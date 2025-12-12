export const graphsBfsDfs = {
  title: "Graphs: BFS & DFS",
  duration: "35 minutes",
  content: `
Graphs are one of the most versatile data structures. They model relationships between things: social networks, maps, dependencies, and more. Understanding graphs unlocks solutions to many real-world problems.

## What is a Graph?

A graph consists of:
- **Vertices (Nodes)**: The entities
- **Edges**: Connections between vertices

\`\`\`
    A ─── B
    │     │
    │     │
    C ─── D ─── E

Vertices: {A, B, C, D, E}
Edges: {(A,B), (A,C), (B,D), (C,D), (D,E)}
\`\`\`

### Graph Types

**Directed vs Undirected**
\`\`\`
Undirected:  A ─── B    (can go both ways)
Directed:   A ──→ B    (one way only)
\`\`\`

**Weighted vs Unweighted**
\`\`\`
Unweighted: A ─── B
Weighted:   A ──5── B  (edge has a cost/distance)
\`\`\`

## Representing Graphs

### Adjacency List (Most Common)
Each vertex stores a list of its neighbors.

\`\`\`javascript
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D'],
  D: ['B', 'C', 'E'],
  E: ['D']
};
\`\`\`

### Adjacency Matrix
2D array where matrix[i][j] = 1 if edge exists.

\`\`\`javascript
//    A  B  C  D  E
// A [0, 1, 1, 0, 0]
// B [1, 0, 0, 1, 0]
// C [1, 0, 0, 1, 0]
// D [0, 1, 1, 0, 1]
// E [0, 0, 0, 1, 0]
\`\`\`

### Comparison

| | Adjacency List | Adjacency Matrix |
|---|----------------|------------------|
| Space | O(V + E) | O(V²) |
| Add Edge | O(1) | O(1) |
| Check Edge | O(degree) | O(1) |
| Find Neighbors | O(1) | O(V) |
| Best for | Sparse graphs | Dense graphs |

## Graph Class Implementation

\`\`\`javascript
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  addEdge(v1, v2) {
    // For undirected graph, add both directions
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);
  }
  
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1].filter(v => v !== v2);
    this.adjacencyList[v2] = this.adjacencyList[v2].filter(v => v !== v1);
  }
}
\`\`\`

## Depth-First Search (DFS)

DFS explores as **deep as possible** before backtracking. It uses a **stack** (or recursion).

\`\`\`
Start at A, explore deep:
A → B → D → E (dead end, backtrack)
→ D → C (dead end, backtrack)
→ done!

Order: A, B, D, E, C
\`\`\`

### DFS Implementation

**Recursive (using call stack):**
\`\`\`javascript
function dfsRecursive(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfs(vertex) {
    if (!vertex) return;
    
    visited.add(vertex);
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }
  
  dfs(start);
  return result;
}
\`\`\`

**Iterative (using explicit stack):**
\`\`\`javascript
function dfsIterative(graph, start) {
  const visited = new Set();
  const result = [];
  const stack = [start];
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    
    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);
      
      // Add neighbors to stack
      for (const neighbor of graph[vertex]) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return result;
}
\`\`\`

### DFS Use Cases
- Finding paths
- Detecting cycles
- Topological sorting
- Solving mazes
- Tree traversals

## Breadth-First Search (BFS)

BFS explores all neighbors at the current depth before going deeper. It uses a **queue**.

\`\`\`
Start at A, explore breadth-first:
Level 0: A
Level 1: B, C (neighbors of A)
Level 2: D (neighbors of B, C)
Level 3: E (neighbors of D)

Order: A, B, C, D, E
\`\`\`

### BFS Implementation

\`\`\`javascript
function bfs(graph, start) {
  const visited = new Set();
  const result = [];
  const queue = [start];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}
\`\`\`

### BFS Use Cases
- **Shortest path** (unweighted graphs)
- Level-order traversal
- Finding nearest neighbors
- Web crawlers
- Social network features ("friends of friends")

## DFS vs BFS Comparison

| Aspect | DFS | BFS |
|--------|-----|-----|
| Data Structure | Stack | Queue |
| Memory | O(h) height | O(w) width |
| Shortest Path | No | Yes (unweighted) |
| Completeness | May not find all | Finds all reachable |
| Use Case | Paths, cycles | Shortest path, levels |

## Finding Shortest Path with BFS

\`\`\`javascript
function shortestPath(graph, start, end) {
  const visited = new Set();
  const queue = [[start, [start]]]; // [vertex, path]
  
  visited.add(start);
  
  while (queue.length > 0) {
    const [vertex, path] = queue.shift();
    
    if (vertex === end) {
      return path;
    }
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  
  return null; // No path found
}

// Example
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D'],
  D: ['B', 'C', 'E'],
  E: ['D']
};

shortestPath(graph, 'A', 'E'); // ['A', 'B', 'D', 'E'] or ['A', 'C', 'D', 'E']
\`\`\`

## Detecting Cycles (DFS)

\`\`\`javascript
function hasCycle(graph) {
  const visited = new Set();
  const recStack = new Set(); // Vertices in current recursion
  
  function dfs(vertex) {
    visited.add(vertex);
    recStack.add(vertex);
    
    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true; // Cycle found!
      }
    }
    
    recStack.delete(vertex);
    return false;
  }
  
  for (const vertex of Object.keys(graph)) {
    if (!visited.has(vertex)) {
      if (dfs(vertex)) return true;
    }
  }
  
  return false;
}
\`\`\`

## Key Takeaways

1. Graphs model relationships (nodes + edges)
2. Adjacency list is most common for sparse graphs
3. **DFS** goes deep first (stack) — good for paths, cycles
4. **BFS** goes wide first (queue) — good for shortest path
5. Both are O(V + E) time complexity
6. Track visited nodes to avoid infinite loops!
`,
  exercise: {
    description: "Implement BFS and DFS for a graph, then use BFS to find the shortest path between two nodes.",
    starterCode: `// Graph represented as adjacency list
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

// TODO: Implement DFS (return array of visited nodes)
function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  // Your code here (use recursion or a stack)
  
  return result;
}

// TODO: Implement BFS (return array of visited nodes)
function bfs(graph, start) {
  const visited = new Set();
  const result = [];
  const queue = [];
  
  // Your code here
  
  return result;
}

// TODO: Find shortest path using BFS
function shortestPath(graph, start, end) {
  // Your code here
  // Return the path as an array, or null if no path exists
}

// Test your implementations
console.log("DFS from A:", dfs(graph, 'A'));
console.log("BFS from A:", bfs(graph, 'A'));
console.log("Shortest A to F:", shortestPath(graph, 'A', 'F'));
`,
    expectedOutput: `DFS from A: A,B,D,E,F,C
BFS from A: A,B,C,D,E,F
Shortest A to F: A,C,F`,
    hint: "For DFS: use recursion - mark node visited, add to result, then recursively visit unvisited neighbors. For BFS: use a queue - add start, then repeatedly dequeue and enqueue unvisited neighbors. For shortest path: track the path alongside each node in the queue."
  },
  quiz: [
    {
      question: "Which data structure does BFS use?",
      options: ["Stack", "Queue", "Heap", "Hash Map"],
      correctAnswer: 1,
      explanation: "BFS uses a queue to process nodes in FIFO order, ensuring all nodes at distance d are processed before nodes at distance d+1."
    },
    {
      question: "Which algorithm finds the shortest path in an unweighted graph?",
      options: ["DFS", "BFS", "Binary Search", "Both DFS and BFS"],
      correctAnswer: 1,
      explanation: "BFS finds the shortest path in unweighted graphs because it explores nodes level by level, reaching closer nodes before farther ones."
    },
    {
      question: "What is the time complexity of BFS/DFS on a graph with V vertices and E edges?",
      options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
      correctAnswer: 2,
      explanation: "Both BFS and DFS visit each vertex once O(V) and examine each edge once O(E), giving O(V + E) total time."
    },
    {
      question: "Which is true about DFS?",
      options: [
        "It always finds the shortest path",
        "It uses a queue",
        "It explores as deep as possible before backtracking",
        "It has higher time complexity than BFS"
      ],
      correctAnswer: 2,
      explanation: "DFS explores as deep as possible along each branch before backtracking. It uses a stack (or recursion) and doesn't guarantee the shortest path."
    }
  ]
};


