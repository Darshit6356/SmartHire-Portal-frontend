"use client"
import { useAuth } from "../../contexts/AuthContext"
import { useJobs } from "../../contexts/JobContext"
import Badge from "../ui/Badge"

const MyApplications = () => {
  const { user } = useAuth()
  const { getApplicationsByUser, jobs } = useJobs()

  const applications = getApplicationsByUser(user.id)

  const getJobDetails = (jobId) => {
    return jobs.find((job) => job.id === jobId)
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Applications</h2>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">You haven't applied to any jobs yet.</p>
            <p>Start browsing available positions to find your next opportunity!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = getJobDetails(application.jobId)
            return (
              <div key={application.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job?.title}</h3>
                    <p className="text-gray-600 font-medium">{job?.company}</p>
                    <p className="text-sm text-gray-500">{job?.location}</p>
                  </div>
                  <Badge variant={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Applied:</span> {formatDate(application.appliedDate)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Salary:</span> {job?.salary}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-sm text-gray-700 italic">"{application.coverLetter.substring(0, 200)}..."</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyApplications
