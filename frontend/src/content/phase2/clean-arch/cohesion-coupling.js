export const cohesionCoupling = {
  title: "Cohesion & Coupling",
  duration: "25 minutes",
  content: `
Cohesion and coupling are the two most important concepts in software design. Understanding them helps you write code that's easier to maintain, test, and evolve.

## The Core Principle

> **High cohesion, low coupling** — the golden rule of software design.

- **Cohesion**: How focused a module is on a single purpose
- **Coupling**: How dependent modules are on each other

## Cohesion: Keep Related Things Together

**High cohesion** means a module does one thing well. All its parts work together toward a single purpose.

### Bad: Low Cohesion
\`\`\`javascript
// UserManager does too many unrelated things
class UserManager {
  createUser(data) { /* ... */ }
  validateEmail(email) { /* ... */ }
  sendWelcomeEmail(user) { /* ... */ }
  generateReport() { /* ... */ }
  calculateTax(amount) { /* ... */ } // What?!
  formatDate(date) { /* ... */ }     // Why is this here?
}
\`\`\`

### Good: High Cohesion
\`\`\`javascript
// Each class has one focused purpose
class UserRepository {
  create(user) { /* ... */ }
  findById(id) { /* ... */ }
  update(user) { /* ... */ }
}

class EmailService {
  send(to, subject, body) { /* ... */ }
  validate(email) { /* ... */ }
}

class UserService {
  constructor(userRepo, emailService) {
    this.userRepo = userRepo;
    this.emailService = emailService;
  }
  
  register(data) {
    const user = this.userRepo.create(data);
    this.emailService.send(user.email, 'Welcome!', '...');
    return user;
  }
}
\`\`\`

### Types of Cohesion (Best to Worst)

1. **Functional**: All elements contribute to a single task
2. **Sequential**: Output of one element is input to another
3. **Communicational**: Elements operate on the same data
4. **Procedural**: Elements are related by order of execution
5. **Temporal**: Elements are related by when they execute
6. **Logical**: Elements are related by category
7. **Coincidental**: Elements have no meaningful relationship

## Coupling: Keep Unrelated Things Apart

**Low coupling** means modules can change independently. They don't know too much about each other.

### Bad: High Coupling
\`\`\`javascript
// OrderService knows too much about PaymentService internals
class OrderService {
  processOrder(order) {
    const payment = new PaymentService();
    payment.stripeClient = new StripeClient(API_KEY);
    payment.stripeClient.connect();
    payment.amount = order.total;
    payment.currency = 'USD';
    const result = payment.stripeClient.charge(payment);
    
    if (result.response.data.status === 'succeeded') {
      order.status = 'paid';
    }
  }
}
\`\`\`

### Good: Low Coupling
\`\`\`javascript
// OrderService only knows PaymentService's interface
class OrderService {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }
  
  processOrder(order) {
    const result = this.paymentService.charge(order.total);
    if (result.success) {
      order.status = 'paid';
    }
  }
}

// PaymentService hides its implementation details
class PaymentService {
  charge(amount) {
    // Internal details hidden
    return { success: true, transactionId: '...' };
  }
}
\`\`\`

### Types of Coupling (Best to Worst)

1. **Message coupling**: Only method calls with simple data
2. **Data coupling**: Pass simple data structures
3. **Stamp coupling**: Pass whole objects when only part is needed
4. **Control coupling**: One module controls another's flow
5. **Common coupling**: Shared global data
6. **Content coupling**: One module modifies another's internals

## Practical Guidelines

### 1. Single Responsibility Principle
Each module should have one reason to change.

\`\`\`javascript
// Bad: Multiple reasons to change
class Report {
  calculate() { /* ... */ }
  format() { /* ... */ }
  print() { /* ... */ }
  email() { /* ... */ }
}

// Good: Separate concerns
class ReportCalculator { calculate() { /* ... */ } }
class ReportFormatter { format(data) { /* ... */ } }
class ReportPrinter { print(formatted) { /* ... */ } }
\`\`\`

### 2. Depend on Abstractions
\`\`\`javascript
// Bad: Direct dependency
class UserService {
  constructor() {
    this.db = new PostgresDatabase(); // Concrete class
  }
}

// Good: Depend on interface
class UserService {
  constructor(database) { // Any database that implements the interface
    this.db = database;
  }
}
\`\`\`

### 3. Information Hiding
\`\`\`javascript
// Bad: Exposing internals
class ShoppingCart {
  items = [];
  
  getItems() { return this.items; } // Can be modified externally!
}

// Good: Hide internals
class ShoppingCart {
  #items = [];
  
  getItems() { return [...this.#items]; } // Return copy
  addItem(item) { this.#items.push(item); }
  removeItem(id) { /* ... */ }
}
\`\`\`

## Signs of Problems

### Low Cohesion Smells
- Class name includes "Manager", "Handler", "Utils", "Helper"
- Class has many unrelated methods
- Methods don't use most of the class's fields
- Hard to describe what the class does in one sentence

### High Coupling Smells
- Changes in one module require changes in many others
- Can't test a module without its dependencies
- Circular dependencies between modules
- Module knows implementation details of another

## Key Takeaways

1. **High cohesion**: Modules should do one thing well
2. **Low coupling**: Modules should be independent
3. **Single Responsibility**: One reason to change
4. **Depend on abstractions**: Not concrete implementations
5. **Information hiding**: Don't expose internals
`,
  quiz: [
    {
      question: "What does high cohesion mean?",
      options: [
        "Modules are strongly connected to each other",
        "A module focuses on a single, well-defined purpose",
        "Code is easy to read",
        "Functions are short"
      ],
      correctAnswer: 1,
      explanation: "High cohesion means a module's parts are closely related and work together toward a single purpose. It's about focus within a module."
    },
    {
      question: "What does low coupling mean?",
      options: [
        "Modules are slow to communicate",
        "Modules can change independently without affecting others",
        "There are few modules in the system",
        "Modules share common data"
      ],
      correctAnswer: 1,
      explanation: "Low coupling means modules are independent — changes to one don't require changes to others. They interact through well-defined interfaces."
    },
    {
      question: "Which is a sign of low cohesion?",
      options: [
        "A class with a name like 'UserUtils' or 'DataManager'",
        "A class with private fields",
        "A class that throws exceptions",
        "A class with only one public method"
      ],
      correctAnswer: 0,
      explanation: "Names like 'Utils', 'Manager', or 'Helper' suggest a class does many unrelated things. High-cohesion classes have specific, descriptive names like 'UserRepository' or 'EmailValidator'."
    },
    {
      question: "Why is depending on abstractions better than depending on concrete classes?",
      options: [
        "Abstractions are faster",
        "It allows swapping implementations without changing dependent code",
        "Abstractions use less memory",
        "It's required by JavaScript"
      ],
      correctAnswer: 1,
      explanation: "When you depend on an interface/abstraction, you can swap the concrete implementation (e.g., different databases) without changing the code that uses it."
    }
  ]
};


