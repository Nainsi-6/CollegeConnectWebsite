// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { useUser } from "../contexts/UserContext"
// import Navbar from "./Navbar"

// const ConnectPeople = () => {
//   const [users, setUsers] = useState([])
//   const [filteredUsers, setFilteredUsers] = useState([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterRole, setFilterRole] = useState("all")
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [connections, setConnections] = useState([])
//   const navigate = useNavigate()
//   const { user } = useUser()

//   useEffect(() => {
//     const fetchUsersAndConnections = async () => {
//       try {
//         setIsLoading(true)

//         // Fetch all users
//         const usersResponse = await fetch("http://localhost:5005/api/users/all", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         if (!usersResponse.ok) {
//           throw new Error("Failed to fetch users")
//         }

//         const usersData = await usersResponse.json()

//         // Fetch user's connections
//         const connectionsResponse = await fetch("http://localhost:5005/api/users/connections", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         if (!connectionsResponse.ok) {
//           throw new Error("Failed to fetch connections")
//         }

//         const connectionsData = await connectionsResponse.json()
//         setConnections(connectionsData.connections)

//         // Filter out the current user from the list
//         const otherUsers = usersData.users.filter((u) => u._id !== user?._id)

//         // Merge connection status with users
//         const usersWithConnectionStatus = otherUsers.map((u) => {
//           const connection = connectionsData.connections.find((c) => c.requester === u._id || c.recipient === u._id)

//           if (!connection) {
//             return { ...u, connectionStatus: "none" }
//           }

//           if (connection.status === "pending") {
//             if (connection.requester === user?._id) {
//               return { ...u, connectionStatus: "pending", connectionId: connection._id }
//             } else {
//               return { ...u, connectionStatus: "pending-received", connectionId: connection._id }
//             }
//           }

//           return { ...u, connectionStatus: "connected", connectionId: connection._id }
//         })

//         setUsers(usersWithConnectionStatus)
//         setFilteredUsers(usersWithConnectionStatus)
//         setIsLoading(false)
//       } catch (err) {
//         console.error("Error fetching data:", err)
//         setError(err.message)
//         setIsLoading(false)
//       }
//     }

//     if (user?._id) {
//       fetchUsersAndConnections()
//     }
//   }, [user])

//   useEffect(() => {
//     // Filter users based on search query and role filter
//     const filtered = users.filter((user) => {
//       const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
//       const roleMatch = filterRole === "all" || user.role === filterRole
//       return nameMatch && roleMatch
//     })

//     setFilteredUsers(filtered)
//   }, [searchQuery, filterRole, users])

//   const handleConnect = async (userId) => {
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

//       // Update UI to show connection request sent
//       const updatedUsers = users.map((user) =>
//         user._id === userId ? { ...user, connectionStatus: "pending", connectionId: data.connection._id } : user,
//       )
//       setUsers(updatedUsers)
//       setFilteredUsers(
//         updatedUsers.filter((user) => {
//           const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
//           const roleMatch = filterRole === "all" || user.role === filterRole
//           return nameMatch && roleMatch
//         }),
//       )

//       // Add to connections
//       setConnections([...connections, data.connection])
//     } catch (err) {
//       console.error("Error connecting with user:", err)
//       alert(`Failed to send connection request: ${err.message}`)
//     }
//   }

//   const handleCancelRequest = async (connectionId) => {
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

//       // Update connections list
//       const updatedConnections = connections.filter((c) => c._id !== connectionId)
//       setConnections(updatedConnections)

//       // Update users list
//       const updatedUsers = users.map((user) =>
//         user.connectionId === connectionId ? { ...user, connectionStatus: "none", connectionId: undefined } : user,
//       )
//       setUsers(updatedUsers)
//       setFilteredUsers(
//         updatedUsers.filter((user) => {
//           const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
//           const roleMatch = filterRole === "all" || user.role === filterRole
//           return nameMatch && roleMatch
//         }),
//       )
//     } catch (err) {
//       console.error("Error canceling connection request:", err)
//       alert(`Failed to cancel connection request: ${err.message}`)
//     }
//   }

//   const handleAcceptRequest = async (connectionId) => {
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

//       // Update connections list
//       const updatedConnections = connections.map((c) => (c._id === connectionId ? { ...c, status: "accepted" } : c))
//       setConnections(updatedConnections)

//       // Update users list
//       const updatedUsers = users.map((user) =>
//         user.connectionId === connectionId ? { ...user, connectionStatus: "connected" } : user,
//       )
//       setUsers(updatedUsers)
//       setFilteredUsers(
//         updatedUsers.filter((user) => {
//           const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
//           const roleMatch = filterRole === "all" || user.role === filterRole
//           return nameMatch && roleMatch
//         }),
//       )
//     } catch (err) {
//       console.error("Error accepting connection request:", err)
//       alert(`Failed to accept connection request: ${err.message}`)
//     }
//   }

