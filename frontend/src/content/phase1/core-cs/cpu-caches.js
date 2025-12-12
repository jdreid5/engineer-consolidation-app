export const cpuCaches = {
  title: "CPU Caches & Performance",
  duration: "25 minutes",
  content: `
Understanding CPU caches helps you write faster code. Even in high-level languages, knowing how memory access patterns affect performance can make your programs significantly faster.

## The Memory Hierarchy

CPUs are fast. Main memory (RAM) is slow. The gap is huge:

\`\`\`
┌─────────────────┐
│   CPU Registers │ ← 1 cycle (~0.3 ns)
├─────────────────┤
│    L1 Cache     │ ← 4 cycles (~1 ns)
├─────────────────┤
│    L2 Cache     │ ← 12 cycles (~4 ns)
├─────────────────┤
│    L3 Cache     │ ← 40 cycles (~15 ns)
├─────────────────┤
│   Main Memory   │ ← 200+ cycles (~100 ns)
├─────────────────┤
│    SSD/Disk     │ ← 10,000-100,000+ cycles
└─────────────────┘
\`\`\`

Main memory is **~100x slower** than L1 cache. This is why caches matter!

## How Caches Work

When the CPU needs data:

1. Check L1 cache → **Cache hit** if found (fast!)
2. Check L2, L3 if not in L1
3. Fetch from RAM if not in any cache → **Cache miss** (slow!)

When data is fetched, the CPU loads a whole **cache line** (typically 64 bytes), betting you'll need nearby data soon.

## Why This Matters for Programmers

### Example: Array Traversal

\`\`\`javascript
const size = 10000;
const arr = new Array(size).fill(0).map((_, i) => i);

// Sequential access (cache-friendly)
function sumSequential(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]; // Access consecutive memory
  }
  return sum;
}

// Random access (cache-unfriendly)
function sumRandom(arr) {
  let sum = 0;
  const indices = shuffle([...Array(arr.length).keys()]);
  for (let i = 0; i < indices.length; i++) {
    sum += arr[indices[i]]; // Jump around in memory
  }
  return sum;
}
\`\`\`

Sequential access is often **5-10x faster** because:
- First access loads a cache line (64 bytes ≈ 8 numbers)
- Next 7 accesses hit the cache
- Random access causes cache misses constantly

## Spatial Locality

**Spatial locality**: If you access memory location X, you'll likely access X+1, X+2, etc.

\`\`\`javascript
// Good spatial locality
for (let i = 0; i < arr.length; i++) {
  process(arr[i]); // Sequential access
}

// Poor spatial locality
for (let i = 0; i < arr.length; i += 100) {
  process(arr[i]); // Skipping elements, wasting cache lines
}
\`\`\`

## Temporal Locality

**Temporal locality**: If you access data now, you'll likely access it again soon.

\`\`\`javascript
// Good temporal locality
let sum = 0;
for (let i = 0; i < 1000; i++) {
  sum += i; // 'sum' accessed repeatedly, stays in cache
}

// Poor temporal locality (simplified example)
for (let i = 0; i < 1000; i++) {
  results[i] = calculate(inputs[i]); // Each result touched once
}
\`\`\`

## Row-Major vs Column-Major

2D arrays are stored as 1D in memory. In JavaScript (row-major):

\`\`\`
matrix = [[1,2,3],
          [4,5,6],
          [7,8,9]]

Memory: [1,2,3,4,5,6,7,8,9]
           row0   row1   row2
\`\`\`

### Row-wise vs Column-wise Access

\`\`\`javascript
const N = 1000;
const matrix = Array(N).fill(0).map(() => Array(N).fill(1));

// Row-wise: FAST (cache-friendly)
function sumRowWise(matrix) {
  let sum = 0;
  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      sum += matrix[row][col]; // Sequential in memory
    }
  }
  return sum;
}

// Column-wise: SLOW (cache-unfriendly)
function sumColumnWise(matrix) {
  let sum = 0;
  for (let col = 0; col < N; col++) {
    for (let row = 0; row < N; row++) {
      sum += matrix[row][col]; // Jumps by N each access
    }
  }
  return sum;
}
\`\`\`

Row-wise can be **10x+ faster** on large matrices!

## Practical Tips

### 1. Prefer Arrays Over Linked Structures

\`\`\`javascript
// Array: elements contiguous → cache-friendly
const arr = [1, 2, 3, 4, 5];

// Linked list: nodes scattered → cache-unfriendly
// node1 → node2 → node3 (each in different memory locations)
\`\`\`

### 2. Process Data in Order

\`\`\`javascript
// Better: process items in order
for (const item of items) {
  process(item);
}

// Worse: random access patterns
for (const index of randomIndices) {
  process(items[index]);
}
\`\`\`

### 3. Keep Related Data Together

\`\`\`javascript
// Structure of Arrays (SoA) - better for bulk operations
const positions = {
  x: [1, 2, 3, 4],
  y: [5, 6, 7, 8]
};

// Array of Structures (AoS) - better for individual entity access
const entities = [
  { x: 1, y: 5 },
  { x: 2, y: 6 },
  { x: 3, y: 7 },
  { x: 4, y: 8 }
];
\`\`\`

### 4. Avoid Pointer Chasing

\`\`\`javascript
// Bad: following pointers through objects
let current = linkedList.head;
while (current) {
  sum += current.data;
  current = current.next; // Cache miss likely!
}

// Better: process flat array
for (let i = 0; i < array.length; i++) {
  sum += array[i];
}
\`\`\`

## When Does This Matter?

Cache optimization matters most for:
- Large datasets (megabytes+)
- Performance-critical loops
- Real-time applications
- Scientific computing

For small data or non-performance-critical code, readability > cache optimization.

## Key Takeaways

1. **Caches** bridge the CPU-memory speed gap
2. **Cache misses** are expensive (~100x slower than hits)
3. **Sequential access** is faster than random access
4. **Row-major order** matters for 2D array traversal
5. **Keep data together** that's accessed together
`,
  exercise: {
    description: "Compare row-wise vs column-wise matrix traversal to see cache effects.",
    starterCode: `// Create a matrix
const N = 500; // Size of matrix
const matrix = [];
for (let i = 0; i < N; i++) {
  matrix[i] = [];
  for (let j = 0; j < N; j++) {
    matrix[i][j] = i * N + j;
  }
}

// TODO: Implement row-wise sum (cache-friendly)
function sumRowWise(matrix) {
  let sum = 0;
  // Your code here
  // Iterate: for each row, for each column
  return sum;
}

// TODO: Implement column-wise sum (cache-unfriendly)
function sumColumnWise(matrix) {
  let sum = 0;
  // Your code here
  // Iterate: for each column, for each row
  return sum;
}

// Time both approaches
console.time('Row-wise');
const rowSum = sumRowWise(matrix);
console.timeEnd('Row-wise');

console.time('Column-wise');
const colSum = sumColumnWise(matrix);
console.timeEnd('Column-wise');

console.log('Row sum:', rowSum);
console.log('Column sum:', colSum);
console.log('Sums equal:', rowSum === colSum);
`,
    expectedOutput: `Row-wise: [time in ms]
Column-wise: [time in ms]
Sums equal: true`,
    hint: "Row-wise: outer loop over rows (i), inner loop over columns (j), access matrix[i][j]. Column-wise: outer loop over columns (j), inner loop over rows (i), access matrix[i][j]."
  },
  quiz: [
    {
      question: "Why is sequential array access faster than random access?",
      options: [
        "Arrays are stored in special fast memory",
        "Sequential access benefits from cache line prefetching",
        "Random access requires more CPU instructions",
        "JavaScript optimizes sequential loops"
      ],
      correctAnswer: 1,
      explanation: "When you access arr[0], the CPU loads a whole cache line (64 bytes). Sequential access (arr[1], arr[2]...) hits this cache. Random access likely misses, requiring slow RAM fetches."
    },
    {
      question: "A cache miss occurs when:",
      options: [
        "The CPU can't find the data in any cache level",
        "The cache is full",
        "Two programs access the same memory",
        "The data is corrupted"
      ],
      correctAnswer: 0,
      explanation: "A cache miss occurs when the CPU needs data that isn't in any cache level, requiring a slow fetch from main memory."
    },
    {
      question: "For a 2D array in JavaScript, which traversal order is more cache-efficient?",
      options: [
        "Column-major (for each column, then each row)",
        "Row-major (for each row, then each column)",
        "Diagonal traversal",
        "Doesn't matter in JavaScript"
      ],
      correctAnswer: 1,
      explanation: "JavaScript arrays are row-major, meaning elements in the same row are contiguous in memory. Row-major traversal (matrix[i][j] with i in outer loop) accesses sequential memory."
    },
    {
      question: "What is 'spatial locality'?",
      options: [
        "Data that is accessed recently will be accessed again",
        "Data near recently accessed data will likely be accessed soon",
        "Data stored in local variables",
        "Memory allocated close to the CPU"
      ],
      correctAnswer: 1,
      explanation: "Spatial locality means if you access memory address X, you'll likely access nearby addresses (X+1, X+2, etc.) soon. Caches exploit this by loading whole cache lines."
    }
  ]
};


