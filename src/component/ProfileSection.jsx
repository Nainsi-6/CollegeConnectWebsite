//   displayData.profilePhotoUrl
//               ? `http://localhost:5005${displayData.profilePhotoUrl}`
//               : displayData.image || "https://tse1.mm.bing.net/th?id=OIP.MoLuogvKSS_uEhep5nvcuQHaID&pid=Api&P=0&h=180"

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

const ProfileSection = ({ className = "" }) => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async () => {
    if (!user?._id) return

    try {
      const response = await fetch(`http://localhost:5005/api/profiles/${user._id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.profile)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  const handleProfileClick = () => {
    // Navigate to own profile page
    navigate("/profile")
  }

  if (loading) {
    return (
      <div
        className={`bg-gradient-to-br from-indigo-200 to-purple-400 p-2 rounded-2xl shadow-lg text-center ${className}`}
      >
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-indigo-300 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-indigo-300 rounded mb-2"></div>
          <div className="h-3 bg-indigo-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div
        className={`bg-gradient-to-br from-indigo-200 to-purple-400 p-4 rounded-lg shadow-lg text-center ${className}`}
      >
        <p className="text-indigo-800 font-bold">Log in to see your profile.</p>
      </div>
    )
  }

  const displayData = profileData || user

  return (
    <div
      className={`bg-gradient-to-br from-indigo-200 to-purple-400 p-3 rounded-3xl shadow-lg text-center ${className}`}
    >
      <div className="flex justify-center">
        <img
          src={
            displayData.profilePhotoUrl
              ? `http://localhost:5005${displayData.profilePhotoUrl}`
              : displayData.image || "https://tse1.mm.bing.net/th?id=OIP.MoLuogvKSS_uEhep5nvcuQHaID&pid=Api&P=0&h=180"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 shadow-md cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleProfileClick}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=128&width=128"
          }}
        />
      </div>

      <h3
        className="text-2xl font-extrabold text-indigo-900 mt-2 cursor-pointer hover:text-indigo-700 transition-colors"
        onClick={handleProfileClick}
      >
        {displayData.name}
      </h3>

      <p className="text-indigo-700 text-sm font-bold mt-1">
        {displayData.role === "student"
          ? `Student at ${displayData.department || "VIT Bhopal University"}`
          : displayData.role === "faculty"
            ? `Faculty at ${displayData.department || "VIT Bhopal University"}`
            : `Alumni from ${displayData.passedOutBatch || ""} batch`}
      </p>

      {displayData.branch && <p className="text-indigo-600 text-xs font-bold">{displayData.branch}</p>}

      {/* Stats */}
      <div className="flex justify-center items-center space-x-8 mt-2 bg-white p-2 rounded-lg shadow-md">
        <div className="text-sm font-medium text-gray-700">
          <span className="text-indigo-700 font-bold text-base">Followers</span> -
          <span className="ml-1 font-bold text-indigo-900 text-base">{displayData.stats?.followers || 0}</span>
        </div>
        <div className="w-px h-5 bg-gray-300"></div>
        <div className="text-sm font-medium text-gray-700">
          <span className="text-indigo-700 font-bold text-base">Following</span> -
          <span className="ml-1 font-bold text-base text-indigo-900">{displayData.stats?.following || 0}</span>
        </div>
      </div>

      {/* Skills */}
      {displayData.skills && displayData.skills.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap justify-center gap-1">
            {displayData.skills.slice(0, 6).map((skill, idx) => (
              <span key={idx} className="bg-indigo-500 text-gray-200 text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
            {displayData.skills.length > 6 && (
              <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                +{displayData.skills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileSection
