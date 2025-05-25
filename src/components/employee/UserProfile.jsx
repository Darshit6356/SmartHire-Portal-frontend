"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Select from "../ui/Select";
import Badge from "../ui/Badge";

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    dateOfBirth: "",
    gender: "",

    // Professional Information
    experience: "",
    skills: "",
    education: "",
    certifications: "",
    languages: "",

    // Career Information
    currentJobTitle: "",
    currentCompany: "",
    salaryExpectation: {
      min: "",
      max: "",
      currency: "USD",
    },
    availabilityStatus: "available",
    preferredJobType: "full-time",
    preferredLocation: "",

    // Social Links
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    websiteUrl: "",

    // Additional Information
    workAuthorization: "",
    willingToRelocate: false,
    remoteWorkPreference: "hybrid",
    noticePeriod: "",

    // Company Information (for HR managers)
    companyName: "",
    companySize: "",
    industry: "",
    companyWebsite: "",
    companyDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Sync profileData state whenever user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        // Personal Information
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        gender: user.gender || "",

        // Professional Information
        experience: user.experience || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        education: user.education || "",
        certifications: Array.isArray(user.certifications)
          ? user.certifications.join(", ")
          : user.certifications || "",
        languages: Array.isArray(user.languages)
          ? user.languages.join(", ")
          : user.languages || "",

        // Career Information
        currentJobTitle: user.currentJobTitle || "",
        currentCompany: user.currentCompany || "",
        salaryExpectation: {
          min: user.salaryExpectation?.min || "",
          max: user.salaryExpectation?.max || "",
          currency: user.salaryExpectation?.currency || "USD",
        },
        availabilityStatus: user.availabilityStatus || "available",
        preferredJobType: user.preferredJobType || "full-time",
        preferredLocation: user.preferredLocation || "",

        // Social Links
        linkedinUrl: user.socialLinks?.linkedin || "",
        githubUrl: user.socialLinks?.github || "",
        portfolioUrl: user.socialLinks?.portfolio || "",
        websiteUrl: user.socialLinks?.website || "",

        // Additional Information
        workAuthorization: user.workAuthorization || "",
        willingToRelocate: user.willingToRelocate || false,
        remoteWorkPreference: user.remoteWorkPreference || "hybrid",
        noticePeriod: user.noticePeriod || "",

        // Company Information (for HR managers)
        companyName: user.companyName || "",
        companySize: user.companySize || "",
        industry: user.industry || "",
        companyWebsite: user.companyWebsite || "",
        companyDescription: user.companyDescription || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      name === "salaryMin" ||
      name === "salaryMax" ||
      name === "salaryCurrency"
    ) {
      setProfileData({
        ...profileData,
        salaryExpectation: {
          ...profileData.salaryExpectation,
          [name === "salaryMin"
            ? "min"
            : name === "salaryMax"
            ? "max"
            : "currency"]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare data for submission
      const submitData = {
        ...profileData,
        skills: profileData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        certifications: profileData.certifications
          .split(",")
          .map((cert) => cert.trim())
          .filter((cert) => cert),
        languages: profileData.languages
          .split(",")
          .map((lang) => lang.trim())
          .filter((lang) => lang),
        socialLinks: {
          linkedin: profileData.linkedinUrl,
          github: profileData.githubUrl,
          portfolio: profileData.portfolioUrl,
          website: profileData.websiteUrl,
        },
      };

      const result = await updateProfile(submitData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Profile update failed");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("Profile update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompleteness = () => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "location",
      "bio",
      "experience",
      "skills",
    ];
    const filledFields = requiredFields.filter(
      (field) => profileData[field] && profileData[field].trim()
    );
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString()
      : "Not provided";
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Profile Completeness:
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProfileCompleteness()}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {getProfileCompleteness()}%
              </span>
            </div>
            <Badge
              variant={user?.role === "jobseeker" ? "primary" : "secondary"}
            >
              {user?.role === "jobseeker" ? "Job Seeker" : "HR Manager"}
            </Badge>
          </div>
        </div>
        {success && (
          <div className="text-green-700 text-sm px-4 py-2 bg-green-50 border border-green-200 rounded-md">
            Profile updated successfully!
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(user?.createdAt)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(user?.updatedAt)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <Badge
                variant={user?.role === "jobseeker" ? "primary" : "secondary"}
              >
                {user?.role === "jobseeker" ? "Job Seeker" : "HR Manager"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                  { value: "prefer-not-to-say", label: "Prefer not to say" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Location
              </label>
              <Input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                placeholder="City, State, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <Input
                type="text"
                name="languages"
                value={profileData.languages}
                onChange={handleChange}
                placeholder="English, Spanish, French (comma separated)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <TextArea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </div>

        {/* Professional Information - Only for Job Seekers */}
        {user?.role === "jobseeker" && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Job Title
                  </label>
                  <Input
                    type="text"
                    name="currentJobTitle"
                    value={profileData.currentJobTitle}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Company
                  </label>
                  <Input
                    type="text"
                    name="currentCompany"
                    value={profileData.currentCompany}
                    onChange={handleChange}
                    placeholder="e.g., Tech Corp Inc."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience
                  </label>
                  <TextArea
                    name="experience"
                    value={profileData.experience}
                    onChange={handleChange}
                    placeholder="Describe your work experience, achievements, and responsibilities..."
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <Input
                    type="text"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Node.js, Python (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <TextArea
                    name="education"
                    value={profileData.education}
                    onChange={handleChange}
                    placeholder="Your educational background, degrees, institutions..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <Input
                    type="text"
                    name="certifications"
                    value={profileData.certifications}
                    onChange={handleChange}
                    placeholder="AWS Certified, Google Cloud, Scrum Master (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Career Preferences */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Career Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <Select
                    name="availabilityStatus"
                    value={profileData.availabilityStatus}
                    onChange={handleChange}
                    options={[
                      { value: "available", label: "Available" },
                      { value: "not-available", label: "Not Available" },
                      { value: "open-to-offers", label: "Open to Offers" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Job Type
                  </label>
                  <Select
                    name="preferredJobType"
                    value={profileData.preferredJobType}
                    onChange={handleChange}
                    options={[
                      { value: "full-time", label: "Full Time" },
                      { value: "part-time", label: "Part Time" },
                      { value: "contract", label: "Contract" },
                      { value: "freelance", label: "Freelance" },
                      { value: "internship", label: "Internship" },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remote Work Preference
                  </label>
                  <Select
                    name="remoteWorkPreference"
                    value={profileData.remoteWorkPreference}
                    onChange={handleChange}
                    options={[
                      { value: "remote", label: "Fully Remote" },
                      { value: "hybrid", label: "Hybrid" },
                      { value: "onsite", label: "On-site Only" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Period
                  </label>
                  <Input
                    type="text"
                    name="noticePeriod"
                    value={profileData.noticePeriod}
                    onChange={handleChange}
                    placeholder="e.g., 2 weeks, 1 month, Immediate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Location
                  </label>
                  <Input
                    type="text"
                    name="preferredLocation"
                    value={profileData.preferredLocation}
                    onChange={handleChange}
                    placeholder="City, State or Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Authorization
                  </label>
                  <Input
                    type="text"
                    name="workAuthorization"
                    value={profileData.workAuthorization}
                    onChange={handleChange}
                    placeholder="e.g., US Citizen, H1B, Green Card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Salary ($)
                  </label>
                  <Input
                    type="number"
                    name="salaryMin"
                    value={profileData.salaryExpectation.min}
                    onChange={handleChange}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Salary ($)
                  </label>
                  <Input
                    type="number"
                    name="salaryMax"
                    value={profileData.salaryExpectation.max}
                    onChange={handleChange}
                    placeholder="80000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <Select
                    name="salaryCurrency"
                    value={profileData.salaryExpectation.currency}
                    onChange={handleChange}
                    options={[
                      { value: "USD", label: "USD" },
                      { value: "EUR", label: "EUR" },
                      { value: "GBP", label: "GBP" },
                      { value: "CAD", label: "CAD" },
                    ]}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="willingToRelocate"
                  name="willingToRelocate"
                  checked={profileData.willingToRelocate}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="willingToRelocate"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Willing to relocate for the right opportunity
                </label>
              </div>
            </div>
          </>
        )}

        {/* Company Information - Only for HR Managers */}
        {user?.role === "hrmanager" && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Company Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  type="text"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <Select
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select Company Size" },
                    { value: "1-10", label: "1-10 employees" },
                    { value: "11-50", label: "11-50 employees" },
                    { value: "51-200", label: "51-200 employees" },
                    { value: "201-500", label: "201-500 employees" },
                    { value: "501-1000", label: "501-1000 employees" },
                    { value: "1000+", label: "1000+ employees" },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <Input
                  type="text"
                  name="industry"
                  value={profileData.industry}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <Input
                  type="url"
                  name="companyWebsite"
                  value={profileData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://www.company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <TextArea
                name="companyDescription"
                value={profileData.companyDescription}
                onChange={handleChange}
                placeholder="Describe your company, mission, and values..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Social Links & Portfolio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <Input
                type="url"
                name="linkedinUrl"
                value={profileData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Profile
              </label>
              <Input
                type="url"
                name="githubUrl"
                value={profileData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Website
              </label>
              <Input
                type="url"
                name="portfolioUrl"
                value={profileData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Website
              </label>
              <Input
                type="url"
                name="websiteUrl"
                value={profileData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="submit" loading={loading} className="px-8">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
