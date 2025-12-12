export const dependencyInversion = {
  title: "Dependency Inversion",
  duration: "25 minutes",
  content: `
The Dependency Inversion Principle (DIP) is the D in SOLID. It's the key to building flexible, testable software that can evolve without massive rewrites.

## The Problem

Traditional code creates tight coupling:

\`\`\`javascript
// High-level module depends on low-level module
class OrderService {
  constructor() {
    this.database = new MySQLDatabase(); // Direct dependency!
    this.emailer = new SMTPEmailer();    // Direct dependency!
  }
  
  createOrder(order) {
    this.database.save(order);
    this.emailer.send(order.customer.email, 'Order confirmed');
  }
}
\`\`\`

Problems:
- Can't use OrderService without MySQL and SMTP
- Can't test without real database and email
- Switching to PostgreSQL requires changing OrderService

## The Dependency Inversion Principle

> **High-level modules should not depend on low-level modules. Both should depend on abstractions.**

\`\`\`
Traditional:                    With DIP:
┌───────────────┐               ┌───────────────┐
│  High-Level   │               │  High-Level   │
│   (Business)  │               │   (Business)  │
└───────┬───────┘               └───────┬───────┘
        │ depends on                    │ depends on
        ▼                               ▼
┌───────────────┐               ┌───────────────┐
│   Low-Level   │               │  Abstraction  │
│ (Database)    │               │  (Interface)  │
└───────────────┘               └───────┬───────┘
                                        │ implements
                                        ▼
                                ┌───────────────┐
                                │   Low-Level   │
                                │  (Database)   │
                                └───────────────┘
\`\`\`

## Implementing DIP in JavaScript

### Step 1: Define Abstractions (Interfaces)

\`\`\`javascript
// In JavaScript, we document expected interfaces
// TypeScript would use actual interfaces

/**
 * Database interface
 * @method save(data) - Save data, returns id
 * @method findById(id) - Find by id, returns data or null
 */

/**
 * Emailer interface  
 * @method send(to, subject, body) - Send email, returns success boolean
 */
\`\`\`

### Step 2: High-Level Module Depends on Abstractions

\`\`\`javascript
class OrderService {
  // Dependencies injected, not created
  constructor(database, emailer) {
    this.database = database;
    this.emailer = emailer;
  }
  
  createOrder(order) {
    const id = this.database.save(order);
    this.emailer.send(
      order.customer.email,
      'Order Confirmed',
      \`Your order #\${id} has been received.\`
    );
    return id;
  }
}
\`\`\`

### Step 3: Low-Level Modules Implement Abstractions

\`\`\`javascript
// Real implementations
class MySQLDatabase {
  save(data) {
    // MySQL-specific code
    return generatedId;
  }
  findById(id) { /* ... */ }
}

class PostgresDatabase {
  save(data) {
    // PostgreSQL-specific code
    return generatedId;
  }
  findById(id) { /* ... */ }
}

class SMTPEmailer {
  send(to, subject, body) {
    // SMTP-specific code
    return true;
  }
}

class SendGridEmailer {
  send(to, subject, body) {
    // SendGrid API code
    return true;
  }
}
\`\`\`

### Step 4: Wire It Up (Composition Root)

\`\`\`javascript
// At the application entry point
const database = new PostgresDatabase();
const emailer = new SendGridEmailer();
const orderService = new OrderService(database, emailer);

// OrderService doesn't know or care which implementations are used
\`\`\`

## Benefits

### 1. Testability
\`\`\`javascript
// Test with mock implementations
class MockDatabase {
  saved = [];
  save(data) {
    this.saved.push(data);
    return this.saved.length;
  }
}

class MockEmailer {
  sentEmails = [];
  send(to, subject, body) {
    this.sentEmails.push({ to, subject, body });
    return true;
  }
}

// Test
const mockDb = new MockDatabase();
const mockEmailer = new MockEmailer();
const service = new OrderService(mockDb, mockEmailer);

service.createOrder({ customer: { email: 'test@test.com' } });

assert(mockDb.saved.length === 1);
assert(mockEmailer.sentEmails.length === 1);
\`\`\`

### 2. Flexibility
\`\`\`javascript
// Switch implementations without touching business logic
const database = process.env.NODE_ENV === 'test'
  ? new InMemoryDatabase()
  : new PostgresDatabase();
\`\`\`

### 3. Separation of Concerns
Business logic doesn't contain infrastructure details.

## Dependency Injection Patterns

### Constructor Injection (Preferred)
\`\`\`javascript
class OrderService {
  constructor(database, emailer) {
    this.database = database;
    this.emailer = emailer;
  }
}
\`\`\`

### Setter Injection
\`\`\`javascript
class OrderService {
  setDatabase(database) { this.database = database; }
  setEmailer(emailer) { this.emailer = emailer; }
}
\`\`\`

### Method Injection
\`\`\`javascript
class OrderService {
  createOrder(order, database, emailer) {
    // Use injected dependencies for this call only
  }
}
\`\`\`

## Common Mistakes

### 1. Injecting Concrete Classes
\`\`\`javascript
// Still coupled to specific implementation!
constructor(mysqlDatabase) { /* ... */ }

// Better: accept any database
constructor(database) { /* ... */ }
\`\`\`

### 2. Service Locator Anti-Pattern
\`\`\`javascript
// Don't do this - hidden dependencies
class OrderService {
  createOrder(order) {
    const db = ServiceLocator.get('database'); // Hidden!
    const email = ServiceLocator.get('emailer');
  }
}

// Do this - explicit dependencies
class OrderService {
  constructor(database, emailer) { /* ... */ }
}
\`\`\`

## Key Takeaways

1. **Depend on abstractions**, not concrete implementations
2. **Inject dependencies** through constructor
3. **High-level modules** define what they need; low-level modules provide it
4. **Wire everything** at the composition root (app entry point)
5. **Test easily** by injecting mocks
`,
  quiz: [
    {
      question: "What does the Dependency Inversion Principle state?",
      options: [
        "Dependencies should be inverted in test code",
        "High-level modules should depend on abstractions, not low-level modules",
        "All dependencies should be removed",
        "Low-level modules should control high-level modules"
      ],
      correctAnswer: 1,
      explanation: "DIP states that high-level modules (business logic) should depend on abstractions (interfaces), and low-level modules (infrastructure) should implement those abstractions."
    },
    {
      question: "What is dependency injection?",
      options: [
        "Creating dependencies inside a class",
        "Passing dependencies to a class from outside",
        "Removing all dependencies",
        "Using global variables for dependencies"
      ],
      correctAnswer: 1,
      explanation: "Dependency injection means passing (injecting) dependencies into a class rather than having the class create them. This inverts control and enables flexibility."
    },
    {
      question: "Why is constructor injection preferred?",
      options: [
        "It's faster",
        "Dependencies are explicit and the object is complete after construction",
        "It uses less memory",
        "It's required by JavaScript"
      ],
      correctAnswer: 1,
      explanation: "Constructor injection makes dependencies explicit (you can see them in the constructor signature) and ensures the object is fully initialized and usable immediately after construction."
    },
    {
      question: "What is a composition root?",
      options: [
        "The root folder of the project",
        "Where all dependency wiring happens, typically at app startup",
        "A special dependency injection framework",
        "The main business logic class"
      ],
      correctAnswer: 1,
      explanation: "The composition root is where you wire up all the dependencies, typically at the application entry point. This keeps dependency resolution in one place."
    }
  ]
};


