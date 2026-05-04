# Project Manager - Full Stack Application

A comprehensive project management system with role-based access control, built with Django REST Framework backend and React frontend.

## 📊 Features

### Core Features
- ✅ User Authentication (Registration, Login, Logout)
- ✅ Role-Based Access Control (Admin/Member)
- ✅ Project Management (Create, Update, Delete)
- ✅ Task Management (Create, Assign, Track Status)
- ✅ Team Management (Create Teams, Add/Remove Members)
- ✅ Dashboard with Statistics and Overdue Tasks
- ✅ Task Comments & Discussions
- ✅ Priority & Status Tracking
- ✅ Responsive Design

### Technical Features
- REST APIs with validation
- Token-based authentication
- SQLite database with proper relationships
- Role-based permissions
- Docker support
- Production-ready code
- API Documentation (Swagger/ReDoc)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  - Login/Register Pages                                      │
│  - Dashboard with Statistics                                 │
│  - Project Management Interface                              │
│  - Task Management Interface                                 │
│  - Team Management Interface                                 │
└──────────────────────────┬──────────────────────────────────┘
                          │ REST API
┌──────────────────────────▼──────────────────────────────────┐
│               Backend (Django DRF)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Apps:                                                 │ │
│  │  - core (Auth, Users, Teams)                           │ │
│  │  - projects (Project Management)                       │ │
│  │  - tasks (Task Management, Comments)                   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                          │ ORM
┌──────────────────────────▼──────────────────────────────────┐
│               Database (SQLite)                              │
│  - Users Table                                               │
│  - Teams Table                                               │
│  - Projects Table                                            │
│  - Tasks Table                                               │
│  - Task Comments Table                                       │
└──────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
etharaai/
├── backend/                    # Django Backend
│   ├── config/                # Django Settings
│   │   ├── settings.py        # Main settings
│   │   ├── urls.py            # URL routing
│   │   └── wsgi.py            # WSGI config
│   ├── apps/
│   │   ├── core/              # Auth & User Management
│   │   │   ├── models.py      # User, Team models
│   │   │   ├── views.py       # Auth endpoints
│   │   │   ├── serializers.py # Data serialization
│   │   │   └── urls.py        # Auth routes
│   │   ├── projects/          # Project Management
│   │   │   ├── models.py      # Project model
│   │   │   ├── views.py       # Project endpoints
│   │   │   └── serializers.py
│   │   └── tasks/             # Task Management
│   │       ├── models.py      # Task, Comment models
│   │       ├── views.py       # Task endpoints
│   │       └── serializers.py
│   ├── manage.py              # Django management
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Docker config
│   └── README.md              # Backend docs
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── api/               # API client & endpoints
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth, Data)
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS stylesheets
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite config
│   ├── Dockerfile.dev         # Dev container
│   ├── Dockerfile.prod        # Prod container
│   └── README.md              # Frontend docs
│
├── docker-compose.yml         # Docker orchestration
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm/yarn
- Docker & Docker Compose (optional)

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```
   
   Backend runs at: **http://localhost:8000**
   API Docs at: **http://localhost:8000/api/docs/**

### Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend runs at: **http://localhost:3000**

## 🐳 Docker Setup

### Using Docker Compose (Easiest)

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs/

5. **Stop services**
   ```bash
   docker-compose down
   ```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| GET | `/api/auth/profile/` | Get user profile |
| PUT | `/api/auth/profile/` | Update user profile |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/teams/` | List all teams |
| POST | `/api/auth/teams/create/` | Create team |
| GET | `/api/auth/teams/{id}/` | Get team details |
| PUT | `/api/auth/teams/{id}/` | Update team |
| DELETE | `/api/auth/teams/{id}/` | Delete team |
| POST | `/api/auth/teams/{id}/members/add/` | Add team member |
| POST | `/api/auth/teams/{id}/members/remove/` | Remove team member |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/` | List projects |
| POST | `/api/projects/create/` | Create project |
| GET | `/api/projects/{id}/` | Get project details |
| PUT | `/api/projects/{id}/` | Update project |
| DELETE | `/api/projects/{id}/` | Delete project |
| GET | `/api/projects/{id}/dashboard/` | Project dashboard stats |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List tasks |
| POST | `/api/tasks/create/` | Create task |
| GET | `/api/tasks/{id}/` | Get task details |
| PUT | `/api/tasks/{id}/` | Update task |
| DELETE | `/api/tasks/{id}/` | Delete task |
| POST | `/api/tasks/{id}/comments/` | Add comment |
| GET | `/api/tasks/dashboard/` | Dashboard overview |

## 🔐 Authentication

The system uses **Token-Based Authentication**:

1. User registers or logs in
2. Server returns authentication token
3. Token stored in localStorage
4. Token sent with each API request in header: `Authorization: Token {token}`
5. Token automatically removed on logout or 401 response

## 🛡️ Role-Based Access Control

### Admin Role
- Create, edit, delete projects
- Assign tasks to team members
- Manage team members
- View all team data

### Member Role
- View assigned projects
- View assigned tasks
- Create tasks (if allowed)
- Update own tasks
- Add comments

## 📊 Database Models

### User
```python
- email (unique)
- username
- first_name
- last_name
- password (hashed)
- role (admin/member)
- bio
- avatar
- created_at
- updated_at
```

### Team
```python
- name
- description
- owner (FK to User)
- members (M2M to User)
- created_at
- updated_at
```

### Project
```python
- name
- description
- team (FK)
- created_by (FK to User)
- status (active/on_hold/completed/archived)
- start_date
- end_date
- created_at
- updated_at
```

### Task
```python
- title
- description
- project (FK)
- assigned_to (FK to User, nullable)
- created_by (FK to User)
- status (pending/in_progress/completed/on_hold)
- priority (low/medium/high/critical)
- due_date
- start_date
- completed_at
- created_at
- updated_at
```

### TaskComment
```python
- task (FK)
- user (FK)
- content
- created_at
- updated_at
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test
```

### Run Specific App Tests
```bash
python manage.py test apps.core
python manage.py test apps.projects
python manage.py test apps.tasks
```

## 📝 Validations & Error Handling

### Frontend Validations
- Email format validation
- Password strength (min 8 characters)
- Required field validation
- Form error messages

### Backend Validations
- Email uniqueness
- Password requirements
- Date range validation
- Permission checks
- Data type validation
- Relationship validation

## 🚀 Production Deployment

### Before Deploying

1. **Update Django Settings**
   ```bash
   DEBUG=False
   SECRET_KEY=<generate-secure-key>
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   ```

2. **Set Secure Cookies**
   ```bash
   SECURE_SSL_REDIRECT=True
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   ```

3. **Install Production Dependencies**
   ```bash
   pip install psycopg2-binary  # For PostgreSQL
   ```

4. **Collect Static Files**
   ```bash
   python manage.py collectstatic --noinput
   ```

### Deploy with Gunicorn & Nginx

```bash
# Backend with Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4

