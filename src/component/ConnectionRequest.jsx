// "use client"

// const ConnectionRequest = ({ request, onAccept, onReject }) => {
//   const { follower } = request

//   // Format role for display
//   const formatRole = (role) => {
//     return role.charAt(0).toUpperCase() + role.slice(1)
//   }

//   return (
//     <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
//       <div className="flex items-center space-x-3">
//         {/* Profile Image */}
//         <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
//           <img
//             src={follower.profilePhotoUrl || "/default-profile.jpg"}
//             alt={`${follower.name}'s profile`}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.onerror = null
//               e.target.src = "/default-profile.jpg"
//             }}
//           />
//         </div>

//         {/* User Info */}
//         <div>
//           <h3 className="font-medium text-gray-800">{follower.name}</h3>
//           <p className="text-sm text-gray-600">{formatRole(follower.role)}</p>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex space-x-2">
//         <button
//           onClick={onAccept}
//           className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
//         >
//           Accept
//         </button>
//         <button
//           onClick={onReject}
//           className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
//         >
//           Ignore
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ConnectionRequest

// ***********************************************************************************************


// import React from "react"
// import PropTypes from "prop-types"

// const ConnectionRequest = ({ request, onAccept, onReject }) => {
//   const { follower } = request

//   return (
//     <div className="flex items-center justify-between p-4 bg-white rounded-lg border mb-3">
//       <div className="flex items-center space-x-4">
//         <img
//           src={follower.profilePhotoUrl || "/placeholder.svg"}
//           alt={follower.name}
//           className="w-12 h-12 rounded-full object-cover"
//           onError={(e) => {
//             e.target.onerror = null
//             e.target.src = "/default-profile.jpg"
//           }}
//         />
//         <div>
//           <h4 className="font-medium text-gray-900">{follower.name}</h4>
//           <p className="text-sm text-gray-500 capitalize">{follower.role}</p>
//         </div>
//       </div>
//       <div className="flex space-x-2">
//         <button
//           onClick={onReject}
//           className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
//         >
//           Ignore
//         </button>
//         <button
//           onClick={onAccept}
//           className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//         >
//           Accept
//         </button>
//       </div>
//     </div>
//   )
// }

// ConnectionRequest.propTypes = {
//   request: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     follower: PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       name: PropTypes.string.isRequired,
//       email: PropTypes.string.isRequired,
//       role: PropTypes.string.isRequired,
//       profilePhotoUrl: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
//   onAccept: PropTypes.func.isRequired,
//   onReject: PropTypes.func.isRequired,
// }

// export default ConnectionRequest


// "use client"
// import PropTypes from "prop-types"

// const ConnectionRequest = ({ request, onAccept, onReject }) => {
//   console.log("Rendering connection request:", request)

//   // Check if the request has the necessary data structure
//   if (!request || !request.follower) {
//     console.error("Invalid request format:", request)
//     return null
//   }

//   const { follower } = request

//   return (
//     <div className="flex items-center justify-between p-4 bg-white rounded-lg border mb-3 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center space-x-4">
//         <img
//           src={
//             follower.profilePhotoUrl ||
//             "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180" ||
//             "/placeholder.svg"
//           }
//           alt={follower.name || "User"}
//           className="w-12 h-12 rounded-full object-cover border border-gray-200"
//           onError={(e) => {
//             e.target.onerror = null
//             e.target.src = "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
//           }}
//         />
//         <div>
//           <h4 className="font-medium text-gray-900">{follower.name || "Unknown User"}</h4>
//           <p className="text-sm text-gray-500 capitalize">
//             {follower.role || "User"}
//             {follower.department && ` • ${follower.department}`}
//           </p>
//         </div>
//       </div>
//       <div className="flex space-x-2">
//         <button
//           onClick={onReject}
//           className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
//         >
//           Ignore
//         </button>
//         <button
//           onClick={onAccept}
//           className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//         >
//           Accept
//         </button>
//       </div>
//     </div>
//   )
// }

// ConnectionRequest.propTypes = {
//   request: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     follower: PropTypes.shape({
//       _id: PropTypes.string,
//       name: PropTypes.string,
//       email: PropTypes.string,
//       role: PropTypes.string,
//       department: PropTypes.string,
//       profilePhotoUrl: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
//   onAccept: PropTypes.func.isRequired,
//   onReject: PropTypes.func.isRequired,
// }

// export default ConnectionRequest


// "use client"
// import PropTypes from "prop-types"
// import { useNavigate } from "react-router-dom"

// const ConnectionRequest = ({ request, onAccept, onReject }) => {
//   const navigate = useNavigate()

//   // Check if the request has the necessary data structure
//   if (!request || !request.follower) {
//     console.error("Invalid request format:", request)
//     return null
//   }

//   const { follower } = request

//   // Navigate to the follower's profile on dp click
//   const handleDpClick = () => {
//     if (follower._id) {
//       navigate(`/profile/${follower._id}`)
//     }
//   }

//   return (
//     <div className="flex items-center justify-between p-4 bg-white rounded-lg border mb-3 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center space-x-4">
//         <img
//           src={
//             follower.profilePhotoUrl ||
//             "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
//           }
//           alt={follower.name || "User"}
//           className="w-12 h-12 rounded-full object-cover border border-gray-200 cursor-pointer"
//           onClick={handleDpClick}
//           onError={(e) => {
//             e.target.onerror = null
//             e.target.src = "https://tse2.mm.bing.net/th?id=OIP.lvzPu-WOW4Iv7QyjP-IkrgHaHa&pid=Api&P=0&h=180"
//           }}
//         />
//         <div>
//           <h4 className="font-medium text-gray-900">{follower.name || "Unknown User"}</h4>
//           <p className="text-sm text-gray-500 capitalize">
//             {follower.role || "User"}
//             {follower.department && ` • ${follower.department}`}
//           </p>
//         </div>
//       </div>
//       <div className="flex space-x-2">
//         <button
//           onClick={onReject}
//           className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
//         >
//           Ignore
//         </button>
//         <button
//           onClick={onAccept}
//           className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//         >
//           Accept
//         </button>
//       </div>
//     </div>
//   )
// }

// ConnectionRequest.propTypes = {
//   request: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     follower: PropTypes.shape({
//       _id: PropTypes.string,
//       name: PropTypes.string,
//       email: PropTypes.string,
//       role: PropTypes.string,
//       department: PropTypes.string,
//       profilePhotoUrl: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
//   onAccept: PropTypes.func.isRequired,
//   onReject: PropTypes.func.isRequired,
// }

// export default ConnectionRequest


// "use client"

// import PropTypes from "prop-types"
// import { useNavigate } from "react-router-dom"
// import ProfilePhoto from "./ProfilePhoto"

// const ConnectionRequest = ({ request, onAccept, onReject }) => {
//   const navigate = useNavigate()

//   // Check if the request has the necessary data structure
//   if (!request || !request.follower) {
//     console.error("Invalid request format:", request)
//     return null
//   }

//   const { follower } = request

//   // Navigate to the follower's profile on dp click
//   const handleDpClick = () => {
//     if (follower._id) {
//       navigate(`/profile/${follower._id}`)
//     }
//   }

//   return (
//     <div className="flex items-center justify-between p-4 bg-white rounded-lg border mb-3 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center space-x-4">
//         <ProfilePhoto
//           src={follower.profilePhotoUrl}
//           alt={follower.name || "User"}
//           size="lg"
//           className="cursor-pointer border border-gray-200"
//           onClick={handleDpClick}
//         />
//         <div>
//           <h4 className="font-medium text-gray-900">{follower.name || "Unknown User"}</h4>
//           <p className="text-sm text-gray-500 capitalize">
//             {follower.role || "User"}
//             {follower.department && ` • ${follower.department}`}
//           </p>
//         </div>
//       </div>
//       <div className="flex space-x-2">
//         <button
//           onClick={onReject}
//           className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
//         >
//           Ignore
//         </button>
//         <button
//           onClick={onAccept}
//           className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//         >
//           Accept
//         </button>
//       </div>
//     </div>
//   )
// }

// ConnectionRequest.propTypes = {
//   request: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     follower: PropTypes.shape({
//       _id: PropTypes.string,
//       name: PropTypes.string,
//       email: PropTypes.string,
//       role: PropTypes.string,
//       department: PropTypes.string,
//       profilePhotoUrl: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
//   onAccept: PropTypes.func.isRequired,
//   onReject: PropTypes.func.isRequired,
// }

// export default ConnectionRequest

"use client"

import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import ProfilePhoto from "./ProfilePhoto"

const ConnectionRequest = ({ request, onAccept, onReject }) => {
  const navigate = useNavigate()

  // Check if the request has the necessary data structure
  if (!request || !request.follower) {
    console.error("Invalid request format:", request)
    return null
  }

  const { follower } = request

  // Navigate to the follower's profile on dp click
  const handleDpClick = () => {
    if (follower._id) {
      navigate(`/profile/${follower._id}`)
    }
  }

  // Handle accept with callback to refresh connections modal
  const handleAccept = () => {
    onAccept(request._id)
  }

  // Handle reject with callback
  const handleReject = () => {
    onReject(request._id)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <ProfilePhoto
          src={follower.profilePhotoUrl}
          alt={follower.name || "User"}
          size="lg"
          className="cursor-pointer border border-gray-200"
          onClick={handleDpClick}
        />
        <div>
          <h4 className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600" onClick={handleDpClick}>
            {follower.name || "Unknown User"}
          </h4>
          <p className="text-sm text-gray-500 capitalize">
            {follower.role || "User"}
            {follower.department && ` • ${follower.department}`}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleReject}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Ignore
        </button>
        <button
          onClick={handleAccept}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

ConnectionRequest.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    follower: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      department: PropTypes.string,
      profilePhotoUrl: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
}

export default ConnectionRequest

