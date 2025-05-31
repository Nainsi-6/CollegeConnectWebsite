

// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import StudentProfile from "./StudentProfile"
// import FacultyProfile from "./FacultyProfile"
// import AlumniProfile from "./AlumniProfile"
// import { useUser } from "../contexts/UserContext"

// const ProfilePage = () => {
//   const [userRole, setUserRole] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()
//   const { user } = useUser() // Get user from context
//   // ****************************
  

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // First check if we already have the user in context
//         if (user && user.role) {
//           setUserRole(user.role.toLowerCase())
//           setLoading(false)
//           return
//         }

//         // If not in context, try to get from token
//         const token = localStorage.getItem("token")
//         if (!token) {
//           navigate("/login")
//           return
//         }

//         // Fetch user profile from backend
//         const response = await axios.get("http://localhost:5005/api/profiles/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })

//         if (response.data && response.data.profile && response.data.profile.role) {
//           setUserRole(response.data.profile.role.toLowerCase())
//         } else {
//           throw new Error("Role not found in profile")
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error)

//         // Only redirect if the error is authentication related
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem("token")
//           navigate("/login")
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//   }, [navigate, user])

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="ml-2">Loading profile...</p>
//       </div>
//     )
//   }

//   switch (userRole) {
//     case "student":
//       return <StudentProfile />
//     case "faculty":
//       return <FacultyProfile />
//     case "alumni":
//       return <AlumniProfile />
//     default:
//       return (
//         <div className="flex flex-col items-center justify-center h-screen">
//           <p className="text-xl text-red-500">Profile not available or role unknown.</p>
//           <button onClick={() => navigate("/login")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//             Back to Login
//           </button>
//         </div>
//       )
//   }
// }

// export default ProfilePage




//*************************************
//  */

// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "react-router-dom"
// import axios from "axios"
// import ProfileHeader from "./profileHeader"
// import { useUser } from "../contexts/UserContext"

// const ProfilePage = () => {
//   const { userId } = useParams()
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const { user } = useUser() // Get current user from context

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         const headers = token ? { Authorization: Bearer ${token} } : {}

//         // Determine the endpoint based on whether we're viewing our own profile or someone else's
//         const endpoint = userId
//           ? http://localhost:5005/api/profiles/${userId}
//           : "http://localhost:5005/api/profiles/me"

//         const response = await axios.get(endpoint, { headers })

//         if (response.data.success) {
//           setProfile(response.data.profile)
//         } else {
//           setError(response.data.message || "Failed to load profile")
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err)
//         setError("An error occurred while loading the profile")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [userId])

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return <div className="text-center text-red-500 p-8">{error}</div>
//   }

//   if (!profile) {
//     return <div className="text-center p-8">Profile not found</div>
//   }

//   return (
//     <div>
//       <ProfileHeader
//         name={profile.name}
//         email={profile.email}
//         stats={profile.stats}
//         profilePhotoUrl={profile.profilePhotoUrl}
//         coverPhotoUrl={profile.coverPhotoUrl}
//         userId={userId || profile.userId}
//         currentUserId={user?._id}
//         editable={!userId} // Only editable if viewing own profile
//       />

//       {/* Rest of your profile page content */}
//       <div className="max-w-4xl mx-auto p-6">{/* Profile content sections */}</div>
//     </div>
//   )
// }

// export default ProfilePage


// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import axios from "axios"
// import StudentProfile from "./StudentProfile"
// import FacultyProfile from "./FacultyProfile"
// import AlumniProfile from "./AlumniProfile"
// import { useUser } from "../contexts/UserContext"
// import ProfileHeader from "./profileHeader"

// const ProfilePage = () => {
//   const { userId } = useParams()
//   const [userRole, setUserRole] = useState(null)
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()
//   const { user } = useUser() // Get user from context

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // First check if we already have the user in context
//         if (user && user.role) {
//           setUserRole(user.role.toLowerCase())
          
//           // If viewing own profile, we already have some data
//           if (!userId) {
//             setProfile({
//               name: user.name,
//               email: user.email,
//               role: user.role,
//               userId: user._id,
//               stats: user.stats || { followers: 0, following: 0, posts: 0 },
//               profilePhotoUrl: user.profilePhotoUrl,
//               coverPhotoUrl: user.coverPhotoUrl,
//             })
//           }
//         }

//         // Get token for API requests
//         const token = localStorage.getItem("token")
//         if (!token) {
//           navigate("/login")
//           return
//         }

//         // Fetch profile data - either the user's own profile or someone else's
//         const endpoint = userId
//           ? `http://localhost:5005/api/profiles/${userId}`
//           : "http://localhost:5005/api/profiles/me"

//         const response = await axios.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })

//         if (response.data && response.data.profile) {
//           const profileData = response.data.profile
//           setProfile(profileData)
          
//           // If viewing own profile, update role
//           if (!userId && profileData.role) {
//             setUserRole(profileData.role.toLowerCase())
//           }
//         } else {
//           throw new Error("Profile data not found")
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error)

//         // Only redirect if the error is authentication related
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem("token")
//           navigate("/login")
//         } else {
//           setError("Failed to load profile data")
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//   }, [navigate, user, userId])

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="ml-2">Loading profile...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <p className="text-xl text-red-500">{error}</p>
//         <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//           Go Back
//         </button>
//       </div>
//     )
//   }

//   // If viewing someone else's profile, render the profile with header
//   if (userId) {
//     return (
//       <div>
//         {profile && (
//           <ProfileHeader
//             name={profile.name}
//             email={profile.email}
//             stats={profile.stats}
//             profilePhotoUrl={profile.profilePhotoUrl}
//             coverPhotoUrl={profile.coverPhotoUrl}
//             userId={userId}
//             currentUserId={user?._id}
//             editable={false}
//           />
//         )}
//         <div className="max-w-4xl mx-auto p-6">
//           {/* Additional profile content can go here */}
//         </div>
//       </div>
//     )
//   }

//   // If viewing own profile, render based on role
//   switch (userRole) {
//     case "student":
//       return <StudentProfile />
//     case "faculty":
//       return <FacultyProfile />
//     case "alumni":
//       return <AlumniProfile />
//     default:
//       return (
//         <div className="flex flex-col items-center justify-center h-screen">
//           <p className="text-xl text-red-500">Profile not available or role unknown.</p>
//           <button onClick={() => navigate("/login")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//             Back to Login
//           </button>
//         </div>
//       )
//   }
// }

// export default ProfilePage
/// ???????????????????????????????????????????????

// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import axios from "axios"
// import ProfileHeader from "./ProfileHeader"
// import StudentProfile from "./StudentProfile"
// import FacultyProfile from "./FacultyProfile"
// import AlumniProfile from "./AlumniProfile"
// import { useUser } from "../contexts/UserContext"

// const ProfilePage = () => {
//   const { userId } = useParams()
//   const [userRole, setUserRole] = useState(null)
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()
//   const { user } = useUser() // Get current user from context

//   // Add state for profile and cover photos
//   const [profilePhotoFile, setProfilePhotoFile] = useState(null)
//   const [coverPhotoFile, setCoverPhotoFile] = useState(null)

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Get token for API requests
//         const token = localStorage.getItem("token")
//         const headers = token ? { Authorization: `Bearer ${token}` } : {}

//         // If viewing own profile and user context exists, set role
//         if (!userId && user && user.role) {
//           setUserRole(user.role.toLowerCase())
//         }

//         // Determine the endpoint based on whether we're viewing our own profile or someone else's
//         const endpoint = userId
//           ? `http://localhost:5005/api/profiles/${userId}`
//           : "http://localhost:5005/api/profiles/me"

//         const response = await axios.get(endpoint, { headers })

//         if (response.data.success) {
//           const profileData = response.data.profile
//           setProfile(profileData)

