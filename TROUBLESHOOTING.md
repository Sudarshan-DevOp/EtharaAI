# Troubleshooting Guide

## Debug Checklist

Before investigating further, verify:
- [ ] Virtual environment activated (backend)
- [ ] Dependencies installed (`pip install -r requirements.txt` / `npm install`)
- [ ] Environment files created (`.env`)
- [ ] Migrations run (`python manage.py migrate`)
- [ ] Backend running (`python manage.py runserver`)
- [ ] Frontend running (`npm run dev`)
- [ ] No port conflicts (8000, 3000, 5173)

---

## Backend Issues

### 1. ModuleNotFoundError

**Error:**
```
ModuleNotFoundError: No module named 'django'
```

**Solutions:**
- ✅ Activate virtual environment: `source venv/bin/activate`
- ✅ Install requirements: `pip install -r requirements.txt`
- ✅ Reinstall (force): `pip install -r requirements.txt --force-reinstall`
- ✅ Check Python version: `python --version` (need 3.11+)

---

### 2. Database Connection Error

**Error:**
```
sqlite3.OperationalError: unable to open database file
```

**Solutions:**
- ✅ Run migrations: `python manage.py migrate`
- ✅ Check .env DATABASE settings
- ✅ Delete db.sqlite3 and start fresh: `rm db.sqlite3 && python manage.py migrate`
- ✅ Check file permissions: `chmod 666 db.sqlite3`

**For Docker:**
```bash
docker-compose exec backend chmod 666 db.sqlite3
```

---

### 3. PORT 8000 Already In Use

**Error:**
```
OSError: [Errno 48] Address already in use
```

**Solutions:**
- ✅ Kill process: 
  ```bash
  # Find PID
  lsof -i :8000
  kill -9 <PID>
  ```
- ✅ Use different port: `python manage.py runserver 8001`
- ✅ Docker: Change port in docker-compose.yml

**For Docker:**
```bash
docker-compose down
docker-compose up -d
```

---

### 4. CORS Errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
- ✅ Check `.env` file:
  ```
  CORS_ALLOWED_ORIGINS=http://localhost:3000
  ```
- ✅ Verify frontend URL in CORS_ALLOWED_ORIGINS
- ✅ Restart backend after env changes
- ✅ If using docker: ensure service name matches

