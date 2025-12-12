export const concurrency = {
  title: "Concurrency: Threads & Locks",
  duration: "35 minutes",
  content: `
Concurrency is one of the most challenging topics in programming. Understanding it helps you write faster programs and avoid subtle bugs that are notoriously hard to find.

## What is Concurrency?

**Concurrency** is dealing with multiple things at once. It's about structure — how we organize code that handles multiple tasks.

**Parallelism** is doing multiple things at once. It's about execution — actually running multiple tasks simultaneously.

\`\`\`
Concurrency (structure):        Parallelism (execution):
    ┌────┐  ┌────┐              ┌────┐
    │ A  │  │ B  │              │ A  │───CPU 1
    └──┬─┘  └─┬──┘              └────┘
       │      │                 ┌────┐
    ┌──┴──────┴──┐              │ B  │───CPU 2
    │   Switch   │              └────┘
    │  between   │
    └────────────┘
   Single CPU, time-slicing     Multiple CPUs, true parallel
\`\`\`

## Processes vs Threads

### Process
- Independent program with its own memory space
- Heavy to create
- Communication via IPC (pipes, sockets)

### Thread
- Lightweight unit within a process
- Shares memory with other threads
- Cheap to create
- Communication via shared memory

\`\`\`
Process A             Process B
┌──────────────┐     ┌──────────────┐
│ Memory Space │     │ Memory Space │
│  ┌────────┐  │     │  ┌────────┐  │
│  │Thread 1│  │     │  │Thread 1│  │
│  └────────┘  │     │  └────────┘  │
│  ┌────────┐  │     │              │
│  │Thread 2│  │     │              │
│  └────────┘  │     │              │
└──────────────┘     └──────────────┘
  Isolated memory      Isolated memory
\`\`\`

## The Concurrency Problem

When threads share memory, bad things happen:

\`\`\`javascript
// Shared state
let counter = 0;

// Two threads increment simultaneously
// Thread A                // Thread B
read counter (0)           read counter (0)
add 1 (1)                  add 1 (1)
write counter (1)          write counter (1)

// Expected: 2, Got: 1 — Race condition!
\`\`\`

This is a **race condition** — the result depends on timing.

## Race Conditions

A race condition occurs when:
1. Multiple threads access shared data
2. At least one thread modifies it
3. Access isn't synchronized

\`\`\`javascript
// Classic example: lost update
let balance = 100;

// Thread A: withdraw 50
if (balance >= 50) {      // Check: 100 >= 50 ✓
  // Context switch here!
  balance = balance - 50;  // balance = 50
}

// Thread B: withdraw 80
if (balance >= 80) {      // Check: 100 >= 80 ✓ (stale!)
  balance = balance - 80;  // balance = -30 (overdraft!)
}
\`\`\`

## Locks (Mutexes)

A **lock** (mutex = mutual exclusion) ensures only one thread accesses critical code:

\`\`\`javascript
// Pseudocode with lock
const lock = new Lock();

function withdraw(amount) {
  lock.acquire();        // Wait if another thread has the lock
  try {
    if (balance >= amount) {
      balance -= amount;
      return true;
    }
    return false;
  } finally {
    lock.release();      // Always release!
  }
}
\`\`\`

Now the operations are **atomic** — they can't be interrupted.

## Deadlocks

When threads wait for each other forever:

\`\`\`
Thread A: holds Lock1, wants Lock2
Thread B: holds Lock2, wants Lock1

Neither can proceed — DEADLOCK!

┌────────────────────────────────┐
│ Thread A        Thread B       │
│    │               │           │
│    │ holds Lock1   │ holds Lock2
│    │               │           │
│    ├───wants Lock2─┤           │
│    │               │           │
│    ├───────────────┼─wants Lock1
│    │               │           │
└────────────────────────────────┘
\`\`\`

### Deadlock Prevention

1. **Lock ordering**: Always acquire locks in the same order
2. **Timeout**: Give up if lock isn't available
3. **Lock hierarchy**: Assign levels, only lock lower levels

## JavaScript's Concurrency Model

JavaScript is **single-threaded** with an **event loop**:

\`\`\`javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');

// Output:
// Start
// End
// Promise
// Timeout
\`\`\`

### The Event Loop

\`\`\`
┌───────────────────────┐
│      Call Stack       │
│   (sync execution)    │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│     Event Loop        │
│   Check queues:       │
│   1. Microtask queue  │
│   2. Macrotask queue  │
└───────────────────────┘

Microtasks: Promise.then, queueMicrotask
Macrotasks: setTimeout, setInterval, I/O
\`\`\`

### No Race Conditions in JS?

JavaScript doesn't have thread race conditions, but has **async race conditions**:

\`\`\`javascript
let data = null;

// Race between two async operations
fetch('/api/user')
  .then(res => res.json())
  .then(user => { data = user; });

fetch('/api/profile')
  .then(res => res.json())
  .then(profile => { 
    // BUG: data might still be null!
    data.profile = profile; 
  });
\`\`\`

### Web Workers

For true parallelism in JavaScript:

\`\`\`javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
\`\`\`

Workers have separate memory — communicate via message passing (no shared state, no race conditions).

## Common Concurrency Patterns

### 1. Producer-Consumer

\`\`\`javascript
// Using a queue
const queue = [];

// Producer
async function produce() {
  while (true) {
    const item = await generateItem();
    queue.push(item);
  }
}

// Consumer
async function consume() {
  while (true) {
    if (queue.length > 0) {
      const item = queue.shift();
      await processItem(item);
    }
    await sleep(10); // Don't spin
  }
}
\`\`\`

### 2. Rate Limiting

\`\`\`javascript
class RateLimiter {
  constructor(maxPerSecond) {
    this.tokens = maxPerSecond;
    this.maxTokens = maxPerSecond;
    setInterval(() => {
      this.tokens = this.maxTokens;
    }, 1000);
  }
  
  async acquire() {
    while (this.tokens <= 0) {
      await sleep(10);
    }
    this.tokens--;
  }
}
\`\`\`

### 3. Async Mutex in JavaScript

\`\`\`javascript
class AsyncMutex {
  constructor() {
    this.locked = false;
    this.waiting = [];
  }
  
  async acquire() {
    while (this.locked) {
      await new Promise(resolve => this.waiting.push(resolve));
    }
    this.locked = true;
  }
  
  release() {
    this.locked = false;
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      resolve();
    }
  }
}
\`\`\`

## Key Takeaways

1. **Concurrency** is structure; **parallelism** is execution
2. **Race conditions** happen when threads share mutable state unsafely
3. **Locks** protect critical sections but can cause **deadlocks**
4. **JavaScript is single-threaded** but has async concurrency
5. **Web Workers** enable true parallelism with message passing
6. Prefer **immutable data** and **message passing** over shared state
`,
  exercise: {
    description: "Simulate a race condition and fix it with a simple mutex implementation.",
    starterCode: `// Simulating async race condition in JavaScript
let balance = 100;

// Simulate delay (like network/disk I/O)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Unsafe withdraw - has race condition!
async function unsafeWithdraw(amount, name) {
  console.log(\`\${name}: Checking balance (\${balance})\`);
  if (balance >= amount) {
    // Simulate delay during which another operation might run
    await delay(10);
    balance -= amount;
    console.log(\`\${name}: Withdrew \${amount}, new balance: \${balance}\`);
    return true;
  }
  console.log(\`\${name}: Insufficient funds\`);
  return false;
}

// TODO: Implement AsyncMutex
class AsyncMutex {
  constructor() {
    this.locked = false;
    this.waiting = [];
  }
  
  async acquire() {
    // Your code here
    // If locked, wait. Otherwise, lock.
  }
  
  release() {
    // Your code here
    // Unlock and notify waiting tasks
  }
}

// TODO: Implement safe withdraw using mutex
const mutex = new AsyncMutex();

async function safeWithdraw(amount, name) {
  // Your code here
  // Use mutex.acquire() and mutex.release()
}

// Test the race condition
async function testUnsafe() {
  balance = 100;
  console.log("=== Unsafe Test ===");
  // Both try to withdraw 80 from 100 - should only one succeed
  await Promise.all([
    unsafeWithdraw(80, "A"),
    unsafeWithdraw(80, "B")
  ]);
  console.log(\`Final balance: \${balance} (should be 20, but might be negative!)\`);
}

async function testSafe() {
  balance = 100;
  console.log("\\n=== Safe Test ===");
  await Promise.all([
    safeWithdraw(80, "A"),
    safeWithdraw(80, "B")
  ]);
  console.log(\`Final balance: \${balance} (should be 20)\`);
}

testUnsafe().then(() => testSafe());
`,
    expectedOutput: `=== Unsafe Test ===
A: Checking balance (100)
B: Checking balance (100)
A: Withdrew 80, new balance: 20
B: Withdrew 80, new balance: -60
Final balance: -60 (should be 20, but might be negative!)

=== Safe Test ===
A: Checking balance (100)
A: Withdrew 80, new balance: 20
B: Checking balance (20)
B: Insufficient funds
Final balance: 20 (should be 20)`,
    hint: "For acquire(): If locked, create a Promise and push its resolve function to waiting[], then await that promise. If not locked, just set locked = true. For release(): Set locked = false, then if waiting[] has items, shift and call the first resolver."
  },
  quiz: [
    {
      question: "What is a race condition?",
      options: [
        "When a program runs too fast",
        "When the outcome depends on unpredictable timing of multiple threads",
        "When two computers compete for network resources",
        "When a loop iterates too quickly"
      ],
      correctAnswer: 1,
      explanation: "A race condition occurs when multiple threads or async operations access shared state and the result depends on their relative timing, which is unpredictable."
    },
    {
      question: "What is a deadlock?",
      options: [
        "When a thread runs forever",
        "When two or more threads wait for each other indefinitely",
        "When a lock is never released",
        "When memory runs out"
      ],
      correctAnswer: 1,
      explanation: "A deadlock occurs when two or more threads are each waiting for a lock held by another, creating a cycle where none can proceed."
    },
    {
      question: "How does JavaScript avoid traditional multi-threaded race conditions?",
      options: [
        "By using locks automatically",
        "By being single-threaded with an event loop",
        "By copying all shared variables",
        "By running all code synchronously"
      ],
      correctAnswer: 1,
      explanation: "JavaScript runs on a single thread with an event loop. While async code can interleave, there's no truly simultaneous execution of JS code, preventing traditional race conditions."
    },
    {
      question: "What do Web Workers provide in JavaScript?",
      options: [
        "Faster network requests",
        "True parallelism through separate threads with isolated memory",
        "Automatic code optimization",
        "Better error handling"
      ],
      correctAnswer: 1,
      explanation: "Web Workers run JavaScript in separate threads with their own memory space. They communicate via message passing, enabling true parallelism without shared-memory race conditions."
    }
  ]
};


