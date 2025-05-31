// src/components/JobCard.jsx
"use client"
import { BookmarkIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import {
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"

const JobCard = ({ job, onApply, isSaved, onToggleSave }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">{job.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
              {job.company}
            </p>
            {job.source && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  job.source === "LinkedIn"
                    ? "bg-blue-100 text-blue-800"
                    : job.source === "Unstop"
                      ? "bg-orange-100 text-orange-800"
                      : job.source === "Indeed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.source}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => onToggleSave && onToggleSave(job._id)} className="text-purple-600 hover:text-purple-800">
          {isSaved ? <BookmarkSolidIcon className="h-6 w-6" /> : <BookmarkIcon className="h-6 w-6" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1" />
          {job.location || "Remote"}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <BriefcaseIcon className="h-4 w-4 mr-1" />
          {job.type || "Full-time"}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-1" />
          {new Date(job.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
          {job.salary || "Not specified"}
        </div>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 5).map((skill) => (
              <span key={skill} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="mr-3">{job.views || 0} views</span>
          <span>{job.applications || 0} applications</span>
        </div>
        <button
          onClick={() => onApply(job._id, job.applicationLink)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Apply
          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

export default JobCard
