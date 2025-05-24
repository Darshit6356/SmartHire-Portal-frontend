"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useJobs } from "../../contexts/JobContext"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Modal from "../ui/Modal"
import AIResumeFilter from "./AIResumeFilter"

const ApplicantsList = ({ job, onBack }) => {
  const { user } = useAuth()
  const { getJobsByHiringManager, updateApplicationStatus } = useJobs()
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [showAIFilter, setShowAIFilter] = useState(false)
  const [filteredApplicants, setFilteredApplicants] = useState([])
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({})

  const jobs = job ? [job] : getJobsByHiringManager(user.email)
  const allApplicants = jobs.flatMap((j) =>
    (j.applicants || []).map((applicant) => ({
      ...applicant,
      jobTitle: j.title,
      jobId: j.id,
    })),
  )

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setStatusUpdateLoading((prev) => ({ ...prev, [applicationId]: true }))

    try {
      // Update status and automatically send email
      updateApplicationStatus(applicationId, newStatus)

      // Show success message
      const applicant = allApplicants.find((app) => app.id === applicationId)
      console.log(`✅ Status updated to "${newStatus}" and email sent to ${applicant?.userEmail}`)

      // In a real app, you might show a toast notification here
      setTimeout(() => {
        setStatusUpdateLoading((prev) => ({ ...prev, [applicationId]: false }))
      }, 1000)
    } catch (error) {
      console.error("Failed to update status:", error)
      setStatusUpdateLoading((prev) => ({ ...prev, [applicationId]: false }))
    }
  }

  const handleAIFilter = (jobForFilter) => {
    setShowAIFilter(true)
    const applicantsForJob = jobForFilter.applicants || []
    setFilteredApplicants(applicantsForJob)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "accepted":
        return "success"
      case "rejected":
        return "danger"
      case "interview":
        return "info"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {job && (
            <Button variant="outline" onClick={onBack}>
              ← Back to Jobs
            </Button>
          )}
          <h2 className="text-2xl font-bold text-gray-900">{job ? `Applicants for ${job.title}` : "All Applicants"}</h2>
        </div>

        {job && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleAIFilter(job)}>
              🤖 AI Filter Resumes
            </Button>
          </div>
        )}
      </div>

      {!job && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">{j.title}</h3>
              <p className="text-gray-600 mb-3">{j.applicants?.length || 0} applicants</p>
              <Button size="sm" onClick={() => handleAIFilter(j)}>
                🤖 AI Filter
              </Button>
            </div>
          ))}
        </div>
      )}

      {allApplicants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No applications received yet.</p>
            <p>Share your job postings to start receiving applications!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allApplicants.map((applicant) => (
            <div key={applicant.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{applicant.userName}</h3>
                  <p className="text-gray-600 text-sm">{applicant.userEmail}</p>
                  {!job && <p className="text-blue-600 text-sm font-medium">Applied for: {applicant.jobTitle}</p>}
                </div>
                <Badge variant={getStatusColor(applicant.status)}>
                  {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </Badge>
              </div>

              <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Applied:</span> {formatDate(applicant.appliedDate)}
                </p>
                {applicant.portfolio && (
                  <p>
                    <span className="font-medium">Portfolio:</span>{" "}
                    <a
                      href={applicant.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Portfolio
                    </a>
                  </p>
                )}
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                <p className="text-sm text-gray-600 italic">"{applicant.coverLetter.substring(0, 150)}..."</p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm" onClick={() => setSelectedApplicant(applicant)}>
                  View Details
                </Button>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <div className="relative">
                    <select
                      value={applicant.status}
                      onChange={(e) => handleStatusUpdate(applicant.id, e.target.value)}
                      disabled={statusUpdateLoading[applicant.id]}
                      className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {statusUpdateLoading[applicant.id] && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {statusUpdateLoading[applicant.id] && (
                <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                  <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Updating status and sending email...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedApplicant && (
        <Modal isOpen={!!selectedApplicant} onClose={() => setSelectedApplicant(null)} title="Applicant Details">
          <div className="max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedApplicant.userName}</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {selectedApplicant.userEmail}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Applied:</span> {formatDate(selectedApplicant.appliedDate)}
              </p>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                <p className="text-gray-700">{selectedApplicant.coverLetter}</p>
              </div>

              {selectedApplicant.experience && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p className="text-gray-700">{selectedApplicant.experience}</p>
                </div>
              )}

              {selectedApplicant.portfolio && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Portfolio</h4>
                  <a
                    href={selectedApplicant.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedApplicant.portfolio}
                  </a>
                </div>
              )}

              {selectedApplicant.resume && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resume</h4>
                  <p className="text-gray-700">Resume file: {selectedApplicant.resume.name}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {showAIFilter && (
        <AIResumeFilter job={job} applicants={filteredApplicants} onClose={() => setShowAIFilter(false)} />
      )}
    </div>
  )
}

export default ApplicantsList
