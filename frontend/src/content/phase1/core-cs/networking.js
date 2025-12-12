export const networking = {
  title: "Networking: TCP, HTTP, Sockets",
  duration: "35 minutes",
  content: `
The internet is built on layers of protocols. Understanding networking helps you build better web applications, debug connectivity issues, and design distributed systems.

## The Network Stack

\`\`\`
┌───────────────────────┐
│   Application Layer   │ ← HTTP, WebSocket, DNS
├───────────────────────┤
│   Transport Layer     │ ← TCP, UDP
├───────────────────────┤
│   Network Layer       │ ← IP (routing)
├───────────────────────┤
│   Link Layer          │ ← Ethernet, WiFi
└───────────────────────┘
\`\`\`

Each layer has a specific job and talks to the layers above and below.

## IP Addresses & Ports

### IP Address
Identifies a device on a network:
- IPv4: \`192.168.1.1\` (32 bits)
- IPv6: \`2001:0db8:85a3:0000:0000:8a2e:0370:7334\` (128 bits)

### Port
Identifies an application on a device:
- Port range: 0-65535
- Well-known ports: 80 (HTTP), 443 (HTTPS), 22 (SSH)

\`\`\`
192.168.1.1:80  →  Device 192.168.1.1, Application on port 80
\`\`\`

## TCP vs UDP

### TCP (Transmission Control Protocol)

**Reliable, ordered delivery**

\`\`\`
Sender              Receiver
  │                    │
  │───[SYN]───────────>│  Connection setup
  │<──[SYN-ACK]────────│  (3-way handshake)
  │───[ACK]───────────>│
  │                    │
  │───[Data 1]────────>│
  │<──[ACK]────────────│
  │───[Data 2]────────>│
  │<──[ACK]────────────│
  │                    │
  │───[FIN]───────────>│  Connection close
  │<──[ACK]────────────│
\`\`\`

TCP guarantees:
- Delivery (retransmits lost packets)
- Order (reassembles out-of-order packets)
- No duplicates
- Flow control (doesn't overwhelm receiver)

**Used for**: HTTP, file transfer, email, SSH

### UDP (User Datagram Protocol)

**Fast, no guarantees**

\`\`\`
Sender              Receiver
  │                    │
  │───[Data]──────────>│  Just send it!
  │───[Data]──────────>│
  │───[Data]───────X   │  Lost? Too bad!
  │───[Data]──────────>│
\`\`\`

UDP provides:
- Speed (no handshake, no acknowledgments)
- Low latency
- No connection state

**Used for**: Video streaming, gaming, DNS, VoIP

## HTTP: How the Web Works

HTTP (Hypertext Transfer Protocol) runs over TCP:

\`\`\`
Client                           Server
  │                                │
  │────HTTP Request───────────────>│
  │     GET /index.html HTTP/1.1   │
  │     Host: example.com          │
  │                                │
  │<───HTTP Response───────────────│
  │     HTTP/1.1 200 OK            │
  │     Content-Type: text/html    │
  │     <html>...</html>           │
\`\`\`

### HTTP Request

\`\`\`http
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer token123
Accept: application/json

{request body for POST/PUT}
\`\`\`

Components:
- **Method**: GET, POST, PUT, DELETE, PATCH
- **Path**: /api/users
- **Headers**: Metadata (auth, content type, etc.)
- **Body**: Data (for POST, PUT)

### HTTP Response

\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{"users": [...]}
\`\`\`

Components:
- **Status code**: 200, 404, 500, etc.
- **Headers**: Metadata
- **Body**: Response data

### Common Status Codes

\`\`\`
2xx Success
  200 OK              - Request succeeded
  201 Created         - Resource created
  204 No Content      - Success, no body

3xx Redirection
  301 Moved Permanently
  302 Found (temporary redirect)
  304 Not Modified    - Use cached version

4xx Client Error
  400 Bad Request     - Invalid request
  401 Unauthorized    - Need authentication
  403 Forbidden       - No permission
  404 Not Found       - Resource doesn't exist

5xx Server Error
  500 Internal Error  - Server crashed
  502 Bad Gateway     - Upstream server error
  503 Unavailable     - Server overloaded
\`\`\`

## Making HTTP Requests in JavaScript

### Fetch API

\`\`\`javascript
// GET request
const response = await fetch('https://api.example.com/users');
const users = await response.json();

// POST request
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
});
\`\`\`

### Error Handling

\`\`\`javascript
try {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
  
  const data = await response.json();
} catch (error) {
  if (error.name === 'TypeError') {
    console.error('Network error - server unreachable');
  } else {
    console.error('Request failed:', error.message);
  }
}
\`\`\`

## WebSockets: Real-time Communication

HTTP is request-response. WebSockets provide **bidirectional, persistent** connections:

\`\`\`
HTTP:
Client ──request──> Server
Client <──response── Server
(connection closed)

WebSocket:
Client <────────────> Server
       persistent, bidirectional
       both can send anytime
\`\`\`

### WebSocket Example

\`\`\`javascript
// Client
const socket = new WebSocket('ws://example.com/chat');

socket.onopen = () => {
  console.log('Connected!');
  socket.send('Hello server!');
};

socket.onmessage = (event) => {
  console.log('Received:', event.data);
};

socket.onclose = () => {
  console.log('Disconnected');
};

// Send message anytime
socket.send(JSON.stringify({ type: 'message', text: 'Hi!' }));
\`\`\`

### WebSocket Use Cases
- Chat applications
- Live notifications
- Real-time dashboards
- Multiplayer games
- Collaborative editing

## DNS: Domain Name System

Translates domain names to IP addresses:

\`\`\`
"google.com" → DNS → 142.250.80.46

┌───────────┐      ┌───────────┐      ┌───────────┐
│  Browser  │──────│ DNS Server│──────│   Root    │
│           │      │           │      │   DNS     │
└───────────┘      └───────────┘      └───────────┘
      │                  │                   │
      │ google.com?      │                   │
      ├─────────────────>│                   │
      │                  │ .com server?      │
      │                  ├──────────────────>│
      │                  │<──────────────────┤
      │                  │                   │
      │ 142.250.80.46    │                   │
      │<─────────────────┤                   │
\`\`\`

DNS is hierarchical and heavily cached.

## HTTPS & TLS

HTTPS = HTTP + TLS (Transport Layer Security)

\`\`\`
┌─────────────────────────────────────┐
│             HTTP                    │
├─────────────────────────────────────┤
│         TLS (encryption)            │
├─────────────────────────────────────┤
│              TCP                    │
└─────────────────────────────────────┘
\`\`\`

TLS provides:
- **Encryption**: Data can't be read by eavesdroppers
- **Authentication**: Server proves its identity (certificates)
- **Integrity**: Data can't be tampered with

## Key Takeaways

1. **TCP** = reliable, ordered delivery; **UDP** = fast, no guarantees
2. **HTTP** is request-response over TCP
3. **WebSockets** provide real-time bidirectional communication
4. **DNS** translates domain names to IP addresses
5. **HTTPS** adds encryption and authentication to HTTP
6. Status codes: 2xx = success, 4xx = client error, 5xx = server error
`,
  exercise: {
    description: "Build a simple HTTP client that handles various response scenarios.",
    starterCode: `// Simulated fetch for demo (in real code, use actual fetch)
function simulatedFetch(url) {
  return new Promise((resolve, reject) => {
    // Simulate different responses based on URL
    setTimeout(() => {
      if (url.includes('success')) {
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ message: 'Success!', data: [1, 2, 3] })
        });
      } else if (url.includes('notfound')) {
        resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Not found' })
        });
      } else if (url.includes('error')) {
        resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Server error' })
        });
      } else if (url.includes('timeout')) {
        reject(new TypeError('Network request failed'));
      }
    }, 100);
  });
}

// TODO: Implement a robust HTTP client
async function httpGet(url) {
  // Your code here:
  // 1. Make the request
  // 2. Check if response.ok
  // 3. If ok, parse and return JSON
  // 4. If not ok, throw an error with status code
  // 5. Catch network errors and throw meaningful error
  
  // Return: { success: true, data: ... } or { success: false, error: ... }
}

// Test different scenarios
async function runTests() {
  console.log('Test 1: Success');
  const result1 = await httpGet('/api/success');
  console.log(result1);
  
  console.log('\\nTest 2: Not Found');
  const result2 = await httpGet('/api/notfound');
  console.log(result2);
  
  console.log('\\nTest 3: Server Error');
  const result3 = await httpGet('/api/error');
  console.log(result3);
  
  console.log('\\nTest 4: Network Timeout');
  const result4 = await httpGet('/api/timeout');
  console.log(result4);
}

runTests();
`,
    expectedOutput: `Test 1: Success
{ success: true, data: { message: 'Success!', data: [1, 2, 3] } }

Test 2: Not Found
{ success: false, error: 'HTTP 404' }

Test 3: Server Error
{ success: false, error: 'HTTP 500' }

Test 4: Network Timeout
{ success: false, error: 'Network error' }`,
    hint: "Use try/catch around simulatedFetch. Inside try: check response.ok. If ok, return success with parsed JSON. If not ok, return error with status. In catch: check if error is TypeError (network) and return appropriate error message."
  },
  quiz: [
    {
      question: "What does TCP guarantee that UDP does not?",
      options: [
        "Faster transmission",
        "Reliable, ordered delivery",
        "Smaller packet size",
        "Lower latency"
      ],
      correctAnswer: 1,
      explanation: "TCP guarantees reliable delivery (retransmits lost packets), ordered delivery (reassembles packets in correct order), and no duplicates. UDP provides none of these guarantees but is faster."
    },
    {
      question: "What HTTP status code indicates a resource was not found?",
      options: ["200", "400", "404", "500"],
      correctAnswer: 2,
      explanation: "404 Not Found indicates the requested resource doesn't exist on the server. 200 = success, 400 = bad request, 500 = server error."
    },
    {
      question: "What is the main advantage of WebSockets over HTTP?",
      options: [
        "Better security",
        "Bidirectional real-time communication",
        "Smaller data transfer",
        "Better browser support"
      ],
      correctAnswer: 1,
      explanation: "WebSockets provide a persistent, bidirectional connection where both client and server can send messages at any time. HTTP is request-response only — the server can't push data without a client request."
    },
    {
      question: "What does DNS do?",
      options: [
        "Encrypts web traffic",
        "Translates domain names to IP addresses",
        "Compresses data for faster transfer",
        "Validates website certificates"
      ],
      correctAnswer: 1,
      explanation: "DNS (Domain Name System) translates human-readable domain names like 'google.com' into IP addresses like '142.250.80.46' that computers use to route traffic."
    }
  ]
};


