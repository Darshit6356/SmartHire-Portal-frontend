"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = login(formData.email, formData.password, formData.role)
      if (!result.success) {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      </div>

      <div>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: "employee", label: "Job Seeker" },
            { value: "hiring-manager", label: "Hiring Manager" },
          ]}
        />
      </div>

      {error && <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded-md">{error}</div>}

      <Button type="submit" loading={loading} className="w-full mt-4">
        Login
      </Button>
    </form>
  )
}

export default LoginForm
