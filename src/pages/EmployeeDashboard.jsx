"use client";

import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import JobList from "../components/employee/JobList";
import JobApplication from "../components/employee/JobApplication";
import UserProfile from "../components/employee/UserProfile";
import MyApplications from "../components/employee/MyApplications";
import { useAuth } from "../contexts/AuthContext";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useAuth();

  const tabs = [
    { id: "jobs", label: "Available Jobs" },
    { id: "applications", label: "My Applications" },
    { id: "profile", label: "Profile" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "jobs":
        return selectedJob ? (
          <JobApplication
            job={selectedJob}
            onBack={() => setSelectedJob(null)}
          />
        ) : (
          <JobList onSelectJob={setSelectedJob} />
        );
      case "applications":
        return <MyApplications />;
      case "profile":
        return <UserProfile />;
      default:
        return <JobList onSelectJob={setSelectedJob} />;
    }
  };

  return (
    <DashboardLayout
      userRole="jobseeker"
      userName={user?.name}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
