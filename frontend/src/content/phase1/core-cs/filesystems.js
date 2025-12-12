export const filesystems = {
  title: "Filesystems Deep Dive",
  duration: "25 minutes",
  content: `
Filesystems are how operating systems organize and store data on disks. Understanding them helps you write better file-handling code and diagnose performance issues.

## What is a Filesystem?

A filesystem is the structure that manages how data is stored and retrieved on storage devices. It handles:

- **Organization**: Files, directories, hierarchy
- **Metadata**: Names, sizes, permissions, timestamps
- **Allocation**: Where data lives on disk
- **Access**: Reading, writing, seeking

## Common Filesystems

| Filesystem | OS | Features |
|------------|-----|----------|
| NTFS | Windows | Permissions, journaling, large files |
| ext4 | Linux | Journaling, fast, reliable |
| APFS | macOS | Optimized for SSD, encryption |
| FAT32 | Universal | Simple, limited (4GB file max) |

## How Files are Stored

### Disk Structure

\`\`\`
Physical disk:
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ 0   │ 1   │ 2   │ 3   │ 4   │ 5   │ ... │ ← Blocks/sectors
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
\`\`\`

Files aren't stored in one piece. They're split into **blocks** (typically 4KB):

\`\`\`
File "document.txt" (12KB):
  Block 5  → First 4KB
  Block 12 → Next 4KB
  Block 8  → Last 4KB

Not contiguous! This is called fragmentation.
\`\`\`

### Inodes (Unix/Linux)

Each file has an **inode** containing metadata:

\`\`\`
Inode 42:
├── Size: 12KB
├── Owner: user1
├── Permissions: rw-r--r--
├── Created: 2024-01-15
├── Modified: 2024-01-20
├── Block pointers: [5, 12, 8]
└── Link count: 1
\`\`\`

The filename is stored separately in the directory, pointing to the inode.

## File Operations

### Opening a File

When you open a file, the OS:
1. Finds the file's inode
2. Creates a file descriptor (handle)
3. Tracks your position in the file

\`\`\`javascript
// Node.js example
const fs = require('fs');

// Open file - returns file descriptor
const fd = fs.openSync('file.txt', 'r');
// fd is now a number like 3, 4, etc.

// Read data
const buffer = Buffer.alloc(100);
fs.readSync(fd, buffer, 0, 100, 0);

// Close file - releases the descriptor
fs.closeSync(fd);
\`\`\`

### Buffering

File I/O is buffered for performance:

\`\`\`
Your code → [Buffer] → [OS Buffer] → Disk

write('A')  →  Buffer: [A........]  (not written yet)
write('B')  →  Buffer: [AB.......]
write('C')  →  Buffer: [ABC......]
flush/close →  Disk write happens!
\`\`\`

This is why data can be lost if the program crashes before flushing.

## Reading: Sequential vs Random

### Sequential Reading
\`\`\`javascript
// Sequential: read from start to end
const data = fs.readFileSync('file.txt'); // Reads entire file

// Fast because:
// - Disk heads don't need to move much
// - OS can predict and prefetch
\`\`\`

### Random Access
\`\`\`javascript
// Random: jump to specific positions
const fd = fs.openSync('file.txt', 'r');
const buffer = Buffer.alloc(100);

fs.readSync(fd, buffer, 0, 100, 1000); // Read from position 1000
fs.readSync(fd, buffer, 0, 100, 5000); // Read from position 5000
fs.readSync(fd, buffer, 0, 100, 200);  // Read from position 200

// Slower on HDDs (seek time)
// Better on SSDs (no physical movement)
\`\`\`

## Sync vs Async I/O

### Synchronous (Blocking)
\`\`\`javascript
// Blocks the thread until complete
const data = fs.readFileSync('large.txt');
console.log('Done'); // Only runs after read completes
\`\`\`

### Asynchronous (Non-blocking)
\`\`\`javascript
// Returns immediately, callback when done
fs.readFile('large.txt', (err, data) => {
  console.log('File read complete');
});
console.log('This prints first!');
\`\`\`

### Promises/Async-Await
\`\`\`javascript
const fs = require('fs').promises;

async function processFile() {
  const data = await fs.readFile('file.txt', 'utf8');
  console.log(data);
}
\`\`\`

## Streams for Large Files

Don't load huge files into memory:

\`\`\`javascript
// Bad: loads entire file into memory
const data = fs.readFileSync('huge.log'); // 10GB = 10GB RAM!

// Good: process chunk by chunk
const stream = fs.createReadStream('huge.log');
stream.on('data', (chunk) => {
  // Process chunk (default 64KB at a time)
  console.log('Got', chunk.length, 'bytes');
});
stream.on('end', () => console.log('Done!'));
\`\`\`

### Piping Streams
\`\`\`javascript
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream); // Efficiently copy file
\`\`\`

## Common Performance Issues

### 1. Too Many Small Writes
\`\`\`javascript
// Bad: many small writes
for (let i = 0; i < 10000; i++) {
  fs.appendFileSync('log.txt', \`Line \${i}\\n\`);
}

// Good: batch writes
const lines = [];
for (let i = 0; i < 10000; i++) {
  lines.push(\`Line \${i}\`);
}
fs.writeFileSync('log.txt', lines.join('\\n'));
\`\`\`

### 2. Not Using Streams
\`\`\`javascript
// Bad: loads 1GB into memory
const data = fs.readFileSync('huge.csv');
process(data);

// Good: stream processing
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('huge.csv')
});
rl.on('line', (line) => processLine(line));
\`\`\`

### 3. Sync in Event Loops
\`\`\`javascript
// Bad in a web server: blocks all requests
app.get('/data', (req, res) => {
  const data = fs.readFileSync('data.json'); // Blocks!
  res.send(data);
});

// Good: async
app.get('/data', async (req, res) => {
  const data = await fs.promises.readFile('data.json');
  res.send(data);
});
\`\`\`

## Key Takeaways

1. Files are stored in **blocks**, not contiguously
2. **Inodes** contain metadata, directories map names to inodes
3. I/O is **buffered** — data isn't immediately written to disk
4. Use **streams** for large files to avoid memory issues
5. Use **async I/O** in servers to avoid blocking
`,
  exercise: {
    description: "Practice file operations with streams to handle data efficiently.",
    starterCode: `// Note: This exercise simulates file operations
// In a browser, we can't access the real filesystem

// Simulated stream processing
function simulateStream(text, chunkSize = 10) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// TODO: Implement a function that counts words in "chunks"
// simulating how you'd process a large file
function countWordsInChunks(chunks) {
  let wordCount = 0;
  let partialWord = ''; // Handle words split across chunks
  
  for (const chunk of chunks) {
    // Your code here
    // Hint: Handle the case where a word is split between chunks
    // Combine partialWord with the chunk before processing
  }
  
  // Don't forget the last partial word!
  if (partialWord.trim()) {
    wordCount++;
  }
  
  return wordCount;
}

// Test data
const text = "The quick brown fox jumps over the lazy dog. This is a test.";
const chunks = simulateStream(text, 10);

console.log("Chunks:", chunks);
console.log("Word count:", countWordsInChunks(chunks));

// The text has 14 words
`,
    expectedOutput: `Chunks: ["The quick ", "brown fox ", "jumps over", " the lazy ", "dog. This ", "is a test."]
Word count: 14`,
    hint: "For each chunk: prepend the partialWord from the previous chunk. Split by whitespace to get words. If the chunk doesn't end with whitespace, save the last word as the new partialWord (it might be incomplete)."
  },
  quiz: [
    {
      question: "What is an inode?",
      options: [
        "A type of directory",
        "A data structure containing file metadata",
        "A file compression format",
        "A network protocol for file transfer"
      ],
      correctAnswer: 1,
      explanation: "An inode is a data structure in Unix-like filesystems that stores metadata about a file (size, permissions, timestamps, block pointers) — everything except the filename and actual data."
    },
    {
      question: "Why is buffered I/O used?",
      options: [
        "To encrypt file data",
        "To reduce the number of expensive disk operations",
        "To compress files automatically",
        "To prevent file corruption"
      ],
      correctAnswer: 1,
      explanation: "Buffering accumulates small writes into larger ones, reducing the number of disk operations. Disk I/O is slow, so fewer, larger operations are more efficient than many small ones."
    },
    {
      question: "When should you use streams instead of readFileSync?",
      options: [
        "For small configuration files",
        "For files larger than available memory",
        "For JSON files",
        "For encrypted files"
      ],
      correctAnswer: 1,
      explanation: "Streams process data in chunks, so you can handle files larger than your RAM. readFileSync loads the entire file into memory, which fails or slows down for very large files."
    },
    {
      question: "What's wrong with using synchronous file operations in a Node.js web server?",
      options: [
        "They use more memory",
        "They block the event loop, preventing other requests from being handled",
        "They don't work with JSON",
        "They're slower than async operations"
      ],
      correctAnswer: 1,
      explanation: "Node.js is single-threaded. Synchronous operations block the entire event loop, meaning no other requests can be processed until the file operation completes."
    }
  ]
};


