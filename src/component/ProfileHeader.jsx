// import React, { useState, useEffect } from 'react';
// import Navbar from "./Navbar";

// const ProfileHeader = ({ 
//   name, 
//   email, 
//   stats = { followers: 0, following: 0, posts: 0 }, 
//   editable,
//   onPhotoChange,
//   profilePhotoUrl,
//   coverPhotoUrl
// }) => {
//   const [coverPhoto, setCoverPhoto] = useState(null);
//   const [profilePhoto, setProfilePhoto] = useState(null);
  
//   useEffect(() => {
//     if (coverPhotoUrl) {
//       setCoverPhoto(coverPhotoUrl);
//     }
//     if (profilePhotoUrl) {
//       setProfilePhoto(profilePhotoUrl);
//     }
//   }, [coverPhotoUrl, profilePhotoUrl]);

//   const handleCoverUpload = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setCoverPhoto(URL.createObjectURL(file));
//       if (onPhotoChange) {
//         onPhotoChange("cover", file);
//       }
//     }
//   };

//   const handleProfileUpload = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setProfilePhoto(URL.createObjectURL(file));
//       if (onPhotoChange) {
//         onPhotoChange("profile", file);
//       }
//     }
//   };

//   return (
//     <>
//     <Navbar />
//     <div className="relative w-full bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800 pb-16">
//       {/* Cover Photo */}
//       <div className="w-full h-64 bg-gray-300 relative">
//         {coverPhoto ? (
//           <div className="w-full h-full relative">
//             <img
//               src={coverPhoto || "/placeholder.svg"}
//               alt="Cover"
//               className="w-full h-full object-cover"
//               draggable="false"
//             />
//             {editable && (
//               <div className="absolute bottom-2 right-2">
//                 <label htmlFor="coverUpload" className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full cursor-pointer shadow-md">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </label>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-600">
//             {editable ? (
//               <label htmlFor="coverUpload" className="cursor-pointer">
//                 Click to upload cover photo
//               </label>
//             ) : (
//               <div>No cover photo</div>
//             )}
//           </div>
//         )}
//         {editable && (
//           <input
//             id="coverUpload"
//             type="file"
//             accept="image/*"
//             onChange={handleCoverUpload}
//             className="hidden"
//           />
//         )}
//       </div>

//       {/* Profile & Info */}
//       <div className="flex flex-col md:flex-row items-center md:items-end gap-4 px-6">
//         <div className="relative -mt-20">
//           <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
//             {profilePhoto ? (
//               <div className="relative w-full h-full">
//                 <img
//                   src={profilePhoto || "/placeholder.svg"}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                   draggable="false"
//                 />
//                 {editable && (
//                   <div className="absolute bottom-0 right-0 p-2">
//                     <label htmlFor="profileUpload" className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full cursor-pointer shadow-md">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </label>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white">
//                 {editable ? (
//                   <label htmlFor="profileUpload" className="cursor-pointer">
//                     Upload
//                   </label>
//                 ) : (
//                   <div>No profile photo</div>
//                 )}
//               </div>
//             )}
//             {editable && (
//               <input
//                 id="profileUpload"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfileUpload}
//                 className="hidden"
//               />
//             )}
//           </div>
//         </div>

//         {/* Name + Email + Stats */}
//         <div className="flex-1">
//           <div className="text-center md:text-left">
//             <h1 className="text-2xl font-bold text-indigo-700">{name}</h1>
//             <p className="text-gray-600">{email}</p>
//           </div>

//           <div className="flex gap-8 justify-center md:justify-start mt-4">
//             <div className="text-center">
//               <h2 className="text-xl font-semibold text-indigo-600">{stats?.followers || 0}</h2>
//               <p className="text-gray-500">Followers</p>
//             </div>
//             <div className="text-center">
//               <h2 className="text-xl font-semibold text-indigo-600">{stats?.following || 0}</h2>
//               <p className="text-gray-500">Following</p>
//             </div>
//             <div className="text-center">
//               <h2 className="text-xl font-semibold text-indigo-600">{stats?.posts || 0}</h2>
//               <p className="text-gray-500">Posts</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default ProfileHeader;
// **************************************************

// "use client"

// import { useState, useEffect } from "react"
// import Navbar from "./Navbar"
// import ProfilePhoto from "./ProfilePhoto"

// const ProfileHeader = ({
//   name,
//   email,
//   stats = { followers: 0, following: 0, posts: 0 },
//   editable,
//   onPhotoChange,
//   profilePhotoUrl,
//   coverPhotoUrl,
// }) => {
//   const [coverPhoto, setCoverPhoto] = useState(null)
//   const [profilePhoto, setProfilePhoto] = useState(null)

//   useEffect(() => {
//     if (coverPhotoUrl) {
//       setCoverPhoto(coverPhotoUrl)
//     }
//     if (profilePhotoUrl) {
//       setProfilePhoto(profilePhotoUrl)
//     }
//   }, [coverPhotoUrl, profilePhotoUrl])

