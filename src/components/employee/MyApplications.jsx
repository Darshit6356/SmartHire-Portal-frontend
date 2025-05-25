"use client";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useJobs } from "../../contexts/JobContext";
import Badge from "../ui/Badge";

const MyApplications = () => {
  const { user } = useAuth();
  const { applications = [], fetchMyApplications, loading } = useJobs();

  useEffect(() => {
    if (user) {
      fetchMyApplications();
    }
  }, [user]);

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
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const formatSalary = (salary) => {
    if (salary?.min && salary?.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  if (loading) {
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          My Applications
        </h2>
        <p className="text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      {applications?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">You haven't applied to any jobs yet.</p>
            <p>
              Start browsing available positions to find your next opportunity!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = application?.jobId || {};
            const status = application?.status || "unknown";
            const matchScore = application?.matchScore;
            const coverLetter = application?.coverLetter || "";

            return (
              <div
                key={application?._id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job?.title || "Job Title Unavailable"}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {job?.company || "Company Name Missing"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {job?.location || "Location not specified"}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Applied:</span>{" "}
                    {formatDate(application?.appliedAt)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Salary:</span>{" "}
                    {formatSalary(job?.salary)}
                  </p>
                  {matchScore !== undefined && (
                    <p className="text-gray-600">
                      <span className="font-medium">Match Score:</span>{" "}
                      {Math.round(matchScore * 100)}%
                    </p>
                  )}
                </div>

                {coverLetter && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700 italic">
                      "{coverLetter.substring(0, 200)}..."
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
