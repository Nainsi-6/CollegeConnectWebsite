// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { useUser } from "../contexts/UserContext"
// import Navbar from "../component/Navbar"
// import UserCard from "../component/UserCard"
// import ConnectionRequest from "../component/ConnectionRequest"
// import { toast } from "react-toastify"

// const ConnectPeople = () => {
//   const { user } = useUser()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [searchResults, setSearchResults] = useState([])
//   const [suggestedUsers, setSuggestedUsers] = useState([])
//   const [connectionRequests, setConnectionRequests] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [loading, setLoading] = useState({
//     suggestions: true,
//     requests: true,
//     search: false,
//   })

//   // Get the token from localStorage
//   const token = localStorage.getItem("token")

//   // Set up axios headers
//   const config = {
//     headers: {
//       Authorization: token,
//     },
//   }

//   // Fetch connection requests
//   const fetchConnectionRequests = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, requests: true }))
//       const response = await axios.get("http://localhost:5005/api/users/requests", config)
//       setConnectionRequests(response.data.requests)
//     } catch (error) {
//       console.error("Error fetching connection requests:", error)
//       toast.error("Failed to load connection requests")
//     } finally {
//       setLoading((prev) => ({ ...prev, requests: false }))
//     }
//   }

//   // Fetch suggested users
//   const fetchSuggestedUsers = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, suggestions: true }))
//       const response = await axios.get("http://localhost:5005/api/users/suggested", config)
//       setSuggestedUsers(response.data.users)
//     } catch (error) {
//       console.error("Error fetching suggested users:", error)
//       toast.error("Failed to load suggested users")
//     } finally {
//       setLoading((prev) => ({ ...prev, suggestions: false }))
//     }
//   }

//   // Search for users
//   const searchUsers = async () => {
//     if (!searchQuery.trim()) return

//     try {
//       setIsSearching(true)
//       setLoading((prev) => ({ ...prev, search: true }))
//       const response = await axios.get(`http://localhost:5005/api/users/search?query=${searchQuery}`, config)
//       setSearchResults(response.data.users)
//     } catch (error) {
//       console.error("Error searching users:", error)
//       toast.error("Search failed. Please try again.")
//     } finally {
//       setLoading((prev) => ({ ...prev, search: false }))
//     }
//   }

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   // Handle search form submission
//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     searchUsers()
//   }

//   // Send a follow request
//   const handleFollow = async (userId) => {
//     try {
//       await axios.post(`http://localhost:5005/api/users/follow/${userId}`, {}, config)
//       toast.success("Connection request sent!")

//       // Update the UI to reflect the sent request
//       if (isSearching) {
//         setSearchResults((prev) => prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user)))
//       } else {
//         setSuggestedUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user)))
//       }
//     } catch (error) {
//       console.error("Error sending follow request:", error)
//       toast.error(error.response?.data?.message || "Failed to send connection request")
//     }
//   }

//   // Respond to a connection request
//   const handleRequestResponse = async (requestId, action) => {
//     try {
//       await axios.put(`http://localhost:5005/api/users/request/${requestId}`, { action }, config)

//       toast.success(`Request ${action === "accept" ? "accepted" : "rejected"}`)

//       // Remove the request from the list
//       setConnectionRequests((prev) => prev.filter((request) => request._id !== requestId))

