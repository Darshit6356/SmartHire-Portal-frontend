"use client"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../ui/Button"

const Header = ({ userName, userRole }) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Agent-AI</h1>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {userRole === "employee" ? "Job Seeker" : "Hiring Manager"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Welcome, {userName}</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
