"use client";

import { useState, useEffect } from "react";
import { useJobs } from "../../contexts/JobContext";
import JobCard from "./JobCard";
import SearchBar from "../ui/SearchBar";
import Filter from "../ui/Filter";

const JobList = ({ onSelectJob }) => {
  const { jobs, fetchJobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter, skillFilter]);

  const loadJobs = async () => {
    await fetchJobs();
  };

  const filterJobs = () => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesSkill =
        !skillFilter ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        );

      return matchesSearch && matchesLocation && matchesSkill;
    });

    setFilteredJobs(filtered);
  };

  const locations = [...new Set(jobs.map((job) => job.location))];
  const skills = [...new Set(jobs.flatMap((job) => job.skills || []))];

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Available Jobs ({filteredJobs.length})
        </h2>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          <Filter
            placeholder="Filter by location"
            options={locations}
            value={locationFilter}
            onChange={setLocationFilter}
          />

          <Filter
            placeholder="Filter by skill"
            options={skills}
            value={skillFilter}
            onChange={setSkillFilter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onSelect={() => onSelectJob(job)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg mb-2">
                No jobs found matching your criteria.
              </p>
              <p>Try adjusting your search filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
