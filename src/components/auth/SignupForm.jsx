"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const result = signup(formData.email, formData.password, formData.role, formData.name)
      if (!result.success) {
        setError("Signup failed")
      }
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
      </div>

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
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
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
        Sign Up
      </Button>
    </form>
  )
}

export default SignupForm
