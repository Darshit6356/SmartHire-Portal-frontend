"use client"

import { useState } from "react"
import { useJobs } from "../../contexts/JobContext"
import JobCard from "./JobCard"
import SearchBar from "../ui/SearchBar"
import Filter from "../ui/Filter"

const JobList = ({ onSelectJob }) => {
  const { jobs } = useJobs()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())

    const matchesSkill =
      !skillFilter || job.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))

    return matchesSearch && matchesLocation && matchesSkill
  })

  const locations = [...new Set(jobs.map((job) => job.location))]
  const skills = [...new Set(jobs.flatMap((job) => job.skills))]

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Jobs ({filteredJobs.length})</h2>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar placeholder="Search jobs..." value={searchTerm} onChange={setSearchTerm} />
          </div>

          <Filter
            placeholder="Filter by location"
            options={locations}
            value={locationFilter}
            onChange={setLocationFilter}
          />

          <Filter placeholder="Filter by skill" options={skills} value={skillFilter} onChange={setSkillFilter} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} onSelect={() => onSelectJob(job)} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg mb-2">No jobs found matching your criteria.</p>
              <p>Try adjusting your search filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList
