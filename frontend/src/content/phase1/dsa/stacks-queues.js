export const stacksQueues = {
  title: "Stacks & Queues",
  duration: "25 minutes",
  content: `
Stacks and queues are fundamental data structures that restrict how elements are added and removed. Understanding them is crucial because they model real-world processes and are used everywhere in programming.

## Stacks: Last In, First Out (LIFO)

A **stack** is like a stack of plates — you can only add or remove from the top.

\`\`\`
    ┌─────┐
    │  3  │  ← Top (most recently added)
    ├─────┤
    │  2  │
    ├─────┤
    │  1  │  ← Bottom (first added)
    └─────┘
\`\`\`

### Stack Operations

- **push(item)**: Add to the top — O(1)
- **pop()**: Remove from the top — O(1)
- **peek()**: Look at the top without removing — O(1)
- **isEmpty()**: Check if empty — O(1)

### Implementing a Stack

\`\`\`javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(item) {
    this.items.push(item);
  }
  
  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop()); // 3 (last in, first out)
console.log(stack.peek()); // 2
\`\`\`

### Real-World Stack Uses

1. **Function Call Stack**: When functions call other functions
2. **Undo/Redo**: Each action pushed, undo = pop
3. **Browser History**: Back button pops from history stack
4. **Parsing**: Matching brackets, HTML tags
5. **DFS (Depth-First Search)**: Explore deeply before backtracking

### Classic Problem: Valid Parentheses

\`\`\`javascript
function isValidParentheses(str) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  
  for (const char of str) {
    if ('([{'.includes(char)) {
      stack.push(char);
    } else if (')]}' .includes(char)) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}

isValidParentheses("([]){}"); // true
isValidParentheses("([)]");   // false
\`\`\`

## Queues: First In, First Out (FIFO)

A **queue** is like a line at a store — first person in line gets served first.

\`\`\`
  Front                    Back
    ↓                       ↓
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │
└─────┴─────┴─────┴─────┘
  ↑                       ↑
Dequeue               Enqueue
\`\`\`

### Queue Operations

- **enqueue(item)**: Add to the back — O(1)
- **dequeue()**: Remove from the front — O(1)*
- **front()**: Look at the front without removing — O(1)
- **isEmpty()**: Check if empty — O(1)

*O(1) with a proper implementation

### Implementing a Queue

The naive array implementation has O(n) dequeue because of shifting:

\`\`\`javascript
// ❌ Naive implementation - O(n) dequeue
class NaiveQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(item) {
    this.items.push(item);
  }
  
  dequeue() {
    return this.items.shift(); // O(n) - shifts all elements!
  }
}
\`\`\`

Better implementation using an object:

\`\`\`javascript
// ✅ Better implementation - O(1) operations
class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }
  
  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  
  front() {
    return this.items[this.frontIndex];
  }
  
  isEmpty() {
    return this.frontIndex === this.backIndex;
  }
  
  size() {
    return this.backIndex - this.frontIndex;
  }
}
\`\`\`

### Real-World Queue Uses

1. **Task Scheduling**: Print queues, job queues
2. **BFS (Breadth-First Search)**: Explore level by level
3. **Message Queues**: RabbitMQ, Amazon SQS
4. **Buffering**: Video streaming, keyboard input
5. **Request Handling**: Web servers processing requests in order

## Deque: Double-Ended Queue

A **deque** (pronounced "deck") allows insertion and removal from both ends:

\`\`\`javascript
class Deque {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  
  addFront(item) {
    this.frontIndex--;
    this.items[this.frontIndex] = item;
  }
  
  addBack(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }
  
  removeFront() {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  
  removeBack() {
    if (this.isEmpty()) return undefined;
    this.backIndex--;
    const item = this.items[this.backIndex];
    delete this.items[this.backIndex];
    return item;
  }
  
  isEmpty() {
    return this.frontIndex === this.backIndex;
  }
}
\`\`\`

## Priority Queue (Preview)

A **priority queue** serves elements by priority, not by order. We'll cover this more with heaps, but here's the idea:

\`\`\`javascript
// Elements with higher priority come out first
priorityQueue.enqueue("task1", 3); // priority 3
priorityQueue.enqueue("task2", 1); // priority 1
priorityQueue.enqueue("task3", 2); // priority 2

priorityQueue.dequeue(); // "task1" (highest priority)
priorityQueue.dequeue(); // "task3"
priorityQueue.dequeue(); // "task2"
\`\`\`

## Comparison

| Feature | Stack | Queue |
|---------|-------|-------|
| Order | LIFO | FIFO |
| Add | push (top) | enqueue (back) |
| Remove | pop (top) | dequeue (front) |
| Use Case | Undo, DFS, recursion | BFS, scheduling, buffers |

## Key Takeaways

1. **Stack** = LIFO: Last item added is first removed
2. **Queue** = FIFO: First item added is first removed
3. Both have O(1) operations when implemented correctly
4. Stacks are great for backtracking; queues for ordered processing
5. The call stack is why recursion works!
`,
  exercise: {
    description: "Implement a Queue class with O(1) enqueue and dequeue operations. Then use it to implement a 'hot potato' game simulation.",
    starterCode: `class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  
  // TODO: Implement enqueue(item)
  enqueue(item) {
    // Your code here
  }
  
  // TODO: Implement dequeue()
  dequeue() {
    // Your code here
  }
  
  // TODO: Implement isEmpty()
  isEmpty() {
    // Your code here
  }
  
  size() {
    return this.backIndex - this.frontIndex;
  }
}

// Test your Queue
const queue = new Queue();
queue.enqueue("first");
queue.enqueue("second");
queue.enqueue("third");
console.log(queue.dequeue()); // Should print: first
console.log(queue.dequeue()); // Should print: second
console.log(queue.size());    // Should print: 1

// Hot Potato Game
// Players pass a "potato" and one is eliminated each round
function hotPotato(players, num) {
  const queue = new Queue();
  
  // Add all players to queue
  for (const player of players) {
    queue.enqueue(player);
  }
  
  while (queue.size() > 1) {
    // Pass the potato 'num' times
    for (let i = 0; i < num; i++) {
      // Move front person to back
      queue.enqueue(queue.dequeue());
    }
    // Eliminate the person holding the potato
    console.log(queue.dequeue() + " is eliminated");
  }
  
  return queue.dequeue(); // Winner!
}

console.log("Winner: " + hotPotato(["Alice", "Bob", "Charlie", "Diana"], 3));
`,
    expectedOutput: `first
second
1`,
    hint: "For enqueue: store the item at backIndex, then increment backIndex. For dequeue: get the item at frontIndex, delete it, increment frontIndex. For isEmpty: compare frontIndex === backIndex."
  },
  quiz: [
    {
      question: "What does LIFO stand for in the context of stacks?",
      options: ["Last In First Out", "Least In First Out", "Last Index First Output", "Linear In First Out"],
      correctAnswer: 0,
      explanation: "LIFO means Last In First Out — the most recently added item is the first one to be removed, like a stack of plates."
    },
    {
      question: "Which data structure would you use to implement an 'undo' feature?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "A stack is perfect for undo because you want to undo the most recent action first (LIFO behavior)."
    },
    {
      question: "What is the time complexity of dequeue() using array.shift() in JavaScript?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "array.shift() is O(n) because it removes the first element and shifts all remaining elements down by one index."
    },
    {
      question: "Which traversal algorithm typically uses a queue?",
      options: ["Depth-First Search", "Binary Search", "Breadth-First Search", "Quick Sort"],
      correctAnswer: 2,
      explanation: "BFS uses a queue to explore nodes level by level. Nodes are added to the back and processed from the front, ensuring breadth-first order."
    }
  ]
};


