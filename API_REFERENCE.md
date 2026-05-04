# API Reference Guide

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints (except `/auth/register/` and `/auth/login/`) require authentication.

### Headers
```
Authorization: Token <your-token>
Content-Type: application/json
```

### Get Token
Use `/auth/login/` endpoint to get token.

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register/`

Create a new user account.

**Request:**
```json
{
  "email": "john@example.com",
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "password": "SecurePassword123",
  "password_confirm": "SecurePassword123"
}
```

**Response:** (201 Created)
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "role": "member",
    "bio": null,
    "avatar": null,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "abc123def456xyz789"
}
```

**Errors:**
- `400 Bad Request` - Invalid data or passwords don't match

---

### 2. Login User
**POST** `/auth/login/`

Authenticate user and get token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "role": "member",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "abc123def456xyz789"
}
```

**Errors:**
- `400 Bad Request` - Invalid credentials

---

### 3. Logout User
**POST** `/auth/logout/`

Logout and invalidate token.

**Request:** (no body needed)

**Response:** (200 OK)
```json
{
  "detail": "Logged out successfully"
}
```

---

### 4. Get User Profile
**GET** `/auth/profile/`

Get current user's profile.

**Response:** (200 OK)
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "role": "member",
  "bio": "Software developer",
  "avatar": null,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. Update User Profile
**PUT** `/auth/profile/`

Update current user's profile.

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "bio": "Senior developer"
}
```

**Response:** (200 OK)
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Smith",
  "role": "member",
  "bio": "Senior developer",
  "avatar": null,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Team Endpoints

### 1. List Teams
**GET** `/auth/teams/`

Get all teams for current user.

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "name": "Engineering Team",
    "description": "Main development team",
    "owner": {
      "id": 1,
      "email": "john@example.com",
      "username": "john_doe",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin"
    },
    "members": [
      {
        "id": 2,
        "email": "jane@example.com",
        "username": "jane_doe",
        "first_name": "Jane",
        "last_name": "Doe",
        "role": "member"
      }
    ],
    "member_count": 2,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. Create Team
**POST** `/auth/teams/create/`

Create a new team.

**Request:**
```json
{
  "name": "Design Team",
  "description": "UI/UX design team"
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "name": "Design Team",
  "description": "UI/UX design team",
  "owner": { ... },
  "members": [],
  "member_count": 0,
  "created_at": "2024-01-15T11:00:00Z"
}
```

---

### 3. Get Team Details
**GET** `/auth/teams/{id}/`

Get specific team details.

**Response:** (200 OK) - Same as team object above

---

### 4. Update Team
**PUT** `/auth/teams/{id}/`

Update team (owner only).

**Request:**
```json
{
  "name": "Design Team (Updated)",
  "description": "Updated description"
}
```

**Response:** (200 OK) - Updated team object

---

### 5. Delete Team
**DELETE** `/auth/teams/{id}/`

Delete team (owner only).

**Response:** (200 OK)
```json
{
  "detail": "Team deleted successfully."
}
```

---

### 6. Add Team Member
**POST** `/auth/teams/{id}/members/add/`

Add user to team (owner only).

**Request:**
```json
{
  "user_id": 3
}
```

**Response:** (200 OK) - Updated team object with new member

---

### 7. Remove Team Member
**POST** `/auth/teams/{id}/members/remove/`

Remove user from team (owner only).

**Request:**
```json
{
  "user_id": 3
}
```

**Response:** (200 OK) - Updated team object

---

## Project Endpoints

### 1. List Projects
**GET** `/projects/`

Get all projects for user's teams.

**Query Parameters:**
- `status` - Filter by status (active, on_hold, completed, archived)

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete website redesign",
    "team": 1,
    "team_name": "Design Team",
    "created_by": 1,
    "created_by_name": "John Doe",
    "status": "active",
    "start_date": "2024-01-15",
    "end_date": "2024-03-15",
    "task_count": 5,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. Create Project
**POST** `/projects/create/`

Create new project.

**Request:**
```json
{
  "name": "Mobile App",
  "description": "iOS and Android app",
  "team": 1,
  "status": "active",
  "start_date": "2024-01-20",
  "end_date": "2024-06-20"
}
```

**Response:** (201 Created) - Project object

---

### 3. Get Project Details
**GET** `/projects/{id}/`

Get specific project details.

**Response:** (200 OK) - Project object

---

### 4. Update Project
**PUT** `/projects/{id}/`

Update project (team owner only).

**Request:** (partial updates allowed)
```json
{
  "status": "on_hold",
  "end_date": "2024-07-20"
}
```

**Response:** (200 OK) - Updated project object

---

### 5. Delete Project
**DELETE** `/projects/{id}/`

Delete project (team owner only).

