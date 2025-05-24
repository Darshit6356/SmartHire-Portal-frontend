"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import HiringManagerDashboard from "./pages/HiringManagerDashboard"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { JobProvider } from "./contexts/JobContext"
import ToastContainer from "./components/ui/ToastContainer"
import "./App.css"

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user.role === "employee" ? "/employee" : "/hiring-manager"} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hiring-manager"
        element={
          <ProtectedRoute requiredRole="hiring-manager">
            <HiringManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? (user?.role === "employee" ? "/employee" : "/hiring-manager") : "/login"}
            replace
          />
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <div className="App">
            <AppRoutes />
            <ToastContainer />
          </div>
        </JobProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
