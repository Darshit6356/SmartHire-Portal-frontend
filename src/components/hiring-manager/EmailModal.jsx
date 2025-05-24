"use client"

import { useState } from "react"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Input from "../ui/Input"
import TextArea from "../ui/TextArea"
import Select from "../ui/Select"

const EmailModal = ({ recipient, onClose }) => {
  const [emailData, setEmailData] = useState({
    to: recipient?.userEmail || "",
    subject: "",
    message: "",
    template: "",
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const emailTemplates = {
    interview: {
      subject: "Interview Invitation - [Job Title]",
      message: `Dear ${recipient?.userName || "Candidate"},

Thank you for your interest in the [Job Title] position. We were impressed with your application and would like to invite you for an interview.

Interview Details:
- Date: [Please suggest your availability]
- Duration: 45 minutes
- Format: Video call / In-person

Please reply with your availability for the coming week.

Best regards,
[Your Name]`,
    },
    rejection: {
      subject: "Application Update - [Job Title]",
      message: `Dear ${recipient?.userName || "Candidate"},

Thank you for your interest in the [Job Title] position and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We appreciate your interest in our company and encourage you to apply for future positions that match your skills.

Best wishes for your job search.

Best regards,
[Your Name]`,
    },
    followup: {
      subject: "Following up on your application - [Job Title]",
      message: `Dear ${recipient?.userName || "Candidate"},

Thank you for applying for the [Job Title] position. We wanted to update you on the status of your application.

We are currently reviewing all applications and will be in touch within the next [timeframe] with next steps.

We appreciate your patience during this process.

Best regards,
[Your Name]`,
    },
  }

  const handleTemplateChange = (templateKey) => {
    if (templateKey && emailTemplates[templateKey]) {
      setEmailData({
        ...emailData,
        template: templateKey,
        subject: emailTemplates[templateKey].subject,
        message: emailTemplates[templateKey].message,
      })
    }
  }

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setSent(true)
      setLoading(false)
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1000)
  }

  if (sent) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Email Sent">
        <div className="text-center py-8">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Email sent successfully!</h3>
          <p className="text-gray-600">Your email has been sent to {recipient?.userName}</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Send Email" size="large">
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
          <Select
            name="template"
            value={emailData.template}
            onChange={(e) => handleTemplateChange(e.target.value)}
            options={[
              { value: "", label: "Choose a template..." },
              { value: "interview", label: "Interview Invitation" },
              { value: "rejection", label: "Application Rejection" },
              { value: "followup", label: "Follow-up Email" },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <Input type="email" name="to" value={emailData.to} onChange={handleChange} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <Input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            placeholder="Email subject"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <TextArea
            name="message"
            value={emailData.message}
            onChange={handleChange}
            placeholder="Type your message here..."
            rows={12}
            required
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Send Email
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EmailModal