//       // If accepted, refresh suggested users
//       if (action === "accept") {
//         fetchSuggestedUsers()
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing request:`, error)
//       toast.error(`Failed to ${action} request`)
//     }
//   }

//   // Clear search results
//   const clearSearch = () => {
//     setSearchQuery("")
//     setSearchResults([])
//     setIsSearching(false)
//   }

//   // Load data on component mount
//   useEffect(() => {
//     if (user && token) {
//       fetchConnectionRequests()
//       fetchSuggestedUsers()
//     }
//   }, [user])

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-10">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Find & Connect with People</h1>

//         {/* Search Bar */}
//         <div className="mb-8">
//           <form onSubmit={handleSearchSubmit} className="flex w-full max-w-3xl mx-auto">
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
//               disabled={loading.search}
//             >
//               {loading.search ? "Searching..." : "Search"}
//             </button>
//           </form>
//         </div>

//         {/* Search Results */}
//         {isSearching && (
//           <div className="mb-10">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
//               <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800">
//                 Clear Results
//               </button>
//             </div>

//             {loading.search ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Searching...</p>
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {searchResults.map((user) => (
//                   <UserCard key={user._id} user={user} onFollow={() => handleFollow(user._id)} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 bg-white rounded-lg shadow">
//                 <p className="text-gray-600">No users found matching your search.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Connection Requests */}
//         {!isSearching && connectionRequests.length > 0 && (
//           <div className="mb-10 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Requests</h2>

//             {loading.requests ? (
//               <div className="text-center py-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading requests...</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {connectionRequests.map((request) => (
//                   <ConnectionRequest
//                     key={request._id}
//                     request={request}
//                     onAccept={() => handleRequestResponse(request._id, "accept")}
//                     onReject={() => handleRequestResponse(request._id, "reject")}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* People You May Know */}
//         {!isSearching && (
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">People You May Know</h2>

//             {loading.suggestions ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading suggestions...</p>
//               </div>
//             ) : suggestedUsers.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {suggestedUsers.map((user) => (
//                   <UserCard key={user._id} user={user} onFollow={() => handleFollow(user._id)} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-600">No suggestions available at the moment.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ConnectPeople


// ############################################


// import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "../component/Navbar"
// import UserCard from "../component/UserCard"
// import ConnectionRequest from "../component/ConnectionRequest"

// const ConnectPeople = () => {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [searchResults, setSearchResults] = useState([])
//   const [suggestedUsers, setSuggestedUsers] = useState([])
//   const [connectionRequests, setConnectionRequests] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [loading, setLoading] = useState({
//     suggestions: true,
//     requests: true,
//     search: false,
//   })

//   // Get the token from localStorage
//   const token = localStorage.getItem("token")

//   // Set up axios headers
//   const config = {
//     headers: {
//       Authorization: token,
//     },
//   }

//   // Check if user is authenticated
//   useEffect(() => {
//     if (!token) {
//       navigate("/login")
//     }
//   }, [navigate, token])

//   // Fetch connection requests
//   const fetchConnectionRequests = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, requests: true }))
//       const response = await axios.get("http://localhost:5005/api/users/requests", config)
//       setConnectionRequests(response.data.requests)
//     } catch (error) {
//       console.error("Error fetching connection requests:", error)
//       toast.error("Failed to load connection requests")
//     } finally {
//       setLoading((prev) => ({ ...prev, requests: false }))
//     }
//   }

//   // Fetch suggested users
//   const fetchSuggestedUsers = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, suggestions: true }))
//       const response = await axios.get("http://localhost:5005/api/users/suggested", config)
//       setSuggestedUsers(response.data.users)
//     } catch (error) {
//       console.error("Error fetching suggested users:", error)
//       toast.error("Failed to load suggested users")
//     } finally {
//       setLoading((prev) => ({ ...prev, suggestions: false }))
//     }
//   }

//   // Search for users
//   const searchUsers = async () => {
//     if (!searchQuery.trim()) return

//     try {
//       setIsSearching(true)
//       setLoading((prev) => ({ ...prev, search: true }))
//       const response = await axios.get(`http://localhost:5005/api/users/search?query=${searchQuery}`, config)
//       setSearchResults(response.data.users)
//     } catch (error) {
//       console.error("Error searching users:", error)
//       toast.error("Search failed. Please try again.")
//     } finally {
//       setLoading((prev) => ({ ...prev, search: false }))
//     }
//   }

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   // Handle search form submission
//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     searchUsers()
//   }

//   // Send a follow request
//   const handleFollow = async (userId) => {
//     try {
//       await axios.post(`http://localhost:5005/api/users/follow/${userId}`, {}, config)
//       toast.success("Connection request sent!")

//       // Update the UI to reflect the sent request
//       if (isSearching) {
//         setSearchResults((prev) => prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user)))
//       } else {
//         setSuggestedUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user)))
//       }
//     } catch (error) {
//       console.error("Error sending follow request:", error)
//       toast.error(error.response?.data?.message || "Failed to send connection request")
//     }
//   }

//   // Respond to a connection request
//   const handleRequestResponse = async (requestId, action) => {
//     try {
//       await axios.put(`http://localhost:5005/api/users/request/${requestId}`, { action }, config)

//       toast.success(`Request ${action === "accept" ? "accepted" : "rejected"}`)

//       // Remove the request from the list
//       setConnectionRequests((prev) => prev.filter((request) => request._id !== requestId))

