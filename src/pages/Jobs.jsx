// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "../component/Navbar"
// import {
//   BriefcaseIcon,
//   MapPinIcon,
//   BuildingOfficeIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   ArrowTopRightOnSquareIcon,
//   MagnifyingGlassIcon,
//   AdjustmentsHorizontalIcon,
//   BookmarkIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline"
// import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"

// const Jobs = () => {
//   const navigate = useNavigate()
//   const [jobs, setJobs] = useState([])
//   const [recommendedJobs, setRecommendedJobs] = useState([])
//   const [loading, setLoading] = useState({
//     jobs: true,
//     recommendedJobs: true,
//   })
//   const [filters, setFilters] = useState({
//     search: "",
//     type: "",
//     location: "",
//     company: "",
//     skills: [],
//     source: "",
//   })
//   const [showFilters, setShowFilters] = useState(false)
//   const [savedJobs, setSavedJobs] = useState([])
//   const [activeTab, setActiveTab] = useState("recommended")
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//   })
//   const [error, setError] = useState(null)

//   // Get the token from localStorage
//   const token = localStorage.getItem("token")

//   // Axios config with token
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`, // Adding "Bearer " prefix
//     },
//   }

//   // API base URL
//   const API_BASE_URL = "http://localhost:5005/api"

//   useEffect(() => {
//     if (!token) {
//       navigate("/login")
//       return
//     }

//     // Load saved jobs from localStorage
//     const savedJobsFromStorage = JSON.parse(localStorage.getItem("savedJobs") || "[]")
//     setSavedJobs(savedJobsFromStorage)

//     // Fetch initial data
//     fetchJobs()
//     fetchRecommendedJobs()

//     // Sync external jobs when component mounts
//     syncExternalJobs()
//   }, [token])

//   // Fetch all jobs with pagination and filters
//   const fetchJobs = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, jobs: true }))
//       setError(null)

//       // Build query string from filters
//       const queryParams = new URLSearchParams()
//       if (filters.search) queryParams.append("search", filters.search)
//       if (filters.type) queryParams.append("type", filters.type)
//       if (filters.location) queryParams.append("location", filters.location)
//       if (filters.company) queryParams.append("company", filters.company)
//       if (filters.skills.length > 0) queryParams.append("skills", filters.skills.join(","))
//       if (filters.source) queryParams.append("source", filters.source)
//       queryParams.append("page", pagination.page)
//       queryParams.append("limit", pagination.limit)

//       const response = await axios.get(`${API_BASE_URL}/jobs?${queryParams.toString()}`, config)

//       if (response.data && response.data.success) {
//         setJobs(response.data.jobs || [])
//         setPagination(
//           response.data.pagination || {
//             page: 1,
//             limit: 10,
//             total: 0,
//             pages: 1,
//           },
//         )
//       } else {
//         // Handle unexpected response format
//         setJobs([])
//         toast.error("Invalid response format from server")
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error)
//       setError("Failed to load jobs. Please try again later.")

//       // For development: show sample jobs if API fails
//       setJobs(getSampleJobs())
//     } finally {
//       setLoading((prev) => ({ ...prev, jobs: false }))
//     }
//   }

//   // Fetch recommended jobs
//   const fetchRecommendedJobs = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, recommendedJobs: true }))
//       setError(null)

//       const response = await axios.get(`${API_BASE_URL}/jobs/recommended`, config)

//       if (response.data && response.data.success) {
//         setRecommendedJobs(response.data.jobs || [])
//       } else {
//         setRecommendedJobs([])
//       }
//     } catch (error) {
//       console.error("Error fetching recommended jobs:", error)

//       // For development: show sample recommended jobs if API fails
//       setRecommendedJobs(getSampleRecommendedJobs())
//     } finally {
//       setLoading((prev) => ({ ...prev, recommendedJobs: false }))
//     }
//   }

//   // Add this after the fetchRecommendedJobs function
//   const syncExternalJobs = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, jobs: true }))
//       setError(null)

//       const response = await axios.post(
//         `${API_BASE_URL}/jobs/sync-external`,
//         {
//           sources: ["LinkedIn", "Unstop"],
//         },
//         config,
//       )

//       if (response.data && response.data.success) {
//         toast.success(`Synced ${response.data.newJobsCount} new jobs from external sources`)
//         fetchJobs() // Refresh jobs after sync
//       }
//     } catch (error) {
//       console.error("Error syncing external jobs:", error)
//       toast.error("Failed to sync external jobs")
//     }
//   }

//   // Sample jobs for development/fallback
//   const getSampleJobs = () => {
//     return [
//       {
//         _id: "job1",
//         title: "Frontend Developer",
//         company: "Tech Solutions Inc.",
//         location: "Remote",
//         type: "Full-time",
//         salary: "$80,000 - $100,000",
//         skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
//         createdAt: new Date().toISOString(),
//         views: 45,
//         applications: 12,
//         applicationLink: "https://example.com/apply",
//       },
//       {
//         _id: "job2",
//         title: "Backend Engineer",
//         company: "Data Systems Ltd.",
//         location: "New York, NY",
//         type: "Full-time",
//         salary: "$90,000 - $120,000",
//         skills: ["Node.js", "Express", "MongoDB", "API Design", "AWS"],
//         createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
//         views: 32,
//         applications: 8,
//         applicationLink: "https://example.com/apply",
//       },
//       {
//         _id: "job3",
//         title: "Full Stack Developer",
//         company: "Innovative Apps",
//         location: "San Francisco, CA",
//         type: "Contract",
//         salary: "$60/hr",
//         skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
//         createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
//         views: 67,
//         applications: 23,
//         applicationLink: "https://example.com/apply",
//       },
//     ]
//   }

//   // Sample recommended jobs for development/fallback
//   const getSampleRecommendedJobs = () => {
//     return [
//       {
//         _id: "rec1",
//         title: "Senior React Developer",
//         company: "Web Experts Inc.",
//         location: "Remote",
//         type: "Full-time",
//         salary: "$120,000 - $150,000",
//         skills: ["React", "Next.js", "TypeScript", "GraphQL", "Redux"],
//         createdAt: new Date().toISOString(),
//         views: 78,
//         applications: 34,
//         applicationLink: "https://example.com/apply",
//         relevanceScore: 0.95,
//       },
//       {
//         _id: "rec2",
//         title: "JavaScript Engineer",
//         company: "Software Solutions",
//         location: "Austin, TX",
//         type: "Full-time",
//         salary: "$95,000 - $125,000",
//         skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
//         createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
//         views: 54,
//         applications: 21,
//         applicationLink: "https://example.com/apply",
//         relevanceScore: 0.87,
//       },
//     ]
//   }

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSkillAdd = (skill) => {
//     if (!filters.skills.includes(skill) && skill.trim() !== "") {
//       setFilters((prev) => ({
//         ...prev,
//         skills: [...prev.skills, skill],
//       }))
//     }
//   }

//   const handleSkillRemove = (skillToRemove) => {
//     setFilters((prev) => ({
//       ...prev,
//       skills: prev.skills.filter((skill) => skill !== skillToRemove),
//     }))
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page on new search
//     fetchJobs()
//   }

//   const handleResetFilters = () => {
//     setFilters({
//       search: "",
//       type: "",
//       location: "",
//       company: "",
//       skills: [],
//       source: "",
//     })
//   }

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return
//     setPagination((prev) => ({ ...prev, page: newPage }))
//     fetchJobs()
//   }

//   const toggleSaveJob = (jobId) => {
//     if (savedJobs.includes(jobId)) {
//       // Remove from saved jobs
//       const updatedSavedJobs = savedJobs.filter((id) => id !== jobId)
//       setSavedJobs(updatedSavedJobs)
//       localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
//       toast.success("Job removed from saved jobs")
//     } else {
//       // Add to saved jobs
//       const updatedSavedJobs = [...savedJobs, jobId]
//       setSavedJobs(updatedSavedJobs)
//       localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
//       toast.success("Job saved successfully")
//     }
//   }

//   const handleApplyForJob = async (jobId, applicationLink) => {
//     try {
//       await axios.post(`${API_BASE_URL}/jobs/${jobId}/apply`, {}, config)
//       toast.success("Application recorded!")
//       // Open application link in new tab
//       window.open(applicationLink, "_blank")
//     } catch (error) {
//       console.error("Error applying for job:", error)
//       toast.error("Failed to apply for job, but opening application link")
//       // Still open the link even if tracking fails
//       window.open(applicationLink, "_blank")
//     }
//   }

//   const renderJobCard = (job) => {
//     const isSaved = savedJobs.includes(job._id)

//     return (
//       <div key={job._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h2 className="text-xl font-semibold text-blue-800">{job.title}</h2>
//             <div className="flex items-center gap-2 mt-1">
//               <p className="text-gray-600 flex items-center">
//                 <BuildingOfficeIcon className="h-4 w-4 mr-1" />
//                 {job.company}
//               </p>
//               {job.source && (
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     job.source === "LinkedIn"
//                       ? "bg-blue-100 text-blue-800"
//                       : job.source === "Unstop"
//                         ? "bg-orange-100 text-orange-800"
//                         : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {job.source}
//                 </span>
//               )}
//             </div>
//           </div>
//           <button onClick={() => toggleSaveJob(job._id)} className="text-purple-600 hover:text-purple-800">
//             {isSaved ? <BookmarkSolidIcon className="h-6 w-6" /> : <BookmarkIcon className="h-6 w-6" />}
//           </button>
//         </div>

//         <div className="grid grid-cols-2 gap-2 mb-4">
//           <div className="flex items-center text-sm text-gray-600">
//             <MapPinIcon className="h-4 w-4 mr-1" />
//             {job.location || "Remote"}
//           </div>
//           <div className="flex items-center text-sm text-gray-600">
//             <BriefcaseIcon className="h-4 w-4 mr-1" />
//             {job.type || "Full-time"}
//           </div>
//           <div className="flex items-center text-sm text-gray-600">
//             <ClockIcon className="h-4 w-4 mr-1" />
//             {new Date(job.createdAt).toLocaleDateString()}
//           </div>
//           <div className="flex items-center text-sm text-gray-600">
//             <CurrencyDollarIcon className="h-4 w-4 mr-1" />
//             {job.salary || "Not specified"}
//           </div>
//         </div>

//         {job.skills && job.skills.length > 0 && (
//           <div className="mb-4">
//             <p className="text-sm text-gray-700 mb-2">Skills:</p>
//             <div className="flex flex-wrap gap-1">
//               {job.skills.slice(0, 5).map((skill) => (
//                 <span key={skill} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
//                   {skill}
//                 </span>
//               ))}
//               {job.skills.length > 5 && (
//                 <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                   +{job.skills.length - 5} more
//                 </span>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
//           <div className="text-sm text-gray-600">
//             <span className="mr-3">{job.views || 0} views</span>
//             <span>{job.applications || 0} applications</span>
//           </div>
//           <button
//             onClick={() => handleApplyForJob(job._id, job.applicationLink)}
//             className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//           >
//             Apply <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-200">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-20 pb-10">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">
//             {activeTab === "recommended" ? "Recommended Jobs" : "All Jobs"}
//           </h1>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setActiveTab("recommended")}
//               className={`px-4 py-2 rounded-md font-medium ${
//                 activeTab === "recommended"
//                   ? "bg-blue-600 text-white"
//                   : "bg-white text-blue-600 border border-purple-600"
//               }`}
//             >
//               Recommended
//             </button>
//             <button
//               onClick={() => setActiveTab("all")}
//               className={`px-4 py-2 rounded-md font-medium ${
//                 activeTab === "all" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-600"
//               }`}
//             >
//               All Jobs
//             </button>
//             <button
//               onClick={syncExternalJobs}
//               className="px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
//             >
//               Sync External Jobs
//             </button>
//           </div>
//         </div>

//         {/* Filters Toggle */}
//         <div className="mb-4 flex justify-between items-center">
//           <form onSubmit={handleSearch} className="flex-grow mr-4">
//             <div className="relative">
//               <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 name="search"
//                 placeholder="Search jobs..."
//                 value={filters.search}
//                 onChange={handleFilterChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-purple-400"
//               />
//             </div>
//           </form>
//           <button
//             onClick={() => setShowFilters((prev) => !prev)}
//             className="flex items-center gap-1 text-sm text-purple-600 hover:underline"
//           >
//             <AdjustmentsHorizontalIcon className="h-5 w-5" />
//             Filters
//             {showFilters ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
//           </button>
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 name="type"
//                 value={filters.type}
//                 onChange={handleFilterChange}
//                 placeholder="Job Type"
//                 className="border rounded-md px-3 py-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="location"
//                 value={filters.location}
//                 onChange={handleFilterChange}
//                 placeholder="Location"
//                 className="border rounded-md px-3 py-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="company"
//                 value={filters.company}
//                 onChange={handleFilterChange}
//                 placeholder="Company"
//                 className="border rounded-md px-3 py-2 w-full"
//               />
//               <input
//                 type="text"
//                 placeholder="Add Skill"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault()
//                     handleSkillAdd(e.target.value)
//                     e.target.value = ""
//                   }
//                 }}
//                 className="border rounded-md px-3 py-2 w-full"
//               />
//               <input
//                 type="text"
//                 name="source"
//                 value={filters.source}
//                 onChange={handleFilterChange}
//                 placeholder="Source"
//                 className="border rounded-md px-3 py-2 w-full"
//               />
//             </div>

//             {/* Skills Display */}
//             {filters.skills.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {filters.skills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
//                   >
//                     {skill}
//                     <XMarkIcon onClick={() => handleSkillRemove(skill)} className="h-4 w-4 ml-1 cursor-pointer" />
//                   </span>
//                 ))}
//               </div>
//             )}

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={handleResetFilters}
//                 className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
//             <p>{error}</p>
//             <p className="text-sm mt-1">Using sample data for demonstration.</p>
//           </div>
//         )}

//         {/* Job Listings */}
//         {loading[activeTab === "recommended" ? "recommendedJobs" : "jobs"] ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
//           </div>
//         ) : (
//           <>
//             {(activeTab === "recommended" ? recommendedJobs : jobs).length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-lg shadow">
//                 <div className="mx-auto h-12 w-12 text-gray-400">
//                   <BriefcaseIcon className="h-12 w-12" />
//                 </div>
//                 <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   {activeTab === "recommended"
//                     ? "We don't have any recommended jobs for you yet. Update your profile to get better recommendations."
//                     : "No jobs match your search criteria. Try adjusting your filters."}
//                 </p>
//                 {activeTab === "all" && (
//                   <div className="mt-6">
//                     <button
//                       onClick={handleResetFilters}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
//                     >
//                       Reset Filters
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {(activeTab === "recommended" ? recommendedJobs : jobs).map((job) => renderJobCard(job))}
//               </div>
//             )}
//           </>
//         )}

//         {/* Pagination */}
//         {!loading.jobs && pagination.pages > 1 && activeTab === "all" && (
//           <div className="flex justify-center mt-8 space-x-2">
//             <button
//               onClick={() => handlePageChange(pagination.page - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//               disabled={pagination.page === 1}
//             >
//               Previous
//             </button>
//             <span className="px-3 py-1">
//               {pagination.page} / {pagination.pages}
//             </span>
//             <button
//               onClick={() => handlePageChange(pagination.page + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//               disabled={pagination.page === pagination.pages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Jobs

/////////////////////////////////////////////////////////////////////////////////////////////
// "use client"

// import { useState, useEffect } from "react"
// import { toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// // import JobCard from "../components/JobCard"
// // import JobFilter from "../components/JobFilter"
// // import Pagination from "../components/Pagination"
// import { jobApi } from "../api/services/jobService" // Import the job API service
// import { getSampleJobs, getSampleRecommendedJobs } from "../utils/sampleJobs" // Import sample jobs for development
// import axios from "axios"
// import { API_BASE_URL } from "../config"
// import { useAuth } from "../context/AuthContext"

// const Jobs = () => {
//   const [jobs, setJobs] = useState([])
//   const [recommendedJobs, setRecommendedJobs] = useState([])
//   const [loading, setLoading] = useState({ jobs: true, recommendedJobs: true })
//   const [error, setError] = useState(null)
//   const [filters, setFilters] = useState({
//     search: "",
//     type: "",
//     location: "",
//     company: "",
//     skills: [],
//     source: "",
//   })
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//   })
//   const { token } = useAuth()
//   const [activeTab, setActiveTab] = useState("all")

//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }

//   useEffect(() => {
//     fetchJobs()
//     fetchRecommendedJobs()
//   }, [filters, pagination.page, pagination.limit])

//   const fetchJobs = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, jobs: true }))
//       setError(null)

//       // Build query params from filters
//       const queryParams = {}
//       if (filters.search) queryParams.search = filters.search
//       if (filters.type) queryParams.type = filters.type
//       if (filters.location) queryParams.location = filters.location
//       if (filters.company) queryParams.company = filters.company
//       if (filters.skills.length > 0) queryParams.skills = filters.skills
//       if (filters.source) queryParams.source = filters.source

//       const response = await jobApi.getJobs(queryParams, pagination.page, pagination.limit)

//       if (response.data && response.data.success) {
//         setJobs(response.data.jobs || [])
//         setPagination(
//           response.data.pagination || {
//             page: 1,
//             limit: 10,
//             total: 0,
//             pages: 1,
//           },
//         )
//       } else {
//         // Handle unexpected response format
//         setJobs([])
//         toast.error("Invalid response format from server")
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error)
//       setError("Failed to load jobs. Please try again later.")

