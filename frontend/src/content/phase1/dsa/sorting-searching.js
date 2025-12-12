export const sortingSearching = {
  title: "Sorting & Searching",
  duration: "40 minutes",
  content: `
Sorting and searching are fundamental algorithms that every programmer must know. They're used everywhere — from database queries to user interfaces — and understanding them deeply improves your problem-solving skills.

## Why Sorting Matters

Sorting is preprocessing that enables faster operations:
- **Binary search**: O(log n) instead of O(n)
- **Finding duplicates**: Adjacent duplicates are easy to spot
- **Finding median**: Just pick the middle element
- **Database optimization**: Sorted indices speed up queries

## Common Sorting Algorithms

### Bubble Sort — O(n²)
Simple but slow. Repeatedly swap adjacent elements if they're in wrong order.

\`\`\`javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
\`\`\`

### Selection Sort — O(n²)
Find the minimum, put it first. Repeat for remaining elements.

\`\`\`javascript
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}
\`\`\`

### Insertion Sort — O(n²)
Build sorted array one element at a time. Great for nearly-sorted data!

\`\`\`javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}
\`\`\`

### Merge Sort — O(n log n)
Divide and conquer. Split array in half, sort each half, merge them.

\`\`\`javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
\`\`\`

### Quick Sort — O(n log n) average
Pick a pivot, partition array so smaller elements are left, larger are right.

\`\`\`javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIdx = partition(arr, left, right);
    quickSort(arr, left, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right]; // Choose rightmost as pivot
  let i = left;
  
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
\`\`\`

## Sorting Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

**Stable sort**: Equal elements maintain their relative order.

## Searching Algorithms

### Linear Search — O(n)
Check each element one by one. Works on any array.

\`\`\`javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
\`\`\`

### Binary Search — O(log n)
Only works on **sorted** arrays. Eliminates half the remaining elements each step.

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}
\`\`\`

### Binary Search Visualization

\`\`\`
Array: [1, 3, 5, 7, 9, 11, 13]
Target: 9

Step 1: left=0, right=6, mid=3
        arr[3]=7 < 9, so left=4

Step 2: left=4, right=6, mid=5
        arr[5]=11 > 9, so right=4

Step 3: left=4, right=4, mid=4
        arr[4]=9 === 9 ✓ Found!
\`\`\`

### Binary Search Variations

**Find first occurrence:**
\`\`\`javascript
function findFirst(arr, target) {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Keep searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}
\`\`\`

**Find insertion point:**
\`\`\`javascript
function findInsertPosition(arr, target) {
  let left = 0, right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}
\`\`\`

## JavaScript Built-in Sort

\`\`\`javascript
// Default: converts to strings and sorts lexicographically!
[10, 2, 1].sort(); // [1, 10, 2] — Wrong!

// Correct numeric sort
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]

// Descending
[10, 2, 1].sort((a, b) => b - a); // [10, 2, 1]

// Objects by property
users.sort((a, b) => a.age - b.age);
users.sort((a, b) => a.name.localeCompare(b.name));
\`\`\`

## When to Use What

| Scenario | Recommendation |
|----------|----------------|
| Small array (< 10) | Insertion sort |
| Nearly sorted | Insertion sort |
| General purpose | Quick sort or Merge sort |
| Need stability | Merge sort |
| Memory constrained | Quick sort |
| Searching sorted data | Binary search |
| Searching unsorted data | Linear search |

## Key Takeaways

1. **O(n²) sorts** (bubble, selection, insertion) are simple but slow for large data
2. **O(n log n) sorts** (merge, quick) are efficient for large datasets
3. **Binary search** is O(log n) but requires sorted data
4. JavaScript's \`.sort()\` needs a compare function for numbers!
5. Choose your algorithm based on data size, structure, and constraints
`,
  exercise: {
    description: "Implement binary search and then use it to solve a problem: find the square root of a number (integer part only) using binary search.",
    starterCode: `// TODO: Implement binary search
function binarySearch(arr, target) {
  // Your code here
  // Return the index if found, -1 otherwise
}

// Test binary search
const sorted = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log("Index of 7:", binarySearch(sorted, 7));   // Should be 3
console.log("Index of 10:", binarySearch(sorted, 10)); // Should be -1

// TODO: Find integer square root using binary search
// Example: sqrt(16) = 4, sqrt(17) = 4, sqrt(15) = 3
function integerSqrt(n) {
  if (n < 0) return -1;
  if (n < 2) return n;
  
  // Your code here
  // Find the largest integer x where x*x <= n
  // Hint: Binary search from 1 to n/2
}

console.log("sqrt(16):", integerSqrt(16)); // Should be 4
console.log("sqrt(17):", integerSqrt(17)); // Should be 4
console.log("sqrt(99):", integerSqrt(99)); // Should be 9
console.log("sqrt(100):", integerSqrt(100)); // Should be 10
`,
    expectedOutput: `Index of 7: 3
Index of 10: -1
sqrt(16): 4
sqrt(17): 4
sqrt(99): 9
sqrt(100): 10`,
    hint: "For binarySearch: compare arr[mid] with target, adjust left or right accordingly. For integerSqrt: binary search where left=1, right=n/2, and you're looking for the largest mid where mid*mid <= n."
  },
  quiz: [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: 2,
      explanation: "Binary search halves the search space with each comparison, giving O(log n) time complexity."
    },
    {
      question: "Which sorting algorithm has O(n²) worst-case but O(n log n) average-case?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Selection Sort"],
      correctAnswer: 1,
      explanation: "Quick Sort has O(n log n) average case but O(n²) worst case when the pivot choices are poor (e.g., already sorted array with first/last element as pivot)."
    },
    {
      question: "What is required for binary search to work correctly?",
      options: [
        "The array must contain unique elements",
        "The array must be sorted",
        "The array must have an even number of elements",
        "The array must contain only integers"
      ],
      correctAnswer: 1,
      explanation: "Binary search requires a sorted array because it relies on the ordering to eliminate half the elements at each step."
    },
    {
      question: "Which sort is best for a nearly-sorted array?",
      options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
      correctAnswer: 2,
      explanation: "Insertion Sort is O(n) on nearly-sorted data because elements only need to move a short distance. Other O(n log n) sorts don't benefit from this."
    }
  ]
};


