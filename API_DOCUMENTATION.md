# PRANU v2 — API Documentation

## Base URL
```
Development: http://localhost:4000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Getting a Token

1. **Register** a new account
2. **Login** with credentials
3. Use the returned `accessToken` in the `Authorization` header

### Using Tokens

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Endpoints

### 🔐 Authentication

#### Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "emailVerified": false,
      "createdAt": "2026-04-23T10:00:00.000Z",
      "updatedAt": "2026-04-23T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "uuid"
    }
  }
}
```

**Validation:**
- Email must be valid format
- Password must be at least 8 characters
- Name is required

---

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "uuid"
    }
  }
}
```

---

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "uuid"
  }
}
```

---

#### Logout
```http
POST /api/v1/auth/logout
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Logout All Devices
```http
POST /api/v1/auth/logout-all
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

---

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "emailVerified": false,
    "createdAt": "2026-04-23T10:00:00.000Z",
    "updatedAt": "2026-04-23T10:00:00.000Z"
  }
}
```

---

#### Update Profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newemail@example.com",
    "name": "John Updated",
    "role": "user"
  }
}
```

---

### 📋 Tasks

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "description": "Build a React application",
  "workspacePath": "/path/to/workspace" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "taskId": "uuid",
    "status": "created"
  }
}
```

---

#### List Tasks
```http
GET /api/v1/tasks?page=1&limit=20&status=pending&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `status` (string, optional) - Filter by status: `pending`, `planning`, `executing`, `reviewing`, `completed`, `failed`, `stopped`, `paused`
- `sortBy` (string, default: `createdAt`) - Sort field: `createdAt`, `completedAt`, `status`
- `sortOrder` (string, default: `desc`) - Sort order: `asc`, `desc`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "description": "Build a React application",
      "status": "pending",
      "workspacePath": "/path/to/workspace",
      "plan": [],
      "currentStepIndex": 0,
      "createdAt": "2026-04-23T10:00:00.000Z"
    }
  ],
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

---

#### Get Task Details
```http
GET /api/v1/tasks/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "description": "Build a React application",
    "status": "executing",
    "workspacePath": "/path/to/workspace",
    "plan": [
      {
        "id": "step-uuid",
        "stepNumber": 1,
        "description": "Initialize project",
        "toolHint": "terminal",
        "acceptanceCriteria": "Project created successfully",
        "status": "completed",
        "resultSummary": "Done",
        "retryCount": 0
      }
    ],
    "steps": [],
    "currentStepIndex": 1,
    "createdAt": "2026-04-23T10:00:00.000Z"
  }
}
```

---

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

#### Stop Task
```http
POST /api/v1/tasks/:id/stop
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "stopped"
  }
}
```

---

#### Pause Task
```http
POST /api/v1/tasks/:id/pause
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "paused"
  }
}
```

---

#### Resume Task
```http
POST /api/v1/tasks/:id/resume
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "resumed"
  }
}
```

---

### 📁 Files

#### Get File Tree
```http
GET /api/v1/files/tree
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "src",
      "path": "src",
      "type": "directory",
      "children": [
        {
          "name": "index.ts",
          "path": "src/index.ts",
          "type": "file",
          "extension": ".ts"
        }
      ]
    }
  ]
}
```

---

#### Read File
```http
GET /api/v1/files/:path+
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "path": "src/index.ts",
    "content": "console.log('Hello');",
    "size": 1234,
    "modified": "2026-04-23T10:00:00.000Z"
  }
}
```

---

#### Create/Update File
```http
POST /api/v1/files/:path+
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "console.log('Hello World');"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    "path": "src/index.ts"
  }
}
```

---

### 🤖 Agents

#### Get Agent Status
```http
GET /api/v1/agents/status
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "ready",
    "agents": [
      {
        "role": "planner",
        "state": "idle",
        "currentTaskId": null
      },
      {
        "role": "executor",
        "state": "idle",
        "currentTaskId": null
      },
      {
        "role": "critic",
        "state": "idle",
        "currentTaskId": null
      }
    ]
  }
}
```

---

### 🏥 Health

#### Health Check
```http
GET /api/v1/health
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "2.0.0"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {} // optional
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing token |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 10 requests per 15 minutes

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1619712000
```

---

## WebSocket

Real-time updates are available via WebSocket:

```
ws://localhost:4001
```

### Events Received

- `task.created` - New task created
- `task.planning` - Task planning started
- `plan.ready` - Plan generated
- `step.started` - Step execution started
- `step.completed` - Step completed
- `task.completed` - Task finished
- `task.error` - Task failed
- `agent.status` - Agent status changed
- `file.changed` - File modified

### Event Format

```json
{
  "id": "uuid",
  "type": "task.completed",
  "timestamp": "2026-04-23T10:00:00.000Z",
  "payload": {
    "taskId": "uuid",
    "summary": "Task completed successfully"
  }
}
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** (localStorage, httpOnly cookies)
3. **Refresh tokens** before expiration
4. **Handle errors gracefully** (check `success` field)
5. **Implement retry logic** for failed requests
6. **Use pagination** for large datasets
7. **Validate inputs** client-side before sending

---

## SDKs & Libraries

### JavaScript/TypeScript
```typescript
import { api } from './lib/api';

// Login
const response = await api.login({ email, password });

// Create task
const task = await api.createTask({ description: 'Build app' });

// Get tasks
const tasks = await api.getTasks({ page: 1, limit: 20 });
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get tasks
curl http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Changelog

### v1.0.0 (2026-04-23)
- Initial release
- Authentication system
- Task management
- File operations
- WebSocket support
- Security features

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-23  
**Support**: api@yourdomain.com