//   const handleCoverUpload = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setCoverPhoto(URL.createObjectURL(file))
//       if (onPhotoChange) {
//         onPhotoChange("cover", file)
//       }
//     }
//   }

//   const handleProfileUpload = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setProfilePhoto(URL.createObjectURL(file))
//       if (onPhotoChange) {
//         onPhotoChange("profile", file)
//       }
//     }
//   }

//   const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150"

//   return (
//     <>
//       <Navbar />
//       <div className="relative w-full bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800 pb-16">
//         {/* Cover Photo */}
//         <div className="w-full h-64 bg-gray-300 relative">
//           {coverPhoto ? (
//             <div className="w-full h-full relative">
//               <img
//                 src={coverPhoto || "/placeholder.svg"}
//                 alt="Cover"
//                 className="w-full h-full object-cover"
//                 draggable="false"
//               />
//               {editable && (
//                 <div className="absolute bottom-2 right-2">
//                   <label
//                     htmlFor="coverUpload"
//                     className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full cursor-pointer shadow-md"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-700"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                   </label>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-600">
//               {editable ? (
//                 <label htmlFor="coverUpload" className="cursor-pointer">
//                   Click to upload cover photo
//                 </label>
//               ) : (
//                 <div>No cover photo</div>
//               )}
//             </div>
//           )}
//           {editable && (
//             <input id="coverUpload" type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
//           )}
//         </div>

//         {/* Profile & Info */}
//         <div className="flex flex-col md:flex-row items-center md:items-end gap-4 px-6">
//           <div className="relative -mt-20">
//             <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
//               {profilePhoto ? (
//                 <div className="relative w-full h-full">
//                   <ProfilePhoto src={profilePhoto} alt={name || "Profile"} size="3xl" className="border-0" />
//                   {editable && (
//                     <div className="absolute bottom-0 right-0 p-2">
//                       <label
//                         htmlFor="profileUpload"
//                         className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full cursor-pointer shadow-md"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5 text-gray-700"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                       </label>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white">
//                   {editable ? (
//                     <label htmlFor="profileUpload" className="cursor-pointer">
//                       Upload
//                     </label>
//                   ) : (
//                     <ProfilePhoto src={DEFAULT_PROFILE_IMAGE} alt={name || "Profile"} size="3xl" />
//                   )}
//                 </div>
//               )}
//               {editable && (
//                 <input
//                   id="profileUpload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleProfileUpload}
//                   className="hidden"
//                 />
//               )}
//             </div>
//           </div>

//           {/* Name + Email + Stats */}
//           <div className="flex-1">
//             <div className="text-center md:text-left">
//               <h1 className="text-2xl font-bold text-indigo-700">{name}</h1>
//               <p className="text-gray-600">{email}</p>
//             </div>

//             <div className="flex gap-8 justify-center md:justify-start mt-4">
//               <div className="text-center">
//                 <h2 className="text-xl font-semibold text-indigo-600">{stats?.followers || 0}</h2>
//                 <p className="text-gray-500">Followers</p>
//               </div>
//               <div className="text-center">
//                 <h2 className="text-xl font-semibold text-indigo-600">{stats?.following || 0}</h2>
//                 <p className="text-gray-500">Following</p>
//               </div>
//               <div className="text-center">
//                 <h2 className="text-xl font-semibold text-indigo-600">{stats?.posts || 0}</h2>
//                 <p className="text-gray-500">Posts</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default ProfileHeader

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./Navbar"
import FollowersList from "./followers-list"

const ProfileHeader = ({
  name,
  email,
  stats = { followers: 0, following: 0, posts: 0 },
  editable,
  onPhotoChange,
  profilePhotoUrl,
  coverPhotoUrl,
  userId,
  currentUserId,
}) => {
  const [coverPhoto, setCoverPhoto] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [localStats, setLocalStats] = useState(stats)
  const [connectionStatus, setConnectionStatus] = useState("none") // none, pending, connected
  const [loading, setLoading] = useState(false)

  // API base URL
  const API_BASE_URL = "http://localhost:5005"

  // Get the token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Set up axios headers
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  useEffect(() => {
    // Update state when props change
    if (coverPhotoUrl) {
      setCoverPhoto(`${API_BASE_URL}${coverPhotoUrl}`)
    }
    if (profilePhotoUrl) {
      setProfilePhoto(`${API_BASE_URL}${profilePhotoUrl}`)
    }
    setLocalStats(stats)
  }, [coverPhotoUrl, profilePhotoUrl, stats])

  // Check connection status when component mounts
  useEffect(() => {
    if (userId && currentUserId && userId !== currentUserId) {
      checkConnectionStatus()
    }
  }, [userId, currentUserId])

  // Check if current user is following or has sent a request to the profile owner
  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/connections/${userId}`, config)

      // Check if current user is following or has a pending request
      const currentUserInFollowers = response.data.followers.find((follow) => follow.follower._id === currentUserId)

      if (currentUserInFollowers) {
        setConnectionStatus(currentUserInFollowers.status === "accepted" ? "connected" : "pending")
      } else {
        setConnectionStatus("none")
      }
    } catch (error) {
      console.error("Error checking connection status:", error)
    }
  }

  const handleCoverUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverPhoto(URL.createObjectURL(file))
      if (onPhotoChange) {
        onPhotoChange("cover", file)
      }
    }
  }

  const handleProfileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(URL.createObjectURL(file))
      if (onPhotoChange) {
        onPhotoChange("profile", file)
      }
    }
  }

  // Send connection request
  const sendConnectionRequest = async () => {
    try {
      setLoading(true)
      await axios.post(`${API_BASE_URL}/api/users/follow/${userId}`, {}, config)
      setConnectionStatus("pending")
      // Update local stats - but don't increment until request is accepted
      // We'll leave this comment here but not increment as pending requests don't count as followers
    } catch (error) {
      console.error("Error sending connection request:", error)
    } finally {
      setLoading(false)
    }
  }

  // Start a conversation
  const startConversation = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          recipientId: userId,
          content: `Hello ${name}! I'd like to connect with you.`,
        },
        config,
      )

      if (response.data.success) {
        window.location.href = "/messages"
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    } finally {
      setLoading(false)
    }
  }

  // Default image if src is not provided or fails to load
  const DEFAULT_PROFILE_IMAGE = "https://tse2.mm.bing.net/th?id=OIP.T60Aago6tLDepIF5alRigwHaHa&pid=Api&P=0&h=180"

  return (
    <>
      <Navbar />
      <div className="relative w-full bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800 pb-16">
        {/* Cover Photo */}
        <div className="w-full h-64 bg-gray-300 relative">
          {coverPhoto ? (
            <div className="w-full h-full relative">
              <img
                src={coverPhoto || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-full object-cover"
                draggable="false"
              />
              {editable && (
                <div className="absolute bottom-2 right-2">
                  <label
                    htmlFor="coverUpload"
                    className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full cursor-pointer shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-600">
              {editable ? (
                <label htmlFor="coverUpload" className="cursor-pointer">
                  Click to upload cover photo
                </label>
              ) : (
                <div>No cover photo</div>
              )}
            </div>
          )}
          {editable && (
            <input id="coverUpload" type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          )}
        </div>

        {/* Profile & Info */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 px-6">
          <div className="relative -mt-20">
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {profilePhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={profilePhoto || "/placeholder.svg"}
                    alt={name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = DEFAULT_PROFILE_IMAGE
                    }}
                  />
                  {editable && (
                    <div className="absolute bottom-0 right-0 p-2">
                      <label
                        htmlFor="profileUpload"
                        className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full cursor-pointer shadow-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white">
                  {editable ? (
                    <label htmlFor="profileUpload" className="cursor-pointer">
                      Upload
                    </label>
                  ) : (
                    <img
                      src={DEFAULT_PROFILE_IMAGE || "/placeholder.svg"}
                      alt={name || "Profile"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = DEFAULT_PROFILE_IMAGE
                      }}
                    />
                  )}
                </div>
              )}
              {editable && (
                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  className="hidden"
                />
              )}
            </div>
          </div>

          {/* Name + Email + Stats */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-indigo-700">{name}</h1>
                <p className="text-gray-600">{email}</p>
              </div>

              {/* Connection buttons for viewing other profiles */}
              {userId && userId !== currentUserId && (
                <div className="flex mt-4 md:mt-0">
                  {/* {connectionStatus === "none" && (
                    <button
                      onClick={sendConnectionRequest}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      {loading ? "Sending..." : "Connect"}
                    </button>
                  )}
                  {connectionStatus === "pending" && (
                    <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                      Request Sent
                    </button>
                  )} */}
                  <button
                    onClick={startConversation}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 mr-10 text-white rounded-lg hover:bg-indigo-700 mt-5 transition"
                  >
                    {loading ? "Loading..." : "Message"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-8 justify-center md:justify-start mt-4">
              <div
                className="text-center cursor-pointer hover:bg-indigo-50 rounded-lg p-2 transition-colors"
                onClick={() => setShowFollowers(true)}
              >
                <h2 className="text-xl font-semibold text-indigo-600">{localStats?.followers || 0}</h2>
                <p className="text-gray-500">Followers</p>
              </div>
              <div
                className="text-center cursor-pointer hover:bg-indigo-50 rounded-lg p-2 transition-colors"
                onClick={() => setShowFollowing(true)}
              >
                <h2 className="text-xl font-semibold text-indigo-600">{localStats?.following || 0}</h2>
                <p className="text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      <FollowersList isOpen={showFollowers} onClose={() => setShowFollowers(false)} userId={userId} type="followers" />

      {/* Following Modal */}
      <FollowersList isOpen={showFollowing} onClose={() => setShowFollowing(false)} userId={userId} type="following" />
    </>
  )
}

export default ProfileHeader

