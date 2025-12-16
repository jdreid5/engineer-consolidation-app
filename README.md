# Engineer Consolidation App

Offline-first Progressive Web App (PWA) for relearning software engineering fundamentals via lessons, exercises, and quizzes. Initially created entirely with Cursor using an Opus 4.5 agent from a single prompt, as an experiment to test agentic coding capability. Indeed ironic that it was to create an app to teach others to code.

## Features
- **PWA**: installable and works offline
- **Interactive code editor**: Monaco editor + sandboxed JS execution
- **Structured curriculum**: multi-phase learning path
- **Quizzes + progress tracking**: stored locally per profile on your machine
- **Profiles**: selectable local profiles with optional PIN lock
- **Import/Export**: move a profile between machines via JSON export/import

## Tech stack
- **Frontend**: React + Vite + `vite-plugin-pwa`
- **Storage**: IndexedDB (via `idb`) + localStorage (small settings)

## Getting started

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```bash
npm run install:all
```

### Run (dev)

```bash
npm run dev
```

- App: `http://localhost:5173`

### Build / preview

```bash
npm run build
npm run preview
```

## Data model (local-only)

- **Profiles**: stored in IndexedDB (name, created/updated timestamps, optional PIN hash)
- **Progress**: stored per profile in IndexedDB
- **Quiz results**: stored per profile in IndexedDB
- **Active profile**: stored in localStorage (just the selected profile id)

**PIN note**: the PIN is a local-only guardrail. It’s not a secure authentication system and there is no recovery if you forget it.

## Project structure

```
/
├── frontend/              # React + Vite PWA
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── content/       # Course content
│   │   ├── storage/       # IndexedDB/local storage modules
│   │   └── styles/        # CSS
│   └── public/            # Static assets & PWA icons
├── package.json           # Root convenience scripts
└── README.md
```

## License
MIT