**Response:** (200 OK)
```json
{
  "detail": "Project deleted successfully."
}
```

---

### 6. Project Dashboard
**GET** `/projects/{id}/dashboard/`

Get project statistics.

**Response:** (200 OK)
```json
{
  "total_tasks": 10,
  "completed_tasks": 3,
  "in_progress_tasks": 5,
  "pending_tasks": 2,
  "overdue_tasks": 1
}
```

---

## Task Endpoints

### 1. List Tasks
**GET** `/tasks/`

Get all tasks user has access to.

**Query Parameters:**
- `project_id` - Filter by project
- `status` - Filter by status (pending, in_progress, completed, on_hold)
- `assigned_to` - Filter by assignee (use "me" for current user)
- `priority` - Filter by priority (low, medium, high, critical)

**Example:**
```
GET /tasks/?assigned_to=me&status=pending
```

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "title": "Design homepage",
    "description": "Create homepage mockup",
    "project": 1,
    "project_name": "Website Redesign",
    "assigned_to": 2,
    "assigned_to_name": "Jane Doe",
    "created_by": 1,
    "created_by_name": "John Doe",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-02-01",
    "start_date": "2024-01-20",
    "is_overdue": false,
    "days_until_due": 12,
    "completed_at": null,
    "comments": [],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. Create Task
**POST** `/tasks/create/`

Create new task.

**Request:**
```json
{
  "title": "Setup database",
  "description": "Initialize PostgreSQL database",
  "project": 1,
  "assigned_to": 2,
  "status": "pending",
  "priority": "high",
  "due_date": "2024-02-05",
  "start_date": "2024-01-20"
}
```

**Response:** (201 Created) - Task object

---

### 3. Get Task Details
**GET** `/tasks/{id}/`

Get specific task with comments.

**Response:** (200 OK) - Task object with comments

---

### 4. Update Task
**PUT** `/tasks/{id}/`

Update task (team owner only).

**Request:** (partial updates allowed)
```json
{
  "status": "completed",
  "assigned_to": 3
}
```

**Response:** (200 OK) - Updated task object

---

### 5. Delete Task
**DELETE** `/tasks/{id}/`

Delete task (team owner only).

**Response:** (200 OK)
```json
{
  "detail": "Task deleted successfully."
}
```

---

### 6. Add Task Comment
**POST** `/tasks/{id}/comments/`

Add comment to task.

**Request:**
```json
{
  "content": "Started working on this task. Expecting completion by tomorrow."
}
```

**Response:** (201 Created)
```json
{
  "id": 1,
  "user": 2,
  "user_name": "Jane Doe",
  "user_email": "jane@example.com",
  "content": "Started working on this task...",
  "created_at": "2024-01-15T14:30:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

---

### 7. Dashboard Overview
**GET** `/tasks/dashboard/`

Get user's dashboard statistics.

**Response:** (200 OK)
```json
{
  "total_tasks": 15,
  "completed_tasks": 5,
  "in_progress_tasks": 7,
  "pending_tasks": 3,
  "overdue_tasks": 2,
  "tasks_due_today": 1,
  "my_tasks": 8,
  "my_completed_tasks": 3,
  "my_overdue_tasks": 1,
  "my_in_progress_tasks": 4,
  "top_overdue_tasks": [ ... ],
  "recent_tasks": [ ... ]
}
```

---

## Error Responses

### 400 Bad Request
Invalid input data.

```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
Missing or invalid token.

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
User doesn't have permission.

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
Resource not found.

```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
Server error.

```json
{
  "detail": "Internal server error occurred."
}
```

---

## Common Use Cases

### 1. Complete Task Workflow
```bash
# 1. Register
POST /auth/register/

# 2. Login
POST /auth/login/

# 3. Create team
POST /auth/teams/create/

# 4. Create project
POST /projects/create/

# 5. Create task
POST /tasks/create/

# 6. Update task status
PUT /tasks/1/ → {"status": "in_progress"}

# 7. Add comment
POST /tasks/1/comments/

# 8. Complete task
PUT /tasks/1/ → {"status": "completed"}

# 9. View dashboard
GET /tasks/dashboard/
```

### 2. Managing Team
```bash
# Get all teams
GET /auth/teams/

# Create new team
POST /auth/teams/create/

# Add member to team
POST /auth/teams/1/members/add/

# Remove member
POST /auth/teams/1/members/remove/
```

### 3. Filtering Tasks
```bash
# My pending tasks
GET /tasks/?assigned_to=me&status=pending

# High priority tasks
GET /tasks/?priority=high

# Tasks in specific project
GET /tasks/?project_id=1

# Tasks assigned to specific user
GET /tasks/?assigned_to=2
```

---

## Rate Limiting

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

---

## API Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

---

**Last Updated:** January 2024
