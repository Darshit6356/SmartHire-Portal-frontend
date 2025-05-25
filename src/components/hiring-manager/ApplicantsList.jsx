"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useJobs } from "../../contexts/JobContext";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import AIResumeFilter from "./AIResumeFilter";

const ApplicantsList = ({ job, onBack }) => {
  const { user } = useAuth();
  const { getJobApplications, updateApplicationStatus, matchCandidates } =
    useJobs();
  const [applications, setApplications] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showAIFilter, setShowAIFilter] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      loadApplications();
    }
  }, [job]);

  const loadApplications = async () => {
    if (!job) return;

    setLoading(true);
    try {
      const response = await getJobApplications(job._id);
      setApplications(response.applications || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setStatusUpdateLoading((prev) => ({ ...prev, [applicationId]: true }));

    try {
      const result = await updateApplicationStatus(applicationId, newStatus);
      if (result.success) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        const applicant = applications.find((app) => app._id === applicationId);
        console.log(
          `✅ Status updated to "${newStatus}" and email sent to ${applicant?.candidateEmail}`
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setStatusUpdateLoading((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleAIFilter = async () => {
    if (!job) return;

    setLoading(true);
    try {
      const response = await matchCandidates(job._id);
      setAiResults(response.matches || []);
      setShowAIFilter(true);
    } catch (error) {
      console.error("AI filtering failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "hired":
      case "shortlisted":
        return "success";
      case "rejected":
        return "danger";
      case "reviewed":
        return "info";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && applications.length === 0) {
    return (
      <div className="max-w-6xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-600">Loading applications...</span>
        </div>
      </div>
    );
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
          <h2 className="text-2xl font-bold text-gray-900">
            {job ? `Applicants for ${job.title}` : "All Applicants"}
          </h2>
        </div>

        {job && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleAIFilter}
              loading={loading}
            >
              🤖 AI Filter Resumes
            </Button>
          </div>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No applications received yet.</p>
            <p>Share your job postings to start receiving applications!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {application.candidateName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {application.candidateEmail}
                  </p>
                  {application.matchScore && (
                    <p className="text-blue-600 text-sm font-medium">
                      Match Score: {Math.round(application.matchScore * 100)}%
                    </p>
                  )}
                </div>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </Badge>
              </div>

              <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Applied:</span>{" "}
                  {formatDate(application.appliedAt)}
                </p>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Cover Letter:
                </p>
                <p className="text-sm text-gray-600 italic">
                  "{application.coverLetter?.substring(0, 150)}..."
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  size="sm"
                  onClick={() => setSelectedApplicant(application)}
                >
                  View Details
                </Button>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <div className="relative">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleStatusUpdate(application._id, e.target.value)
                      }
                      disabled={statusUpdateLoading[application._id]}
                      className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                    {statusUpdateLoading[application._id] && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {statusUpdateLoading[application._id] && (
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
        <Modal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          title="Applicant Details"
        >
          <div className="max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedApplicant.candidateName}
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {selectedApplicant.candidateEmail}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Applied:</span>{" "}
                {formatDate(selectedApplicant.appliedAt)}
              </p>
              {selectedApplicant.matchScore && (
                <p className="text-gray-600">
                  <span className="font-medium">AI Match Score:</span>{" "}
                  {Math.round(selectedApplicant.matchScore * 100)}%
                </p>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                <p className="text-gray-700">{selectedApplicant.coverLetter}</p>
              </div>

              {selectedApplicant.resumeText && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Resume Summary
                  </h4>
                  <p className="text-gray-700">
                    {selectedApplicant.resumeText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {showAIFilter && (
        <AIResumeFilter
          job={job}
          applicants={aiResults}
          onClose={() => setShowAIFilter(false)}
        />
      )}
    </div>
  );
};

export default ApplicantsList;
