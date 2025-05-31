import axios from "axios"

const API_BASE_URL = "http://localhost:5005/api"

// Get token from localStorage
const getConfig = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: token,
    },
  }
}

// LinkedIn API integration
export const fetchLinkedInJobs = async () => {
  try {
    // This would be replaced with actual LinkedIn API integration
    // For now, we'll simulate the API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would use the LinkedIn API client
    // const response = await linkedInClient.getJobs();

    // Sample data structure that matches what our backend expects
    return [
      {
        title: "Frontend Developer",
        company: "LinkedIn Company",
        location: "Remote",
        type: "Full-time",
        description: "Frontend development role using React and TypeScript",
        skills: ["React", "TypeScript", "CSS", "HTML"],
        salary: "$80,000 - $100,000",
        applicationLink: "https://linkedin.com/jobs/123",
      },
      {
        title: "Backend Engineer",
        company: "Tech Solutions via LinkedIn",
        location: "New York, NY",
        type: "Full-time",
        description: "Backend development using Node.js and MongoDB",
        skills: ["Node.js", "Express", "MongoDB", "API Design"],
        salary: "$90,000 - $120,000",
        applicationLink: "https://linkedin.com/jobs/456",
      },
    ]
  } catch (error) {
    console.error("Error fetching LinkedIn jobs:", error)
    throw error
  }
}

// Unstop API integration
export const fetchUnstopJobs = async () => {
  try {
    // This would be replaced with actual Unstop API integration
    // For now, we'll simulate the API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would use the Unstop API client
    // const response = await unstopClient.getJobs();

    // Sample data structure that matches what our backend expects
    return [
      {
        title: "Software Engineering Intern",
        company: "Startup via Unstop",
        location: "Remote",
        type: "Internship",
        description: "3-month internship for computer science students",
        skills: ["Java", "Python", "Data Structures"],
        salary: "$20/hr",
        applicationLink: "https://unstop.com/internships/123",
      },
      {
        title: "Machine Learning Research Assistant",
        company: "AI Lab via Unstop",
        location: "Bangalore, India",
        type: "Part-time",
        description: "Research assistant position for ML enthusiasts",
        skills: ["Python", "TensorFlow", "Machine Learning"],
        salary: "$25/hr",
        applicationLink: "https://unstop.com/jobs/456",
      },
    ]
  } catch (error) {
    console.error("Error fetching Unstop jobs:", error)
    throw error
  }
}

// Sync jobs from external sources
export const syncExternalJobs = async (sources = ["LinkedIn", "Unstop"]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jobs/sync-external`, { sources }, getConfig())
    return response.data
  } catch (error) {
    console.error("Error syncing external jobs:", error)
    throw error
  }
}

// Get all jobs with filters
export const getJobs = async (filters = {}, page = 1, limit = 10) => {
  try {
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === "skills" && Array.isArray(value)) {
          queryParams.append("skills", value.join(","))
        } else {
          queryParams.append(key, value)
        }
      }
    })
    queryParams.append("page", page)
    queryParams.append("limit", limit)

    const response = await axios.get(`${API_BASE_URL}/jobs?${queryParams.toString()}`, getConfig())
    return response.data
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error
  }
}

// Get recommended jobs
export const getRecommendedJobs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs/recommended`, getConfig())
    return response.data
  } catch (error) {
    console.error("Error fetching recommended jobs:", error)
    throw error
  }
}

// Apply for a job
export const applyForJob = async (jobId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jobs/${jobId}/apply`, {}, getConfig())
    return response.data
  } catch (error) {
    console.error("Error applying for job:", error)
    throw error
  }
}

// View job details
export const viewJob = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`, getConfig())
    return response.data
  } catch (error) {
    console.error("Error viewing job:", error)
    throw error
  }
}

export default {
  fetchLinkedInJobs,
  fetchUnstopJobs,
  syncExternalJobs,
  getJobs,
  getRecommendedJobs,
  applyForJob,
  viewJob,
}