//   const viewProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto p-4 max-w-6xl">
//           <h1 className="text-3xl font-bold mb-6 text-blue-600">Connect with People</h1>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="border rounded-lg overflow-hidden shadow-lg animate-pulse">
//                 <div className="bg-gray-200 h-24 relative">
//                   <div className="absolute bottom-0 left-4 transform translate-y-1/2 w-16 h-16 bg-gray-300 rounded-full"></div>
//                 </div>
//                 <div className="p-4 pt-10">
//                   <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
//                   <div className="flex gap-2">
//                     <div className="h-10 bg-gray-200 rounded w-full"></div>
//                     <div className="h-10 bg-gray-200 rounded w-full"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
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

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-4 max-w-6xl">
//         <div className="flex flex-col md:flex-row items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-blue-600 mb-4 md:mb-0">Connect with People</h1>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <i className="fas fa-users text-sm"></i>
//             <span>{filteredUsers.length} people found</span>
//           </div>
//         </div>

//         <div className="mb-6 flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//             <input
//               type="text"
//               placeholder="Search by name..."
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="md:w-1/4">
//             <select
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filterRole}
//               onChange={(e) => setFilterRole(e.target.value)}
//             >
//               <option value="all">All Roles</option>
//               <option value="student">Students</option>
//               <option value="faculty">Faculty</option>
//               <option value="alumni">Alumni</option>
//             </select>
//           </div>
//         </div>

//         {filteredUsers.length === 0 ? (
//           <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
//             <i className="fas fa-user-circle text-gray-400 text-4xl mb-2"></i>
//             <p className="text-gray-500 text-lg">No users found matching your search criteria.</p>
//             <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredUsers.map((user) => (
//               <div
//                 key={user._id}
//                 className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24 relative">
//                   {/* Role badge */}
//                   <div className="absolute top-2 right-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
//                     {user.role === "student" && (
//                       <>
//                         <i className="fas fa-graduation-cap mr-1"></i> Student
//                       </>
//                     )}
//                     {user.role === "faculty" && (
//                       <>
//                         <i className="fas fa-building mr-1"></i> Faculty
//                       </>
//                     )}
//                     {user.role === "alumni" && (
//                       <>
//                         <i className="fas fa-briefcase mr-1"></i> Alumni
//                       </>
//                     )}
//                   </div>

//                   {/* Profile photo */}
//                   <div className="absolute bottom-0 left-4 transform translate-y-1/2">
//                     <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white overflow-hidden">
//                       {user.profilePhoto ? (
//                         <img
//                           src={`http://localhost:5005/${user.profilePhoto}`}
//                           alt={user.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-blue-600">{user.name.charAt(0).toUpperCase()}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-4 pt-10">
//                   <h2 className="text-xl font-semibold">{user.name}</h2>

//                   {/* Role-specific details */}
//                   {user.role === "student" && (
//                     <p className="text-gray-600 text-sm mt-1 flex items-center">
//                       <i className="fas fa-graduation-cap text-blue-500 mr-1"></i>
//                       {user.batch && `Batch: ${user.batch}`} {user.regNumber && `• Reg: ${user.regNumber}`}
//                     </p>
//                   )}

//                   {user.role === "faculty" && (
//                     <p className="text-gray-600 text-sm mt-1 flex items-center">
//                       <i className="fas fa-building text-blue-500 mr-1"></i>
//                       {user.department && `Department: ${user.department}`}
//                     </p>
//                   )}

//                   {user.role === "alumni" && (
//                     <p className="text-gray-600 text-sm mt-1 flex items-center">
//                       <i className="fas fa-briefcase text-blue-500 mr-1"></i>
//                       {user.company && `Company: ${user.company}`}{" "}
//                       {user.passedOutBatch && `• Class of ${user.passedOutBatch}`}
//                     </p>
//                   )}

//                   <div className="mt-4 flex gap-2">
//                     <button
//                       onClick={() => viewProfile(user._id)}
//                       className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
//                     >
//                       View Profile
//                     </button>

//                     {user.connectionStatus === "none" && (
//                       <button
//                         onClick={() => handleConnect(user._id)}
//                         className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                       >
//                         Connect
//                       </button>
//                     )}

//                     {user.connectionStatus === "pending" && (
//                       <button
//                         onClick={() => handleCancelRequest(user.connectionId)}
//                         className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
//                       >
//                         Cancel Request
//                       </button>
//                     )}

//                     {user.connectionStatus === "pending-received" && (
//                       <button
//                         onClick={() => handleAcceptRequest(user.connectionId)}
//                         className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                       >
//                         Accept Request
//                       </button>
//                     )}

//                     {user.connectionStatus === "connected" && (
//                       <button
//                         className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-not-allowed"
//                         disabled
//                       >
//                         Connected
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default ConnectPeople


// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { useUser } from "../contexts/UserContext"
// import Navbar from "../components/Navbar"
// import UserCard from "../components/UserCard"
// import ConnectionRequest from "../components/ConnectionRequest"
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




