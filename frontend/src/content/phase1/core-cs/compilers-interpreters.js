export const compilersInterpreters = {
  title: "Compilers & Interpreters",
  duration: "30 minutes",
  content: `
Understanding how code is executed helps you write better programs and debug mysterious issues. Let's explore the journey from source code to running program.

## The Big Picture

Computers only understand **machine code** (binary). High-level languages need translation:

\`\`\`
Source Code → [Translation] → Machine Code → Execution
  "x + 1"         ???           01001010     CPU runs it
\`\`\`

Two main translation strategies:

1. **Compilation**: Translate everything upfront
2. **Interpretation**: Translate and execute line by line

## Compilers

A **compiler** translates entire source code to machine code before execution.

\`\`\`
Source Code (.c, .rs, .go)
       ↓
   Compiler
       ↓
Executable Binary (.exe)
       ↓
    Execution
\`\`\`

### Compilation Stages

\`\`\`
1. Lexing      →  2. Parsing     →  3. Semantic    →  4. Optimization  →  5. Code Gen
"x = 1 + 2"       Tokens to AST     Type checking     Remove dead code     Binary output
   ↓                   ↓                 ↓                  ↓                   ↓
[x][=][1][+][2]    AST tree        Types valid?       Optimize               01001010
\`\`\`

### Stage 1: Lexical Analysis (Lexing)

Break source code into **tokens**:

\`\`\`javascript
// Input: "let x = 10 + 5;"

// Output tokens:
[
  { type: 'KEYWORD', value: 'let' },
  { type: 'IDENTIFIER', value: 'x' },
  { type: 'OPERATOR', value: '=' },
  { type: 'NUMBER', value: '10' },
  { type: 'OPERATOR', value: '+' },
  { type: 'NUMBER', value: '5' },
  { type: 'SEMICOLON', value: ';' }
]
\`\`\`

### Stage 2: Parsing

Build an **Abstract Syntax Tree (AST)** from tokens:

\`\`\`
        VariableDeclaration
              |
     ┌────────┴────────┐
     │                 │
  name: x         BinaryExpression
                       |
              ┌────────┼────────┐
              │        │        │
           left: 10   op: +   right: 5
\`\`\`

### Stage 3: Semantic Analysis

Check that the code makes sense:
- Type checking
- Variable declarations
- Scope validation

\`\`\`javascript
let x = "hello";
x = 10;  // OK in JavaScript, error in TypeScript!
\`\`\`

### Stage 4: Optimization

Make the code faster:
- Dead code elimination
- Constant folding
- Loop unrolling
- Inlining

\`\`\`javascript
// Before optimization
const a = 2 + 3;
const b = a * 2;

// After constant folding
const a = 5;      // 2 + 3 computed at compile time
const b = 10;     // a * 2 computed at compile time
\`\`\`

### Stage 5: Code Generation

Output machine code or bytecode.

## Interpreters

An **interpreter** executes code line by line without producing an executable.

\`\`\`
Source Code
     ↓
┌─────────────┐
│ Interpreter │ ← Reads, translates, executes each line
└─────────────┘
     ↓
  Results
\`\`\`

### Interpreter Advantages
- Faster development cycle (no compile step)
- Easier debugging
- Platform independent
- Dynamic features (eval, runtime modification)

### Interpreter Disadvantages
- Slower execution
- Must have interpreter installed
- Less optimization opportunity

## Just-In-Time (JIT) Compilation

Modern JavaScript engines (V8, SpiderMonkey) use **JIT compilation** — the best of both worlds:

\`\`\`
JavaScript Code
       ↓
   Interpreter (fast startup)
       ↓
   Profiler (monitors "hot" code)
       ↓
   JIT Compiler (compiles hot paths)
       ↓
   Machine Code (fast execution)
\`\`\`

### How V8 (Chrome/Node.js) Works

\`\`\`
JavaScript
    ↓
Parser → AST
    ↓
Ignition (Interpreter) → Bytecode
    ↓                         │
    │    ← Profiling data ←───┘
    ↓
TurboFan (Optimizing Compiler)
    ↓
Machine Code
\`\`\`

V8 starts interpreting immediately (fast startup), then compiles frequently-executed code to optimized machine code.

### Deoptimization

Sometimes optimizations fail:

\`\`\`javascript
function add(a, b) {
  return a + b;
}

// V8 sees this always called with numbers
add(1, 2);    // Compiles optimized for numbers
add(3, 4);
add(5, 6);

add("x", "y"); // Oops! Strings! Must deoptimize
\`\`\`

This is why consistent types in JavaScript improve performance.

## Build Your Own Mini-Interpreter

Let's build a simple expression evaluator:

\`\`\`javascript
// Tokenizer
function tokenize(code) {
  const tokens = [];
  let i = 0;
  
  while (i < code.length) {
    if (/\\d/.test(code[i])) {
      let num = '';
      while (/\\d/.test(code[i])) num += code[i++];
      tokens.push({ type: 'NUMBER', value: Number(num) });
    } else if (code[i] === '+') {
      tokens.push({ type: 'PLUS' });
      i++;
    } else if (code[i] === '-') {
      tokens.push({ type: 'MINUS' });
      i++;
    } else if (code[i] === '*') {
      tokens.push({ type: 'MULTIPLY' });
      i++;
    } else if (code[i] === ' ') {
      i++;
    }
  }
  
  return tokens;
}

// Simple evaluator (left to right, no precedence)
function evaluate(tokens) {
  let result = tokens[0].value;
  
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i].type;
    const num = tokens[i + 1].value;
    
    if (op === 'PLUS') result += num;
    else if (op === 'MINUS') result -= num;
    else if (op === 'MULTIPLY') result *= num;
  }
  
  return result;
}

const tokens = tokenize("10 + 5 - 3");
console.log(evaluate(tokens)); // 12
\`\`\`

## Languages and Their Execution

| Language | Execution Method |
|----------|-----------------|
| C, C++, Rust | Compiled to machine code |
| Java, C# | Compiled to bytecode, JIT |
| JavaScript | Interpreted + JIT |
| Python | Interpreted (CPython) / JIT (PyPy) |
| Go | Compiled to machine code |

## Key Takeaways

1. **Compilers** translate code upfront; faster execution, slower dev cycle
2. **Interpreters** execute line by line; faster dev cycle, slower execution
3. **JIT** combines both: interpret first, compile hot code
4. Compilation stages: Lexing → Parsing → Semantic Analysis → Optimization → Code Generation
5. Consistent types in JavaScript help JIT optimization
`,
  exercise: {
    description: "Build a simple tokenizer and evaluator for mathematical expressions.",
    starterCode: `// TODO: Build a simple expression evaluator
// Should handle: numbers, +, -, *, /

function tokenize(expression) {
  const tokens = [];
  let i = 0;
  
  while (i < expression.length) {
    // Skip whitespace
    if (expression[i] === ' ') {
      i++;
      continue;
    }
    
    // TODO: Handle numbers (including multi-digit)
    if (/\\d/.test(expression[i])) {
      // Your code here
    }
    
    // TODO: Handle operators (+, -, *, /)
    // Your code here
    
    i++;
  }
  
  return tokens;
}

function evaluate(tokens) {
  // Simple left-to-right evaluation (no precedence)
  if (tokens.length === 0) return 0;
  
  let result = tokens[0].value;
  
  // TODO: Process remaining tokens (operator, number pairs)
  // Your code here
  
  return result;
}

// Test your implementation
const expr1 = "10 + 5";
const expr2 = "20 - 8 + 3";
const expr3 = "5 * 3";

console.log("10 + 5 =", evaluate(tokenize(expr1)));    // Should be 15
console.log("20 - 8 + 3 =", evaluate(tokenize(expr2))); // Should be 15
console.log("5 * 3 =", evaluate(tokenize(expr3)));      // Should be 15
`,
    expectedOutput: `10 + 5 = 15
20 - 8 + 3 = 15
5 * 3 = 15`,
    hint: "For tokenizing numbers: build a string while you see digits, then push a NUMBER token with the numeric value. For operators: push an appropriate token like {type: 'PLUS'} or {type: 'MULTIPLY'}."
  },
  quiz: [
    {
      question: "What is the main difference between a compiler and an interpreter?",
      options: [
        "Compilers are faster",
        "Compilers translate all code before execution; interpreters execute line by line",
        "Interpreters can only run Python",
        "Compilers don't need source code"
      ],
      correctAnswer: 1,
      explanation: "A compiler translates the entire program to machine code before execution. An interpreter reads and executes code line by line without creating a separate executable."
    },
    {
      question: "What does JIT stand for and what does it do?",
      options: [
        "Just In Time - compiles code during execution",
        "JavaScript Internal Transformer - converts JS to TypeScript",
        "Joint Interpreted Translation - combines multiple scripts",
        "JavaScript Iteration Tool - optimizes loops"
      ],
      correctAnswer: 0,
      explanation: "JIT (Just-In-Time) compilation compiles code during execution, combining the quick startup of interpretation with the fast execution of compiled code for frequently-run sections."
    },
    {
      question: "What is an Abstract Syntax Tree (AST)?",
      options: [
        "A compressed version of source code",
        "A tree representation of code structure",
        "A debugging tool",
        "A type of variable"
      ],
      correctAnswer: 1,
      explanation: "An AST is a tree representation of the syntactic structure of code. Each node represents a construct (variable, operator, function call, etc.) and its children are its components."
    },
    {
      question: "Why does V8 sometimes 'deoptimize' code?",
      options: [
        "To save memory",
        "When code hasn't run for a while",
        "When runtime behavior differs from what was assumed during optimization",
        "To improve debugging"
      ],
      correctAnswer: 2,
      explanation: "V8 optimizes based on observed types. If a function always receives numbers, it generates number-optimized code. If a string is later passed, the optimization becomes invalid and must be undone."
    }
  ]
};


