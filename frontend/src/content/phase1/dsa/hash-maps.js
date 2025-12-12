export const hashMaps = {
  title: "Hash Maps",
  duration: "30 minutes",
  content: `
Hash maps (also called hash tables, dictionaries, or objects in JavaScript) are one of the most important data structures in programming. They provide **near-instant** lookups, insertions, and deletions.

## The Problem Hash Maps Solve

Imagine you have a phone book with 10 million entries. To find someone's number:

- **Array**: Search through all entries — O(n), potentially millions of comparisons
- **Hash Map**: Jump directly to the entry — O(1), just one lookup!

## How Hash Maps Work

A hash map uses a **hash function** to convert keys into array indices. Here's the basic idea:

\`\`\`javascript
// Simplified concept
function simpleHash(key, arraySize) {
  let hash = 0;
  for (let char of key) {
    hash += char.charCodeAt(0);
  }
  return hash % arraySize;
}

// "cat" might hash to index 5
// "dog" might hash to index 2
\`\`\`

### The Three Components

1. **Hash Function**: Converts keys to indices
2. **Bucket Array**: Stores the values at computed indices
3. **Collision Handler**: Deals with two keys mapping to the same index

## Collisions: The Big Challenge

What happens when two keys hash to the same index? This is called a **collision**.

\`\`\`javascript
// Both might hash to index 7!
hash("cat") // → 7
hash("tac") // → 7 (same letters, same sum)
\`\`\`

### Collision Resolution Strategies

**1. Chaining (Most Common)**
Store a linked list at each bucket:

\`\`\`javascript
// Bucket 7: [("cat", "meow")] → [("tac", "backwards cat")]
\`\`\`

**2. Open Addressing**
Find the next empty slot:

\`\`\`javascript
// If bucket 7 is full, try 8, then 9, etc.
\`\`\`

## Building Your Own Hash Map

Let's build a simple hash map to understand the internals:

\`\`\`javascript
class HashMap {
  constructor(size = 53) {
    this.buckets = new Array(size);
    this.size = size;
  }
  
  _hash(key) {
    let hash = 0;
    const PRIME = 31; // Prime numbers reduce collisions
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      hash = (hash * PRIME + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }
  
  set(key, value) {
    const index = this._hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    // Check if key exists, update if so
    const existing = this.buckets[index].find(pair => pair[0] === key);
    if (existing) {
      existing[1] = value;
    } else {
      this.buckets[index].push([key, value]);
    }
  }
  
  get(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    if (bucket) {
      const pair = bucket.find(pair => pair[0] === key);
      if (pair) return pair[1];
    }
    return undefined;
  }
}
\`\`\`

## Time Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert    | O(1)    | O(n)       |
| Lookup    | O(1)    | O(n)       |
| Delete    | O(1)    | O(n)       |

The worst case O(n) happens when all keys collide into the same bucket. A good hash function and proper sizing prevent this.

## JavaScript's Built-in Hash Maps

### Objects
\`\`\`javascript
const obj = {};
obj["name"] = "Alice"; // Set
console.log(obj.name); // Get
delete obj.name;       // Delete
\`\`\`

### Map (ES6+)
\`\`\`javascript
const map = new Map();
map.set("name", "Alice"); // Any key type!
map.set(42, "answer");
map.set({}, "object key");

console.log(map.get("name")); // Alice
console.log(map.size);        // 3

// Iteration
for (const [key, value] of map) {
  console.log(key, value);
}
\`\`\`

### Object vs Map

| Feature | Object | Map |
|---------|--------|-----|
| Key types | Strings, Symbols | Any value |
| Size | Manual count | .size property |
| Iteration order | Not guaranteed* | Insertion order |
| Performance | Fast for small data | Better for frequent add/remove |
| Prototype | Has default keys | Clean |

*Modern engines maintain insertion order, but it's not in the spec

## Common Hash Map Patterns

### 1. Counting Occurrences
\`\`\`javascript
function countChars(str) {
  const counts = {};
  for (const char of str) {
    counts[char] = (counts[char] || 0) + 1;
  }
  return counts;
}

countChars("hello"); // {h: 1, e: 1, l: 2, o: 1}
\`\`\`

### 2. Caching (Memoization)
\`\`\`javascript
const cache = new Map();

function expensiveOperation(n) {
  if (cache.has(n)) return cache.get(n);
  
  const result = /* expensive calculation */;
  cache.set(n, result);
  return result;
}
\`\`\`

### 3. Two Sum Problem (Classic Interview Question)
\`\`\`javascript
function twoSum(nums, target) {
  const seen = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  
  return null;
}

twoSum([2, 7, 11, 15], 9); // [0, 1]
\`\`\`

## Key Takeaways

1. Hash maps provide O(1) average-case operations
2. A good hash function distributes keys evenly
3. Collisions are handled by chaining or open addressing
4. Use \`Map\` in JavaScript for non-string keys or when you need size/iteration
5. Hash maps are the go-to for counting, caching, and lookups
`,
  exercise: {
    description: "Implement a simple HashMap class with set, get, and has methods. Then use it to solve the 'Two Sum' problem.",
    starterCode: `class HashMap {
  constructor(size = 53) {
    this.buckets = new Array(size);
    this.size = size;
  }
  
  // Simple hash function
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }
  
  // TODO: Implement set(key, value)
  set(key, value) {
    // Your code here
  }
  
  // TODO: Implement get(key)
  get(key) {
    // Your code here
  }
  
  // TODO: Implement has(key)
  has(key) {
    // Your code here
  }
}

// Test your HashMap
const map = new HashMap();
map.set("name", "Alice");
map.set("age", "30");
console.log(map.get("name")); // Should print: Alice
console.log(map.has("age"));  // Should print: true
console.log(map.has("city")); // Should print: false

// Bonus: Solve Two Sum using your HashMap
function twoSum(nums, target) {
  const map = new HashMap();
  // Your code here
  // Return indices of two numbers that add up to target
}

console.log(twoSum([2, 7, 11, 15], 9)); // Should print: [0, 1]
`,
    expectedOutput: `Alice
true
false`,
    hint: "For set: use _hash(key) to get the index, then store [key, value] pairs in that bucket. For get: find the bucket and search for the matching key. For has: return true if get returns a value."
  },
  quiz: [
    {
      question: "What is the average time complexity for looking up a value in a hash map?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
      correctAnswer: 1,
      explanation: "Hash maps provide O(1) average-case lookup because the hash function computes the index directly, requiring no searching."
    },
    {
      question: "What is a hash collision?",
      options: [
        "When a hash function returns a negative number",
        "When two different keys produce the same hash index",
        "When a hash map runs out of memory",
        "When a key is too long to hash"
      ],
      correctAnswer: 1,
      explanation: "A collision occurs when two different keys hash to the same index. This is inevitable given a limited array size, so hash maps need strategies to handle it."
    },
    {
      question: "Which collision resolution strategy stores a linked list at each bucket?",
      options: ["Open addressing", "Linear probing", "Chaining", "Double hashing"],
      correctAnswer: 2,
      explanation: "Chaining stores colliding elements in a linked list (or array) at each bucket. It's the most common collision resolution strategy."
    },
    {
      question: "In JavaScript, when should you use Map instead of a plain object?",
      options: [
        "When you need faster performance",
        "When keys might be non-strings (numbers, objects)",
        "When you have fewer than 10 entries",
        "When you only need string keys"
      ],
      correctAnswer: 1,
      explanation: "Map allows any value as a key (including objects, functions, numbers), while plain objects convert all keys to strings. Map also maintains insertion order and has a .size property."
    }
  ]
};