//           // Set role if viewing own profile
//           if (!userId && profileData.role) {
//             setUserRole(profileData.role.toLowerCase())
//           }
//         } else {
//           setError(response.data.message || "Failed to load profile")
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err)

//         if (err.response && err.response.status === 401) {
//           localStorage.removeItem("token")
//           navigate("/login")
//         } else {
//           setError("An error occurred while loading the profile")
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [userId, user, navigate])

//   // Handle photo change from ProfileHeader
//   const handlePhotoChange = (type, file) => {
//     if (type === "profile") {
//       setProfilePhotoFile(file)
//     } else if (type === "cover") {
//       setCoverPhotoFile(file)
//     }
//   }

//   // Handle back button click
//   const handleGoBack = () => {
//     navigate(-1)
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//         <p className="ml-2">Loading profile...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <p className="text-xl text-red-500">{error}</p>
//         <button onClick={handleGoBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//           Go Back
//         </button>
//       </div>
//     )
//   }

//   if (!profile) {
//     return (
//       <div className="text-center p-8">
//         <p>Profile not found</p>
//         <button onClick={handleGoBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//           Go Back
//         </button>
//       </div>
//     )
//   }

//   // Render the profile with header and back button for any profile
//   return (
//     <div>
//       <div className="flex justify-end p-4">
//         <button onClick={handleGoBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
//           ← Back
//         </button>
//       </div>

//       <ProfileHeader
//         name={profile.name}
//         email={profile.email}
//         stats={profile.stats || { followers: 0, following: 0, posts: 0 }}
//         profilePhotoUrl={profile.profilePhotoUrl}
//         coverPhotoUrl={profile.coverPhotoUrl}
//         userId={userId || profile.userId}
//         currentUserId={user?._id}
//         editable={!userId} // Only editable if viewing own profile
//         onPhotoChange={handlePhotoChange}
//       />

//       <div className="max-w-4xl mx-auto p-6">
//         {/* If viewing own profile, render based on role */}
//         {!userId && (
//           <>
//             {userRole === "student" ? (
//               <StudentProfile profile={profile} profilePhotoFile={profilePhotoFile} coverPhotoFile={coverPhotoFile} />
//             ) : userRole === "faculty" ? (
//               <FacultyProfile profile={profile} profilePhotoFile={profilePhotoFile} coverPhotoFile={coverPhotoFile} />
//             ) : userRole === "alumni" ? (
//               <AlumniProfile profile={profile} profilePhotoFile={profilePhotoFile} coverPhotoFile={coverPhotoFile} />
//             ) : (
//               <div className="p-4">
//                 <h2 className="text-xl font-bold mb-2">Profile Details</h2>
//                 {/* Display generic profile information */}
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <p>
//                     <strong>Name:</strong> {profile.name}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {profile.email}
//                   </p>
//                   <p>
//                     <strong>Role:</strong> {profile.role || "Not specified"}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* For viewing other profiles, show generic content */}
//         {userId && (
//           <div className="p-4">
//             <h2 className="text-xl font-bold mb-2">Profile Details</h2>
//             <div className="bg-white rounded-lg shadow p-4">
//               <p>
//                 <strong>Name:</strong> {profile.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {profile.email}
//               </p>
//               <p>
//                 <strong>Role:</strong> {profile.role || "Not specified"}
//               </p>
//               {/* Additional profile content can go here */}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// ????????????????????????????????????????????????????????????????????????????????????


"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import ProfileHeader from "./ProfileHeader"
import StudentProfile from "./StudentProfile"
import FacultyProfile from "./FacultyProfile"
import AlumniProfile from "./AlumniProfile"
import { useUser } from "../contexts/UserContext"
import SavedPostsModal from "./SavedPostsModal"

