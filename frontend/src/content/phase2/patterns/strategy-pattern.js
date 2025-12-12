export const strategyPattern = {
  title: "Strategy Pattern",
  duration: "20 minutes",
  content: `
The Strategy pattern lets you define a family of algorithms, encapsulate each one, and make them interchangeable. It's one of the most useful patterns for writing flexible code.

## The Problem

You have a class that needs different behaviors in different situations:

\`\`\`javascript
// Bad: conditionals everywhere
class ShippingCalculator {
  calculate(order) {
    if (order.shippingMethod === 'ground') {
      return order.weight * 1.5;
    } else if (order.shippingMethod === 'air') {
      return order.weight * 3.0;
    } else if (order.shippingMethod === 'express') {
      return order.weight * 5.0 + 10;
    }
    // Adding new methods means modifying this class
  }
}
\`\`\`

## The Solution: Strategy Pattern

Encapsulate each algorithm as a separate class:

\`\`\`javascript
// Strategy interface (implicit in JS)
// { calculate(order) → number }

// Concrete strategies
class GroundShipping {
  calculate(order) {
    return order.weight * 1.5;
  }
}

class AirShipping {
  calculate(order) {
    return order.weight * 3.0;
  }
}

class ExpressShipping {
  calculate(order) {
    return order.weight * 5.0 + 10;
  }
}

// Context class
class ShippingCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  calculate(order) {
    return this.strategy.calculate(order);
  }
}

// Usage
const calculator = new ShippingCalculator(new GroundShipping());
console.log(calculator.calculate({ weight: 10 })); // 15

calculator.setStrategy(new ExpressShipping());
console.log(calculator.calculate({ weight: 10 })); // 60
\`\`\`

## Benefits

1. **Open/Closed**: Add new strategies without modifying existing code
2. **Single Responsibility**: Each strategy has one job
3. **Runtime flexibility**: Switch strategies dynamically
4. **Testability**: Test each strategy independently

## Real-World Examples

### Payment Processing
\`\`\`javascript
class StripePayment {
  process(amount) { /* Stripe API */ }
}

class PayPalPayment {
  process(amount) { /* PayPal API */ }
}

class CryptoPayment {
  process(amount) { /* Crypto processing */ }
}

const checkout = new PaymentProcessor(new StripePayment());
checkout.process(99.99);
\`\`\`

### Compression
\`\`\`javascript
class ZipCompression { compress(data) { /* */ } }
class GzipCompression { compress(data) { /* */ } }
class NoCompression { compress(data) { return data; } }
\`\`\`

## When to Use

- Multiple algorithms for the same task
- Need to switch algorithms at runtime
- Avoiding multiple conditionals
- Want to isolate algorithm implementation details
`,
  quiz: [
    {
      question: "What problem does the Strategy pattern solve?",
      options: [
        "Creating objects",
        "Avoiding switch/if statements for algorithm selection",
        "Managing object lifecycle",
        "Caching data"
      ],
      correctAnswer: 1,
      explanation: "Strategy pattern encapsulates algorithms as separate classes, allowing runtime selection without conditional statements in the main class."
    }
  ]
};


