import React, { useState, useEffect } from "react"
import axios from "axios"

const FollowButton = ({ userId, onFollowChange }) => {
  const [connectionStatus, setConnectionStatus] = useState("none") // none, pending, connected
  const [loading, setLoading] = useState(false)

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null

  // Configure axios headers
  const config = {
    headers: {
      Authorization: token,
    },
  }

  // Check connection status when component mounts
  useEffect(() => {
    if (userId && userId !== currentUserId) {
      checkConnectionStatus()
    }
  }, [userId, currentUserId])

  // Get connection status
  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/users/connections/${userId}`, config)
      
      // Check if current user is in followers with accepted or pending status
      const follower = response.data.followers.find(
        follow => follow.follower._id === currentUserId
      )

      if (follower) {
        setConnectionStatus(follower.status === "accepted" ? "connected" : "pending")
      } else {
        setConnectionStatus("none")
      }
    } catch (error) {
      console.error("Error checking connection status:", error)
    }
  }

  // Send connection request
  const sendConnectionRequest = async () => {
    try {
      setLoading(true)
      await axios.post(`http://localhost:5005/api/users/follow/${userId}`, {}, config)
      setConnectionStatus("pending")
      
      // Notify parent component about the change
      if (onFollowChange) {
        onFollowChange(false) // Not yet following, only requested
      }
    } catch (error) {
      console.error("Error sending connection request:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle unfollow
  const handleUnfollow = async () => {
    try {
      setLoading(true)
      await axios.delete(`http://localhost:5005/api/users/unfollow/${userId}`, config)
      setConnectionStatus("none")
      
      // Notify parent component about the change
      if (onFollowChange) {
        onFollowChange(false)
      }
    } catch (error) {
      console.error("Error unfollowing user:", error)
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything if it's the current user's profile
  if (userId === currentUserId) return null

  return (
    <div>
      {connectionStatus === "none" && (
        <button
          onClick={sendConnectionRequest}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          )}
          Connect
        </button>
      )}

      {connectionStatus === "pending" && (
        <button
          disabled
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md bg-gray-50"
        >
          Request Pending
        </button>
      )}

      {connectionStatus === "connected" && (
        <div className="flex space-x-2">
          <button
            disabled
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md bg-gray-50 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Connected
          </button>
          <button
            onClick={handleUnfollow}
            className="px-4 py-2 border border-gray-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            Unfollow
          </button>
        </div>
      )}
    </div>
  )
}

export default FollowButton