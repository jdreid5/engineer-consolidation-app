export const timeSpaceComplexity = {
  title: "Time & Space Complexity",
  duration: "30 minutes",
  content: `
Understanding time and space complexity is essential for writing efficient code. It's how we measure algorithm performance and make informed decisions about trade-offs.

## What is Big O Notation?

Big O describes how an algorithm's performance **scales** with input size. It answers: "As input grows, how much longer does this take?"

\`\`\`javascript
// O(1) - Constant: Same time regardless of input size
function getFirst(arr) {
  return arr[0];
}

// O(n) - Linear: Time grows with input size
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²) - Quadratic: Time grows with square of input
function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
\`\`\`

## Common Time Complexities

\`\`\`
O(1)       Constant     Hash table lookup
O(log n)   Logarithmic  Binary search
O(n)       Linear       Simple loop
O(n log n) Linearithmic Good sorting (merge, quick)
O(n²)      Quadratic    Nested loops
O(2ⁿ)      Exponential  Recursive Fibonacci
O(n!)      Factorial    Permutations
\`\`\`

### Visualizing Growth

For n = 1000:
\`\`\`
O(1)        →  1 operation
O(log n)    →  ~10 operations
O(n)        →  1,000 operations
O(n log n)  →  ~10,000 operations
O(n²)       →  1,000,000 operations
O(2ⁿ)       →  Number with 300+ digits!
\`\`\`

## Analyzing Time Complexity

### Rule 1: Drop Constants
\`\`\`javascript
// O(2n) → O(n)
function doubleLoop(arr) {
  for (let x of arr) console.log(x);
  for (let x of arr) console.log(x);
}
\`\`\`

### Rule 2: Drop Lower-Order Terms
\`\`\`javascript
// O(n² + n) → O(n²)
function example(arr) {
  // O(n²)
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
  // O(n)
  for (let x of arr) console.log(x);
}
\`\`\`

### Rule 3: Different Inputs = Different Variables
\`\`\`javascript
// O(a * b), not O(n²)!
function compareLists(listA, listB) {
  for (let a of listA) {
    for (let b of listB) {
      if (a === b) return true;
    }
  }
  return false;
}
\`\`\`

### Rule 4: Recursive Complexity
\`\`\`javascript
// O(2ⁿ) - branches^depth
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Each call branches into 2, depth is n
\`\`\`

## Space Complexity

Space complexity measures **extra memory** used by an algorithm.

\`\`\`javascript
// O(1) space - only using fixed variables
function sum(arr) {
  let total = 0;
  for (let x of arr) total += x;
  return total;
}

// O(n) space - creating array proportional to input
function double(arr) {
  const result = [];
  for (let x of arr) result.push(x * 2);
  return result;
}

// O(n) space - recursion uses call stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
  // n frames on call stack
}
\`\`\`

## Analyzing Examples

### Example 1: Two Sum
\`\`\`javascript
// Brute Force: O(n²) time, O(1) space
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}

// Hash Map: O(n) time, O(n) space
function twoSumHash(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
\`\`\`

**Trade-off**: We traded space (O(n)) for time (O(n²) → O(n)).

### Example 2: Finding Duplicates
\`\`\`javascript
// O(n²) time, O(1) space
function hasDuplicateBrute(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n log n) time, O(1) space (sort in place)
function hasDuplicateSort(arr) {
  arr.sort((a, b) => a - b);
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1]) return true;
  }
  return false;
}

// O(n) time, O(n) space
function hasDuplicateSet(arr) {
  const seen = new Set();
  for (let x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
\`\`\`

## Best, Worst, Average Case

\`\`\`javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
\`\`\`

- **Best case**: O(1) — target is first element
- **Worst case**: O(n) — target is last or not present
- **Average case**: O(n) — on average, check half the elements

We usually care about **worst case** because it gives us guarantees.

## Amortized Analysis

Some operations are "expensive" but happen rarely:

\`\`\`javascript
const arr = [];
for (let i = 0; i < 1000; i++) {
  arr.push(i); // Usually O(1), occasionally O(n) when resizing
}
\`\`\`

\`.push()\` is O(1) **amortized** — the occasional O(n) resize is spread across many O(1) operations.

## Common Patterns

| Pattern | Time | Space |
|---------|------|-------|
| Single loop | O(n) | O(1) |
| Nested loops | O(n²) | O(1) |
| Binary search | O(log n) | O(1) |
| Merge sort | O(n log n) | O(n) |
| Hash map lookup | O(1) avg | O(n) |
| BFS/DFS | O(V + E) | O(V) |
| Generate subsets | O(2ⁿ) | O(2ⁿ) |

## Interview Tips

1. **State complexity explicitly**: "This is O(n) time, O(1) space"
2. **Consider trade-offs**: "We can improve time to O(n) if we use O(n) space"
3. **Think about input size**: O(n²) might be fine for n < 1000
4. **Watch for hidden complexity**: String concatenation, array \`.slice()\`

## Key Takeaways

1. Big O measures **growth rate**, not exact time
2. Drop constants and lower-order terms
3. Time-space trade-off is common
4. Worst case matters most for guarantees
5. Know the complexity of common operations!
`,
  exercise: {
    description: "Analyze the time and space complexity of given functions, then optimize one of them.",
    starterCode: `// Analyze the complexity of each function
// Write your answers as comments

// Function 1: What is the time and space complexity?
function mystery1(n) {
  let result = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result += i * j;
    }
  }
  return result;
}
// Time: O(?)
// Space: O(?)

// Function 2: What is the time and space complexity?
function mystery2(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mystery2(arr.slice(0, mid));
  const right = mystery2(arr.slice(mid));
  return left.concat(right);
}
// Time: O(?)
// Space: O(?)

// Function 3: What is the time and space complexity?
function mystery3(n) {
  if (n <= 1) return n;
  return mystery3(n - 1) + mystery3(n - 2);
}
// Time: O(?)
// Space: O(?)

// TODO: Optimize mystery3 using memoization
function mystery3Optimized(n, memo = {}) {
  // Your code here
  // Hint: Store computed values in memo
}

// Test the optimized version
console.log("Fib(10):", mystery3Optimized(10)); // Should be 55
console.log("Fib(20):", mystery3Optimized(20)); // Should be 6765
console.log("Fib(40):", mystery3Optimized(40)); // Should be 102334155

// Print your complexity analysis
console.log("\\nComplexity Analysis:");
console.log("mystery1: Time O(n²), Space O(1)");
console.log("mystery2: Time O(n log n), Space O(n)");
console.log("mystery3: Time O(2^n), Space O(n)");
console.log("mystery3Optimized: Time O(n), Space O(n)");
`,
    expectedOutput: `Fib(10): 55
Fib(20): 6765
Fib(40): 102334155

Complexity Analysis:
mystery1: Time O(n²), Space O(1)
mystery2: Time O(n log n), Space O(n)
mystery3: Time O(2^n), Space O(n)
mystery3Optimized: Time O(n), Space O(n)`,
    hint: "For mystery3Optimized: check if n is in memo, if so return it. Otherwise compute the result, store it in memo, then return it. Base cases: n <= 1 returns n."
  },
  quiz: [
    {
      question: "What is the time complexity of accessing an element in a hash map (average case)?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Hash maps provide O(1) average-case access because the hash function computes the index directly."
    },
    {
      question: "What happens to O(2n + 100) when simplified using Big O?",
      options: ["O(2n + 100)", "O(2n)", "O(n)", "O(100)"],
      correctAnswer: 2,
      explanation: "Big O drops constants (2n → n) and lower-order terms (100), leaving O(n)."
    },
    {
      question: "A function has nested loops where outer loop runs n times and inner loop runs m times. What is the complexity?",
      options: ["O(n)", "O(m)", "O(n + m)", "O(n × m)"],
      correctAnswer: 3,
      explanation: "When loops are nested, we multiply: the inner loop runs m times for each of the n outer iterations, giving O(n × m)."
    },
    {
      question: "The recursive Fibonacci function (without memoization) has what time complexity?",
      options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"],
      correctAnswer: 2,
      explanation: "Each call branches into 2 recursive calls, with depth n, giving O(2ⁿ). This is why naive Fibonacci is very slow for large n."
    }
  ]
};