//       // For development: show sample jobs if API fails
//       setJobs(getSampleJobs())
//     } finally {
//       setLoading((prev) => ({ ...prev, jobs: false }))
//     }
//   }

//   const syncExternalJobs = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, jobs: true }))
//       setError(null)

//       // Show a loading toast
//       const toastId = toast.info("Syncing jobs from LinkedIn and Unstop...", { autoClose: false })

//       const response = await axios.post(
//         `${API_BASE_URL}/jobs/sync-external`,
//         {
//           sources: ["LinkedIn", "Unstop"],
//         },
//         config,
//       )

//       if (response.data && response.data.success) {
//         // Update the toast with success message
//         toast.update(toastId, {
//           render: `Successfully synced ${response.data.newJobsCount} new jobs from external sources`,
//           type: toast.TYPE.SUCCESS,
//           autoClose: 3000,
//         })

//         // Refresh jobs after sync
//         fetchJobs()
//         fetchRecommendedJobs()
//       } else {
//         toast.update(toastId, {
//           render: "No new jobs found or sync failed",
//           type: toast.TYPE.WARNING,
//           autoClose: 3000,
//         })
//       }
//     } catch (error) {
//       console.error("Error syncing external jobs:", error)
//       toast.error("Failed to sync external jobs. Please try again later.")

