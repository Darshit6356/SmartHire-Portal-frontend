"use client"

import { createContext, useContext, useState, useEffect } from "react"

const JobContext = createContext()

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider")
  }
  return context
}

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    // Initialize with mock data
    const mockJobs = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Corp",
        location: "Remote",
        salary: "$70,000 - $90,000",
        description:
          "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-facing features using React, JavaScript, and modern web technologies.",
        requirements: [
          "3+ years of React experience",
          "Proficiency in JavaScript, HTML, CSS",
          "Experience with Git and version control",
          "Knowledge of responsive design",
        ],
        skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
        postedBy: "hiring-manager@techcorp.com",
        postedDate: new Date().toISOString(),
        applicants: [],
      },
      {
        id: 2,
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        salary: "$80,000 - $120,000",
        description:
          "Join our dynamic startup as a Full Stack Developer. Work on cutting-edge projects using Node.js, React, and MongoDB.",
        requirements: [
          "5+ years of full-stack experience",
          "Proficiency in Node.js and React",
          "Database experience (MongoDB preferred)",
          "API development experience",
        ],
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        postedBy: "hr@startupxyz.com",
        postedDate: new Date().toISOString(),
        applicants: [],
      },
    ]

    const storedJobs = localStorage.getItem("jobs")
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs))
    } else {
      setJobs(mockJobs)
      localStorage.setItem("jobs", JSON.stringify(mockJobs))
    }

    const storedApplications = localStorage.getItem("applications")
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications))
    }
  }, [])

  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now(),
      postedDate: new Date().toISOString(),
      applicants: [],
    }
    const updatedJobs = [...jobs, newJob]
    setJobs(updatedJobs)
    localStorage.setItem("jobs", JSON.stringify(updatedJobs))
  }

  const applyToJob = (jobId, applicationData) => {
    const application = {
      id: Date.now(),
      jobId,
      ...applicationData,
      appliedDate: new Date().toISOString(),
      status: "pending",
    }

    const updatedApplications = [...applications, application]
    setApplications(updatedApplications)
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    // Add applicant to job
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, applicants: [...job.applicants, application] } : job,
    )
    setJobs(updatedJobs)
    localStorage.setItem("jobs", JSON.stringify(updatedJobs))

    // Automatically send follow-up email to applicant
    sendFollowUpEmail(applicationData, jobId)
  }

  const sendFollowUpEmail = (applicationData, jobId) => {
    const job = jobs.find((j) => j.id === jobId)

    // Simulate sending follow-up email
    console.log(`📧 Follow-up email sent to ${applicationData.userEmail}`)
    console.log(`Subject: Application Received - ${job?.title}`)
    console.log(
      `Message: Thank you for applying to ${job?.title} at ${job?.company}. We have received your application and will review it shortly.`,
    )

    // Show toast notification
    if (typeof window !== "undefined" && window.showToast) {
      window.showToast(`📧 Confirmation email sent to ${applicationData.userEmail}`, "success")
    }

    // In a real application, this would call an email service
  }

  const getJobById = (jobId) => {
    return jobs.find((job) => job.id === Number.parseInt(jobId))
  }

  const getApplicationsByUser = (userId) => {
    return applications.filter((app) => app.userId === userId)
  }

  const getJobsByHiringManager = (email) => {
    return jobs.filter((job) => job.postedBy === email)
  }

  const updateApplicationStatus = (applicationId, status) => {
    const updatedApplications = applications.map((app) => (app.id === applicationId ? { ...app, status } : app))
    setApplications(updatedApplications)
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    // Update job applicants as well
    const updatedJobs = jobs.map((job) => ({
      ...job,
      applicants: job.applicants.map((applicant) =>
        applicant.id === applicationId ? { ...applicant, status } : applicant,
      ),
    }))
    setJobs(updatedJobs)
    localStorage.setItem("jobs", JSON.stringify(updatedJobs))

    // Automatically send status update email
    const application = updatedApplications.find((app) => app.id === applicationId)
    if (application) {
      sendStatusUpdateEmail(application, status)
    }
  }

  const sendStatusUpdateEmail = (application, status) => {
    const job = jobs.find((j) => j.id === application.jobId)

    let subject = ""
    let message = ""
    let emailType = ""

    switch (status) {
      case "interview":
        subject = `Interview Invitation - ${job?.title}`
        emailType = "Interview invitation"
        message = `Dear ${application.userName},

Thank you for your interest in the ${job?.title} position at ${job?.company}. We were impressed with your application and would like to invite you for an interview.

Interview Details:
- Position: ${job?.title}
- Company: ${job?.company}
- Next Steps: Our HR team will contact you within 2 business days to schedule the interview

Please keep an eye on your email and phone for further communication.

Best regards,
${job?.company} Hiring Team`
        break

      case "accepted":
        subject = `Congratulations! Job Offer - ${job?.title}`
        emailType = "Job offer"
        message = `Dear ${application.userName},

Congratulations! We are pleased to offer you the position of ${job?.title} at ${job?.company}.

Position Details:
- Job Title: ${job?.title}
- Company: ${job?.company}
- Salary: ${job?.salary}
- Location: ${job?.location}

Our HR team will contact you within 1 business day with the detailed offer letter and next steps.

We look forward to welcoming you to our team!

Best regards,
${job?.company} Hiring Team`
        break

      case "rejected":
        subject = `Application Update - ${job?.title}`
        emailType = "Application rejection"
        message = `Dear ${application.userName},

Thank you for your interest in the ${job?.title} position at ${job?.company} and for taking the time to apply.

After careful consideration of all applications, we have decided to move forward with other candidates whose experience more closely matches our current requirements.

We were impressed with your background and encourage you to apply for future positions that match your skills and experience.

We wish you the best of luck in your job search.

Best regards,
${job?.company} Hiring Team`
        break

      case "pending":
        subject = `Application Status Update - ${job?.title}`
        emailType = "Status update"
        message = `Dear ${application.userName},

Thank you for your application for the ${job?.title} position at ${job?.company}.

Your application is currently under review. We will update you on the status within the next few business days.

Thank you for your patience.

Best regards,
${job?.company} Hiring Team`
        break

      default:
        return
    }

    // Simulate sending email
    console.log(`📧 Status update email sent to ${application.userEmail}`)
    console.log(`Subject: ${subject}`)
    console.log(`Message: ${message}`)

    // Show toast notification
    if (typeof window !== "undefined" && window.showToast) {
      window.showToast(`📧 ${emailType} email sent to ${application.userName}`, "success")
    }

    // In a real application, this would call an email service
  }

  const value = {
    jobs,
    applications,
    addJob,
    applyToJob,
    getJobById,
    getApplicationsByUser,
    getJobsByHiringManager,
    updateApplicationStatus,
    sendFollowUpEmail,
    sendStatusUpdateEmail,
  }

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}
