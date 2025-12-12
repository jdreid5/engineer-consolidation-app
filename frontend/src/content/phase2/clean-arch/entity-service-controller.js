export const entityServiceController = {
  title: "Entity vs Service vs Controller",
  duration: "20 minutes",
  content: `
Understanding the difference between entities, services, and controllers is fundamental to organizing code properly. Each has a distinct role.

## The Three Roles

\`\`\`
Request → Controller → Service → Entity → Database
                         ↓
                    Response
\`\`\`

## Entities: The Core

Entities represent **business concepts** with identity and behavior.

\`\`\`javascript
class User {
  constructor({ id, email, name, passwordHash }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
  }
  
  // Business behavior
  updateEmail(newEmail) {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }
  
  isValidEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }
  
  // Business rules
  canAccessPremiumFeatures() {
    return this.subscription?.isActive && this.subscription.tier === 'premium';
  }
}
\`\`\`

**Entities should:**
- Contain business logic related to themselves
- Validate their own state
- Be independent of frameworks and databases
- Have identity (usually an ID)

**Entities should NOT:**
- Make HTTP requests
- Query databases directly
- Know about controllers or services

## Services: The Orchestrators

Services **coordinate operations** between entities, repositories, and external systems.

\`\`\`javascript
class UserService {
  constructor(userRepository, emailService, eventBus) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.eventBus = eventBus;
  }
  
  async register(userData) {
    // Validate input
    if (!userData.email || !userData.password) {
      throw new Error('Email and password required');
    }
    
    // Check uniqueness (can't be in entity)
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error('Email already registered');
    }
    
    // Create entity
    const user = new User({
      id: generateId(),
      email: userData.email,
      name: userData.name,
      passwordHash: await hashPassword(userData.password)
    });
    
    // Persist
    await this.userRepository.save(user);
    
    // Side effects
    await this.emailService.sendWelcome(user.email);
    this.eventBus.publish('user.registered', { userId: user.id });
    
    return user;
  }
  
  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    
    if (!await verifyPassword(oldPassword, user.passwordHash)) {
      throw new Error('Current password incorrect');
    }
    
    user.passwordHash = await hashPassword(newPassword);
    await this.userRepository.save(user);
    
    await this.emailService.sendPasswordChanged(user.email);
  }
}
\`\`\`

**Services should:**
- Orchestrate use cases
- Coordinate multiple entities/repositories
- Handle transactions
- Trigger side effects (emails, events)

**Services should NOT:**
- Contain business rules (those belong in entities)
- Know about HTTP/requests/responses
- Contain presentation logic

## Controllers: The Adapters

Controllers **translate between HTTP and the application** — they handle web concerns.

\`\`\`javascript
class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  
  async register(req, res) {
    try {
      // Extract and validate HTTP input
      const { email, password, name } = req.body;
      
      // Call service (no business logic here!)
      const user = await this.userService.register({ email, password, name });
      
      // Format HTTP response
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString()
      });
    } catch (error) {
      // Map errors to HTTP status codes
      if (error.message === 'Email already registered') {
        return res.status(409).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
  
  async getProfile(req, res) {
    try {
      const user = await this.userService.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal error' });
    }
  }
}
\`\`\`

**Controllers should:**
- Parse HTTP requests
- Validate request format (not business rules)
- Call services
- Format HTTP responses
- Map errors to status codes

**Controllers should NOT:**
- Contain business logic
- Access repositories directly
- Know about database details

## Summary Table

| Aspect | Entity | Service | Controller |
|--------|--------|---------|------------|
| Purpose | Business concepts | Orchestrate operations | HTTP adapter |
| Contains | Business logic | Use case coordination | Request/response handling |
| Depends on | Nothing | Entities, repositories | Services |
| Knows about | Own state | Entities, infrastructure | HTTP, services |

## Common Mistakes

### Fat Controller
\`\`\`javascript
// Bad: Business logic in controller
async register(req, res) {
  const { email, password } = req.body;
  
  // This should be in a service!
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser) return res.status(409).json({ error: 'Exists' });
  
  const hash = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users...', [email, hash]);
  await sendEmail(email, 'Welcome!');
  
  res.status(201).json({ success: true });
}
\`\`\`

### Anemic Entity
\`\`\`javascript
// Bad: Entity is just data, no behavior
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
  }
  // No methods! All logic is in services
}
\`\`\`

## Key Takeaways

1. **Entities** = Business concepts with behavior
2. **Services** = Use case orchestration
3. **Controllers** = HTTP translation layer
4. Keep business logic in entities, not controllers
5. Services coordinate, controllers translate
`,
  quiz: [
    {
      question: "Where should business validation rules live?",
      options: ["Controller", "Service", "Entity", "Database"],
      correctAnswer: 2,
      explanation: "Business validation rules (like 'email must be valid format') belong in entities. Services coordinate operations, controllers handle HTTP."
    },
    {
      question: "What is an 'anemic entity'?",
      options: [
        "An entity with too much logic",
        "An entity that's just data with no behavior",
        "An entity without an ID",
        "An entity that doesn't persist"
      ],
      correctAnswer: 1,
      explanation: "An anemic entity is just a data structure with getters/setters but no behavior. Business logic ends up scattered in services, making code harder to maintain."
    },
    {
      question: "What should a controller NOT do?",
      options: [
        "Parse request parameters",
        "Return HTTP status codes",
        "Execute business logic directly",
        "Call services"
      ],
      correctAnswer: 2,
      explanation: "Controllers should translate HTTP to service calls, not execute business logic. Business logic belongs in entities (rules) and services (orchestration)."
    },
    {
      question: "Which layer should send welcome emails after user registration?",
      options: ["Entity", "Service", "Controller", "Repository"],
      correctAnswer: 1,
      explanation: "Sending emails is a side effect that should be coordinated by the service layer. The service orchestrates the full use case: create user, save, send email."
    }
  ]
};


