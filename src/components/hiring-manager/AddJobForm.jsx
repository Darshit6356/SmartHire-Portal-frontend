"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useJobs } from "../../contexts/JobContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Select from "../ui/Select";

const AddJobForm = ({ onJobAdded }) => {
  const { user } = useAuth();
  const { addJob } = useJobs();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: "",
      max: "",
      currency: "USD",
    },
    description: "",
    requirements: "",
    skills: "",
    benefits: "",
    applicationDeadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "salaryMin" || name === "salaryMax") {
      setFormData({
        ...formData,
        salary: {
          ...formData.salary,
          [name === "salaryMin" ? "min" : "max"]: parseInt(value) || "",
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements
          .split("\n")
          .filter((req) => req.trim()),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        benefits: formData.benefits
          .split(",")
          .map((benefit) => benefit.trim())
          .filter((benefit) => benefit),
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline)
          : null,
      };

      const result = await addJob(jobData);
      if (result.success) {
        onJobAdded();
      } else {
        setError(result.error || "Failed to create job");
      }
    } catch (error) {
      console.error("Failed to add job:", error);
      setError("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Post a New Job
        </h2>
        <p className="text-gray-600">
          Fill in the details to create a new job posting
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA or Remote"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <Select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={[
                  { value: "full-time", label: "Full Time" },
                  { value: "part-time", label: "Part Time" },
                  { value: "contract", label: "Contract" },
                  { value: "internship", label: "Internship" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <Select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                options={[
                  { value: "entry", label: "Entry Level" },
                  { value: "mid", label: "Mid Level" },
                  { value: "senior", label: "Senior Level" },
                  { value: "executive", label: "Executive" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Salary
              </label>
              <Input
                type="number"
                name="salaryMin"
                value={formData.salary.min}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Salary
              </label>
              <Input
                type="number"
                name="salaryMax"
                value={formData.salary.max}
                onChange={handleChange}
                placeholder="80000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <Input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Job Details
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements *
              </label>
              <TextArea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List each requirement on a new line:&#10;3+ years of React experience&#10;Strong JavaScript skills&#10;Experience with Git"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills *
              </label>
              <Input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, TypeScript, Node.js (comma separated)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <Input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Health insurance, 401k, Remote work (comma separated)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="submit" loading={loading}>
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddJobForm;
