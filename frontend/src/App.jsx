import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { Toast } from './components/Toast'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import Navigation from './components/Navigation'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TasksList from './pages/TasksList'
import TaskDetail from './pages/TaskDetail'
import TeamCreate from './pages/TeamCreate'
import TeamDetail from './pages/TeamDetail'
import TeamsList from './pages/TeamsList'
import ProjectCreate from './pages/ProjectCreate'
import ProjectDetail from './pages/ProjectDetail'
import ProjectsList from './pages/ProjectsList'
import TaskCreate from './pages/TaskCreate'

import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toast />
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            <Route path="/" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/teams" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <TeamsList />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/teams/new" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <TeamCreate />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/teams/:id" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <TeamDetail />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <ProjectsList />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/projects/new" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <ProjectCreate />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <ProjectDetail />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/tasks" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <TasksList />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/tasks/new" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <TaskCreate />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/tasks/:id" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="app-main">
                    <TaskDetail />
                  </main>
                </div>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
