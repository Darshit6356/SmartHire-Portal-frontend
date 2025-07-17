"use client";

import { createContext, useContext, useState } from "react";
import apiService from "../services/api";

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all jobs (public)
  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getJobs(params);
      setJobs(response.jobs || []);
      return response;
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my applications (job seeker)
  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyApplications();
      // console.log("🔍 API response:", response);
      setApplications(response.applications || []);
      return response;
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my jobs (HR manager)
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyJobs();
      setMyJobs(response.jobs || []);
      return response;
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch my jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new job (HR manager)
  const addJob = async (jobData) => {
    try {
      setLoading(true);
      const response = await apiService.createJob(jobData);
      await fetchMyJobs(); // Refresh the list
      return { success: true, job: response.job };
    } catch (error) {
      setError(error.message);
      console.error("Failed to add job:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Apply to job (job seeker)
  const applyToJob = async (jobId, applicationData) => {
    try {
      setLoading(true);
      const response = await apiService.applyToJob({
        jobId,
        ...applicationData,
      });
      await fetchMyApplications(); // Refresh applications
      return { success: true, application: response.application };
    } catch (error) {
      setError(error.message);
      console.error("Failed to apply to job:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get job by ID
  const getJobById = async (jobId) => {
    try {
      const response = await apiService.getJobById(jobId);
      return response;
    } catch (error) {
      console.error("Failed to get job:", error);
      return null;
    }
  };

  // Get applications for a job (HR manager)
  const getJobApplications = async (jobId) => {
    try {
      const response = await apiService.getJobApplications(jobId);
      return response;
    } catch (error) {
      console.error("Failed to get job applications:", error);
      return { applications: [] };
    }
  };

  // Update application status (HR manager)
  const updateApplicationStatus = async (applicationId, status, notes = "") => {
    try {
      const response = await apiService.updateApplicationStatus(
        applicationId,
        status,
        notes
      );
      return { success: true, application: response.application };
    } catch (error) {
      console.error("Failed to update application status:", error);
      return { success: false, error: error.message };
    }
  };

  // Upload resume
  const uploadResume = async (formData) => {
    try {
      setLoading(true);
      const response = await apiService.uploadResume(formData);
      return { success: true, candidate: response.candidate };
    } catch (error) {
      setError(error.message);
      console.error("Failed to upload resume:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Match candidates (HR manager)
  const matchCandidates = async (jobId) => {
    try {
      setLoading(true);
      const response = await apiService.matchCandidates(jobId);
      return response;
    } catch (error) {
      console.error("Failed to match candidates:", error);
      return { matches: [] };
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for backward compatibility
  const getApplicationsByUser = (userId) => {
    return applications;
  };

  const getJobsByHiringManager = (email) => {
    return myJobs;
  };

  const value = {
    jobs,
    applications,
    myJobs,
    loading,
    error,
    fetchJobs,
    fetchMyApplications,
    fetchMyJobs,
    addJob,
    applyToJob,
    getJobById,
    getJobApplications,
    updateApplicationStatus,
    uploadResume,
    matchCandidates,
    getApplicationsByUser,
    getJobsByHiringManager,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
