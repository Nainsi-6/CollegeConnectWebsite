"use client"

import { useState } from "react"
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline"

const JobFilters = ({ filters, setFilters, onSearch, onReset }) => {
  const [skillInput, setSkillInput] = useState("")

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillAdd = () => {
    if (skillInput.trim() !== "" && !filters.skills.includes(skillInput.trim())) {
      setFilters((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const handleSkillRemove = (skillToRemove) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSkillAdd()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 mb-6 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="e.g. Remote, New York"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            placeholder="e.g. Google, Microsoft"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="skillInput" className="text-sm font-medium text-gray-700">
            Skills
          </label>
          <div className="flex">
            <input
              type="text"
              id="skillInput"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill"
              className="border rounded-l-md px-3 py-2 w-full"
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              className="bg-purple-600 text-white px-3 py-2 rounded-r-md hover:bg-purple-700"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="source" className="text-sm font-medium text-gray-700">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">All Sources</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Unstop">Unstop</option>
            <option value="Indeed">Indeed</option>
            <option value="Internal">Internal</option>
          </select>
        </div>
      </div>

      {/* Skills Display */}
      {filters.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.skills.map((skill) => (
            <span
              key={skill}
              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
            >
              {skill}
              <XMarkIcon onClick={() => handleSkillRemove(skill)} className="h-4 w-4 ml-1 cursor-pointer" />
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Reset
        </button>
        <button type="submit" className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">
          Apply Filters
        </button>
      </div>
    </form>
  )
}

export default JobFilters

