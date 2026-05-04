# Project Manager Frontend

React-based frontend for Project Management System with role-based access control.

## Setup

### Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:8000/api
```

## Features

- User authentication (Register/Login)
- Dashboard with task overview
- Task management (CRUD operations)
- Project management
- Team management
- Real-time filtering and search
- Responsive design
- Role-based UI

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable components
├── context/          # React context (Auth, Data)
├── pages/            # Page components
├── styles/           # CSS stylesheets
├── App.jsx           # Main App component
└── main.jsx          # Entry point
```

## Technologies

- React 18
- React Router v6
- Axios
- Date-fns
- React Toastify
- Vite

## Docker

```bash
# Development
docker build -f Dockerfile.dev -t project-manager-frontend .
docker run -p 3000:3000 project-manager-frontend

# Production
docker build -f Dockerfile.prod -t project-manager-frontend-prod .
docker run -p 80:80 project-manager-frontend-prod
```