//       // If accepted, refresh suggested users
//       if (action === "accept") {
//         fetchSuggestedUsers()
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing request:`, error)
//       toast.error(`Failed to ${action} request`)
//     }
//   }

//   // Clear search results
//   const clearSearch = () => {
//     setSearchQuery("")
//     setSearchResults([])
//     setIsSearching(false)
//   }

//   // Load data on component mount
//   useEffect(() => {
//     if (token) {
//       fetchConnectionRequests()
//       fetchSuggestedUsers()
//     }
//   }, [token])

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-10">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Find & Connect with People</h1>

//         {/* Search Bar */}
//         <div className="mb-8">
//           <form onSubmit={handleSearchSubmit} className="flex w-full max-w-3xl mx-auto">
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
//               disabled={loading.search}
//             >
//               {loading.search ? "Searching..." : "Search"}
//             </button>
//           </form>
//         </div>

//         {/* Search Results */}
//         {isSearching && (
//           <div className="mb-10">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
//               <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800">
//                 Clear Results
//               </button>
//             </div>

//             {loading.search ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Searching...</p>
//               </div>
//             ) : searchResults.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {searchResults.map((user) => (
//                   <UserCard key={user._id} user={user} onFollow={() => handleFollow(user._id)} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 bg-white rounded-lg shadow">
//                 <p className="text-gray-600">No users found matching your search.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Connection Requests */}
//         {!isSearching && connectionRequests.length > 0 && (
//           <div className="mb-10 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Requests</h2>

//             {loading.requests ? (
//               <div className="text-center py-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading requests...</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {connectionRequests.map((request) => (
//                   <ConnectionRequest
//                     key={request._id}
//                     request={request}
//                     onAccept={() => handleRequestResponse(request._id, "accept")}
//                     onReject={() => handleRequestResponse(request._id, "reject")}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* People You May Know */}
//         {!isSearching && (
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">People You May Know</h2>

//             {loading.suggestions ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading suggestions...</p>
//               </div>
//             ) : suggestedUsers.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {suggestedUsers.map((user) => (
//                   <UserCard key={user._id} user={user} onFollow={() => handleFollow(user._id)} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-600">No suggestions available at the moment.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ConnectPeople

// #############################################################################################&&&&&&&&&&&&&&&&&&&&&&&

// ... (imports remain the same)
// import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "../component/Navbar"
// import UserCard from "../component/UserCard"
// import ConnectionRequest from "../component/ConnectionRequest"
// import {
//   UserGroupIcon,
//   ChatBubbleBottomCenterTextIcon,
//   BriefcaseIcon,
//   CalendarIcon,
//   UserCircleIcon,
//   LifebuoyIcon,
// } from "@heroicons/react/24/outline"

// const ConnectPeople = () => {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [searchResults, setSearchResults] = useState([])
//   const [suggestedUsers, setSuggestedUsers] = useState([])
//   const [connectionRequests, setConnectionRequests] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [loading, setLoading] = useState({
//     suggestions: true,
//     requests: true,
//     search: false,
//   })

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

//   const fetchConnectionRequests = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, requests: true }))
//       const response = await axios.get("http://localhost:5005/api/users/requests", config)
//       setConnectionRequests(response.data.requests || [])
//     } catch (error) {
//       console.error("Error fetching connection requests:", error)
//       toast.error("Failed to load connection requests")
//     } finally {
//       setLoading((prev) => ({ ...prev, requests: false }))
//     }
//   }

//   const fetchSuggestedUsers = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, suggestions: true }))
//       const response = await axios.get("http://localhost:5005/api/users/suggested", config)

//       if (response.data.success && Array.isArray(response.data.users)) {
//         setSuggestedUsers(response.data.users)
//       } else {
//         console.error("Invalid response format:", response.data)
//         setSuggestedUsers([])
//       }
//     } catch (error) {
//       console.error("Error fetching suggested users:", error)
//       toast.error("Failed to load suggested users")
//     } finally {
//       setLoading((prev) => ({ ...prev, suggestions: false }))
//     }
//   }

//   const searchUsers = async () => {
//     if (!searchQuery.trim()) return

//     try {
//       setIsSearching(true)
//       setLoading((prev) => ({ ...prev, search: true }))
//       const response = await axios.get(`http://localhost:5005/api/users/search?query=${searchQuery}`, config)
//       setSearchResults(response.data.users || [])
//     } catch (error) {
//       console.error("Error searching users:", error)
//       toast.error("Search failed. Please try again.")
//     } finally {
//       setLoading((prev) => ({ ...prev, search: false }))
//     }
//   }

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     searchUsers()
//   }

//   const handleFollow = async (userId) => {
//     try {
//       await axios.post(`http://localhost:5005/api/users/follow/${userId}`, {}, config)
//       toast.success("Connection request sent!")

