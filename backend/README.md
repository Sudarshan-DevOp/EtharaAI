# Django Backend Documentation

## Setup Instructions

### Prerequisites
- Python 3.11+
- pip
- virtualenv or venv

### Local Development

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Admin User**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

   Server will run at `http://localhost:8000`

### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

### Docker Setup

1. **Build and Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run Migrations in Docker**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Create Superuser in Docker**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

#### Teams
- `GET /api/auth/teams/` - List teams
- `POST /api/auth/teams/create/` - Create team
- `GET /api/auth/teams/<id>/` - Get team details
- `PUT /api/auth/teams/<id>/` - Update team
- `DELETE /api/auth/teams/<id>/` - Delete team
- `POST /api/auth/teams/<id>/members/add/` - Add team member
- `POST /api/auth/teams/<id>/members/remove/` - Remove team member

#### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/create/` - Create project
- `GET /api/projects/<id>/` - Get project details
- `PUT /api/projects/<id>/` - Update project
- `DELETE /api/projects/<id>/` - Delete project
- `GET /api/projects/<id>/dashboard/` - Get project dashboard

#### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/create/` - Create task
- `GET /api/tasks/<id>/` - Get task details
- `PUT /api/tasks/<id>/` - Update task
- `DELETE /api/tasks/<id>/` - Delete task
- `POST /api/tasks/<id>/comments/` - Add comment to task
- `GET /api/tasks/dashboard/` - Get dashboard overview

### Database

The application uses SQLite by default. Database file is stored at `db.sqlite3`.

### Testing

Run tests with:
```bash
python manage.py test
```

Run specific app tests:
```bash
python manage.py test apps.core
python manage.py test apps.projects
python manage.py test apps.tasks
```

### Production Deployment

1. Change `DEBUG=False` in `.env`
2. Update `SECRET_KEY` with a secure random key
3. Configure `ALLOWED_HOSTS` with your domain
4. Set up proper CORS settings
5. Use environment variables for sensitive data
6. Deploy with gunicorn or similar WSGI server

### Troubleshooting

- **ModuleNotFoundError**: Run `pip install -r requirements.txt`
- **Database errors**: Run `python manage.py migrate`
- **Static files not found**: Run `python manage.py collectstatic`
- **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in `.env`

