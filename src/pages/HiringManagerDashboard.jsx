"use client"

import { useState } from "react"
import DashboardLayout from "../components/layout/DashboardLayout"
import JobManagement from "../components/hiring-manager/JobManagement"
import AddJobForm from "../components/hiring-manager/AddJobForm"
import ApplicantsList from "../components/hiring-manager/ApplicantsList"
import { useAuth } from "../contexts/AuthContext"

const HiringManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs")
  const [selectedJob, setSelectedJob] = useState(null)
  const { user } = useAuth()

  const tabs = [
    { id: "jobs", label: "My Job Posts" },
    { id: "add-job", label: "Post New Job" },
    { id: "applicants", label: "Applicants" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "jobs":
        return selectedJob ? (
          <ApplicantsList job={selectedJob} onBack={() => setSelectedJob(null)} />
        ) : (
          <JobManagement onSelectJob={setSelectedJob} />
        )
      case "add-job":
        return <AddJobForm onJobAdded={() => setActiveTab("jobs")} />
      case "applicants":
        return <ApplicantsList />
      default:
        return <JobManagement onSelectJob={setSelectedJob} />
    }
  }

  return (
    <DashboardLayout
      userRole="hiring-manager"
      userName={user?.name}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  )
}

export default HiringManagerDashboard