//       if (isSearching) {
//         setSearchResults((prev) =>
//           prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user))
//         )
//       } else {
//         setSuggestedUsers((prev) =>
//           prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user))
//         )
//       }
//     } catch (error) {
//       console.error("Error sending follow request:", error)
//       toast.error(error.response?.data?.message || "Failed to send connection request")
//     }
//   }

//   const handleRequestResponse = async (requestId, action) => {
//     try {
//       const response = await axios.put(`http://localhost:5005/api/users/request/${requestId}`, { action }, config)

//       if (response.data.success) {
//         toast.success(`Request ${action === "accept" ? "accepted" : "rejected"}`)
//         setConnectionRequests((prev) => prev.filter((request) => request._id !== requestId))
//         if (action === "accept") {
//           fetchSuggestedUsers()
//         }
//       } else {
//         throw new Error(response.data.message || `Failed to ${action} request`)
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing request:`, error)
//       toast.error(`Failed to ${action} request`)
//     }
//   }

//   const clearSearch = () => {
//     setSearchQuery("")
//     setSearchResults([])
//     setIsSearching(false)
//   }

//   useEffect(() => {
//     if (token) {
//       fetchConnectionRequests()
//       fetchSuggestedUsers()
//     }
//   }, [token])

//   return (
//     <div className="min-h-screen bg-indigo-100">
//       <Navbar />
//       <div className="container mx-auto px-4 pt-24 pb-10">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Find & Connect with People</h1>

//         {/* Layout: Main Content + Sidebar */}
//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* Main Content */}
//           <div className="flex-1">

//             {/* Search Bar */}
//             <div className="mb-8">
//               <form onSubmit={handleSearchSubmit} className="flex w-full max-w-3xl">
//                 <input
//                   type="text"
//                   placeholder="Search users by name or email..."
//                   className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                 />
//                 <button
//                   type="submit"
//                   className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
//                   disabled={loading.search}
//                 >
//                   {loading.search ? (
//                     <div className="flex items-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                       <span>Searching...</span>
//                     </div>
//                   ) : (
//                     "Search"
//                   )}
//                 </button>
//               </form>
//             </div>

//             {/* Search Results */}
//             {isSearching && (
//               <div className="mb-10">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
//                   <button onClick={clearSearch} className="text-indigo-600 hover:text-indigo-800 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Clear Results
//                   </button>
//                 </div>

//                 {loading.search ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Searching...</p>
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {searchResults.map((user) => (
//                       <UserCard
//                         key={user._id}
//                         user={user}
//                         onFollow={() => handleFollow(user._id)}
//                         requestSent={user.requestSent}
//                         isFollowing={user.isFollowing}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 bg-white rounded-lg shadow">
//                     <p className="text-gray-600">No users found matching your search.</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Connection Requests */}
//             {!isSearching && connectionRequests.length > 0 && (
//               <div className="mb-10 bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Requests</h2>
//                 {loading.requests ? (
//                   <div className="text-center py-4">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Loading requests...</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {connectionRequests.map((request) => (
//                       <ConnectionRequest
//                         key={request._id}
//                         request={request}
//                         onAccept={() => handleRequestResponse(request._id, "accept")}
//                         onReject={() => handleRequestResponse(request._id, "reject")}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* People You May Know */}
//             {!isSearching && (
//               <div className="bg-gray-100 mt-2 rounded-lg shadow-md p-4">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-6">People You May Know</h2>
//                 {loading.suggestions ? (
//                   <div className="text-center py-4">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Loading suggestions...</p>
//                   </div>
//                 ) : suggestedUsers.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {suggestedUsers.map((user) => (
//                       <UserCard
//                         key={user._id}
//                         user={user}
//                         onFollow={() => handleFollow(user._id)}
//                         requestSent={user.requestSent}
//                         isFollowing={user.isFollowing}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-600">No suggestions available at the moment.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="hidden lg:block w-full lg:w-1/3 space-y-6 sticky top-24 self-start">
//             <div className="bg-white rounded-lg shadow p-4">
//               <h2 className="text-lg font-bold mb-3 text-gray-800">Quick Access</h2>
//               <ul className="space-y-3 text-indigo-700 font-medium text-sm">
//                 <li><a href="/home" className="hover:underline flex items-center gap-2"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" /></svg>Home</a></li>
//                 <li><a href="/connect" className="hover:underline flex items-center gap-2"><UserGroupIcon className="w-5 h-5" />Connect People</a></li>
//                 <li><a href="/messages" className="hover:underline flex items-center gap-2"><ChatBubbleBottomCenterTextIcon className="w-5 h-5" />Messaging</a></li>
//                 <li><a href="/jobs" className="hover:underline flex items-center gap-2"><BriefcaseIcon className="w-5 h-5" />Jobs</a></li>
//                 <li><a href="/events" className="hover:underline flex items-center gap-2"><CalendarIcon className="w-5 h-5" />Events</a></li>
//                 <li><a href="/profile" className="hover:underline flex items-center gap-2"><UserCircleIcon className="w-5 h-5" />Profile</a></li>
//                 <li><a href="/chatbot" className="hover:underline flex items-center gap-2"><LifebuoyIcon className="w-5 h-5" />Help</a></li>
//               </ul>
//             </div>
//             <div
//               className="bg-indigo-300 text-blue-900 rounded-lg shadow p-6 italic text-base font-semibold tracking-wide select-none"
//               style={{ fontFamily: "'Georgia', serif" }}
//             >
//               “Networking is not collecting contacts, it's about planting relationships.”
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ConnectPeople


// import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "../component/Navbar"
// import UserCard from "../component/UserCard"
// import ConnectionRequest from "../component/ConnectionRequest"
// import {
//   UserGroupIcon,
//   ChatBubbleBottomCenterTextIcon,
//   BriefcaseIcon,
//   CalendarIcon,
//   UserCircleIcon,
//   LifebuoyIcon,
// } from "@heroicons/react/24/outline"

// const ConnectPeople = () => {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [searchResults, setSearchResults] = useState([])
//   const [suggestedUsers, setSuggestedUsers] = useState([])
//   const [connectionRequests, setConnectionRequests] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [loading, setLoading] = useState({
//     suggestions: true,
//     requests: true,
//     search: false,
//   })

//   const token = localStorage.getItem("token")

//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`, // Fixed the token format with Bearer prefix
//     },
//   }

//   useEffect(() => {
//     if (!token) {
//       navigate("/login")
//     }
//   }, [navigate, token])

//   const fetchConnectionRequests = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, requests: true }))
      
//       // Using the exact endpoint from your routes
//       const response = await axios.get("http://localhost:5005/api/users/requests", config)
      
//       // Debug response
//       console.log("Connection requests response:", response.data)
      
//       // Handle different possible response formats
//       if (response.data && response.data.success && Array.isArray(response.data.requests)) {
//         setConnectionRequests(response.data.requests)
//       } else if (response.data && Array.isArray(response.data)) {
//         setConnectionRequests(response.data)
//       } else if (response.data && response.data.requests && Array.isArray(response.data.requests)) {
//         setConnectionRequests(response.data.requests)
//       } else {
//         console.error("Invalid requests format:", response.data)
//         setConnectionRequests([])
//       }
//     } catch (error) {
//       console.error("Error fetching connection requests:", error.response || error)
//       toast.error("Failed to load connection requests")
//       setConnectionRequests([])
//     } finally {
//       setLoading((prev) => ({ ...prev, requests: false }))
//     }
//   }

//   const fetchSuggestedUsers = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, suggestions: true }))
//       const response = await axios.get("http://localhost:5005/api/users/suggested", config)

//       if (response.data.success && Array.isArray(response.data.users)) {
//         setSuggestedUsers(response.data.users)
//       } else {
//         console.error("Invalid response format:", response.data)
//         setSuggestedUsers([])
//       }
//     } catch (error) {
//       console.error("Error fetching suggested users:", error)
//       toast.error("Failed to load suggested users")
//     } finally {
//       setLoading((prev) => ({ ...prev, suggestions: false }))
//     }
//   }

//   const searchUsers = async () => {
//     if (!searchQuery.trim()) return

//     try {
//       setIsSearching(true)
//       setLoading((prev) => ({ ...prev, search: true }))
//       const response = await axios.get(`http://localhost:5005/api/users/search?query=${searchQuery}`, config)
//       setSearchResults(response.data.users || [])
//     } catch (error) {
//       console.error("Error searching users:", error)
//       toast.error("Search failed. Please try again.")
//     } finally {
//       setLoading((prev) => ({ ...prev, search: false }))
//     }
//   }

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     searchUsers()
//   }

//   const handleFollow = async (userId) => {
//     try {
//       await axios.post(`http://localhost:5005/api/users/follow/${userId}`, {}, config)
//       toast.success("Connection request sent!")

//       if (isSearching) {
//         setSearchResults((prev) =>
//           prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user))
//         )
//       } else {
//         setSuggestedUsers((prev) =>
//           prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user))
//         )
//       }
//     } catch (error) {
//       console.error("Error sending follow request:", error)
//       toast.error(error.response?.data?.message || "Failed to send connection request")
//     }
//   }

