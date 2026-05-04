# Setup & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Docker Setup](#docker-setup)
3. [API Testing](#api-testing)
4. [Production Deployment](#production-deployment)
5. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Backend Setup (Detailed)

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
# Key settings:
# - DEBUG=True (for development)
# - SECRET_KEY=your-secret-key (change for production)
# - ALLOWED_HOSTS=localhost,127.0.0.1
# - CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Step 5: Database Setup
```bash
# Create initial migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser
```

#### Step 6: Start Development Server
```bash
python manage.py runserver
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

**Access Points:**
- API: http://localhost:8000/
- Admin: http://localhost:8000/admin/
- API Docs (Swagger): http://localhost:8000/api/docs/
- API Docs (ReDoc): http://localhost:8000/api/redoc/

### Frontend Setup (Detailed)

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

Wait for all dependencies to install. This may take a few minutes.

#### Step 3: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:8000/api
```

#### Step 4: Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Access Points:**
- Frontend: http://localhost:3000 (or http://localhost:5173/)

#### Step 5: Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized production build.

## Docker Setup

### Prerequisites
- Docker (https://www.docker.com/products/docker-desktop)
- Docker Compose
- Git (optional)

### Quick Start with Docker Compose

#### Step 1: Build Services
```bash
docker-compose build
```

#### Step 2: Start Services
```bash
docker-compose up -d
```

This starts:
- Backend API (port 8000)
- Frontend (port 3000)
- SQLite Database

#### Step 3: Initialize Database
```bash
docker-compose exec backend python manage.py migrate
```

#### Step 4: Create Admin User
```bash
docker-compose exec backend python manage.py createsuperuser
```

#### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api/docs/

#### Step 6: Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Services
```bash
# After code changes
docker-compose up -d --build
```

### Execute Commands in Container
```bash
# Django management commands
docker-compose exec backend python manage.py shell

# NPM commands
docker-compose exec frontend npm install <package-name>

# Access bash
docker-compose exec backend bash
```

## API Testing

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepass123",
    "password_confirm": "securepass123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "John",
    "last_name": "Doe",
    "role": "member"
  },
  "token": "abc123def456..."
}
```

#### Create Team (with token)
```bash
curl -X POST http://localhost:8000/api/auth/teams/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token abc123def456..." \
  -d '{
    "name": "Engineering Team",
    "description": "Main engineering team"
  }'
```

### Using Postman

1. **Create Collection**: ProjectManager
2. **Set Base URL**: http://localhost:8000/api
3. **Create Environment Variable**: {{token}}
4. **Add Requests**:
   - POST /auth/register/
   - POST /auth/login/
   - GET /auth/profile/
   - POST /auth/teams/create/
   - GET /projects/
   - POST /tasks/create/

### Using Swagger UI

1. Go to http://localhost:8000/api/docs/
2. Click "Authorize" button
3. Enter token: `Token abc123def456...`
4. Try out endpoints directly from browser

## Production Deployment

### Prerequisites
- Server (AWS, DigitalOcean, Heroku, etc.)
- Domain name
- SSL certificate
- PostgreSQL database (recommended)
- Redis (optional, for caching)

### Step 1: Prepare Environment

Create `.env` with production settings:
```bash
DEBUG=False
SECRET_KEY=<generate-random-secure-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (use PostgreSQL in production)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=projectmanager
DB_USER=postgres
DB_PASSWORD=<secure-password>
DB_HOST=db.example.com
DB_PORT=5432

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Frontend
FRONTEND_URL=https://yourdomain.com
```

### Step 2: Generate SECRET_KEY

```python
# In Python shell
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### Step 3: Deploy Backend

#### Option A: Using Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=<your-secret-key>

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser
```

#### Option B: Using Docker on VPS

```bash
# On your VPS
docker pull <your-docker-image>:latest
docker run -d \
  -p 8000:8000 \
  -e DEBUG=False \
  -e SECRET_KEY=<your-secret-key> \
  --name backend \
  <your-docker-image>:latest \
  gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

#### Option C: Traditional Deployment

```bash
# On VPS
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Start with Gunicorn
gunicorn config.wsgi:application --bind unix:projectmanager.sock --workers 4

# Use systemd service to manage
# Create /etc/systemd/system/projectmanager.service
[Unit]
Description=Project Manager Django Application
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/projectmanager
ExecStart=/var/www/projectmanager/venv/bin/gunicorn config.wsgi:application --bind unix:projectmanager.sock --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

### Step 4: Deploy Frontend

#### Option A: Using Vercel/Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Vercel/Netlify
```

#### Option B: Using Docker

```bash
# Build production image
docker build -f Dockerfile.frontend -t projectmanager-frontend:latest .

# Push to registry
docker push <registry>/projectmanager-frontend:latest

# Run container
docker run -d \
  -p 80:80 \
  --name frontend \
  <registry>/projectmanager-frontend:latest
```

#### Option C: Using Nginx

```bash
# Build
npm run build

# Copy dist to Server
scp -r dist/ user@server:/var/www/projectmanager/

# Configure Nginx
# In /etc/nginx/sites-available/projectmanager
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /var/www/projectmanager/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 5: Set Up HTTPS (SSL)

Using Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Configure Nginx for HTTPS
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 6: Configure Firewall

```bash
# UFW firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Troubleshooting

### Backend Issues

#### Issue: Port 8000 already in use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
python manage.py runserver 8001
```

#### Issue: ModuleNotFoundError
```bash
# Ensure virtual environment is activated
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

#### Issue: Database migration errors
```bash
# Reset database (development only)
rm db.sqlite3
python manage.py migrate

# For production, use:
python manage.py migrate --fake-initial
```

#### Issue: CORS errors
1. Check `CORS_ALLOWED_ORIGINS` in .env
2. Verify frontend URL is in the list
3. Restart backend server

### Frontend Issues

#### Issue: Blank page or 404
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache and rebuild
npm run build
```

#### Issue: API not connecting
1. Check `VITE_API_URL` in .env
2. Verify backend is running
3. Check browser console for errors
4. Verify CORS is configured

#### Issue: Token not persisting
1. Check browser localStorage
2. Verify token format is correct
3. Check token expiration

### Docker Issues

#### Issue: Port already in use
```bash
# Find container using port
docker ps | grep 8000

# Stop container
docker stop <container-id>

# Or use different port in docker-compose
ports:
  - "8001:8000"
```

#### Issue: Container won't start
```bash
# Check logs
docker logs <container-id>

# Rebuild
docker-compose down
docker-compose up -d --build
```

#### Issue: Database file permissions
```bash
# Fix permissions
docker-compose exec backend chown -R www-data:www-data /app/db.sqlite3
```

---

**Need Help?** Check the main README.md for more information.
