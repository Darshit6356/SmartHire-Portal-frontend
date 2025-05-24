"use client"

import { useState, useEffect } from "react"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Badge from "../ui/Badge"

const AIResumeFilter = ({ job, applicants, onClose }) => {
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const results = performAIFiltering(applicants, job)
      setFilteredResults(results)
      setLoading(false)
    }, 2000)
  }, [applicants, job])

  const performAIFiltering = (applicants, job) => {
    return applicants
      .map((applicant) => {
        let score = 0
        const reasons = []

        const coverLetter = applicant.coverLetter.toLowerCase()
        const jobSkills = job.skills.map((skill) => skill.toLowerCase())

        jobSkills.forEach((skill) => {
          if (coverLetter.includes(skill)) {
            score += 20
            reasons.push(`Mentions ${skill} in cover letter`)
          }
        })

        if (applicant.experience) {
          const experience = applicant.experience.toLowerCase()
          jobSkills.forEach((skill) => {
            if (experience.includes(skill)) {
              score += 15
              reasons.push(`Has experience with ${skill}`)
            }
          })
        }

        if (applicant.portfolio) {
          score += 10
          reasons.push("Has portfolio/LinkedIn profile")
        }

        if (applicant.coverLetter.length > 200) {
          score += 5
          reasons.push("Detailed cover letter")
        }

        const randomBonus = Math.floor(Math.random() * 20)
        score += randomBonus

        return {
          ...applicant,
          aiScore: Math.min(score, 100),
          matchReasons: reasons,
          recommendation: score >= 60 ? "Strong Match" : score >= 40 ? "Good Match" : "Weak Match",
        }
      })
      .sort((a, b) => b.aiScore - a.aiScore)
  }

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case "Strong Match":
        return "success"
      case "Good Match":
        return "warning"
      case "Weak Match":
        return "danger"
      default:
        return "secondary"
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="AI Resume Filter Results" size="large">
      <div className="max-h-96 overflow-y-auto">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis for: {job.title}</h3>
          <p className="text-gray-600">Candidates ranked by relevance to job requirements</p>

          {loading && (
            <div className="py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">🤖 AI is analyzing resumes and cover letters...</p>
              <p className="text-gray-500 text-sm">Checking for relevant skills, experience, and qualifications...</p>
            </div>
          )}
        </div>

        {!loading && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredResults.length}</div>
                <div className="text-xs text-gray-500 uppercase font-medium">Applicants Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredResults.filter((r) => r.recommendation === "Strong Match").length}
                </div>
                <div className="text-xs text-gray-500 uppercase font-medium">Strong Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredResults.filter((r) => r.recommendation === "Good Match").length}
                </div>
                <div className="text-xs text-gray-500 uppercase font-medium">Good Matches</div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{result.userName}</h4>
                      <p className="text-sm text-gray-600">{result.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{result.aiScore}%</div>
                        <div className="text-xs text-gray-500 uppercase font-medium">Match Score</div>
                      </div>
                      <Badge variant={getRecommendationColor(result.recommendation)}>{result.recommendation}</Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Why this candidate matches:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.matchReasons.length > 0 ? (
                        result.matchReasons.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {reason}
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          Limited matching criteria found
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Cover Letter Preview:</h5>
                    <p className="text-sm text-gray-600 italic">"{result.coverLetter.substring(0, 200)}..."</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <Button onClick={onClose}>Close Analysis</Button>
        </div>
      </div>
    </Modal>
  )
}

export default AIResumeFilter
