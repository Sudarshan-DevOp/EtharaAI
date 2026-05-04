# Feature Documentation

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Team Management](#team-management)
4. [Project Management](#project-management)
5. [Task Management](#task-management)
6. [Dashboard & Analytics](#dashboard--analytics)
7. [Permissions & Access Control](#permissions--access-control)

---

## Authentication & Authorization

### User Registration
- Users can create account with email, username, first/last name
- Password minimum 8 characters required
- Email must be unique
- Role assigned as "member" by default

**API:** `POST /api/auth/register/`

### User Login
- Login with email and password
- Returns authentication token valid for entire session
- Token stored in localStorage on frontend
- Token sent with all subsequent API requests

**API:** `POST /api/auth/login/`

### Token Authentication
- Each request requires `Authorization: Token {token}` header
- Automatic logout on 401 Unauthorized response
- Tokens never expire (session-based)

**Storage:**
- Frontend: localStorage['token']
- Frontend: localStorage['user']

### User Logout
- Invalidates current token
- Clears localStorage
- Redirects to login page

**API:** `POST /api/auth/logout/`

---

## User Management

### Profile Management
Users can update their own profile information:
- First name
- Last name
- Bio
- Avatar (image)

**API:** 
- Get: `GET /api/auth/profile/`
- Update: `PUT /api/auth/profile/`

### User Roles

#### Admin Role
- Can create projects
- Can assign tasks
- Can manage team members
- Can delete projects/tasks
- Badge displayed in UI ("Admin")

#### Member Role
- Can view assigned projects
- Can view assigned tasks
- Can update own task status
- Can add comments
- Can view dashboard

**Assigned:**
- First user in system: Admin
- New registrations: Member
- Admin can manually change roles

---

## Team Management

### Create Team
- Owner creates team
- Team name required
- Optional description
- Creator becomes team owner

**Features:**
- Team has unique name-owner pair
- Only owner can modify team
- Owner can add/remove members
- Members can view team projects

**API:** `POST /api/auth/teams/create/`

### Team Membership
- Owner can add members by user ID
- Members must be existing users
- Members can be removed anytime
- Owner cannot remove themselves

**APIs:**
- Add member: `POST /api/auth/teams/{id}/members/add/`
- Remove member: `POST /api/auth/teams/{id}/members/remove/`

### Team Visibility
- Users see only teams they own or are members of
- Teams are private by default
- Only members can view team data

---

## Project Management

### Create Project
- Must belong to a team
- Can only be created by team members
- Project name unique per team

**Fields:**
- Name (required)
- Description (optional)
- Team (required)
- Status (active, on_hold, completed, archived)
- Start date (optional)
- End date (optional)

**Validations:**
- Start date must be before end date
- End date cannot be before start date

**API:** `POST /api/projects/create/`

### Update Project
- Only team owner can update
- Can change status and dates
- Cannot move to different team

**Statuses:**
- **Active**: Project is ongoing
- **On Hold**: Project paused
- **Completed**: Project finished
- **Archived**: Project archived

**API:** `PUT /api/projects/{id}/`

### Delete Project
- Only team owner can delete
- Deletes all associated tasks
- Permanent deletion

**API:** `DELETE /api/projects/{id}/`

### Project Dashboard
- View project statistics
- Total tasks count
- Task breakdown by status
- Overdue tasks count

**API:** `GET /api/projects/{id}/dashboard/`

---

## Task Management

### Create Task
- Must belong to a project
- Can be unassigned initially
- Automatic date tracking

**Fields:**
- Title (required)
- Description (optional)
- Project (required)
- Assigned to (optional, must be team member)
- Priority (low, medium, high, critical)
- Status (pending, in_progress, completed, on_hold)
- Due date (optional)
- Start date (optional)

**Validations:**
- Start date before due date
- Cannot assign task to non-team member

**API:** `POST /api/tasks/create/`

### Task Status Lifecycle
```
Pending → In Progress → Completed
         → On Hold → In Progress/Pending
```

**Auto-completion:**
- When status = completed, completed_at timestamp set automatically
- Only system can set completed_at
- Cleared if status changed from completed

**API:** `PUT /api/tasks/{id}/`

### Task Priority Levels
| Priority | Color | Use Case |
|----------|-------|----------|
| Low | Green | Non-urgent bug fixes, documentation |
| Medium | Orange | Normal work items |
| High | Red | Important features |
| Critical | Purple | Blocking issues, urgent bugs |

### Task Comments
- Team members can discuss tasks
- Comments include user, content, timestamp
- Comments show in chronological order
- Edit not available (database stores immutable)

**API:** `POST /api/tasks/{id}/comments/`

### Overdue Tasks
- Tasks marked overdue if due_date < today and status ≠ completed
- System calculates days_until_due
- Overdue tasks highlighted in red

**Properties:**
- is_overdue (boolean)
- days_until_due (integer or null)

### Task Filtering
- Filter by status
- Filter by priority
- Filter by assigned user
- Filter by project
- Combine multiple filters

**API:**
```
GET /tasks/?assigned_to=me&status=pending
GET /tasks/?priority=high&project_id=1
```

---

## Dashboard & Analytics

### Dashboard Overview
Personal dashboard showing:
1. **Quick Stats**
   - Total tasks
   - Completed tasks
   - In progress tasks
   - Pending tasks
   - Overdue tasks
   - Tasks due today

2. **My Tasks Stats**
   - Total assigned to me
   - Completed by me
   - Overdue assigned to me
   - In progress

3. **Recent Data**
   - Top 5 overdue tasks
   - 5 recent tasks assigned
   - Team list
   - Recent projects

4. **Visual Indicators**
   - Overdue in red
   - Color-coded priority
   - Status badges
   - Progress bars

**API:** `GET /api/tasks/dashboard/`

### Project Dashboard
Statistics specific to a project:
- Total tasks
- Completed tasks
- In progress tasks
- Pending tasks
- Overdue tasks

**API:** `GET /api/projects/{id}/dashboard/`

---

## Permissions & Access Control

### Authentication Required
All endpoints except registration and login require token authentication.

### Team Access Rights

| Action | Owner | Member | Non-Member |
|--------|-------|--------|------------|
| View team | ✅ | ✅ | ❌ |
| Update team | ✅ | ❌ | ❌ |
| Delete team | ✅ | ❌ | ❌ |
| Add members | ✅ | ❌ | ❌ |
| Remove members | ✅ | ❌ | ❌ |

### Project Access Rights

| Action | Team Owner | Team Member | Other |
|--------|-----------|------------|-------|
| View project | ✅ | ✅ | ❌ |
| Create in project | ✅ | ✅ | ❌ |
| Update project | ✅ | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ |

### Task Access Rights

| Action | Team Owner | Task Assignee | Team Member | Other |
|--------|-----------|---------------|------------|-------|
| View task | ✅ | ✅ | ✅ | ❌ |
| Create task | ✅ | N/A | ✅ | ❌ |
| Update task | ✅ | ❌ | ❌ | ❌ |
| Delete task | ✅ | ❌ | ❌ | ❌ |
| Add comment | ✅ | ✅ | ✅ | ❌ |
| Change status | ✅ | ✅* | ❌ | ❌ |

*Assignees can only update task status, not other fields

---

## Error Handling

### Validation Errors
```json
{
  "field": ["Error message"]
}
```

### Permission Errors
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### Not Found Errors
```json
{
  "detail": "Not found."
}
```

### Authentication Errors
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Data Relationships

### Database Relations

```
User
├── Many Teams (as owner)
├── Many Teams (as member)
├── Many Projects (as creator)
└── Many Tasks (as assignee/creator)

Team
├── One Owner (User)
├── Many Members (User)
└── Many Projects

Project
├── One Team
├── One Creator (User)
└── Many Tasks

Task
├── One Project
├── One Assignee (User, nullable)
├── One Creator (User)
└── Many Comments

TaskComment
├── One Task
└── One User (commenter)
```

---

## Security Features

### Password Security
- Minimum 8 characters
- Django default password hashing (PBKDF2)
- Password validation rules enforced

### Token Security
- Session-based tokens (valid for entire session)
- Tokens included in localStorage
- Automatic token refresh not implemented (session is persistent)
- Clear on logout

### CORS Protection
- Backend configured with allowed origins
- Frontend URL whitelisted
- API rejects cross-origin requests

### Request Validation
- Input validation on all endpoints
- Type checking
- Range validation
- Required field validation

### User Isolation
- Users can only access their own data
- Team-based access control
- Project inheritance permissions
- Task-based permissions

---

## Best Practices

### For Users
1. **Task Management**
   - Set realistic due dates
   - Break large tasks into smaller ones
   - Update status regularly
   - Add comments for collaboration

2. **Team Management**
   - Keep team size manageable
   - Remove inactive members
   - Use clear team names
   - Document team purpose

3. **Project Management**
   - Create projects with clear goals
   - Set realistic timelines
   - Review dashboard regularly
   - Archive completed projects

### For Developers
1. **API Usage**
   - Always include Authorization header
   - Handle 401/403 responses
   - Implement retry logic
   - Check response status codes

2. **Frontend**
   - Check user permissions before showing UI
   - Handle loading states
   - Show clear error messages
   - Refresh data after updates

3. **Database**
   - Use database transactions
   - Validate data before save
   - Create backups
   - Monitor database size

---

## Limitations & Future Features

### Current Limitations
- Single database instance
- No real-time notifications
- No file attachments on tasks
- No task dependencies
- No recurring tasks
- No team roles (all members equal)

### Planned Features
- Real-time notifications
- File attachments
- Task dependencies
- Recurring tasks
- Team member roles
- Custom fields
- Task templates
- Integrations (Slack, etc.)
- Mobile app
- Advanced reporting

---

**For API reference, see [API_REFERENCE.md](./API_REFERENCE.md)**
