"use client";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useJobs } from "../../contexts/JobContext";
import JobPostCard from "./JobPostCard";

const JobManagement = ({ onSelectJob }) => {
  const { user } = useAuth();
  const { myJobs, fetchMyJobs, loading } = useJobs();

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-600">Loading your jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Job Posts</h2>
        <p className="text-gray-600">
          Manage your job postings and view applicants
        </p>
      </div>

      {myJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">You haven't posted any jobs yet.</p>
            <p>
              Create your first job posting to start receiving applications!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {myJobs.map((job) => (
            <JobPostCard
              key={job._id}
              job={job}
              onSelect={() => onSelectJob(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
