"use client";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const JobCard = ({ job, onSelect }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (salary?.min && salary?.max) {
      return `Rs.${salary.min.toLocaleString()} - Rs.${salary.max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {job.title}
        </h3>
        <p className="text-gray-600 font-medium">{job.company}</p>
      </div>

      <div className="mb-4 space-y-1">
        <p className="text-sm text-gray-600">{job.location}</p>
        <p className="text-sm font-medium text-gray-900">
          {formatSalary(job.salary)}
        </p>
        <p className="text-xs text-gray-500">
          Posted: {formatDate(job.createdAt)}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {job.description.substring(0, 150)}...
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {job.skills?.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary">
            {skill}
          </Badge>
        ))}
        {job.skills?.length > 3 && (
          <span className="text-xs text-gray-500">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={onSelect}>View Details & Apply</Button>
      </div>
    </div>
  );
};

export default JobCard;
