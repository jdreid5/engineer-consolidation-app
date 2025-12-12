export const courseStructure = [
  {
    id: 'phase1',
    title: 'Phase 1: Foundations',
    icon: '🏗️',
    weeks: 'Weeks 1-6',
    description: 'Build the fundamentals that bootcamps skip: data structures, algorithms, and core computer science concepts.',
    modules: [
      {
        id: 'dsa',
        title: 'Data Structures & Algorithms',
        lessons: [
          { id: 'arrays-linked-lists', title: 'Arrays vs Linked Lists' },
          { id: 'hash-maps', title: 'Hash Maps' },
          { id: 'stacks-queues', title: 'Stacks & Queues' },
          { id: 'trees-bst', title: 'Trees & Binary Search Trees' },
          { id: 'graphs-bfs-dfs', title: 'Graphs: BFS & DFS' },
          { id: 'sorting-searching', title: 'Sorting & Searching' },
          { id: 'time-space-complexity', title: 'Time & Space Complexity' },
        ]
      },
      {
        id: 'core-cs',
        title: 'Core Computer Science',
        lessons: [
          { id: 'memory-management', title: 'Memory: Stack, Heap & GC' },
          { id: 'cpu-caches', title: 'CPU Caches & Performance' },
          { id: 'filesystems', title: 'Filesystems Deep Dive' },
          { id: 'compilers-interpreters', title: 'Compilers & Interpreters' },
          { id: 'concurrency', title: 'Concurrency: Threads & Locks' },
          { id: 'networking', title: 'Networking: TCP, HTTP, Sockets' },
        ]
      }
    ]
  },
  {
    id: 'phase2',
    title: 'Phase 2: Architecture',
    icon: '🏛️',
    weeks: 'Weeks 6-12',
    description: 'Learn to design software like a professional: clean architecture, design patterns, and production-grade backends.',
    modules: [
      {
        id: 'clean-arch',
        title: 'Clean Architecture',
        lessons: [
          { id: 'cohesion-coupling', title: 'Cohesion & Coupling' },
          { id: 'dependency-inversion', title: 'Dependency Inversion' },
          { id: 'layers-boundaries', title: 'Layers & Boundaries' },
          { id: 'entity-service-controller', title: 'Entity vs Service vs Controller' },
        ]
      },
      {
        id: 'patterns',
        title: 'Design Patterns',
        lessons: [
          { id: 'strategy-pattern', title: 'Strategy Pattern' },
          { id: 'factory-pattern', title: 'Factory Pattern' },
          { id: 'builder-pattern', title: 'Builder Pattern' },
          { id: 'adapter-pattern', title: 'Adapter Pattern' },
          { id: 'observer-pattern', title: 'Observer Pattern' },
          { id: 'command-pattern', title: 'Command Pattern' },
          { id: 'decorator-pattern', title: 'Decorator Pattern' },
          { id: 'repository-pattern', title: 'Repository Pattern' },
          { id: 'singleton-pattern', title: 'Singleton (& When Not to Use)' },
          { id: 'dependency-injection', title: 'Dependency Injection' },
        ]
      },
      {
        id: 'backend',
        title: 'Backend Architecture',
        lessons: [
          { id: 'rest-principles', title: 'REST Principles' },
          { id: 'authentication', title: 'Authentication Deep Dive' },
          { id: 'caching-strategies', title: 'Caching Strategies' },
          { id: 'scaling-queues', title: 'Scaling & Message Queues' },
          { id: 'retry-patterns', title: 'Retry Patterns & Idempotency' },
        ]
      },
      {
        id: 'testing',
        title: 'Testing',
        lessons: [
          { id: 'unit-testing', title: 'Unit Testing' },
          { id: 'integration-testing', title: 'Integration Testing' },
          { id: 'mocking', title: 'Mocking' },
          { id: 'tdd-basics', title: 'TDD Basics' },
        ]
      }
    ]
  },
  {
    id: 'phase3',
    title: 'Phase 3: Codebase Literacy',
    icon: '📖',
    weeks: 'Weeks 8-20',
    description: 'The skill that separates juniors from seniors: understanding and navigating large, unfamiliar codebases.',
    modules: [
      {
        id: 'reading-code',
        title: 'Reading Code',
        lessons: [
          { id: 'reading-large-codebases', title: 'How to Read Large Codebases' },
          { id: 'finding-patterns', title: 'Finding Structure & Patterns' },
          { id: 'first-contribution', title: 'Making Your First Contribution' },
          { id: 'code-review', title: 'Code Review Best Practices' },
        ]
      }
    ]
  },
  {
    id: 'phase4',
    title: 'Phase 4: Stretch Project',
    icon: '🚀',
    weeks: 'Weeks 12-26',
    description: 'Apply everything you\'ve learned by building a production-quality job queue backend system from scratch.',
    modules: [
      {
        id: 'job-queue',
        title: 'Job Queue Backend',
        lessons: [
          { id: 'project-overview', title: 'Project Overview & Architecture' },
          { id: 'setting-up', title: 'Setting Up the Project' },
          { id: 'building-auth', title: 'Building Authentication' },
          { id: 'job-queue-core', title: 'Implementing the Job Queue' },
          { id: 'workers-processing', title: 'Workers & Job Processing' },
          { id: 'retry-logic', title: 'Retry Logic & Error Handling' },
          { id: 'monitoring-logging', title: 'Monitoring & Logging' },
          { id: 'testing-deployment', title: 'Testing & Deployment' },
        ]
      }
    ]
  }
];


