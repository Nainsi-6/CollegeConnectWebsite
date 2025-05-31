import axios from "axios"

const API_BASE_URL = "http://localhost:5005/api"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Profile API calls
export const profileApi = {
  getProfile: (userId) => apiClient.get(`/profiles/${userId || "me"}`),
  updateProfile: (data, formData = false) => {
    if (formData) {
      return apiClient.put("/profiles", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    }
    return apiClient.put("/profiles", data)
  },
}

// Job API calls
export const jobApi = {
  getJobs: (filters = {}, page = 1, limit = 10) => {
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

    return apiClient.get(`/jobs?${queryParams.toString()}`)
  },
  getRecommendedJobs: () => apiClient.get("/jobs/recommended"),
  syncExternalJobs: (sources = ["LinkedIn", "Unstop"]) => apiClient.post("/jobs/sync-external", { sources }),
  viewJob: (jobId) => apiClient.get(`/jobs/${jobId}`),
  applyForJob: (jobId) => apiClient.post(`/jobs/${jobId}/apply`),
  updateJobPreferences: (preferences) => apiClient.put("/jobs/preferences", preferences),
}

// Message API calls
export const messageApi = {
  getConversations: () => apiClient.get("/messages/conversations"),
  getMessages: (conversationId) => apiClient.get(`/messages/conversations/${conversationId}`),
  sendMessage: (data) => apiClient.post("/messages", data),
}

// User API calls
export const userApi = {
  searchUsers: (query) => apiClient.get(`/users/search?query=${query}`),
  getSuggestedUsers: () => apiClient.get("/users/suggested"),
  getConnectionRequests: () => apiClient.get("/users/requests"),
  followUser: (userId) => apiClient.post(`/users/follow/${userId}`),
  respondToRequest: (requestId, action) => apiClient.put(`/users/request/${requestId}`, { action }),
  getConnections: (userId) => apiClient.get(`/users/connections/${userId || "me"}`),
  getCurrentUser: () => apiClient.get("/users/me"),
}

export default apiClient
