export const memoryManagement = {
  title: "Memory: Stack, Heap & Garbage Collection",
  duration: "30 minutes",
  content: `
Understanding how memory works is crucial for writing efficient programs. Even in high-level languages like JavaScript, memory concepts affect performance and help you avoid subtle bugs.

## Computer Memory Basics

When a program runs, it gets memory divided into several regions:

\`\`\`
┌─────────────────────┐ High addresses
│        Stack        │ ← Function calls, local variables
├─────────────────────┤
│          ↓          │ Stack grows down
│                     │
│          ↑          │ Heap grows up
├─────────────────────┤
│         Heap        │ ← Dynamic allocations (objects)
├─────────────────────┤
│     Static/Data     │ ← Global variables
├─────────────────────┤
│        Code         │ ← Program instructions
└─────────────────────┘ Low addresses
\`\`\`

## The Stack

The **stack** is fast, organized memory for function execution.

### How It Works
\`\`\`javascript
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function main() {
  const result = square(5);
  console.log(result);
}

main();
\`\`\`

Stack during execution:
\`\`\`
1. main() called     2. square(5) called   3. multiply(5,5)
┌─────────────┐      ┌─────────────┐       ┌─────────────┐
│             │      │             │       │ multiply    │
│             │      │ square      │       │ a=5, b=5    │
│ main        │      │ n=5         │       ├─────────────┤
│ result=?    │      ├─────────────┤       │ square      │
└─────────────┘      │ main        │       │ n=5         │
                     │ result=?    │       ├─────────────┤
                     └─────────────┘       │ main        │
                                           │ result=?    │
                                           └─────────────┘
\`\`\`

### Stack Properties
- **LIFO**: Last In, First Out
- **Fast**: Just move a pointer
- **Automatic**: Memory freed when function returns
- **Limited size**: Usually 1-8 MB (stack overflow!)
- **Stores**: Primitives, function parameters, return addresses

### Stack Overflow
\`\`\`javascript
// This will crash!
function infiniteRecursion() {
  return infiniteRecursion(); // Stack fills up
}
// Error: Maximum call stack size exceeded
\`\`\`

## The Heap

The **heap** is flexible memory for dynamic data.

### How It Works
\`\`\`javascript
// Objects are allocated on the heap
const user = {        // 'user' reference on stack
  name: "Alice",      // Object data on heap
  age: 30
};

const arr = [1, 2, 3]; // Array on heap
\`\`\`

Memory layout:
\`\`\`
    Stack                    Heap
┌─────────────┐        ┌─────────────────┐
│ user: 0x100 │───────→│ {name: "Alice", │
│ arr:  0x200 │──┐     │  age: 30}       │
└─────────────┘  │     ├─────────────────┤
                 └────→│ [1, 2, 3]       │
                       └─────────────────┘
\`\`\`

### Heap Properties
- **Flexible**: Allocate any size
- **Slower**: Must search for free space
- **Manual/GC**: Programmer or garbage collector frees it
- **Large**: Limited by system memory
- **Stores**: Objects, arrays, closures

## Primitives vs References

### Primitives (Stack)
\`\`\`javascript
let a = 10;     // Value stored directly on stack
let b = a;      // Copy of value
b = 20;
console.log(a); // 10 (unchanged)
\`\`\`

### References (Heap)
\`\`\`javascript
let obj1 = { value: 10 }; // Reference on stack, object on heap
let obj2 = obj1;           // Copy of reference (same object!)
obj2.value = 20;
console.log(obj1.value);   // 20 (changed!)
\`\`\`

\`\`\`
    Stack                Heap
┌─────────────┐    ┌─────────────┐
│ obj1: 0x100 │───→│ {value: 20} │
│ obj2: 0x100 │───↗│             │
└─────────────┘    └─────────────┘
  Both point to same object!
\`\`\`

## Garbage Collection

In JavaScript, memory is automatically managed by the **garbage collector** (GC).

### How It Works

The GC periodically checks for objects that are no longer **reachable**:

\`\`\`javascript
function createData() {
  const data = { big: new Array(1000000) };
  return data.big.length;
}

createData();
// 'data' object is now unreachable → garbage collected
\`\`\`

### Mark and Sweep Algorithm
1. **Mark**: Start from roots (global, stack), mark all reachable objects
2. **Sweep**: Delete all unmarked objects

\`\`\`
Before:
  roots → A → B → C
           ↘ D
          X  Y  Z  (unreachable)

After sweep:
  roots → A → B → C
           ↘ D
  (X, Y, Z freed)
\`\`\`

### Memory Leaks in JavaScript

Even with GC, leaks happen when objects remain reachable unintentionally:

\`\`\`javascript
// Leak 1: Forgotten global
function process() {
  leak = { huge: new Array(1000000) }; // No 'let' → global!
}

// Leak 2: Forgotten timer
const data = loadHugeData();
setInterval(() => {
  console.log(data.length); // 'data' never released
}, 1000);

// Leak 3: Closures holding references
function outer() {
  const hugeData = new Array(1000000);
  return function inner() {
    // hugeData captured in closure, never freed
  };
}
const fn = outer(); // hugeData stuck in memory
\`\`\`

### Preventing Leaks
\`\`\`javascript
// Clear references when done
let cache = { data: hugeData };
// ... use it ...
cache = null; // Allow GC to collect

// Clear intervals
const intervalId = setInterval(fn, 1000);
// ... when done ...
clearInterval(intervalId);

// Use WeakMap for caches
const cache = new WeakMap();
cache.set(obj, computedValue);
// When obj is garbage collected, cache entry is too!
\`\`\`

## Performance Implications

### Stack is Faster
\`\`\`javascript
// Fast: primitives on stack
let x = 0;
for (let i = 0; i < 1000000; i++) {
  x += i;
}

// Slower: objects on heap
let obj = { x: 0 };
for (let i = 0; i < 1000000; i++) {
  obj.x += i;
}
\`\`\`

### Avoid Excessive Object Creation
\`\`\`javascript
// Bad: creates 1 million objects
for (let i = 0; i < 1000000; i++) {
  const point = { x: i, y: i }; // New object each time
  process(point);
}

// Better: reuse object
const point = { x: 0, y: 0 };
for (let i = 0; i < 1000000; i++) {
  point.x = i;
  point.y = i;
  process(point);
}
\`\`\`

## Key Takeaways

1. **Stack**: Fast, automatic, limited size — for primitives & function calls
2. **Heap**: Flexible, slower, GC managed — for objects
3. **References**: Variables hold pointers to heap objects, not the objects
4. **Garbage Collection**: Frees unreachable objects automatically
5. **Memory Leaks**: Still possible if references are kept unintentionally
`,
  exercise: {
    description: "Explore how primitives and references behave differently in memory.",
    starterCode: `// Experiment 1: Primitives are copied by value
let num1 = 42;
let num2 = num1;
num2 = 100;
console.log("num1:", num1); // What will this print?
console.log("num2:", num2); // What will this print?

// Experiment 2: Objects are copied by reference
let obj1 = { value: 42 };
let obj2 = obj1;
obj2.value = 100;
console.log("obj1.value:", obj1.value); // What will this print?
console.log("obj2.value:", obj2.value); // What will this print?

// Experiment 3: Reassigning a reference
let obj3 = { value: 42 };
let obj4 = obj3;
obj4 = { value: 100 }; // New object!
console.log("obj3.value:", obj3.value); // What will this print?
console.log("obj4.value:", obj4.value); // What will this print?

// TODO: Create a deep copy function
// that creates a completely independent copy of an object
function deepCopy(obj) {
  // Your code here
  // Hint: JSON.parse(JSON.stringify(obj)) works for simple objects
  // Or use recursion to copy nested objects
}

// Test deep copy
const original = { 
  name: "Alice", 
  address: { city: "London" } 
};
const copy = deepCopy(original);
copy.address.city = "Paris";
console.log("\\nDeep copy test:");
console.log("Original city:", original.address.city); // Should be "London"
console.log("Copy city:", copy.address.city);         // Should be "Paris"
`,
    expectedOutput: `num1: 42
num2: 100
obj1.value: 100
obj2.value: 100
obj3.value: 42
obj4.value: 100

Deep copy test:
Original city: London
Copy city: Paris`,
    hint: "For deepCopy, the simplest approach is JSON.parse(JSON.stringify(obj)). For a more robust solution, check if the value is an object and recursively copy each property."
  },
  quiz: [
    {
      question: "Where are JavaScript objects stored in memory?",
      options: ["Stack", "Heap", "Both stack and heap", "Static memory"],
      correctAnswer: 1,
      explanation: "Objects are stored on the heap because they can be of any size and need to persist beyond the function that created them. Only the reference (pointer) is stored on the stack."
    },
    {
      question: "What happens when you assign one object variable to another?",
      options: [
        "The object is copied completely",
        "Only the reference is copied (both point to same object)",
        "A shallow copy is created automatically",
        "An error is thrown"
      ],
      correctAnswer: 1,
      explanation: "When you assign an object variable to another, only the reference (memory address) is copied. Both variables then point to the same object on the heap."
    },
    {
      question: "What causes a stack overflow?",
      options: [
        "Creating too many objects",
        "Too much recursion without base case",
        "Memory leak",
        "Garbage collection failure"
      ],
      correctAnswer: 1,
      explanation: "Stack overflow occurs when too many function calls are added to the stack (usually infinite or very deep recursion). Each function call uses stack space that isn't freed until the function returns."
    },
    {
      question: "When is an object eligible for garbage collection?",
      options: [
        "When you set it to null",
        "When it's no longer reachable from any root",
        "Immediately after the function that created it returns",
        "When the heap is full"
      ],
      correctAnswer: 1,
      explanation: "An object is garbage collected when it's no longer reachable from any root (global scope, current call stack). Setting a variable to null helps only if that was the last reference."
    }
  ]
};


