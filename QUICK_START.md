# Quick Start Guide - 5 Minutes

## 🚀 Fastest Way to Get Running

### Option 1: Docker (Recommended - 3 commands)

```bash
# 1. Build and start services
docker-compose up -d

# 2. Setup database
docker-compose exec backend python manage.py migrate

# 3. Create admin user
docker-compose exec backend python manage.py createsuperuser
```

**Done!** Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api/docs/

---

### Option 2: Local Development

#### Terminal 1 - Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Done!** 
- Frontend: http://localhost:3000 (or http://localhost:5173/)
- Backend: http://localhost:8000

---

## 📝 First Steps After Setup

### 1. Create Account
- Go to http://localhost:3000
- Click "Register"
- Fill in details and create account

### 2. Create Team
- After login, click "Create Team" on Dashboard
- Enter team name and description
- Team created!

### 3. Create Project
- Click "Create Project"
- Select your team
- Set project name and status
- Project created!

### 4. Create Task
- Click "Create Task"
- Select project
- Add title, description, priority, due date
- Assign to team member
- Task created!

### 5. View Dashboard
- Dashboard shows:
  - Total tasks stats
  - Your assigned tasks
  - Overdue tasks
  - Recent projects
  - Team members

---

## 🔑 Test Account & Admin Access

### Using Web Interface

**Member Account:**
- Email: member@example.com
- Password: password123

**Admin Account:**
- Email: admin@example.com
- Password: admin123

### Admin Dashboard
- Go to: http://localhost:8000/admin/
- Login with admin account
- Manage users, teams, projects, tasks

### API Documentation
- Interactive Docs: http://localhost:8000/api/docs/
- Click "Authorize" and paste token to test APIs

---

## 📊 Key Features to Try

### ✅ Dashboard
- View project statistics
- Check overdue tasks
- See team overview

### ✅ Tasks
- Create, edit, delete tasks
- Assign to team members
- Change status (pending → in progress → completed)
- Add comments
- Filter by status, priority, assigned user

### ✅ Projects
- Create projects per team
- Set dates and status
- View project dashboard

### ✅ Teams
- Create teams
- Add/remove members
- View team members

### ✅ Authentication
- Register new account
- Login/Logout
- View profile
- Update profile

---

## 🛑 Stop Services

### Docker
```bash
docker-compose down
```

### Local Development
```bash
# Press Ctrl+C in both terminals
```

---

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| http://localhost:3000 | Frontend Application |
| http://localhost:8000 | Backend API |
| http://localhost:8000/admin/ | Admin Panel |
| http://localhost:8000/api/docs/ | API Documentation (Swagger) |
| http://localhost:8000/api/redoc/ | API Documentation (ReDoc) |

---

## 💡 Tips & Tricks

### View Backend Logs
```bash
docker-compose logs -f backend
```

### View Frontend Logs
```bash
docker-compose logs -f frontend
```

### Restart Services
```bash
docker-compose restart
```

### Fresh Start (Dangerous!)
```bash
docker-compose down -v  # Removes volumes (deletes database)
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

### Run Django Shell
```bash
docker-compose exec backend python manage.py shell

# In Python shell:
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.all()
```

---

## ❓ Common Issues

### Issue: Can't access http://localhost:3000
- ✅ Frontend not running? Run `npm run dev`
- ✅ Port in use? Change port in vite.config.js

### Issue: API returns 401 Unauthorized
- ✅ Not logged in? Login first
- ✅ Token expired? Logout and login again
- ✅ CORS error? Check backend CORS settings

### Issue: Database errors
- ✅ Migrations not run? Run `python manage.py migrate`
- ✅ Docker database? Restart everything

### Issue: Module not found errors
- ✅ Dependencies installed? Run `pip install -r requirements.txt` (backend) or `npm install` (frontend)

---

## 📚 Next Steps

1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Read [README.md](./README.md) for full documentation
3. Explore backend [README.md](./backend/README.md)
4. Explore frontend [README.md](./frontend/README.md)

---

**Happy Coding! 🎉**

For detailed documentation, see [README.md](./README.md)