# Frontend Build
npm run build
# Serve dist/ folder with Nginx
```

## 🐛 Troubleshooting

### Backend Issues

1. **ModuleNotFoundError**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database errors**
   ```bash
   python manage.py migrate
   python manage.py migrate --run-syncdb
   ```

3. **CORS errors**
   - Check `CORS_ALLOWED_ORIGINS` in settings.py
   - Ensure frontend URL is in the list

4. **404 on API endpoints**
   - Check URL routing in config/urls.py
   - Verify app is in INSTALLED_APPS

### Frontend Issues

1. **Module not found**
   ```bash
   npm install
   ```

2. **API connection issues**
   - Check `VITE_API_URL` in .env
   - Verify backend is running
   - Check browser console for CORS errors

3. **Token not persisting**
   - Check localStorage in browser DevTools
   - Verify token is set after login

## 📖 API Documentation

Once the backend is running, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

## 🔄 Workflow Example

1. **User Registration**
   - Fill registration form
   - Receive auth token
   - Redirected to dashboard

2. **Create Team**
   - Go to Teams
   - Click "Create Team"
   - Add team members

3. **Create Project**
   - Select team
   - Create project
   - Set dates and status

4. **Create & Assign Task**
   - Create task in project
   - Assign to team member
   - Set priority & due date
   - Member receives notification

5. **Track Progress**
   - View dashboard
   - Check overdue tasks
   - Update task status
   - Add comments

## 🎨 Customization

### Change Branding
- Update project name in frontend/src/components/Navigation.jsx
- Modify colors in frontend/src/index.css (CSS variables)
- Update favicon in frontend/index.html

### Add New Features
1. Create models in Django app
2. Create migrations
3. Add serializers
4. Create API views
5. Add frontend components
6. Update routing

## 📦 Dependencies

### Backend
- Django 4.2.10
- Django REST Framework 3.14.0
- drf-spectacular (API docs)
- drf-simplejwt (JWT tokens)
- django-cors-headers
- Pillow (image handling)

### Frontend
- React 18
- React Router v6
- Axios (HTTP client)
- Date-fns (date utilities)
- React Toastify (notifications)
- Vite (build tool)

## 📄 License

This project is provided as-is for educational and commercial use.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Verify all environment variables are set correctly

## ✅ Production Checklist

- [ ] Change DEBUG to False
- [ ] Generate secure SECRET_KEY
- [ ] Set ALLOWED_HOSTS
- [ ] Configure CORS_ALLOWED_ORIGINS
- [ ] Enable HTTPS
- [ ] Set up proper database (PostgreSQL)
- [ ] Configure email backend
- [ ] Set up static file serving
- [ ] Configure media file storage
- [ ] Set up error logging
- [ ] Configure server monitoring
- [ ] Set up backup strategy
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test role-based access
- [ ] Performance testing
- [ ] Load testing
- [ ] Security testing

---

**Ready to go! Happy project managing! 🎉**