//       // For development: show sample jobs if API fails
//       if (jobs.length === 0) {
//         setJobs(getSampleJobs())
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, jobs: false }))
//     }
//   }

//   const handleApplyForJob = async (jobId, applicationLink) => {
//     try {
//       await jobApi.applyForJob(jobId)
//       toast.success("Application recorded!")
//       // Open application link in new tab
//       window.open(applicationLink, "_blank")
//     } catch (error) {
//       console.error("Error applying for job:", error)
//       toast.error("Failed to apply for job, but opening application link")
//       // Still open the link even if tracking fails
//       window.open(applicationLink, "_blank")
//     }
//   }

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters)
//     setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page on filter change
//   }

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, page: newPage }))
//   }

//   const fetchRecommendedJobs = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, recommendedJobs: true }))
//       setError(null)

//       const response = await axios.get(`${API_BASE_URL}/jobs/recommended`, config)

//       if (response.data && response.data.success) {
//         setRecommendedJobs(response.data.jobs || [])
//       } else {
//         setRecommendedJobs([])
//         console.warn("Invalid response format or no recommended jobs found")
//       }
//     } catch (error) {
//       console.error("Error fetching recommended jobs:", error)

//       // Only use sample data if we don't have any data yet
//       if (recommendedJobs.length === 0) {
//         setRecommendedJobs(getSampleRecommendedJobs())
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, recommendedJobs: false }))
//     }
//   }

