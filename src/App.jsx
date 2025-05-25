"use client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HiringManagerDashboard from "./pages/HiringManagerDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { JobProvider } from "./contexts/JobContext";
import ToastContainer from "./components/ui/ToastContainer";
import "./App.css";

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to correct dashboard based on user role
    const redirectPath =
      user?.role === "jobseeker" ? "/employee" : "/hiring-manager";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={user?.role === "jobseeker" ? "/employee" : "/hiring-manager"}
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="jobseeker">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hiring-manager"
        element={
          <ProtectedRoute requiredRole="hrmanager">
            <HiringManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? user?.role === "jobseeker"
                  ? "/employee"
                  : "/hiring-manager"
                : "/login"
            }
            replace
          />
        }
      />
      {/* Catch all route */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? user?.role === "jobseeker"
                  ? "/employee"
                  : "/hiring-manager"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
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
  );
}

export default App;
