"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useJobs } from "../../contexts/JobContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import TextArea from "../ui/TextArea"
import FileUpload from "../ui/FileUpload"
import Badge from "../ui/Badge"

const JobApplication = ({ job, onBack }) => {
  const { user } = useAuth()
  const { applyToJob } = useJobs()
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    experience: "",
    portfolio: "",
    resume: null,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (file) => {
    setApplicationData({
      ...applicationData,
      resume: file,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await applyToJob(job.id, {
        ...applicationData,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
      })
      setSuccess(true)
    } catch (error) {
      console.error("Application failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-2">
            Your application for {job.title} at {job.company} has been submitted.
          </p>
          <p className="text-gray-600 mb-2">📧 A confirmation email has been sent to your email address.</p>
          <p className="text-gray-600 mb-6">You will be notified about any status updates via email.</p>
          <Button onClick={onBack}>Back to Job Listings</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack}>
          ← Back to Jobs
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-1">
            {job.company} • {job.location}
          </p>
          <p className="font-medium text-gray-900">{job.salary}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
          <ul className="list-disc list-inside space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-gray-700">
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="primary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Details</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
            <TextArea
              name="coverLetter"
              placeholder="Tell us why you're perfect for this role..."
              value={applicationData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience</label>
            <TextArea
              name="experience"
              placeholder="Describe your relevant work experience..."
              value={applicationData.experience}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/LinkedIn URL</label>
            <Input
              type="url"
              name="portfolio"
              placeholder="https://your-portfolio.com"
              value={applicationData.portfolio}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume *</label>
            <FileUpload accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button type="submit" loading={loading}>
              Submit Application
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default JobApplication
