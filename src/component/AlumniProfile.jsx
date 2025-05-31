"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// import ProfileHeader from './ProfileHeader';

// Set base URL for API requests
const API_BASE_URL = "http://localhost:5005" // Make sure this matches your backend server port

const AlumniProfile = ({ profile, profilePhotoFile, coverPhotoFile }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentJobTitle: "Software Engineer",
    company: "Tech Corp",
    graduationYear: "2020",
    skills: "JavaScript, React, Node.js",
    linkedinProfile: "https://www.linkedin.com/in/johnsmith",
    about: "",
    stats: { followers: 0, following: 0, posts: 0 },
  })

  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [coverPhoto, setCoverPhoto] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        // Fetch profile data
        const response = await axios.get(`${API_BASE_URL}/api/profiles/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const { profile } = response.data

        setProfileData({
          name: profile.name || "",
          email: profile.email || "",
          currentJobTitle: profile.currentJobTitle || "Software Engineer",
          company: profile.company || "Tech Corp",
          graduationYear: profile.graduationYear || "2020",
          skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "JavaScript, React, Node.js",
          linkedinProfile: profile.linkedinProfile || "https://www.linkedin.com/in/johnsmith",
          about: profile.about || "",
          stats: profile.stats || { followers: 0, following: 0, posts: 0 },
        })

        if (profile.profilePhotoUrl) {
          setProfilePhotoUrl(`${API_BASE_URL}${profile.profilePhotoUrl}`)
        }

        if (profile.coverPhotoUrl) {
          setCoverPhotoUrl(`${API_BASE_URL}${profile.coverPhotoUrl}`)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data. Please try again later.")

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  // Update profile photo URLs when files change
  useEffect(() => {
    if (profile) {
      if (profile.profilePhotoUrl) {
        setProfilePhotoUrl(`${API_BASE_URL}${profile.profilePhotoUrl}`)
      }
      if (profile.coverPhotoUrl) {
        setCoverPhotoUrl(`${API_BASE_URL}${profile.coverPhotoUrl}`)
      }
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update the handleSave function to properly handle photo uploads and refresh the page

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const formData = new FormData()
      formData.append("name", profileData.name)
      formData.append("email", profileData.email)
      formData.append("currentJobTitle", profileData.currentJobTitle)
      formData.append("company", profileData.company)
      formData.append("graduationYear", profileData.graduationYear)
      formData.append("skills", profileData.skills)
      formData.append("linkedinProfile", profileData.linkedinProfile)
      formData.append("about", profileData.about)

      // Add profile photo and cover photo files if they exist
      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile)
        console.log("Adding profile photo to form data:", profilePhotoFile.name)
      }

      if (coverPhotoFile) {
        formData.append("coverPhoto", coverPhotoFile)
        console.log("Adding cover photo to form data:", coverPhotoFile.name)
      }

      console.log("Sending profile update request")

      const response = await axios.post(`${API_BASE_URL}/api/profiles/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Profile update response:", response.data)

      if (response.data.success) {
        alert("Profile saved successfully!")

        // Update URLs if provided in response
        if (response.data.profile.profilePhotoUrl) {
          setProfilePhotoUrl(`${API_BASE_URL}${response.data.profile.profilePhotoUrl}`)
        }

        if (response.data.profile.coverPhotoUrl) {
          setCoverPhotoUrl(`${API_BASE_URL}${response.data.profile.coverPhotoUrl}`)
        }

        // Refresh the page to show updated photos
        // window.location.reload()
      } else {
        setError("Failed to save profile: " + (response.data.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      setError("Failed to save profile: " + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-300 text-gray-800 font-sans">
      {/* Error message */}
      {/* {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-auto max-w-xl"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )} */}

      {/* Alumni Specific Info */}
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800 font-sans p-10 w-full">
        <div className="space-y-6">
          <div>
            <label className="block text-xl font-bold text-indigo-700 mb-2">Current Job Title</label>
            <input
              type="text"
              name="currentJobTitle"
              value={profileData.currentJobTitle}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 hover:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-indigo-700 mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={profileData.company}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 hover:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-indigo-700 mb-2">Graduation Year</label>
            <input
              type="text"
              name="graduationYear"
              value={profileData.graduationYear}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 hover:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-indigo-700 mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              value={profileData.skills}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 hover:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-indigo-700 mb-2">LinkedIn Profile</label>
            <input
              type="text"
              name="linkedinProfile"
              value={profileData.linkedinProfile}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 hover:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-indigo-700 mb-2">About</label>
            <textarea
              rows="3"
              name="about"
              value={profileData.about}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-300 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 hover:border-indigo-400"
            ></textarea>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlumniProfile
