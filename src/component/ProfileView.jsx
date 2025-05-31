// "use client"

// import { useState, useEffect } from "react"
// import { useParams, Link } from "react-router-dom"
// import { useUser } from "../contexts/UserContext"
// import Navbar from "./Navbar"

// const ProfileView = () => {
//   const { userId } = useParams()
//   const { user: currentUser } = useUser()
//   const [profile, setProfile] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [connectionStatus, setConnectionStatus] = useState("none")
//   const [connectionId, setConnectionId] = useState(null)
//   const [activeTab, setActiveTab] = useState("about")

//   useEffect(() => {
//     const fetchProfileAndConnection = async () => {
//       try {
//         setIsLoading(true)

//         // Fetch profile
//         const profileResponse = await fetch(`http://localhost:5005/api/profiles/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         if (!profileResponse.ok) {
//           throw new Error("Failed to fetch profile")
//         }

//         const profileData = await profileResponse.json()
//         setProfile(profileData.profile)

//         // Fetch connection status if not viewing own profile
//         if (userId !== currentUser?._id) {
//           const connectionsResponse = await fetch("http://localhost:5005/api/users/connections", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           })

//           if (!connectionsResponse.ok) {
//             throw new Error("Failed to fetch connections")
//           }

//           const connectionsData = await connectionsResponse.json()
//           const connection = connectionsData.connections.find((c) => c.requester === userId || c.recipient === userId)

//           if (!connection) {
//             setConnectionStatus("none")
//           } else if (connection.status === "pending") {
//             setConnectionStatus("pending")
//             setConnectionId(connection._id)
//           } else if (connection.status === "accepted") {
//             setConnectionStatus("connected")
//             setConnectionId(connection._id)
//           }
//         }

//         setIsLoading(false)
//       } catch (err) {
//         console.error("Error fetching profile:", err)
//         setError(err.message)
//         setIsLoading(false)
//       }
//     }

//     if (userId) {
//       fetchProfileAndConnection()
//     }
//   }, [userId, currentUser])

//   const handleConnect = async () => {
//     try {
//       const response = await fetch(`http://localhost:5005/api/users/connect/${userId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to connect with user")
//       }

//       const data = await response.json()
//       setConnectionStatus("pending")
//       setConnectionId(data.connection._id)
//     } catch (err) {
//       console.error("Error connecting with user:", err)
//       alert(`Failed to send connection request: ${err.message}`)
//     }
//   }

//   const handleCancelRequest = async () => {
//     if (!connectionId) return

//     try {
//       const response = await fetch(`http://localhost:5005/api/users/connections/${connectionId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to cancel connection request")
//       }

//       setConnectionStatus("none")
//       setConnectionId(null)
//     } catch (err) {
//       console.error("Error canceling connection request:", err)
//       alert(`Failed to cancel connection request: ${err.message}`)
//     }
//   }

//   const handleAcceptRequest = async () => {
//     if (!connectionId) return

//     try {
//       const response = await fetch(`http://localhost:5005/api/users/connections/${connectionId}/accept`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to accept connection request")
//       }

//       setConnectionStatus("connected")
//     } catch (err) {
//       console.error("Error accepting connection request:", err)
//       alert(`Failed to accept connection request: ${err.message}`)
//     }
//   }

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto p-4 max-w-4xl">
//           <div className="bg-gray-100 h-48 rounded-t-lg relative">
//             <div className="absolute -bottom-16 left-8 w-32 h-32 bg-gray-300 rounded-full border-4 border-white animate-pulse"></div>
//           </div>
//           <div className="pt-20 px-8">
//             <div className="h-8 bg-gray-300 w-1/3 mb-2 animate-pulse rounded"></div>
//             <div className="h-4 bg-gray-200 w-1/4 mb-6 animate-pulse rounded"></div>
//             <div className="flex gap-4 mb-8">
//               <div className="h-10 bg-gray-200 w-32 animate-pulse rounded"></div>
//               <div className="h-10 bg-gray-200 w-32 animate-pulse rounded"></div>
//             </div>
//             <div className="h-4 bg-gray-200 w-full mb-2 animate-pulse rounded"></div>
//             <div className="h-4 bg-gray-200 w-full mb-2 animate-pulse rounded"></div>
//             <div className="h-4 bg-gray-200 w-2/3 animate-pulse rounded"></div>
//           </div>
//         </div>
//       </>
//     )
//   }

//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-[calc(100vh-64px)]">
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
//             <p className="font-bold">Error</p>
//             <p>{error}</p>
//           </div>
//         </div>
//       </>
//     )
//   }

//   if (!profile) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-[calc(100vh-64px)]">
//           <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
//             <p className="font-bold">Profile Not Found</p>
//             <p>The requested profile could not be found.</p>
//           </div>
//         </div>
//       </>
//     )
//   }

//   const isOwnProfile = userId === currentUser?._id

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-4 max-w-4xl">
//         {/* Cover Photo and Profile Photo */}
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 rounded-t-lg relative">
//           {profile.coverPhotoUrl && (
//             <img
//               src={`http://localhost:5005${profile.coverPhotoUrl}`}
//               alt="Cover"
//               className="w-full h-full object-cover rounded-t-lg"
//             />
//           )}

//           {/* Role badge */}
//           <div className="absolute top-4 right-4 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
//             {profile.role === "student" && (
//               <>
//                 <i className="fas fa-graduation-cap mr-1"></i> Student
//               </>
//             )}
//             {profile.role === "faculty" && (
//               <>
//                 <i className="fas fa-building mr-1"></i> Faculty
//               </>
//             )}
//             {profile.role === "alumni" && (
//               <>
//                 <i className="fas fa-briefcase mr-1"></i> Alumni
//               </>
//             )}
//           </div>

//           {/* Profile photo */}
//           <div className="absolute -bottom-16 left-8">
//             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white overflow-hidden">
//               {profile.profilePhotoUrl ? (
//                 <img
//                   src={`http://localhost:5005${profile.profilePhotoUrl}`}
//                   alt={profile.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-blue-600">{profile.name.charAt(0).toUpperCase()}</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="bg-white rounded-b-lg shadow-md pt-20 px-8 pb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold">{profile.name}</h1>
//               <p className="text-gray-600 flex items-center mt-1">
//                 <i className="fas fa-envelope mr-2"></i>
//                 {profile.email}
//               </p>
//             </div>

//             <div className="mt-4 md:mt-0 flex gap-2">
//               {!isOwnProfile && (
//                 <>
//                   {connectionStatus === "none" && (
//                     <button
//                       onClick={handleConnect}
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
//                     >
//                       <i className="fas fa-user-plus"></i>
//                       Connect
//                     </button>
//                   )}

//                   {connectionStatus === "pending" && (
//                     <button
//                       onClick={handleCancelRequest}
//                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
//                     >
//                       Cancel Request
//                     </button>
//                   )}

//                   {connectionStatus === "connected" && (
//                     <button
//                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded cursor-not-allowed flex items-center gap-2"
//                       disabled
//                     >
//                       <i className="fas fa-user-check"></i>
//                       Connected
//                     </button>
//                   )}

//                   <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center gap-2">
//                     <i className="fas fa-comment"></i>
//                     Message
//                   </button>
//                 </>
//               )}

//               {isOwnProfile && (
//                 <Link
//                   to="/edit-profile"
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
//                 >
//                   Edit Profile
//                 </Link>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 mb-6">
//             <div className="flex-1 min-w-[120px] border rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{profile.stats?.followers || 0}</p>
//               <p className="text-gray-500">Followers</p>
//             </div>

//             <div className="flex-1 min-w-[120px] border rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{profile.stats?.following || 0}</p>
//               <p className="text-gray-500">Following</p>
//             </div>

//             <div className="flex-1 min-w-[120px] border rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{profile.stats?.posts || 0}</p>
//               <p className="text-gray-500">Posts</p>
//             </div>
//           </div>

//           <div className="border-b mb-4">
//             <div className="flex">
//               <button
//                 className={`px-4 py-2 font-medium ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("about")}
//               >
//                 About
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium ${activeTab === "skills" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("skills")}
//               >
//                 Skills
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("posts")}
//               >
//                 Posts
//               </button>
//             </div>
//           </div>

//           {activeTab === "about" && (
//             <div className="space-y-4">
//               {profile.about && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">About</h3>
//                   <p className="text-gray-700">{profile.about}</p>
//                 </div>
//               )}

//               {/* Role-specific details */}
//               {profile.role === "student" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.branch && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-book text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Branch</p>
//                         <p className="text-gray-600">{profile.branch}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.yearOfStudy && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-calendar text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Year of Study</p>
//                         <p className="text-gray-600">{profile.yearOfStudy}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.batch && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-users text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Batch</p>
//                         <p className="text-gray-600">{profile.batch}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.regNumber && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-id-card text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Registration Number</p>
//                         <p className="text-gray-600">{profile.regNumber}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {profile.role === "faculty" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.department && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-building text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Department</p>
//                         <p className="text-gray-600">{profile.department}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.designation && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-award text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Designation</p>
//                         <p className="text-gray-600">{profile.designation}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.facultyId && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-id-badge text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Faculty ID</p>
//                         <p className="text-gray-600">{profile.facultyId}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.researchInterests && profile.researchInterests.length > 0 && (
//                     <div className="flex items-start gap-2 col-span-2">
//                       <i className="fas fa-microscope text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Research Interests</p>
//                         <div className="flex flex-wrap gap-2 mt-1">
//                           {profile.researchInterests.map((interest, index) => (
//                             <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
//                               {interest}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {profile.role === "alumni" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.currentJobTitle && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-briefcase text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Current Job</p>
//                         <p className="text-gray-600">{profile.currentJobTitle}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.company && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-building text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Company</p>
//                         <p className="text-gray-600">{profile.company}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.graduationYear && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-graduation-cap text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Graduation Year</p>
//                         <p className="text-gray-600">{profile.graduationYear}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.linkedinProfile && (
//                     <div className="flex items-start gap-2">
//                       <i className="fab fa-linkedin text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">LinkedIn</p>
//                         <a
//                           href={profile.linkedinProfile}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           View Profile
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === "skills" && (
//             <div>
//               {profile.skills && profile.skills.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {profile.skills.map((skill, index) => (
//                     <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No skills listed yet.</p>
//               )}
//             </div>
//           )}

//           {activeTab === "posts" && (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Posts will appear here.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default ProfileView

// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "./Navbar"
// import ProfilePhoto from "./ProfilePhoto"

// const ProfileView = () => {
//   const { userId } = useParams()
//   const navigate = useNavigate()
//   const [profile, setProfile] = useState(null)
//   const [connections, setConnections] = useState({ followers: [], following: [] })
//   const [connectionStatus, setConnectionStatus] = useState("none") // none, pending, connected
//   const [activeTab, setActiveTab] = useState("followers")
//   const [loading, setLoading] = useState({
//     profile: true,
//     connections: true,
//     action: false,
//   })

//   const API_BASE_URL = "http://localhost:5005"
//   const token = localStorage.getItem("token")

//   const config = {
//     headers: {
//       Authorization: token,
//     },
//   }

//   useEffect(() => {
//     if (!token) {
//       navigate("/login")
//     }
//   }, [navigate, token])

//   const fetchProfile = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, profile: true }))
//       const response = await axios.get(`${API_BASE_URL}/api/profiles/${userId}`, config)
//       setProfile(response.data.profile)
//     } catch (error) {
//       console.error("Error fetching profile:", error)
//       toast.error("Failed to load profile")
//     } finally {
//       setLoading((prev) => ({ ...prev, profile: false }))
//     }
//   }

//   const fetchConnections = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, connections: true }))
//       const response = await axios.get(`${API_BASE_URL}/api/users/connections/${userId}`, config)
//       setConnections({
//         followers: response.data.followers,
//         following: response.data.following,
//       })

//       // Check if current user is following or has a pending request
//       const currentUserId = localStorage.getItem("userId")
//       if (currentUserId) {
//         const isFollowing = response.data.followers.some(
//           (follow) => follow.follower._id === currentUserId && follow.status === "accepted",
//         )
//         const isPending = response.data.followers.some(
//           (follow) => follow.follower._id === currentUserId && follow.status === "pending",
//         )
//         setConnectionStatus(isFollowing ? "connected" : isPending ? "pending" : "none")
//       }
//     } catch (error) {
//       console.error("Error fetching connections:", error)
//       toast.error("Failed to load connections")
//     } finally {
//       setLoading((prev) => ({ ...prev, connections: false }))
//     }
//   }

//   const sendConnectionRequest = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, action: true }))
//       await axios.post(`${API_BASE_URL}/api/users/follow/${userId}`, {}, config)
//       setConnectionStatus("pending")
//       toast.success("Connection request sent!")
//     } catch (error) {
//       console.error("Error sending connection request:", error)
//       toast.error(error.response?.data?.message || "Failed to send connection request")
//     } finally {
//       setLoading((prev) => ({ ...prev, action: false }))
//     }
//   }

//   const startConversation = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, action: true }))
//       const response = await axios.post(
//         `${API_BASE_URL}/api/messages`,
//         {
//           recipientId: userId,
//           content: `Hello ${profile?.name}! I'd like to connect with you.`,
//         },
//         config,
//       )

//       if (response.data.success) {
//         navigate("/messages")
//       }
//     } catch (error) {
//       console.error("Error starting conversation:", error)
//       toast.error("Failed to start conversation")
//     } finally {
//       setLoading((prev) => ({ ...prev, action: false }))
//     }
//   }

//   useEffect(() => {
//     if (token && userId) {
//       fetchProfile()
//       fetchConnections()
//     }
//   }, [token, userId])

//   if (loading.profile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
//         <Navbar />
//         <div className="container mx-auto px-4 pt-24 pb-10 flex justify-center items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           <p className="ml-2 text-indigo-700">Loading profile...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
//         <Navbar />
//         <div className="container mx-auto px-4 pt-24 pb-10">
//           <div className="text-center py-8">
//             <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                   />
//                 </svg>
//               </div>
//               <p className="text-xl text-red-600 font-semibold mb-4">Profile not found</p>
//               <button
//                 onClick={() => navigate("/connect")}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-medium"
//               >
//                 Back to Connect
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-10">
//         {/* Cover Photo */}
//         <div
//           className="h-64 rounded-t-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 relative overflow-hidden"
//           style={{
//             backgroundImage: profile.coverPhotoUrl ? `url(${API_BASE_URL}${profile.coverPhotoUrl})` : undefined,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           {!profile.coverPhotoUrl && (
//             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 opacity-90"></div>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-b-xl shadow-xl border border-indigo-100 px-6 pb-6 relative">
//           <div className="flex flex-col md:flex-row">
//             {/* Avatar */}
//             <div className="flex justify-center md:justify-start -mt-16 md:-mt-20">
//               <div className="relative">
//                 <ProfilePhoto
//                   src={profile.profilePhotoUrl}
//                   alt={profile.name}
//                   size="3xl"
//                   className="border-4 border-white shadow-xl"
//                 />
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
//                   <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Profile Details */}
//             <div className="mt-4 md:mt-0 md:ml-6 flex-1">
//               <div className="flex flex-col md:flex-row md:items-center justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
//                   {profile.email && (
//                     <div className="flex items-center mb-3">
//                       <svg
//                         className="w-4 h-4 text-indigo-600 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
//                         />
//                       </svg>
//                       <span className="text-indigo-700 font-medium">{profile.email}</span>
//                     </div>
//                   )}
//                   <div className="flex items-center mt-1 space-x-2 flex-wrap gap-2">
//                     <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 capitalize border border-indigo-200">
//                       {profile.role}
//                     </span>

//                     {profile.department && (
//                       <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200">
//                         {profile.department}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 {userId !== localStorage.getItem("userId") && (
//                   <div className="mt-4 md:mt-0 flex space-x-3">
//                     {connectionStatus === "none" && (
//                       <button
//                         onClick={sendConnectionRequest}
//                         disabled={loading.action}
//                         className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center font-medium shadow-lg"
//                       >
//                         {loading.action ? (
//                           <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                         ) : (
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-5 w-5 mr-2"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
//                             />
//                           </svg>
//                         )}
//                         Connect
//                       </button>
//                     )}

//                     {connectionStatus === "pending" && (
//                       <button
//                         disabled
//                         className="px-6 py-3 border-2 border-yellow-300 text-yellow-700 rounded-lg bg-yellow-50 font-medium"
//                       >
//                         <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                         Request Pending
//                       </button>
//                     )}

//                     {connectionStatus === "connected" && (
//                       <button
//                         disabled
//                         className="px-6 py-3 border-2 border-green-300 text-green-700 rounded-lg bg-green-50 flex items-center font-medium"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5 mr-2"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         Connected
//                       </button>
//                     )}

//                     <button
//                       onClick={startConversation}
//                       className="px-6 py-3 border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center font-medium"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mr-2"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//                         />
//                       </svg>
//                       Message
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="flex space-x-6 mt-6">
//                 <div className="text-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
//                   <span className="text-2xl font-bold text-indigo-700">{profile.stats?.followers || 0}</span>
//                   <p className="text-sm text-indigo-600 font-medium">Followers</p>
//                 </div>
//                 <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
//                   <span className="text-2xl font-bold text-blue-700">{profile.stats?.following || 0}</span>
//                   <p className="text-sm text-blue-600 font-medium">Following</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* About */}
//           {profile.about && (
//             <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
//               <h2 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
//                 <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full mr-3"></div>
//                 About
//               </h2>
//               <p className="text-gray-700 leading-relaxed">{profile.about}</p>
//             </div>
//           )}

//           {/* Role-specific details */}
//           <div className="mt-8">
//             {profile.role === "student" && (
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                 <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
//                   <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
//                   Student Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.email && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-blue-600 mb-1">Email</h4>
//                       <p className="text-gray-900 font-semibold">{profile.email}</p>
//                     </div>
//                   )}
//                   {profile.batch && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-blue-600 mb-1">Batch</h4>
//                       <p className="text-gray-900 font-semibold">{profile.batch}</p>
//                     </div>
//                   )}
//                   {profile.regNumber && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-blue-600 mb-1">Registration Number</h4>
//                       <p className="text-gray-900 font-semibold">{profile.regNumber}</p>
//                     </div>
//                   )}
//                   {profile.branch && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-blue-600 mb-1">Branch</h4>
//                       <p className="text-gray-900 font-semibold">{profile.branch}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {profile.role === "faculty" && (
//               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
//                 <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
//                   <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
//                   Faculty Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.email && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-purple-600 mb-1">Email</h4>
//                       <p className="text-gray-900 font-semibold">{profile.email}</p>
//                     </div>
//                   )}
//                   {profile.facultyId && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-purple-600 mb-1">Faculty ID</h4>
//                       <p className="text-gray-900 font-semibold">{profile.facultyId}</p>
//                     </div>
//                   )}
//                   {profile.department && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-purple-600 mb-1">Department</h4>
//                       <p className="text-gray-900 font-semibold">{profile.department}</p>
//                     </div>
//                   )}
//                   {profile.designation && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-purple-600 mb-1">Designation</h4>
//                       <p className="text-gray-900 font-semibold">{profile.designation}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {profile.role === "alumni" && (
//               <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
//                 <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
//                   <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
//                   Alumni Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.email && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-indigo-600 mb-1">Email</h4>
//                       <p className="text-gray-900 font-semibold">{profile.email}</p>
//                     </div>
//                   )}
//                   {profile.passedOutBatch && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-indigo-600 mb-1">Passed Out Batch</h4>
//                       <p className="text-gray-900 font-semibold">{profile.passedOutBatch}</p>
//                     </div>
//                   )}
//                   {profile.company && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-indigo-600 mb-1">Company</h4>
//                       <p className="text-gray-900 font-semibold">{profile.company}</p>
//                     </div>
//                   )}
//                   {profile.currentJobTitle && (
//                     <div className="bg-white/60 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-indigo-600 mb-1">Current Job Title</h4>
//                       <p className="text-gray-900 font-semibold">{profile.currentJobTitle}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Skills */}
//           {profile.skills && profile.skills.length > 0 && (
//             <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
//               <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
//                 <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-3"></div>
//                 Skills & Expertise
//               </h2>
//               <div className="flex flex-wrap gap-3">
//                 {profile.skills.map((skill, index) => (
//                   <span
//                     key={index}
//                     className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm rounded-full border border-indigo-200 font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Connections */}
//         <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-200">
//             <div className="flex space-x-1">
//               <button
//                 className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
//                   activeTab === "followers"
//                     ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
//                     : "text-indigo-600 hover:bg-indigo-100"
//                 }`}
//                 onClick={() => setActiveTab("followers")}
//               >
//                 <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                   />
//                 </svg>
//                 Followers ({connections.followers.length})
//               </button>
//               <button
//                 className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
//                   activeTab === "following"
//                     ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
//                     : "text-indigo-600 hover:bg-indigo-100"
//                 }`}
//                 onClick={() => setActiveTab("following")}
//               >
//                 <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                   />
//                 </svg>
//                 Following ({connections.following.length})
//               </button>
//             </div>
//           </div>

//           <div className="p-6">
//             {loading.connections ? (
//               <div className="flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
//                 <p className="ml-3 text-indigo-600">Loading connections...</p>
//               </div>
//             ) : activeTab === "followers" ? (
//               connections.followers.length > 0 ? (
//                 <div className="space-y-3">
//                   {connections.followers.map((follow) => (
//                     <div
//                       key={follow._id}
//                       className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 cursor-pointer"
//                       onClick={() => navigate(`/profile/${follow.follower._id}`)}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <ProfilePhoto
//                           src={follow.follower.profilePhotoUrl}
//                           alt={follow.follower.name}
//                           size="md"
//                           className="ring-2 ring-indigo-200"
//                         />
//                         <div>
//                           <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
//                             {follow.follower.name}
//                           </h3>
//                           <p className="text-sm text-indigo-600 capitalize font-medium">{follow.follower.role}</p>
//                           {follow.follower.department && (
//                             <p className="text-xs text-gray-500">{follow.follower.department}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             follow.status === "accepted"
//                               ? "bg-green-100 text-green-800 border border-green-200"
//                               : "bg-yellow-100 text-yellow-800 border border-yellow-200"
//                           }`}
//                         >
//                           {follow.status === "accepted" ? "Following" : "Pending"}
//                         </span>
//                         <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                       />
//                     </svg>
//                   </div>
//                   <p className="text-gray-600 text-lg">No followers yet</p>
//                   <p className="text-gray-400 text-sm mt-1">Start connecting to build your network!</p>
//                 </div>
//               )
//             ) : connections.following.length > 0 ? (
//               <div className="space-y-3">
//                 {connections.following.map((follow) => (
//                   <div
//                     key={follow._id}
//                     className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
//                     onClick={() => navigate(`/profile/${follow.following._id}`)}
//                   >
//                     <div className="flex items-center space-x-4">
//                       <ProfilePhoto
//                         src={follow.following.profilePhotoUrl}
//                         alt={follow.following.name}
//                         size="md"
//                         className="ring-2 ring-blue-200"
//                       />
//                       <div>
//                         <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
//                           {follow.following.name}
//                         </h3>
//                         <p className="text-sm text-blue-600 capitalize font-medium">{follow.following.role}</p>
//                         {follow.following.department && (
//                           <p className="text-xs text-gray-500">{follow.following.department}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           follow.status === "accepted"
//                             ? "bg-green-100 text-green-800 border border-green-200"
//                             : "bg-yellow-100 text-yellow-800 border border-yellow-200"
//                         }`}
//                       >
//                         {follow.status === "accepted" ? "Connected" : "Pending"}
//                       </span>
//                       <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                     />
//                   </svg>
//                 </div>
//                 <p className="text-gray-600 text-lg">Not following anyone yet</p>
//                 <p className="text-gray-400 text-sm mt-1">Discover and connect with amazing people!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileView

"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "./Navbar"
import ProfilePhoto from "./ProfilePhoto"

const ProfileView = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [connections, setConnections] = useState({ followers: [], following: [] })
  const [connectionStatus, setConnectionStatus] = useState("none") // none, pending, connected
  const [activeTab, setActiveTab] = useState("followers")
  const [loading, setLoading] = useState({
    profile: true,
    connections: true,
    action: false,
  })

  const API_BASE_URL = "http://localhost:5005"
  const token = localStorage.getItem("token")
  const currentUserId = localStorage.getItem("userId")

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [navigate, token])

  const fetchProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }))
      const response = await axios.get(`${API_BASE_URL}/api/profiles/${userId}`, config)
      setProfile(response.data.profile)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }))
    }
  }

  const fetchConnections = async () => {
    try {
      setLoading((prev) => ({ ...prev, connections: true }))
      const response = await axios.get(`${API_BASE_URL}/api/users/connections/${userId}`, config)
      setConnections({
        followers: response.data.followers,
        following: response.data.following,
      })

      // Check connection status more thoroughly
      await checkConnectionStatus()
    } catch (error) {
      console.error("Error fetching connections:", error)
      toast.error("Failed to load connections")
    } finally {
      setLoading((prev) => ({ ...prev, connections: false }))
    }
  }

  const checkConnectionStatus = async () => {
    try {
      // Check if current user is following this profile
      const myConnectionsResponse = await axios.get(`${API_BASE_URL}/api/users/connections`, config)

      // Check if we're following this user
      const isFollowing = myConnectionsResponse.data.following?.some(
        (follow) => follow.following._id === userId && follow.status === "accepted",
      )

      if (isFollowing) {
        setConnectionStatus("connected")
        return
      }

      // Check if we have a pending request to this user
      const sentRequestsResponse = await axios.get(`${API_BASE_URL}/api/users/sent-requests`, config)
      const hasPendingRequest = sentRequestsResponse.data.sentRequests?.some(
        (request) => request.following._id === userId,
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

  const sendConnectionRequest = async () => {
    try {
      setLoading((prev) => ({ ...prev, action: true }))
      await axios.post(`${API_BASE_URL}/api/users/follow/${userId}`, {}, config)
      setConnectionStatus("pending")
      toast.success("Connection request sent!")
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast.error(error.response?.data?.message || "Failed to send connection request")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const startConversation = async () => {
    try {
      setLoading((prev) => ({ ...prev, action: true }))
      const response = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          recipientId: userId,
          content: `Hello ${profile?.name}! I'd like to connect with you.`,
        },
        config,
      )

      if (response.data.success) {
        navigate("/messages")
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
      toast.error("Failed to start conversation")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  useEffect(() => {
    if (token && userId) {
      fetchProfile()
      fetchConnections()
    }
  }, [token, userId])

  // Refresh connection status when component mounts or userId changes
  useEffect(() => {
    if (token && userId && currentUserId) {
      checkConnectionStatus()
    }
  }, [token, userId, currentUserId])

  if (loading.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-2 text-indigo-700">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-10">
          <div className="text-center py-8">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xl text-red-600 font-semibold mb-4">Profile not found</p>
              <button
                onClick={() => navigate("/connect")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-medium"
              >
                Back to Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-10">
        {/* Cover Photo */}
        <div
          className="h-64 rounded-t-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 relative overflow-hidden"
          style={{
            backgroundImage: profile.coverPhotoUrl ? `url(${API_BASE_URL}${profile.coverPhotoUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!profile.coverPhotoUrl && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 opacity-90"></div>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-b-xl shadow-xl border border-indigo-100 px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start -mt-16 md:-mt-20">
              <div className="relative">
                <ProfilePhoto
                  src={profile.profilePhotoUrl}
                  alt={profile.name}
                  size="3xl"
                  className="border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  {profile.email && (
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-4 h-4 text-indigo-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      <span className="text-indigo-700 font-medium">{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center mt-1 space-x-2 flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 capitalize border border-indigo-200">
                      {profile.role}
                    </span>

                    {profile.department && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200">
                        {profile.department}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {userId !== currentUserId && (
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    {connectionStatus === "none" && (
                      <button
                        onClick={sendConnectionRequest}
                        disabled={loading.action}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center font-medium shadow-lg"
                      >
                        {loading.action ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
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
                        className="px-6 py-3 border-2 border-yellow-300 text-yellow-700 rounded-lg bg-yellow-50 font-medium flex items-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Request Pending
                      </button>
                    )}

                    {connectionStatus === "connected" && (
                      <button
                        disabled
                        className="px-6 py-3 border-2 border-green-300 text-green-700 rounded-lg bg-green-50 flex items-center font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Connected
                      </button>
                    )}

                    <button
                      onClick={startConversation}
                      className="px-6 py-3 border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Message
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-6 mt-6">
                <div className="text-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                  <span className="text-2xl font-bold text-indigo-700">{connections.followers?.length || 0}</span>
                  <p className="text-sm text-indigo-600 font-medium">Followers</p>
                </div>
                <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <span className="text-2xl font-bold text-blue-700">{connections.following?.length || 0}</span>
                  <p className="text-sm text-blue-600 font-medium">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {profile.about && (
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <h2 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full mr-3"></div>
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">{profile.about}</p>
            </div>
          )}

          {/* Role-specific details */}
          <div className="mt-8">
            {profile.role === "student" && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.email && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Email</h4>
                      <p className="text-gray-900 font-semibold">{profile.email}</p>
                    </div>
                  )}
                  {profile.batch && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Batch</h4>
                      <p className="text-gray-900 font-semibold">{profile.batch}</p>
                    </div>
                  )}
                  {profile.regNumber && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Registration Number</h4>
                      <p className="text-gray-900 font-semibold">{profile.regNumber}</p>
                    </div>
                  )}
                  {profile.branch && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Branch</h4>
                      <p className="text-gray-900 font-semibold">{profile.branch}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profile.role === "faculty" && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
                  Faculty Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.email && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-600 mb-1">Email</h4>
                      <p className="text-gray-900 font-semibold">{profile.email}</p>
                    </div>
                  )}
                  {profile.facultyId && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-600 mb-1">Faculty ID</h4>
                      <p className="text-gray-900 font-semibold">{profile.facultyId}</p>
                    </div>
                  )}
                  {profile.department && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-600 mb-1">Department</h4>
                      <p className="text-gray-900 font-semibold">{profile.department}</p>
                    </div>
                  )}
                  {profile.designation && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-600 mb-1">Designation</h4>
                      <p className="text-gray-900 font-semibold">{profile.designation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profile.role === "alumni" && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                  Alumni Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.email && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-indigo-600 mb-1">Email</h4>
                      <p className="text-gray-900 font-semibold">{profile.email}</p>
                    </div>
                  )}
                  {profile.passedOutBatch && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-indigo-600 mb-1">Passed Out Batch</h4>
                      <p className="text-gray-900 font-semibold">{profile.passedOutBatch}</p>
                    </div>
                  )}
                  {profile.company && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-indigo-600 mb-1">Company</h4>
                      <p className="text-gray-900 font-semibold">{profile.company}</p>
                    </div>
                  )}
                  {profile.currentJobTitle && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-indigo-600 mb-1">Current Job Title</h4>
                      <p className="text-gray-900 font-semibold">{profile.currentJobTitle}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-3"></div>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm rounded-full border border-indigo-200 font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Connections */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-200">
            <div className="flex space-x-1">
              <button
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "followers"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
                onClick={() => setActiveTab("followers")}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Followers ({connections.followers?.length || 0})
              </button>
              <button
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "following"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
                onClick={() => setActiveTab("following")}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Following ({connections.following?.length || 0})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading.connections ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="ml-3 text-indigo-600">Loading connections...</p>
              </div>
            ) : activeTab === "followers" ? (
              connections.followers?.length > 0 ? (
                <div className="space-y-3">
                  {connections.followers.map((follow) => (
                    <div
                      key={follow._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/profile/${follow.follower._id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <ProfilePhoto
                          src={follow.follower.profilePhotoUrl}
                          alt={follow.follower.name}
                          size="md"
                          className="ring-2 ring-indigo-200"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                            {follow.follower.name}
                          </h3>
                          <p className="text-sm text-indigo-600 capitalize font-medium">{follow.follower.role}</p>
                          {follow.follower.department && (
                            <p className="text-xs text-gray-500">{follow.follower.department}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            follow.status === "accepted"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          }`}
                        >
                          {follow.status === "accepted" ? "Following" : "Pending"}
                        </span>
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">No followers yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start connecting to build your network!</p>
                </div>
              )
            ) : connections.following?.length > 0 ? (
              <div className="space-y-3">
                {connections.following.map((follow) => (
                  <div
                    key={follow._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/profile/${follow.following._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <ProfilePhoto
                        src={follow.following.profilePhotoUrl}
                        alt={follow.following.name}
                        size="md"
                        className="ring-2 ring-blue-200"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {follow.following.name}
                        </h3>
                        <p className="text-sm text-blue-600 capitalize font-medium">{follow.following.role}</p>
                        {follow.following.department && (
                          <p className="text-xs text-gray-500">{follow.following.department}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          follow.status === "accepted"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {follow.status === "accepted" ? "Connected" : "Pending"}
                      </span>
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">Not following anyone yet</p>
                <p className="text-gray-400 text-sm mt-1">Discover and connect with amazing people!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView

