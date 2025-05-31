// "use client"
// import { useState } from "react"
// import { Link } from "react-router-dom"

// const UserCard = ({ user, onFollow, isFollowing = false }) => {
//   const [followState, setFollowState] = useState(isFollowing ? "Following" : "Connect")
  
//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case "student":
//         return "bg-blue-200 text-blue-900"
//       case "faculty":
//         return "bg-purple-200 text-purple-900"
//       case "alumni":
//         return "bg-green-200 text-green-900"
//       default:
//         return "bg-gray-300 text-gray-700"
//     }
//   }

//   const formatRole = (role) => {
//     return role.charAt(0).toUpperCase() + role.slice(1)
//   }

//   const getAdditionalInfo = (user) => {
//     switch (user.role) {
//       case "student":
//         return user.batch ? `Batch: ${user.batch}` : ""
//       case "faculty":
//         return user.department ? `Dept: ${user.department}` : ""
//       case "alumni":
//         return user.company ? `Company: ${user.company}` : ""
//       default:
//         return ""
//     }
//   }
  
//   const handleFollow = () => {
//     if (followState === "Connect") {
//       setFollowState("Requested")
//       onFollow(user._id)
//     }
//   }

//   return (
//     <div className="bg-gray-400 rounded-2xl shadow-lg overflow-hidden transition-transform hover:shadow-xl hover:-translate-y-1 duration-200">
//       <div className="p-5 flex flex-col items-center">
//         {/* Profile Image */}
//         <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 mb-4 shadow-sm">
//           <img
//             src={user.profilePhotoUrl || "https://tse1.mm.bing.net/th?id=OIP.4j4jNaPU3bIzDJHBj6HDSwHaHa&pid=Api&rs=1&c=1&qlt=95&w=120&h=120"}
//             alt={`${user.name}'s profile`}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.onerror = null
//               e.target.src = "https://tse1.mm.bing.net/th?id=OIP.4j4jNaPU3bIzDJHBj6HDSwHaHa&pid=Api&rs=1&c=1&qlt=95&w=120&h=120"
//             }}
//           />
//         </div>

//         {/* User Info */}
//         <h3 className="font-semibold text-xl text-gray-800">{user.name}</h3>

//         {/* Role Badge */}
//         <span className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getRoleBadgeColor(user.role)}`}>
//           {formatRole(user.role)}
//         </span>

//         {/* Additional Info */}
//         <p className="text-gray-900 text-sm mt-2 italic">{getAdditionalInfo(user)}</p>

//         {/* Actions */}
//         <div className="mt-5 flex space-x-3 w-full">
//           <Link
//             to={`/profile/${user._id}`}
//             className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-gray-400 transition"
//           >
//             View Profile
//           </Link>
//           <button
//             onClick={handleFollow}
//             className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
//               followState === "Following" 
//                 ? "bg-green-500 text-white hover:bg-green-600" 
//                 : followState === "Requested"
//                 ? "bg-yellow-500 text-white hover:bg-yellow-600"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//           >
//             {followState}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UserCard


// "use client"

// import { useState, useEffect } from "react"
// import PropTypes from "prop-types"
// import { useNavigate } from "react-router-dom"

// const UserCard = ({ user, onFollow, isFollowing = false, requestSent = false }) => {
//   const navigate = useNavigate()
//   const [isHovered, setIsHovered] = useState(false)
//   const [localRequestSent, setLocalRequestSent] = useState(requestSent)
  
//   // Update local state when the prop changes
//   useEffect(() => {
//     setLocalRequestSent(requestSent)
//   }, [requestSent])

//   const handleViewProfile = () => {
//     navigate(`/profile/${user._id}`)
//   }

//   const handleFollow = () => {
//     if (!isFollowing && !localRequestSent) {
//       setLocalRequestSent(true) // Update local state immediately
//       onFollow(user._id)
//     }
//   }

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "student":
//         return "bg-blue-100 text-blue-800"
//       case "faculty":
//         return "bg-purple-100 text-purple-800"
//       case "alumni":
//         return "bg-green-100 text-green-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   // Determine the API base URL
//   const API_BASE_URL = "http://localhost:5005"

//   // Format profile photo URL correctly
//   const getProfilePhotoUrl = () => {
//     if (!user.profilePhotoUrl) {
//       return "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
//     }

//     // If the URL already includes the full domain, use it as is
//     if (user.profilePhotoUrl.startsWith("http")) {
//       return user.profilePhotoUrl
//     }

//     // Otherwise, prepend the API base URL
//     return `${API_BASE_URL}${user.profilePhotoUrl}`
//   }

//   // Format cover photo URL correctly
//   const getCoverPhotoUrl = () => {
//     if (!user.coverPhotoUrl) {
//       return undefined
//     }

//     // If the URL already includes the full domain, use it as is
//     if (user.coverPhotoUrl.startsWith("http")) {
//       return user.coverPhotoUrl
//     }

//     // Otherwise, prepend the API base URL
//     return `${API_BASE_URL}${user.coverPhotoUrl}`
//   }

//   return (
//     <div className="w-[280px] mb-4 p-0 self-end">
//       <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
//         {/* Cover Photo Section */}
//         <div
//           className="relative h-28 w-full cursor-pointer"
//           onClick={handleViewProfile}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           style={{
//             backgroundImage: user.coverPhotoUrl ? `url(${getCoverPhotoUrl()})` : undefined,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             backgroundColor: !user.coverPhotoUrl ? "#4f46e5" : undefined,
//           }}
//         >
//           {isHovered && (
//             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
//               <span className="text-white font-medium px-4 py-2 rounded-lg shadow-md">View Profile</span>
//             </div>
//           )}
//         </div>

//         {/* Profile Image + Info */}
//         <div className="flex flex-col items-center px-4 -mt-10 pb-4 z-20 relative">
//           <img
//             src={getProfilePhotoUrl() || "/placeholder.svg"}
//             alt={user.name}
//             className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md cursor-pointer"
//             onClick={handleViewProfile}
//             onError={(e) => {
//               e.target.onerror = null
//               e.target.src = "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
//             }}
//           />

//           <h3
//             className="mt-2 text-lg font-semibold text-gray-900 cursor-pointer text-center"
//             onClick={handleViewProfile}
//           >
//             {user.name}
//           </h3>

//           {/* Badges */}
//           <div className="mt-1 flex justify-center flex-wrap gap-1 w-full">
//             <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
//               {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//             </span>

//             {user.department && (
//               <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                 {user.department}
//               </span>
//             )}
//           </div>

//           <p className="mt-2 text-sm font-semibold text-gray-800 text-center">
//             {user.role === "student" && user.batch && `Batch: ${user.batch}`}
//             {user.role === "faculty" && user.facultyId && `Faculty ID: ${user.facultyId}`}
//             {user.role === "alumni" && user.company && `Works at ${user.company}`}
//           </p>

//           <div className="mt-4 w-full">
//             {isFollowing ? (
//               <button
//                 disabled
//                 className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 font-medium"
//               >
//                 Connected
//               </button>
//             ) : localRequestSent ? (
//               <button
//                 disabled
//                 className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 font-medium"
//               >
//                 Request Sent
//               </button>
//             ) : (
//               <button
//                 onClick={handleFollow}
//                 className="w-full py-2 px-4 bg-purple-400 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//               >
//                 Connect
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// UserCard.propTypes = {
//   user: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired,
//     batch: PropTypes.string,
//     regNumber: PropTypes.string,
//     facultyId: PropTypes.string,
//     department: PropTypes.string,
//     company: PropTypes.string,
//     passedOutBatch: PropTypes.string,
//     profilePhotoUrl: PropTypes.string,
//     coverPhotoUrl: PropTypes.string,
//   }).isRequired,
//   onFollow: PropTypes.func.isRequired,
//   isFollowing: PropTypes.bool,
//   requestSent: PropTypes.bool,
// }

// export default UserCard

// new

"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const UserCard = ({ user, onFollow, connectionStatus: initialConnectionStatus = "none" }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(initialConnectionStatus)
  const [loading, setLoading] = useState(false)
  
  const API_BASE_URL = "http://localhost:5005"
  const token = localStorage.getItem("token")
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus()
  }, [user._id])

  // Update local state when the prop changes
  useEffect(() => {
    setConnectionStatus(initialConnectionStatus)
  }, [initialConnectionStatus])

  const checkConnectionStatus = async () => {
    try {
      // Check if current user is following this user
      const myConnectionsResponse = await axios.get(`${API_BASE_URL}/api/users/connections`, config)

      // Check if we're following this user
      const isFollowing = myConnectionsResponse.data.following?.some(
        (follow) => follow.following._id === user._id && follow.status === "accepted",
      )

      if (isFollowing) {
        setConnectionStatus("connected")
        return
      }

      // Check if we have a pending request to this user
      const sentRequestsResponse = await axios.get(`${API_BASE_URL}/api/users/sent-requests`, config)
      const hasPendingRequest = sentRequestsResponse.data.sentRequests?.some(
        (request) => request.following._id === user._id,
      )

      if (hasPendingRequest) {
        setConnectionStatus("pending")
        return
      }

      setConnectionStatus("none")
    } catch (error) {
      console.error("Error checking connection status:", error)
      setConnectionStatus("none")
    }
  }

  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`)
  }

  const handleFollow = async () => {
    if (connectionStatus !== "none" || loading) return
    
    try {
      setLoading(true)
      setConnectionStatus("pending") // Update local state immediately
      await onFollow(user._id)
      // Re-check status after the request
      setTimeout(checkConnectionStatus, 1000)
    } catch (error) {
      console.error("Error sending connection request:", error)
      setConnectionStatus("none") // Revert on error
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "faculty":
        return "bg-purple-100 text-purple-800"
      case "alumni":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format profile photo URL correctly
  const getProfilePhotoUrl = () => {
    if (!user.profilePhotoUrl) {
      return "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
    }

    // If the URL already includes the full domain, use it as is
    if (user.profilePhotoUrl.startsWith("http")) {
      return user.profilePhotoUrl
    }

    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${user.profilePhotoUrl}`
  }

  // Format cover photo URL correctly
  const getCoverPhotoUrl = () => {
    if (!user.coverPhotoUrl) {
      return undefined
    }

    // If the URL already includes the full domain, use it as is
    if (user.coverPhotoUrl.startsWith("http")) {
      return user.coverPhotoUrl
    }

    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${user.coverPhotoUrl}`
  }

  const renderConnectionButton = () => {
    if (connectionStatus === "connected") {
      return (
        <button
          disabled
          className="w-full py-2 px-4 border border-green-300 rounded-lg text-green-700 bg-green-50 font-medium flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Connected
        </button>
      )
    }
    
    if (connectionStatus === "pending") {
      return (
        <button
          disabled
          className="w-full py-2 px-4 border border-yellow-300 rounded-lg text-yellow-700 bg-yellow-50 font-medium flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Request Sent
        </button>
      )
    }
    
    return (
      <button
        onClick={handleFollow}
        disabled={loading}
        className="w-full py-2 px-4 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        )}
        Connect
      </button>
    )
  }

  return (
    <div className="w-[280px] mb-4 p-0 self-end">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Cover Photo Section */}
        <div
          className="relative h-28 w-full cursor-pointer"
          onClick={handleViewProfile}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundImage: user.coverPhotoUrl ? `url(${getCoverPhotoUrl()})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: !user.coverPhotoUrl ? "#4f46e5" : undefined,
          }}
        >
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
              <span className="text-white font-medium px-4 py-2 rounded-lg shadow-md">View Profile</span>
            </div>
          )}
        </div>

        {/* Profile Image + Info */}
        <div className="flex flex-col items-center px-4 -mt-10 pb-4 z-2 relative">
          <img
            src={getProfilePhotoUrl() || "/placeholder.svg"}
            alt={user.name}
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md cursor-pointer"
            onClick={handleViewProfile}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
            }}
          />

          <h3
            className="mt-2 text-lg font-semibold text-gray-900 cursor-pointer text-center"
            onClick={handleViewProfile}
          >
            {user.name}
          </h3>

          {/* Badges */}
          <div className="mt-1 flex justify-center flex-wrap gap-1 w-full">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>

            {user.department && (
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {user.department}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm font-semibold text-gray-800 text-center">
            {user.role === "student" && user.batch && `Batch: ${user.batch}`}
            {user.role === "faculty" && user.facultyId && `Faculty ID: ${user.facultyId}`}
            {user.role === "alumni" && user.company && `Works at ${user.company}`}
          </p>

          <div className="mt-4 w-full">
            {renderConnectionButton()}
          </div>
        </div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    batch: PropTypes.string,
    regNumber: PropTypes.string,
    facultyId: PropTypes.string,
    department: PropTypes.string,
    company: PropTypes.string,
    passedOutBatch: PropTypes.string,
    profilePhotoUrl: PropTypes.string,
    coverPhotoUrl: PropTypes.string,
  }).isRequired,
  onFollow: PropTypes.func.isRequired,
  connectionStatus: PropTypes.oneOf(["none", "pending", "connected"]),
}

export default UserCard



// "use client"
// import { Link } from "react-router-dom"
// import ProfilePhoto from "./ProfilePhoto"

// const UserCard = ({ user, onFollow, requestSent, isFollowing }) => {
//   if (!user) return null

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
//       <Link to={`/profile/${user._id}`} className="mb-3">
//         <ProfilePhoto src={user.profilePhotoUrl} alt={user.name} size="xl" className="border-2 border-indigo-100" />
//       </Link>

//       <Link to={`/profile/${user._id}`} className="text-center">
//         <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
//       </Link>

//       <p className="text-sm text-gray-500 capitalize mb-2">{user.role}</p>

//       {user.department && (
//         <p className="text-xs text-gray-600 mb-1">
//           <span className="font-medium">Department:</span> {user.department}
//         </p>
//       )}

//       {user.company && (
//         <p className="text-xs text-gray-600 mb-1">
//           <span className="font-medium">Company:</span> {user.company}
//         </p>
//       )}

//       {user.batch && (
//         <p className="text-xs text-gray-600 mb-1">
//           <span className="font-medium">Batch:</span> {user.batch}
//         </p>
//       )}

//       <div className="mt-auto pt-3 w-full">
//         {isFollowing ? (
//           <button
//             className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md font-medium flex items-center justify-center"
//             disabled
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             Connected
//           </button>
//         ) : requestSent ? (
//           <button className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-md font-medium" disabled>
//             Request Sent
//           </button>
//         ) : (
//           <button
//             onClick={onFollow}
//             className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
//           >
//             Connect
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default UserCard