//   const handleRequestResponse = async (requestId, action) => {
//     try {
//       // Exactly matching the API route in your backend
//       const response = await axios.post(`http://localhost:5005/api/users/respond/${requestId}`, { action }, config)

//       if (response.data && (response.data.success || response.data.message)) {
//         toast.success(`Request ${action === "accept" ? "accepted" : "rejected"}`)
//         setConnectionRequests((prev) => prev.filter((request) => request._id !== requestId))
//         if (action === "accept") {
//           fetchSuggestedUsers()
//         }
//       } else {
//         throw new Error(response.data?.message || `Failed to ${action} request`)
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing request:`, error)
//       toast.error(error.response?.data?.message || `Failed to ${action} request`)
//     }
//   }

//   const clearSearch = () => {
//     setSearchQuery("")
//     setSearchResults([])
//     setIsSearching(false)
//   }

//   useEffect(() => {
//     if (token) {
//       fetchConnectionRequests()
//       fetchSuggestedUsers()
//     }
//   }, [token])

//   return (
//     <div className="min-h-screen bg-indigo-100">
//       <Navbar />
//       <div className="container mx-auto px-4 pt-24 pb-10">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Find & Connect with People</h1>

//         {/* Layout: Main Content + Sidebar */}
//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* Main Content */}
//           <div className="flex-1">

//             {/* Search Bar */}
//             <div className="mb-8">
//               <form onSubmit={handleSearchSubmit} className="flex w-full max-w-3xl">
//                 <input
//                   type="text"
//                   placeholder="Search users by name or email..."
//                   className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                 />
//                 <button
//                   type="submit"
//                   className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
//                   disabled={loading.search}
//                 >
//                   {loading.search ? (
//                     <div className="flex items-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                       <span>Searching...</span>
//                     </div>
//                   ) : (
//                     "Search"
//                   )}
//                 </button>
//               </form>
//             </div>

//             {/* Search Results */}
//             {isSearching && (
//               <div className="mb-10">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
//                   <button onClick={clearSearch} className="text-indigo-600 hover:text-indigo-800 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Clear Results
//                   </button>
//                 </div>

//                 {loading.search ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Searching...</p>
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {searchResults.map((user) => (
//                       <UserCard
//                         key={user._id}
//                         user={user}
//                         onFollow={() => handleFollow(user._id)}
//                         requestSent={user.requestSent}
//                         isFollowing={user.isFollowing}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 bg-white rounded-lg shadow">
//                     <p className="text-gray-600">No users found matching your search.</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Connection Requests */}
//             {!isSearching && (
//               <div className="mb-10 bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Requests</h2>
//                 {loading.requests ? (
//                   <div className="text-center py-4">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Loading requests...</p>
//                   </div>
//                 ) : connectionRequests && connectionRequests.length > 0 ? (
//                   <div className="space-y-4">
//                     {connectionRequests.map((request) => {
//                       console.log("Rendering request:", request);
//                       return (
//                         <ConnectionRequest
//                           key={request._id}
//                           request={request}
//                           onAccept={() => handleRequestResponse(request._id, "accept")}
//                           onReject={() => handleRequestResponse(request._id, "reject")}
//                         />
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-4">
//                     <p className="text-gray-600">No connection requests at this time.</p>
//                     <p className="text-sm text-gray-500 mt-1">Connect with more people to grow your network!</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* People You May Know */}
//             {!isSearching && (
//               <div className="bg-gray-100 mt-2 rounded-lg shadow-md p-4">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-6">People You May Know</h2>
//                 {loading.suggestions ? (
//                   <div className="text-center py-4">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Loading suggestions...</p>
//                   </div>
//                 ) : suggestedUsers.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {suggestedUsers.map((user) => (
//                       <UserCard
//                         key={user._id}
//                         user={user}
//                         onFollow={() => handleFollow(user._id)}
//                         requestSent={user.requestSent}
//                         isFollowing={user.isFollowing}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-600">No suggestions available at the moment.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="hidden lg:block w-full lg:w-1/3 space-y-6 sticky top-24 self-start">
//             <div className="bg-white rounded-lg shadow p-4">
//               <h2 className="text-lg font-bold mb-3 text-gray-800">Quick Access</h2>
//               <ul className="space-y-3 text-indigo-700 font-medium text-sm">
//                 <li><a href="/home" className="hover:underline flex items-center gap-2"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" /></svg>Home</a></li>
//                 <li><a href="/connect" className="hover:underline flex items-center gap-2"><UserGroupIcon className="w-5 h-5" />Connect People</a></li>
//                 <li><a href="/messages" className="hover:underline flex items-center gap-2"><ChatBubbleBottomCenterTextIcon className="w-5 h-5" />Messaging</a></li>
//                 <li><a href="/jobs" className="hover:underline flex items-center gap-2"><BriefcaseIcon className="w-5 h-5" />Jobs</a></li>
//                 <li><a href="/events" className="hover:underline flex items-center gap-2"><CalendarIcon className="w-5 h-5" />Events</a></li>
//                 <li><a href="/profile" className="hover:underline flex items-center gap-2"><UserCircleIcon className="w-5 h-5" />Profile</a></li>
//                 <li><a href="/chatbot" className="hover:underline flex items-center gap-2"><LifebuoyIcon className="w-5 h-5" />Help</a></li>
//               </ul>
//             </div>
//             <div
//               className="bg-indigo-300 text-blue-900 rounded-lg shadow p-6 italic text-base font-semibold tracking-wide select-none"
//               style={{ fontFamily: "'Georgia', serif" }}
//             >
//               "Networking is not collecting contacts, it's about planting relationships."
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ConnectPeople


"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../component/Navbar"
import UserCard from "../component/UserCard"
import ConnectionRequest from "../component/ConnectionRequest"
import ConnectionsModal from "../component/ConnectionsModal" // Import the new ConnectionsModal component
import {
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  BriefcaseIcon,
  CalendarIcon,
  UserCircleIcon,
  LifebuoyIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"

const ConnectPeople = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [connectionRequests, setConnectionRequests] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState({
    suggestions: true,
    requests: true,
    search: false,
  })
  const [showConnectionsModal, setShowConnectionsModal] = useState(false) // New state for connections modal

  const token = localStorage.getItem("token")

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

  // Enhanced function to fetch connection requests with proper error handling and debugging
  const fetchConnectionRequests = async () => {
    try {
      setLoading((prev) => ({ ...prev, requests: true }))

      // Make the API call
      const response = await axios.get("http://localhost:5005/api/users/requests", config)

      // Debug the response structure
      console.log("Connection requests API response:", response.data)

      // Handle the response based on its structure
      if (response.data && Array.isArray(response.data)) {
        // Direct array of requests
        setConnectionRequests(response.data)
      } else if (response.data && response.data.success && Array.isArray(response.data.requests)) {
        // Object with success flag and requests array
        setConnectionRequests(response.data.requests)
      } else if (response.data && Array.isArray(response.data.requests)) {
        // Object with requests array
        setConnectionRequests(response.data.requests)
      } else {
        console.error("Invalid requests format received:", response.data)
        toast.warning("Received unexpected data format from server")
        setConnectionRequests([])
      }
    } catch (error) {
      console.error("Error fetching connection requests:", error.response?.data || error.message || error)
      toast.error("Failed to load connection requests: " + (error.response?.data?.message || "Server error"))
      setConnectionRequests([])
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }))
    }
  }

  const fetchSuggestedUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, suggestions: true }))
      const response = await axios.get("http://localhost:5005/api/users/suggested", config)

      console.log("Suggested users response:", response.data)

      if (response.data && Array.isArray(response.data)) {
        setSuggestedUsers(response.data)
      } else if (response.data && response.data.success && Array.isArray(response.data.users)) {
        setSuggestedUsers(response.data.users)
      } else if (response.data && Array.isArray(response.data.users)) {
        setSuggestedUsers(response.data.users)
      } else {
        console.error("Invalid suggested users format:", response.data)
        setSuggestedUsers([])
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error)
      toast.error("Failed to load suggested users")
      setSuggestedUsers([])
    } finally {
      setLoading((prev) => ({ ...prev, suggestions: false }))
    }
  }

  const searchUsers = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setLoading((prev) => ({ ...prev, search: true }))
      const response = await axios.get(`http://localhost:5005/api/users/search?query=${searchQuery}`, config)

      if (response.data && Array.isArray(response.data)) {
        setSearchResults(response.data)
      } else if (response.data && Array.isArray(response.data.users)) {
        setSearchResults(response.data.users)
      } else {
        console.error("Invalid search results format:", response.data)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Search failed. Please try again.")
      setSearchResults([])
    } finally {
      setLoading((prev) => ({ ...prev, search: false }))
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    searchUsers()
  }

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(`http://localhost:5005/api/users/follow/${userId}`, {}, config)
      toast.success(response.data?.message || "Connection request sent!")

      // Update UI to show request sent
      if (isSearching) {
        setSearchResults((prev) => prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user)))
      } else {
        setSuggestedUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, requestSent: true } : user)))
      }
    } catch (error) {
      console.error("Error sending follow request:", error)
      toast.error(error.response?.data?.message || "Failed to send connection request")
    }
  }

  const handleRequestResponse = async (requestId, action) => {
    try {
      console.log(`Responding to request ${requestId} with action: ${action}`)

      // Send the request to the backend
      const response = await axios.post(`http://localhost:5005/api/users/respond/${requestId}`, { action }, config)

      console.log("Request response result:", response.data)

      // Show success message to user
      toast.success(action === "accept" ? "Connection request accepted!" : "Connection request declined")

      // Remove the request from the UI
      setConnectionRequests((prev) => prev.filter((request) => request._id !== requestId))

      // If accepted, refresh suggested users list
      if (action === "accept") {
        fetchSuggestedUsers()
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error)
      toast.error(error.response?.data?.message || `Failed to ${action} request. Please try again.`)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchConnectionRequests()
      fetchSuggestedUsers()

      // Check localStorage for sent requests
      const sentRequests = JSON.parse(localStorage.getItem("sentConnectionRequests") || "[]")
      if (sentRequests.length > 0) {
        // Update UI for any previously sent requests
        setSuggestedUsers((prev) =>
          prev.map((user) => (sentRequests.includes(user._id) ? { ...user, requestSent: true } : user)),
        )
      }
    }
  }, [token])

  return (
    <div className="min-h-screen bg-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Find & Connect with People</h1>

          {/* View Your Connections Button */}
          <button
            onClick={() => setShowConnectionsModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <UsersIcon className="h-5 w-5" />
            View Your Connections
          </button>
        </div>

        {/* Layout: Main Content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8">
              <form onSubmit={handleSearchSubmit} className="flex w-full max-w-3xl">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
                  disabled={loading.search}
                >
                  {loading.search ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </form>
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
                  <button onClick={clearSearch} className="text-indigo-600 hover:text-indigo-800 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Results
                  </button>
                </div>

                {loading.search ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        onFollow={() => handleFollow(user._id)}
                        requestSent={user.requestSent}
                        isFollowing={user.isFollowing}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-600">No users found matching your search.</p>
                  </div>
                )}
              </div>
            )}

            {/* Connection Requests */}
            {!isSearching && (
              <div className="mb-10 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Requests</h2>

                {loading.requests ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading requests...</p>
                  </div>
                ) : connectionRequests && connectionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {connectionRequests.map((request) => (
                      <ConnectionRequest
                        key={request._id}
                        request={request}
                        onAccept={() => handleRequestResponse(request._id, "accept")}
                        onReject={() => handleRequestResponse(request._id, "reject")}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">No connection requests at this time.</p>
                    <p className="text-sm text-gray-500 mt-1">Connect with more people to grow your network!</p>
                  </div>
                )}
              </div>
            )}

            {/* People You May Know */}
            {!isSearching && (
              <div className="bg-gray-100 mt-2 rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">People You May Know</h2>
                {loading.suggestions ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading suggestions...</p>
                  </div>
                ) : suggestedUsers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedUsers.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        onFollow={() => handleFollow(user._id)}
                        requestSent={user.requestSent}
                        isFollowing={user.isFollowing}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No suggestions available at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-full lg:w-1/3 space-y-6 sticky top-24 self-start">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-3 text-gray-800">Quick Access</h2>
              <ul className="space-y-3 text-indigo-700 font-medium text-sm">
                <li>
                  <a href="/home" className="hover:underline flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/connect" className="hover:underline flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5" />
                    Connect People
                  </a>
                </li>
                <li>
                  <a href="/messages" className="hover:underline flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    Messaging
                  </a>
                </li>
                <li>
                  <a href="/jobs" className="hover:underline flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5" />
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:underline flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Events
                  </a>
                </li>
                <li>
                  <a href="/profile" className="hover:underline flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5" />
                    Profile
                  </a>
                </li>
                <li>
                  <a href="/chatbot" className="hover:underline flex items-center gap-2">
                    <LifebuoyIcon className="w-5 h-5" />
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div
              className="bg-indigo-300 text-blue-900 rounded-lg shadow p-6 italic text-base font-semibold tracking-wide select-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              "Networking is not collecting contacts, it's about planting relationships."
            </div>
          </div>
        </div>
      </div>

      {/* Connections Modal */}
      <ConnectionsModal isOpen={showConnectionsModal} onClose={() => setShowConnectionsModal(false)} />
    </div>
  )
}

export default ConnectPeople