**Production Fix:**
```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

---

### 5. 404 Errors on API Endpoints

**Error:**
```
404 Not Found: /api/auth/register/
```

**Check:**
1. ✅ **Verify URLs are registered**
   - Check `config/urls.py`
   - Check app-specific `urls.py`
   
2. ✅ **Verify app in INSTALLED_APPS**
   ```python
   INSTALLED_APPS = [
       'apps.core',
       'apps.projects',
       'apps.tasks',
   ]
   ```

3. ✅ **Check URL syntax**
   - Should match exactly: `/api/endpoint/`
   
4. ✅ **Restart server**

---

### 6. 401 Unauthorized Errors

**Error:**
```
{"detail":"Authentication credentials were not provided."}
```

**Check:**
1. ✅ **Have you logged in?**
   - Login first to get token
   
2. ✅ **Is token in request header?**
   - Should be: `Authorization: Token {token}`
   
3. ✅ **Token is valid?**
   - Tokens don't expire in this system
   - Use same token from login response
   
4. ✅ **Correct token format?**
   - Should be: `Token 1234567890abcdef...`
   - Not: `Bearer token`

---

### 7. Static Files Missing

**Error:**
```
GET /static/admin/css/base.css 404
```

**Solutions:**
```bash
python manage.py collectstatic --noinput
```

**Production:**
```bash
# Ensure staticfiles folder exists
python manage.py collectstatic --no-input --clear
```

---

### 8. Migration Errors

**Error:**
```
Migrations for 'core' are not yet reflected in the database state.
```

**Solutions:**
```bash
# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# If stuck, fake migrations (development only)
python manage.py migrate --fake
```

**For new models:**
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 9. Secret Key Error

**Error:**
```
KeyError: 'SECRET_KEY'
```

**Solution:**
- ✅ Create `.env` file: `cp .env.example .env`
- ✅ Verify `SECRET_KEY` is set in `.env`
- ✅ Restart server

---

### 10. DEBUG Mode

**In Development:**
```python
# .env
DEBUG=True
```

**In Production (NEVER):**
```python
# .env
DEBUG=False
```

---

## Frontend Issues

### 1. PORT 3000/5173 Already In Use

**Error:**
```
Port 3000 is already in use
Port 5173 is already in use
```

**Solutions:**
- ✅ Kill process:
  ```bash
  lsof -i :3000
  kill -9 <PID>
  ```
- ✅ Use different port in `vite.config.js`:
  ```javascript
  server: {
    port: 3001,
  }
  ```

---

### 2. Module Not Found

**Error:**
```
Cannot find module 'react'
```

**Solutions:**
- ✅ Install dependencies: `npm install`
- ✅ Clear cache and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- ✅ Check `package.json` has dependencies

---

### 3. API Connection Errors

**Error:**
```
GET http://localhost:8000/api/tasks/ - Failed to fetch
```

**Check:**
1. ✅ **Is backend running?**
   - Open http://localhost:8000 in browser
   - Should not be "Connection refused"

2. ✅ **Check .env API URL**
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. ✅ **CORS configured?**
   - Backend has CORS_ALLOWED_ORIGINS set?
   - Frontend URL in the list?

4. ✅ **Check browser console (F12)**
   - Look for actual error message
   - Network tab to see request

---

### 4. Blank Page After Login

**Error:**
- Dashboard shows but no content

**Solutions:**
- ✅ Check browser console (F12):
  - Look for JavaScript errors
  - Look for API errors
  
- ✅ Check if token stored:
  - F12 → Application → localStorage
  - Should have `token` and `user` keys

- ✅ Restart frontend:
  ```bash
  npm run dev
  ```

- ✅ Check API is responding:
  - Visit http://localhost:8000/api/docs/
  - Should show Swagger UI

---

### 5. Infinite Loading

**Error:**
- Page keeps showing "Loading..."

**Solutions:**
- ✅ Check browser console (F12) for errors
- ✅ Check API responses are returning data
- ✅ Check token is valid
- ✅ Restart frontend: `npm run dev`

---

### 6. Form Validation Not Working

**Error:**
- Can submit empty forms

**Check:**
1. ✅ Form has `required` attributes
2. ✅ JavaScript not disabled
3. ✅ Browser validation enabled
4. ✅ Backend validation configured

---

### 7. Logout Not Working

**Error:**
- Logout button does nothing

**Solutions:**
- ✅ Check browser console for errors
- ✅ Verify logout endpoint responds
- ✅ Check localStorage is cleared (F12 → Application)
- ✅ Restart frontend

---

### 8. Assets Not Loading (CSS/Images)

**Error:**
- Page looks broken, styles missing

**Solutions:**
- ✅ Check F12 → Network tab
- ✅ Look for 404 errors on CSS files
- ✅ Clear browser cache: `Ctrl+Shift+Delete`
- ✅ Restart dev server: `npm run dev`

---

### 9. Cannot Build for Production

**Error:**
```
npm run build
vite build failed
```

**Solutions:**
```bash
# Clear node modules
rm -rf node_modules

# Install again
npm install

# Try build
npm run build