//   useEffect(() => {
//     if (token && activeTab === "all") {
//       fetchJobs()
//     }
//   }, [filters, pagination.page, pagination.limit, activeTab])

//   const viewJobDetails = async (jobId) => {
//     try {
//       await axios.get(`${API_BASE_URL}/jobs/${jobId}/view`, config)
//       // No need to handle the response as this is just tracking
//     } catch (error) {
//       console.error("Error tracking job view:", error)
//       // Silent fail - don't show error to user as this is just analytics
//     }
//   }

//   return (
//     <div className="container mt-4">
//       <h1>Job Listings</h1>
//       <button onClick={syncExternalJobs} className="btn btn-primary mb-3">
//         Sync External Jobs
//       </button>
//       <JobFilter onFilterChange={handleFilterChange} />
//       {error && <div className="alert alert-danger">{error}</div>}
//       {loading.jobs ? (
//         <p>Loading jobs...</p>
//       ) : (
//         <>
//           <div className="row">
//             {jobs.map((job) => (
//               <div key={job._id} className="col-md-4 mb-3">
//                 <JobCard job={job} onApply={handleApplyForJob} />
//               </div>
//             ))}
//           </div>
//           <Pagination pagination={pagination} onPageChange={handlePageChange} />
//         </>
//       )}

