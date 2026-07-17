# Galaxy Backend

This is the backend repository for the Galaxy Magica Clone Hackathon submission. It handles API routing, background task orchestration, API key management, and data persistence.

## Architecture Overview

- **Framework**: Next.js (App Router for API Routes)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Background Orchestration**: [Trigger.dev v3](https://trigger.dev) (handles long-running workflow nodes without serverless timeouts)
- **API Keys**: [Unkey](https://unkey.dev) (for ultra-fast edge-verified API keys)
- **Authentication**: Clerk (for syncing users and mapping keys to user accounts)
- **Validation**: Zod (Schema-driven validation for workflow nodes)

## Design Decisions and Trade-offs

1. **Why Trigger.dev?** Workflow graphs (especially those hitting external LLMs or Image Gen APIs) can run for several minutes, quickly exceeding Vercel's standard serverless function timeouts (10-60s). Trigger.dev allows us to offload the orchestrator and individual node tasks to background workers, which also provides automatic retries and resumability in case of failure.
2. **Schema-Driven UI**: We implemented a centralized `NodeRegistry` in the backend using Zod. This registry defines the expected inputs and outputs for every node. The frontend dynamically fetches this configuration, eliminating duplication and ensuring the UI forms are perfectly in sync with the backend expectations.
3. **Database Ledger for Credits**: We built a custom credit ledger mapping to Clerk User IDs. Each node defines its own credit cost (e.g. LLM vs Image Gen) which is deducted transactionally before the task executes.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., Neon or Supabase)
- Trigger.dev account
- Unkey account
- Clerk account

### 1. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# Clerk Auth (matches frontend)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***
CLERK_SECRET_KEY=sk_test_***

# Trigger.dev
TRIGGER_SECRET_KEY=tr_dev_***

# Unkey
UNKEY_ROOT_KEY=unkey_***
UNKEY_API_ID=api_***

# Provider API Keys
OPENROUTER_API_KEY=sk-or-v1-***
```

### 2. Install Dependencies
We use `pnpm` for this project:
```bash
pnpm install
```

### 3. Setup Prisma
Push the schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Locally
You need to run two terminal windows to run both the Next.js API server and the Trigger.dev background worker.

**Terminal 1 (Next.js server):**
```bash
npm run dev
```

**Terminal 2 (Trigger.dev worker):**
```bash
npx trigger.dev dev
```

## API Documentation
The REST API is documented using Mintlify and OpenAPI. See the `docs/` folder or visit the deployed Mintlify URL for the full OpenAPI specification.

## What we'd improve with more time
- **Real-time Updates**: Currently, the frontend polls the backend for workflow run status. We'd replace this with WebSockets or Server-Sent Events (SSE) for instant real-time progress updates.
- **Plugin System**: Refactor the Node Registry so third-party developers can easily inject new nodes simply by dropping a new file into a plugins directory.
- **Enhanced Test Coverage**: While we've included core tests, we would add end-to-end integration tests using Playwright to ensure the entire execution chain remains stable across updates.
