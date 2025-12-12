export const layersBoundaries = {
  title: "Layers & Boundaries",
  duration: "25 minutes",
  content: `
Layered architecture organizes code into distinct levels, each with a specific responsibility. Understanding layers helps you build maintainable systems.

## Why Layers?

Without layers, code becomes a tangled mess where everything depends on everything:

\`\`\`
Database ←→ Business Logic ←→ UI ←→ Email ←→ API
    ↑              ↓           ↑        ↓
    └──────────────┴───────────┴────────┘
              Spaghetti!
\`\`\`

With layers, dependencies flow in one direction:

\`\`\`
┌─────────────────────────┐
│    Presentation Layer   │  ← UI, Controllers, API
├─────────────────────────┤
│    Application Layer    │  ← Use cases, orchestration
├─────────────────────────┤
│      Domain Layer       │  ← Business logic, entities
├─────────────────────────┤
│   Infrastructure Layer  │  ← Database, external APIs
└─────────────────────────┘
       Dependencies flow DOWN
\`\`\`

## The Four Layers

### 1. Presentation Layer
The entry point — how users interact with the system.

\`\`\`javascript
// API Controller
class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }
  
  async createOrder(req, res) {
    try {
      const order = await this.orderService.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
\`\`\`

### 2. Application Layer
Orchestrates use cases — coordinates domain objects and services.

\`\`\`javascript
// Use Case / Application Service
class CreateOrderUseCase {
  constructor(orderRepository, paymentService, notificationService) {
    this.orderRepository = orderRepository;
    this.paymentService = paymentService;
    this.notificationService = notificationService;
  }
  
  async execute(orderData) {
    // Orchestrate the use case
    const order = new Order(orderData);
    order.validate();
    
    const payment = await this.paymentService.process(order.total);
    order.markPaid(payment.transactionId);
    
    await this.orderRepository.save(order);
    await this.notificationService.sendConfirmation(order);
    
    return order;
  }
}
\`\`\`

### 3. Domain Layer
The heart of the application — business rules and entities.

\`\`\`javascript
// Domain Entity
class Order {
  constructor({ items, customerId }) {
    this.items = items;
    this.customerId = customerId;
    this.status = 'pending';
    this.createdAt = new Date();
  }
  
  get total() {
    return this.items.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
    );
  }
  
  validate() {
    if (this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    if (this.total <= 0) {
      throw new Error('Order total must be positive');
    }
  }
  
  markPaid(transactionId) {
    this.status = 'paid';
    this.transactionId = transactionId;
  }
}
\`\`\`

### 4. Infrastructure Layer
Technical details — databases, external services, frameworks.

\`\`\`javascript
// Repository Implementation
class PostgresOrderRepository {
  constructor(db) {
    this.db = db;
  }
  
  async save(order) {
    await this.db.query(
      'INSERT INTO orders (customer_id, items, status, total) VALUES ($1, $2, $3, $4)',
      [order.customerId, JSON.stringify(order.items), order.status, order.total]
    );
  }
  
  async findById(id) {
    const result = await this.db.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0] ? this.toEntity(result.rows[0]) : null;
  }
}
\`\`\`

## The Dependency Rule

**Dependencies only point inward.** Outer layers know about inner layers, never the reverse.

\`\`\`
Presentation → Application → Domain ← Infrastructure
                              ↑
                   (depends on abstractions)
\`\`\`

The Domain layer doesn't know about databases or HTTP — it defines interfaces that Infrastructure implements.

\`\`\`javascript
// Domain defines what it needs (interface)
// In domain/repositories/orderRepository.js
/**
 * @interface OrderRepository
 * @method save(order) - Persist an order
 * @method findById(id) - Find order by ID
 */

// Infrastructure provides it (implementation)
// In infrastructure/repositories/postgresOrderRepository.js
class PostgresOrderRepository {
  // Implements the interface
}
\`\`\`

## Boundaries: Protecting the Domain

Boundaries prevent infrastructure concerns from leaking into business logic:

\`\`\`javascript
// Bad: Domain knows about HTTP
class Order {
  toJSON() {
    return { /* HTTP-specific format */ };
  }
}

// Good: Presentation handles formatting
class OrderPresenter {
  static toJSON(order) {
    return {
      id: order.id,
      items: order.items.map(item => ({
        name: item.name,
        price: item.price
      })),
      total: order.total
    };
  }
}
\`\`\`

## Folder Structure Example

\`\`\`
src/
├── presentation/
│   ├── controllers/
│   │   └── orderController.js
│   ├── middleware/
│   └── presenters/
│       └── orderPresenter.js
├── application/
│   ├── useCases/
│   │   └── createOrderUseCase.js
│   └── services/
├── domain/
│   ├── entities/
│   │   └── order.js
│   ├── valueObjects/
│   └── repositories/
│       └── orderRepository.js  (interface)
└── infrastructure/
    ├── database/
    │   └── postgresOrderRepository.js
    ├── external/
    │   └── stripePaymentService.js
    └── config/
\`\`\`

## Key Takeaways

1. **Four layers**: Presentation → Application → Domain → Infrastructure
2. **Dependencies flow inward** — domain is at the center
3. **Domain is pure** — no framework or infrastructure code
4. **Use interfaces** to invert dependencies at layer boundaries
5. **Each layer has one responsibility**
`,
  quiz: [
    {
      question: "In which direction should dependencies flow in layered architecture?",
      options: [
        "Outward (from domain to presentation)",
        "Inward (from presentation to domain)",
        "Both directions equally",
        "There should be no dependencies"
      ],
      correctAnswer: 1,
      explanation: "Dependencies should flow inward. Outer layers (presentation, infrastructure) depend on inner layers (domain), but inner layers should not depend on outer layers."
    },
    {
      question: "Which layer contains business rules and entities?",
      options: ["Presentation", "Application", "Domain", "Infrastructure"],
      correctAnswer: 2,
      explanation: "The Domain layer contains business rules, entities, and value objects. It's the core of the application and should have no dependencies on other layers."
    },
    {
      question: "Why should the Domain layer not know about databases?",
      options: [
        "Databases are slow",
        "To keep business logic pure and testable without infrastructure",
        "JavaScript doesn't support databases",
        "It would use too much memory"
      ],
      correctAnswer: 1,
      explanation: "Keeping the domain layer free of infrastructure concerns makes it easier to test (no database needed), understand (pure business logic), and change (swap databases without touching business rules)."
    },
    {
      question: "What does the Application layer do?",
      options: [
        "Renders the UI",
        "Orchestrates use cases and coordinates domain objects",
        "Connects to the database",
        "Handles authentication"
      ],
      correctAnswer: 1,
      explanation: "The Application layer orchestrates use cases — it coordinates domain objects and services to fulfill a user's request, without containing business rules itself."
    }
  ]
};


