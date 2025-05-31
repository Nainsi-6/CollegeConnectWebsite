"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import ProfilePhoto from "./ProfilePhoto"

const FollowersList = ({ isOpen, onClose, userId, type }) => {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // API base URL
  const API_BASE_URL = "http://localhost:5005"

  // Get token from localStorage for authentication
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Configure axios headers
  const config = {
    headers: {
      Authorization: token,
    },
  }

  useEffect(() => {
    if (isOpen && userId) {
      fetchConnections()
    }
  }, [isOpen, userId, type])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/users/connections/${userId}`, config)

      // Set the connections based on the type (followers or following)
      if (type === "followers") {
        // Only show accepted followers
        setConnections(response.data.followers.filter((follow) => follow.status === "accepted"))
      } else {
        setConnections(response.data.following.filter((follow) => follow.status === "accepted"))
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    } finally {
      setLoading(false)
    }
  }

  // Navigate to user profile when clicked
  const goToProfile = (id) => {
    navigate(`/profile/${id}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold capitalize">{type}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : connections.length > 0 ? (
            <div className="space-y-4">
              {connections.map((connection) => {
                // Determine whether to use follower or following property
                const user = type === "followers" ? connection.follower : connection.following

                return (
                  <div
                    key={connection._id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => goToProfile(user._id)}
                  >
                    <ProfilePhoto src={user.profilePhotoUrl} alt={user.name} size="lg" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{user.role || ""}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">{`No ${type} yet`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowersList
