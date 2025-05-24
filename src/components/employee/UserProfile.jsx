"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import TextArea from "../ui/TextArea"

const UserProfile = () => {
  const { user, updateProfile } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    experience: user?.experience || "",
    skills: user?.skills || "",
    education: user?.education || "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(profileData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Profile update failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        {success && (
          <div className="text-green-700 text-sm px-4 py-2 bg-green-50 border border-green-200 rounded-md">
            Profile updated successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input type="text" name="name" value={profileData.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input type="email" name="email" value={profileData.email} onChange={handleChange} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <Input type="tel" name="phone" value={profileData.phone} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input type="text" name="location" value={profileData.location} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <TextArea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Professional Information
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
              <TextArea
                name="experience"
                value={profileData.experience}
                onChange={handleChange}
                placeholder="Describe your work experience..."
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <Input
                type="text"
                name="skills"
                value={profileData.skills}
                onChange={handleChange}
                placeholder="e.g., React, JavaScript, Node.js (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <TextArea
                name="education"
                value={profileData.education}
                onChange={handleChange}
                placeholder="Your educational background..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="submit" loading={loading}>
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserProfile
