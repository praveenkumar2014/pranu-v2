# PRANU v2 - Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ (recommended: 21.x)
- pnpm 8+
- Docker (optional, for sandbox)

### Installation

```bash
# Clone the repository
cd pranu-v2

# Install dependencies
pnpm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your LLM API keys (at least one required)
```

### Development

```bash
# Start both backend and frontend
pnpm dev

# Or start them separately
pnpm dev:server    # Backend on port 4000
pnpm dev:frontend  # Frontend on port 3000
```

### Testing

```bash
# Run backend tests
pnpm --filter server test

# Run tests with coverage
pnpm --filter server test:coverage

# Run tests in watch mode
pnpm --filter server test:watch
```

### Build

```bash
# Build all packages
pnpm build

# Build individual packages
pnpm --filter server build
pnpm --filter frontend build
```

## Project Structure

```
pranu-v2/
├── server/                 # Backend (Express.js)
│   ├── src/
│   │   ├── api/           # REST API routes
│   │   │   └── v1/        # API v1 (versioned)
│   │   ├── agents/        # AI agents (planner, executor, critic)
│   │   ├── llm/           # LLM providers
│   │   ├── memory/        # Memory management
│   │   ├── middleware/    # Express middleware
│   │   ├── orchestrator/  # Task orchestration
│   │   ├── sandbox/       # Docker sandbox
│   │   ├── tools/         # Tool implementations
│   │   ├── utils/         # Utilities (logger, etc.)
│   │   └── websocket/     # WebSocket server
│   └── logs/              # Application logs (auto-created)
├── frontend/              # Frontend (Next.js 15)
│   └── src/
│       ├── app/           # Next.js app router
│       ├── components/    # React components
│       └── lib/           # Utilities and store
├── shared/                # Shared types
└── .github/workflows/     # CI/CD pipelines
```

## API Documentation

### API v1 Endpoints

All v1 endpoints are prefixed with `/api/v1`

#### Tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks` - List all tasks (with pagination & filtering)
- `GET /api/v1/tasks/:id` - Get task details
- `DELETE /api/v1/tasks/:id` - Delete a task
- `POST /api/v1/tasks/:id/stop` - Stop a running task
- `POST /api/v1/tasks/:id/pause` - Pause a task
- `POST /api/v1/tasks/:id/resume` - Resume a paused task

#### Files
- `GET /api/v1/files/tree` - Get workspace file tree
- `GET /api/v1/files/:path+` - Read file content
- `POST /api/v1/files/:path+` - Create/update file

#### Agents
- `GET /api/v1/agents/status` - Get agent status

#### Health
- `GET /api/v1/health` - Health check

### Query Parameters

**Tasks List:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by status (pending, planning, executing, reviewing, completed, failed, stopped, paused)
- `sortBy` - Sort field (createdAt, completedAt, status)
- `sortOrder` - Sort order (asc, desc)

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [ ... ]
  }
}
```

## Environment Variables

See `.env.example` for all available options.

**Required:**
- At least one LLM API key (GROQ_API_KEY, OPENAI_API_KEY, or TOGETHER_API_KEY)

**Optional:**
- `FRONTEND_URL` - Frontend URL for CORS (production)
- `SANDBOX_ENABLED` - Enable Docker sandbox (default: false)

## Security Features

- ✅ Helmet security headers
- ✅ Rate limiting (100 req/15min general, 10 req/15min auth)
- ✅ CORS protection
- ✅ XSS protection
- ✅ Request size limits (10MB)
- ✅ Input validation with Zod/express-validator
- ✅ Request ID tracking
- ✅ Structured logging with Winston

## Logging

Logs are stored in `server/logs/`:
- `error.log` - Error logs only
- `combined.log` - All logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## CI/CD

GitHub Actions workflows:
- **Lint & Type Check** - On every push/PR
- **Tests** - Backend and frontend tests
- **Security Audit** - Dependency vulnerability check
- **Docker Build** - Build and push Docker images (main branch)
- **Deploy** - Auto-deploy to staging/production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Private - All rights reserved
