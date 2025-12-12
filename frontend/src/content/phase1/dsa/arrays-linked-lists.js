export const arraysLinkedLists = {
  title: "Arrays vs Linked Lists",
  duration: "25 minutes",
  content: `
Arrays and linked lists are the two most fundamental data structures in computer science. Understanding when to use each one is a key skill that separates good programmers from great ones.

## What is an Array?

An **array** is a contiguous block of memory that stores elements of the same type. Think of it like a row of mailboxes in an apartment building — each mailbox has a number, and you can go directly to any mailbox if you know its number.

\`\`\`javascript
// Creating an array
const numbers = [10, 20, 30, 40, 50];

// Accessing elements is O(1) - instant!
console.log(numbers[2]); // 30

// Memory layout: [10][20][30][40][50]
// Each element sits right next to the other
\`\`\`

### Array Strengths

1. **Fast random access**: Get any element instantly by index - O(1)
2. **Cache-friendly**: Elements are stored contiguously, so the CPU can load them efficiently
3. **Simple**: Easy to understand and use

### Array Weaknesses

1. **Fixed size** (in many languages): You need to know the size upfront
2. **Expensive insertions/deletions**: Inserting at the beginning requires shifting all elements - O(n)
3. **Wasted space**: If you allocate too much, memory is wasted

## What is a Linked List?

A **linked list** is a chain of nodes, where each node contains data and a pointer to the next node. Think of it like a treasure hunt — each clue tells you where the next clue is.

\`\`\`javascript
// A linked list node
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Creating a linked list
const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

// Memory layout: [10|→] ... [20|→] ... [30|null]
// Nodes can be anywhere in memory!
\`\`\`

### Linked List Strengths

1. **Dynamic size**: Grows and shrinks easily
2. **Efficient insertions/deletions**: O(1) if you have a reference to the position
3. **No wasted space**: Only uses what it needs

### Linked List Weaknesses

1. **Slow random access**: Must traverse from head to find element - O(n)
2. **Extra memory**: Each node needs space for the pointer
3. **Cache-unfriendly**: Nodes scattered in memory

## When to Use Each

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) ✅ | O(n) ❌ |
| Insert at beginning | O(n) ❌ | O(1) ✅ |
| Insert at end | O(1)* | O(1)** |
| Delete at beginning | O(n) ❌ | O(1) ✅ |
| Search | O(n) | O(n) |
| Memory | Less | More (pointers) |

*Amortized for dynamic arrays  
**If you maintain a tail pointer

## Real-World Examples

**Use Arrays when:**
- You need fast random access (lookup tables, buffers)
- The size is known or relatively fixed
- You're iterating through all elements frequently

**Use Linked Lists when:**
- You frequently insert/delete at the beginning
- Size is highly variable
- You're implementing a queue or stack

## The JavaScript Array Gotcha

In JavaScript, "arrays" are actually objects with integer keys. They're dynamic and can hold mixed types:

\`\`\`javascript
const mixed = [1, "two", { three: 3 }, [4]];
mixed.push(5); // Dynamic sizing
\`\`\`

However, modern JavaScript engines (V8, SpiderMonkey) optimize arrays internally when they contain homogeneous data, giving you closer to true array performance.

## Key Takeaway

> **Arrays** trade flexibility for speed (random access).  
> **Linked Lists** trade speed for flexibility (dynamic sizing, fast insertion).

Choose based on your **primary operation**. If you're mostly reading by index, use an array. If you're mostly inserting and deleting, consider a linked list.
`,
  exercise: {
    description: "Implement a simple LinkedList class with append and prepend methods. Then compare the time it takes to prepend 10000 items to an array vs your linked list.",
    starterCode: `// Implement a LinkedList class
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // TODO: Implement append (add to end)
  append(data) {
    // Your code here
  }
  
  // TODO: Implement prepend (add to beginning)
  prepend(data) {
    // Your code here
  }
  
  // Helper to convert to array for display
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}

// Test your implementation
const list = new LinkedList();
list.append(1);
list.append(2);
list.prepend(0);
console.log(list.toArray()); // Should print [0, 1, 2]

// Bonus: Time comparison
const arr = [];
const linkedList = new LinkedList();

console.time('Array prepend');
for (let i = 0; i < 10000; i++) {
  arr.unshift(i); // Prepend to array
}
console.timeEnd('Array prepend');

console.time('LinkedList prepend');
for (let i = 0; i < 10000; i++) {
  linkedList.prepend(i);
}
console.timeEnd('LinkedList prepend');
`,
    expectedOutput: `[0, 1, 2]`,
    hint: "For append: if the list is empty, set both head and tail to the new node. Otherwise, set tail.next to the new node and update tail. For prepend: set the new node's next to head, then update head."
  },
  quiz: [
    {
      question: "What is the time complexity of accessing an element by index in an array?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 0,
      explanation: "Arrays provide O(1) constant-time access because elements are stored contiguously and can be accessed directly using pointer arithmetic."
    },
    {
      question: "What is the time complexity of inserting an element at the beginning of a linked list?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Inserting at the beginning of a linked list is O(1) because you just create a new node, point it to the current head, and update the head pointer."
    },
    {
      question: "Why are linked lists generally slower to iterate through than arrays?",
      options: [
        "Linked lists have more elements",
        "Nodes are scattered in memory, causing cache misses",
        "Linked list nodes are larger",
        "JavaScript doesn't optimize linked lists"
      ],
      correctAnswer: 1,
      explanation: "Linked list nodes can be anywhere in memory (non-contiguous), which means the CPU cache can't predict and preload the next elements, causing frequent cache misses."
    },
    {
      question: "When would you choose a linked list over an array?",
      options: [
        "When you need fast random access by index",
        "When memory is very limited",
        "When you frequently insert/delete at the beginning",
        "When storing primitive values only"
      ],
      correctAnswer: 2,
      explanation: "Linked lists excel at insertions and deletions at the beginning (O(1)) because no shifting is required, unlike arrays which need O(n) time to shift all elements."
    }
  ]
};