# Check for errors in output
```

---

### 10. Token Not Persisting

**Error:**
- Get logged out after page refresh

**Solutions:**
- ✅ Check localStorage is enabled (F12 → Application)
- ✅ Check token is being saved:
  ```javascript
  localStorage.setItem('token', token)
  ```
- ✅ Check token is retrieved:
  ```javascript
  const token = localStorage.getItem('token')
  ```

---

## Docker Issues

### 1. Container Won't Start

**Error:**
```
docker-compose up
(container exits immediately)
```

**Debug:**
```bash
# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild
docker-compose down
docker-compose up -d --build
```

---

### 2. Port Conflicts

**Error:**
```
Cannot assign requested address: 0.0.0.0:8000
```

**Solutions:**
- ✅ Check what's using port:
  ```bash
  docker ps
  ```
- ✅ Stop conflicting container:
  ```bash
  docker stop <container-id>
  ```
- ✅ Change port in `docker-compose.yml`:
  ```yaml
  ports:
    - "8001:8000"
  ```

---

### 3. Database Not Persisting

**Error:**
- Data lost after `docker-compose down`

**Solutions:**
- ✅ Use named volumes (in docker-compose.yml):
  ```yaml
  volumes:
    db_data:
  
  services:
    backend:
      volumes:
        - db_data:/app
  ```

---

### 4. Can't Connect Between Containers

**Error:**
```
Connection refused: backend:8000
```

**Solutions:**
- ✅ Container names must match
- ✅ Containers must be on same network (default: yes)
- ✅ Check docker-compose.yml services names
- ✅ Frontend environment:
  ```
  VITE_API_URL=http://backend:8000/api
  ```

---

### 5. Out of Disk Space

**Error:**
```
docker: not enough disk space
```

**Solutions:**
```bash
# Clean up stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Full cleanup (careful!)
docker system prune -a --volumes
```

---

## Performance Issues

### 1. Slow API Responses

**Check:**
- ✅ Database queries are optimized
- ✅ No N+1 queries
- ✅ Indexes are in place
- ✅ Backend server not overloaded

**Solutions:**
```bash
# Check Django ORM queries
python manage.py shell
>>> from django.db import connection
>>> from django.db import reset_queries
>>> from django.conf import settings
>>> settings.DEBUG = True
>>> from django.db import connection
>>> connection.queries  # See all queries
```

---

### 2. Frontend Slow to Load

**Check:**
- ✅ No console errors
- ✅ Network tab shows timings
- ✅ CSS/JS files downloading

**Solutions:**
- ✅ Production build:
  ```bash
  npm run build
  npm run preview
  ```
- ✅ Check bundle size
- ✅ Enable code splitting in Vite

---

## Browser DevTools Tips

### Console Tab (F12)
- Shows JavaScript errors
- API error responses
- Network errors

### Network Tab
- Shows API requests/responses
- Check status codes (200, 401, 404, 500)
- Check response times
- Check headers

### Application Tab
- localStorage (token, user)
- sessionStorage
- Cookies

### Elements Tab
- HTML structure
- CSS styles
- DOM manipulation

---

## Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | OK | ✅ Success |
| 201 | Created | ✅ Resource created |
| 400 | Bad Request | ❌ Check input data |
| 401 | Unauthorized | ❌ Login first / Invalid token |
| 403 | Forbidden | ❌ No permission |
| 404 | Not Found | ❌ Resource doesn't exist |
| 500 | Server Error | ❌ Backend error, check logs |

---

## Quick Debug Checklist

When something isn't working:

1. **Clear Everything**
   ```bash
   # Frontend
   Ctrl+Shift+Delete (clear browser cache)
   F12 - Clear entire cache
   
   # Backend
   python manage.py migrate
   ```

2. **Check Logs**
   ```bash
   # Backend
   python manage.py runserver (watch output)
   
   # Frontend
   npm run dev (watch output)
   
   # Docker
   docker-compose logs -f
   ```

3. **Check Network (F12 → Network tab)**
   - Look at API requests
   - Check response codes
   - Check response data

4. **Restart Everything**
   ```bash
   # Kill backend
   Ctrl+C
   
   # Kill frontend
   Ctrl+C
   
   # Start again
   python manage.py runserver &
   npm run dev
   ```

5. **Ask for Help**
   - Show browser console errors
   - Show terminal output
   - Show API response in Network tab
   - Describe exact steps to reproduce

---

## Getting Help

1. **Read documentation**
   - [README.md](./README.md)
   - [API_REFERENCE.md](./API_REFERENCE.md)
   - [FEATURES.md](./FEATURES.md)

2. **Check logs**
   - Browser console (F12)
   - Terminal output
   - Docker logs

3. **Search issues**
   - Common error messages
   - Stack Overflow
   - Django/React docs

4. **Try solutions**
   - Restart services
   - Clear cache
   - Reinstall dependencies
   - Check environment variables

---

**Common Issues Resolved?** No? Create an issue on GitHub with:
- Exact error message
- Steps to reproduce
- System info (OS, Python version, Node version)
- Logs (console & terminal output)
