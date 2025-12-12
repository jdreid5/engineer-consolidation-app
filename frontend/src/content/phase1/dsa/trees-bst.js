export const treesBst = {
  title: "Trees & Binary Search Trees",
  duration: "35 minutes",
  content: `
Trees are hierarchical data structures that model relationships like file systems, organization charts, and DOM elements. Binary Search Trees (BSTs) are a special type that enable fast searching.

## What is a Tree?

A tree consists of **nodes** connected by **edges**, with one special node called the **root**.

\`\`\`
           root
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
   child  child  child
     │
   ┌─┴─┐
   ▼   ▼
 leaf leaf
\`\`\`

### Tree Terminology

- **Root**: The topmost node (no parent)
- **Parent/Child**: Nodes connected by an edge
- **Leaf**: A node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to a node
- **Subtree**: A node and all its descendants

## Binary Trees

A **binary tree** is a tree where each node has **at most two children** (left and right).

\`\`\`javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

//       10
//      /  \\
//     5    15
//    / \\     \\
//   3   7    20

const root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(15);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(7);
root.right.right = new TreeNode(20);
\`\`\`

## Binary Search Trees (BST)

A BST is a binary tree with a special property:

> For every node, **all values in the left subtree are smaller**, and **all values in the right subtree are larger**.

\`\`\`
       10          
      /  \\         
     5    15       For node 10:
    / \\     \\      Left (5,3,7) < 10
   3   7    20     Right (15,20) > 10
\`\`\`

This property enables **O(log n) search** — each comparison eliminates half the remaining nodes!

### BST Operations

#### Search
\`\`\`javascript
function search(node, value) {
  if (node === null) return null;
  
  if (value === node.value) {
    return node;
  } else if (value < node.value) {
    return search(node.left, value);  // Go left
  } else {
    return search(node.right, value); // Go right
  }
}
\`\`\`

#### Insert
\`\`\`javascript
function insert(node, value) {
  if (node === null) {
    return new TreeNode(value);
  }
  
  if (value < node.value) {
    node.left = insert(node.left, value);
  } else if (value > node.value) {
    node.right = insert(node.right, value);
  }
  // If value === node.value, we typically ignore (no duplicates)
  
  return node;
}
\`\`\`

### Complete BST Class

\`\`\`javascript
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    while (true) {
      if (value === current.value) return this; // No duplicates
      
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }
  
  contains(value) {
    return this.search(value) !== null;
  }
}
\`\`\`

## Tree Traversals

There are several ways to visit all nodes in a tree:

### In-Order (Left, Root, Right)
Visits nodes in **sorted order** for BSTs!

\`\`\`javascript
function inOrder(node, result = []) {
  if (node) {
    inOrder(node.left, result);
    result.push(node.value);
    inOrder(node.right, result);
  }
  return result;
}
// For our BST: [3, 5, 7, 10, 15, 20]
\`\`\`

### Pre-Order (Root, Left, Right)
Good for **copying** a tree.

\`\`\`javascript
function preOrder(node, result = []) {
  if (node) {
    result.push(node.value);
    preOrder(node.left, result);
    preOrder(node.right, result);
  }
  return result;
}
// [10, 5, 3, 7, 15, 20]
\`\`\`

### Post-Order (Left, Right, Root)
Good for **deleting** a tree (children before parent).

\`\`\`javascript
function postOrder(node, result = []) {
  if (node) {
    postOrder(node.left, result);
    postOrder(node.right, result);
    result.push(node.value);
  }
  return result;
}
// [3, 7, 5, 20, 15, 10]
\`\`\`

### Level-Order (BFS)
Visits level by level.

\`\`\`javascript
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
}
// [10, 5, 15, 3, 7, 20]
\`\`\`

## BST Performance

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Search    | O(log n)| O(n)       |
| Insert    | O(log n)| O(n)       |
| Delete    | O(log n)| O(n)       |

The worst case happens when the tree becomes **unbalanced** (like a linked list):

\`\`\`
Insert 1, 2, 3, 4, 5 in order:

1                 vs.    Balanced:
 \\                           3
  2                        /   \\
   \\                      1     4
    3                      \\     \\
     \\                      2     5
      4
       \\
        5

Height: n              Height: log(n)
\`\`\`

This is why **self-balancing trees** (AVL, Red-Black) exist — they automatically rebalance!

## Common Tree Problems

### Find Maximum Depth
\`\`\`javascript
function maxDepth(node) {
  if (node === null) return 0;
  return 1 + Math.max(
    maxDepth(node.left),
    maxDepth(node.right)
  );
}
\`\`\`

### Check if Valid BST
\`\`\`javascript
function isValidBST(node, min = -Infinity, max = Infinity) {
  if (node === null) return true;
  
  if (node.value <= min || node.value >= max) {
    return false;
  }
  
  return isValidBST(node.left, min, node.value) &&
         isValidBST(node.right, node.value, max);
}
\`\`\`

## Key Takeaways

1. Trees model hierarchical relationships
2. BST property: left < node < right
3. BST search is O(log n) average case
4. In-order traversal of BST gives sorted output
5. Unbalanced trees degrade to O(n) — use self-balancing trees for guaranteed performance
`,
  exercise: {
    description: "Implement a BinarySearchTree class with insert, search, and in-order traversal methods.",
    starterCode: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // TODO: Implement insert(value)
  insert(value) {
    // Your code here
    // Return 'this' for method chaining
  }
  
  // TODO: Implement search(value)
  search(value) {
    // Your code here
    // Return the node if found, null otherwise
  }
  
  // TODO: Implement inOrder traversal
  inOrder() {
    // Your code here
    // Return array of values in sorted order
  }
}

// Test your BST
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(20);

console.log(bst.inOrder()); // Should print: [3, 5, 7, 10, 15, 20]
console.log(bst.search(7) !== null); // Should print: true
console.log(bst.search(100) !== null); // Should print: false
`,
    expectedOutput: `[3, 5, 7, 10, 15, 20]
true
false`,
    hint: "For insert: if root is null, create it. Otherwise, traverse left if value < current, right if value > current, until you find an empty spot. For inOrder: recursively visit left, add current value, visit right."
  },
  quiz: [
    {
      question: "What is the key property of a Binary Search Tree?",
      options: [
        "Every node has exactly two children",
        "Left child < parent < right child for all nodes",
        "The tree is always perfectly balanced",
        "All leaf nodes are at the same level"
      ],
      correctAnswer: 1,
      explanation: "In a BST, for every node, all values in the left subtree are smaller and all values in the right subtree are larger. This enables efficient searching."
    },
    {
      question: "What is the time complexity of searching in a balanced BST?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 2,
      explanation: "In a balanced BST, each comparison eliminates half the remaining nodes, giving O(log n) search time."
    },
    {
      question: "Which traversal visits BST nodes in sorted order?",
      options: ["Pre-order", "Post-order", "In-order", "Level-order"],
      correctAnswer: 2,
      explanation: "In-order traversal (left, root, right) visits nodes in sorted order because it processes all smaller values before the current node, then larger values after."
    },
    {
      question: "When does a BST have O(n) search complexity?",
      options: [
        "When the tree is perfectly balanced",
        "When searching for the minimum value",
        "When the tree is unbalanced (like a linked list)",
        "When using iterative instead of recursive search"
      ],
      correctAnswer: 2,
      explanation: "If values are inserted in sorted order, the BST becomes a linked list (each node has only one child), making search O(n) instead of O(log n)."
    }
  ]
};