const ProfilePage = () => {
  const { userId } = useParams()
  const [userRole, setUserRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [postCount, setPostCount] = useState(0)
  const navigate = useNavigate()
  const { user } = useUser()
  const [showSavedPosts, setShowSavedPosts] = useState(false)

  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [coverPhotoFile, setCoverPhotoFile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        if (!userId && user?.role) {
          setUserRole(user.role.toLowerCase())
        }

        const endpoint = userId
          ? `http://localhost:5005/api/profiles/${userId}`
          : "http://localhost:5005/api/profiles/me"

        const response = await axios.get(endpoint, { headers })

        if (response.data.success) {
          const profileData = response.data.profile
          setProfile(profileData)

          if (!userId && profileData.role) {
            setUserRole(profileData.role.toLowerCase())
          }

          await fetchPostCount(userId || profileData.userId || user?._id)
        } else {
          setError(response.data.message || "Failed to load profile")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          setError("An error occurred while loading the profile")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId, user, navigate])

  const fetchPostCount = async (targetUserId) => {
    try {
      const response = await fetch(`http://localhost:5005/api/posts/user/${targetUserId}/count`)
      if (response.ok) {
        const data = await response.json()
        setPostCount(data.count)
      }
    } catch (err) {
      console.error("Error fetching post count:", err)
    }
  }

  const handlePhotoChange = (type, file) => {
    if (type === "profile") {
      setProfilePhotoFile(file)
    } else if (type === "cover") {
      setCoverPhotoFile(file)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleViewPosts = () => {
    const targetUserId = userId || user?._id
    if (targetUserId) {
      navigate(`/posts/user/${targetUserId}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-indigo-700 text-lg">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <p className="text-xl text-red-600 font-semibold">{error}</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
        >
          ← Go Back
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-10 px-4 bg-gray-50">
        <p className="text-lg text-gray-600">Profile not found</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          ← Go Back
        </button>
      </div>
    )
  }

  const enhancedStats = {
    ...(profile.stats || { followers: 0, following: 0 }),
    posts: postCount,
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        stats={enhancedStats}
        profilePhotoUrl={profile.profilePhotoUrl}
        coverPhotoUrl={profile.coverPhotoUrl}
        userId={userId || profile.userId}
        currentUserId={user?._id}
        editable={!userId}
        onPhotoChange={handlePhotoChange}
      />

      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b">
        <button onClick={handleGoBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md">
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleViewPosts}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            {!userId ? "Your Posts" : "View Posts"} ({postCount})
          </button>

          {!userId && (
            <button
              onClick={() => setShowSavedPosts(true)}
              className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-md shadow transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Posts
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-2">
        {!userId ? (
          <>
            {userRole === "student" ? (
              <StudentProfile profile={profile} profilePhotoFile={profilePhotoFile} coverPhotoFile={coverPhotoFile} />
            ) : userRole === "faculty" ? (
              <FacultyProfile profile={profile} profilePhotoFile={profilePhotoFile} coverPhotoFile={coverPhotoFile} />
            ) : userRole === "alumni" ? (
              <AlumniProfile profile={profile} profilePhotoFile={profilePhotoFile} coverPhotoFile={coverPhotoFile} />
            ) : (
              <GenericProfileDetails profile={profile} postCount={postCount} />
            )}
          </>
        ) : (
          <GenericProfileDetails profile={profile} postCount={postCount} />
        )}
      </div>

      {/* Saved Posts Modal */}
      <SavedPostsModal isOpen={showSavedPosts} onClose={() => setShowSavedPosts(false)} userId={user?._id} />
    </div>
  )
}

const GenericProfileDetails = ({ profile, postCount }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Details</h2>
    <p className="mb-2">
      <strong>Name:</strong> {profile.name}
    </p>
    <p className="mb-2">
      <strong>Email:</strong> {profile.email}
    </p>
    <p className="mb-2">
      <strong>Role:</strong> {profile.role || "Not specified"}
    </p>
    <p className="mb-2">
      <strong>Posts Created:</strong> {postCount}
    </p>
  </div>
)

export default ProfilePage