//       <h2>Recommended Jobs</h2>
//       {loading.recommendedJobs ? (
//         <p>Loading recommended jobs...</p>
//       ) : (
//         <div className="row">
//           {recommendedJobs.map((job) => (
//             <div key={job._id} className="col-md-4 mb-3">
//               <JobCard job={job} onApply={handleApplyForJob} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default Jobs

///////////////////////////////////////////////////////////////////////////////////////////

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../component/Navbar"
import JobCard from "../component/JobCard"
import JobFilters from "../component/JobFilters"
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BriefcaseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"

const Jobs = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState({
    jobs: true,
    recommendedJobs: true,
    syncing: false,
  })
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    location: "",
    company: "",
    skills: [],
    source: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState([])
  const [activeTab, setActiveTab] = useState("recommended")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Get the token from localStorage
  const token = localStorage.getItem("token")

  // Axios config with token
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // API base URL
  const API_BASE_URL = "http://localhost:5005/api"

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    // Load saved jobs from localStorage
    const savedJobsFromStorage = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    setSavedJobs(savedJobsFromStorage)

    // Fetch initial data
    fetchJobs()
    fetchRecommendedJobs()
  }, [token])

  // Fetch all jobs with pagination and filters
  const fetchJobs = async (newPage) => {
    try {
      setLoading((prev) => ({ ...prev, jobs: true }))
      setError(null)
      setMessage(null)

      // Use the explicitly passed page or the current pagination state
      const currentPage = newPage !== undefined ? newPage : pagination.page

      console.log(`Fetching jobs for page ${currentPage}`)

      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters.search) queryParams.append("search", filters.search)
      if (filters.type) queryParams.append("type", filters.type)
      if (filters.location) queryParams.append("location", filters.location)
      if (filters.company) queryParams.append("company", filters.company)
      if (filters.skills.length > 0) queryParams.append("skills", filters.skills.join(","))
      if (filters.source) queryParams.append("source", filters.source)

      // Ensure page is a number and convert to string for the query
      queryParams.append("page", String(currentPage))
      queryParams.append("limit", String(pagination.limit))

      const requestUrl = `${API_BASE_URL}/jobs?${queryParams.toString()}`
      console.log(`Making API request to: ${requestUrl}`)

      const response = await axios.get(requestUrl, config)

      console.log("API Response:", response.data)

      if (response.data && response.data.success) {
        setJobs(response.data.jobs || [])
        setPagination(
          response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            pages: 1,
          },
        )

        // Check if there's a message from the server
        if (response.data.message) {
          setMessage(response.data.message)
        }
      } else {
        // Handle unexpected response format
        setJobs([])
        toast.error("Invalid response format from server")
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError("Failed to load jobs. Please try again later.")
      setJobs([])
    } finally {
      setLoading((prev) => ({ ...prev, jobs: false }))
    }
  }

  // Fetch recommended jobs
  const fetchRecommendedJobs = async () => {
    try {
      setLoading((prev) => ({ ...prev, recommendedJobs: true }))
      setError(null)
      setMessage(null)

      const response = await axios.get(`${API_BASE_URL}/jobs/recommended`, config)

      if (response.data && response.data.success) {
        setRecommendedJobs(response.data.jobs || [])

        // Check if there's a message from the server
        if (response.data.message) {
          setMessage(response.data.message)
        }
      } else {
        setRecommendedJobs([])
      }
    } catch (error) {
      console.error("Error fetching recommended jobs:", error)
      setRecommendedJobs([])
    } finally {
      setLoading((prev) => ({ ...prev, recommendedJobs: false }))
    }
  }

  // Sync external jobs
  const syncExternalJobs = async () => {
    try {
      setLoading((prev) => ({ ...prev, syncing: true }))
      setError(null)
      setMessage("Syncing jobs from external sources. This may take a few minutes...")

      // Show toast notification that syncing has started
      toast.info("Syncing jobs from external sources. This may take a few minutes...", {
        autoClose: false,
        toastId: "sync-jobs",
      })

      const response = await axios.post(
        `${API_BASE_URL}/jobs/sync-external`,
        {
          sources: ["LinkedIn", "Unstop", "Indeed"],
        },
        config,
      )

      if (response.data && response.data.success) {
        // Close the previous toast
        toast.dismiss("sync-jobs")
        toast.success(response.data.message || "Job sync started successfully")

        // Set a message to inform the user
        setMessage("Job scraping is running in the background. Please check back in a few minutes for new jobs.")

        // Schedule multiple refreshes to check for new jobs
        const checkForNewJobs = () => {
          const existingCount = response.data.existingJobsCount || 0

          // Function to check if new jobs are available
          const checkJobs = async () => {
            try {
              const checkResponse = await axios.get(`${API_BASE_URL}/jobs?limit=1`, config)
              const newCount = checkResponse.data.pagination?.total || 0

              console.log(`Checking for new jobs: ${newCount} vs ${existingCount}`)

              if (newCount > existingCount) {
                // New jobs found, refresh the lists
                toast.success(`${newCount - existingCount} new jobs have been added!`)
                fetchJobs()
                fetchRecommendedJobs()
                return true // Stop checking
              }
              return false // Continue checking
            } catch (err) {
              console.error("Error checking for new jobs:", err)
              return false // Continue checking despite error
            }
          }

          // Check every 10 seconds for 2 minutes
          let checkCount = 0
          const maxChecks = 12

          const intervalId = setInterval(async () => {
            checkCount++
            console.log(`Check ${checkCount}/${maxChecks} for new jobs`)

            const newJobsFound = await checkJobs()

            if (newJobsFound || checkCount >= maxChecks) {
              clearInterval(intervalId)
              if (!newJobsFound && checkCount >= maxChecks) {
                // If we've checked the maximum number of times and still no jobs
                fetchJobs() // Refresh anyway
                fetchRecommendedJobs()
              }
            }
          }, 10000)
        }

        // Start checking for new jobs
        checkForNewJobs()
      }
    } catch (error) {
      console.error("Error syncing external jobs:", error)
      toast.dismiss("sync-jobs")
      toast.error("Failed to sync external jobs: " + (error.response?.data?.message || error.message))
      setMessage(null)
    } finally {
      // Don't set syncing to false immediately - let it show as syncing until we detect new jobs
      setTimeout(() => {
        setLoading((prev) => ({ ...prev, syncing: false }))
      }, 30000) // Show syncing state for at least 30 seconds
    }
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()

    console.log("Applying filters:", filters)

    // Set active tab to "all" when searching
    setActiveTab("all")

    // Reset to first page on new search
    setPagination((prev) => ({ ...prev, page: 1 }))

    // Fetch jobs with filters
    fetchJobs()
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      type: "",
      location: "",
      company: "",
      skills: [],
      source: "",
    })

    // Reset to page 1 and fetch jobs
    setPagination((prev) => ({ ...prev, page: 1 }))
    setTimeout(() => fetchJobs(), 0)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return

    console.log(`Changing to page ${newPage}`)

    // Update the pagination state
    setPagination((prev) => {
      console.log(`Updating pagination state from page ${prev.page} to ${newPage}`)
      return { ...prev, page: newPage }
    })

    // Directly fetch the jobs with the new page number
    fetchJobs(newPage)

    // Scroll to top of job listings
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      // Remove from saved jobs
      const updatedSavedJobs = savedJobs.filter((id) => id !== jobId)
      setSavedJobs(updatedSavedJobs)
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
      toast.success("Job removed from saved jobs")
    } else {
      // Add to saved jobs
      const updatedSavedJobs = [...savedJobs, jobId]
      setSavedJobs(updatedSavedJobs)
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
      toast.success("Job saved successfully")
    }
  }

  const handleApplyForJob = async (jobId, applicationLink) => {
    try {
      await axios.post(`${API_BASE_URL}/jobs/${jobId}/apply`, {}, config)
      toast.success("Application recorded!")
      // Open application link in new tab
      window.open(applicationLink, "_blank")
    } catch (error) {
      console.error("Error applying for job:", error)
      toast.error("Failed to apply for job, but opening application link")
      // Still open the link even if tracking fails
      window.open(applicationLink, "_blank")
    }
  }

  // Function to refresh jobs
  const refreshJobs = () => {
    if (activeTab === "recommended") {
      fetchRecommendedJobs()
    } else {
      fetchJobs()
    }
  }

  // Generate pagination buttons
  const renderPagination = () => {
    const buttons = []
    const maxButtonsToShow = 5 // Maximum number of page buttons to show

    let startPage = Math.max(1, pagination.page - Math.floor(maxButtonsToShow / 2))
    const endPage = Math.min(pagination.pages, startPage + maxButtonsToShow - 1)

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1)
    }

    // Add first page button if not already included
    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 border rounded mx-1 hover:bg-gray-100"
        >
          1
        </button>,
      )

      // Add ellipsis if there's a gap
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        )
      }
    }

    // Add page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded mx-1 ${
            pagination.page === i ? "bg-purple-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Add last page button if not already included
    if (endPage < pagination.pages) {
      // Add ellipsis if there's a gap
      if (endPage < pagination.pages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }

      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(pagination.pages)}
          className="px-3 py-1 border rounded mx-1 hover:bg-gray-100"
        >
          {pagination.pages}
        </button>,
      )
    }

    return buttons
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "recommended" ? "Recommended Jobs" : "All Jobs"}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("recommended")}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === "recommended"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-purple-600"
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === "all" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-600"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={syncExternalJobs}
              disabled={loading.syncing}
              className={`px-4 py-2 rounded-md font-medium ${
                loading.syncing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {loading.syncing ? "Syncing..." : "Sync External Jobs"}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex justify-between items-center">
          <form onSubmit={handleSearch} className="flex-grow mr-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-purple-400"
              />
            </div>
          </form>
          <div className="flex items-center gap-2">
            <button onClick={refreshJobs} className="p-2 rounded-full hover:bg-gray-200" title="Refresh jobs">
              <ArrowPathIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-1 text-sm text-purple-600 hover:underline"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Filters
              {showFilters ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <JobFilters filters={filters} setFilters={setFilters} onSearch={handleSearch} onReset={handleResetFilters} />
        )}

        {/* Message from server */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            <p>{message}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Job Listings */}
        {loading[activeTab === "recommended" ? "recommendedJobs" : "jobs"] ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {(activeTab === "recommended" ? recommendedJobs : jobs).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <BriefcaseIcon className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "recommended"
                    ? "We don't have any recommended jobs for you yet. Try syncing external jobs or update your profile to get better recommendations."
                    : "No jobs match your search criteria. Try adjusting your filters or sync external jobs."}
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  {activeTab === "all" && (
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    >
                      Reset Filters
                    </button>
                  )}
                  <button
                    onClick={syncExternalJobs}
                    disabled={loading.syncing}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      loading.syncing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                    } focus:outline-none`}
                  >
                    {loading.syncing ? "Syncing..." : "Sync External Jobs"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeTab === "recommended" ? recommendedJobs : jobs).map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onApply={handleApplyForJob}
                    isSaved={savedJobs.includes(job._id)}
                    onToggleSave={() => toggleSaveJob(job._id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination - Enhanced version */}
        {!loading.jobs && pagination.pages > 1 && activeTab === "all" && (
          <div className="flex flex-wrap justify-center mt-8 bg-white rounded-lg py-3 px-6 shadow">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 mr-2"
              disabled={pagination.page === 1}
            >
              &laquo; Prev
            </button>

            {renderPagination()}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 ml-2"
              disabled={pagination.page === pagination.pages}
            >
              Next &raquo;
            </button>

            <div className="w-full text-center mt-2 text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages} | Total Jobs: {pagination.total}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs

