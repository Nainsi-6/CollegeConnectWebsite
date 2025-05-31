// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Tab } from "@headlessui/react"
// import ProfilePhoto from "./ProfilePhoto"

// const ConnectionsModal = ({ isOpen, onClose }) => {
//   const [connections, setConnections] = useState({
//     followers: [],
//     following: [],
//     pending: [],
//     sent: [] // Added state for sent requests
//   })
//   const [loading, setLoading] = useState(true)

//   // API base URL
//   const API_BASE_URL = "http://localhost:5005"

//   // Get token from localStorage
//   const token = localStorage.getItem("token")

//   // Set up axios headers
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }

//   // Format profile photo URL correctly
//   const getProfilePhotoUrl = (user) => {
//     if (!user.profilePhotoUrl) {
//       return "/default-profile.jpg"
//     }

//     // If the URL already includes the full domain, use it as is
//     if (user.profilePhotoUrl.startsWith("http")) {
//       return user.profilePhotoUrl
//     }

//     // Otherwise, prepend the API base URL
//     return `${API_BASE_URL}${user.profilePhotoUrl}`
//   }

//   useEffect(() => {
//     if (isOpen) {
//       fetchConnections()
//     }
//   }, [isOpen])

//   const fetchConnections = async () => {
//     try {
//       setLoading(true)
//       // Fetch connections
//       const connectionsResponse = await axios.get(`${API_BASE_URL}/api/users/connections`, config)
      
//       // Fetch pending requests (received)
//       const requestsResponse = await axios.get(`${API_BASE_URL}/api/users/requests`, config)
      
//       // Fetch sent requests that haven't been accepted yet
//       const sentRequestsResponse = await axios.get(`${API_BASE_URL}/api/users/sent-requests`, config)

//       // Parse and organize connection data
//       const followers = connectionsResponse.data.followers || []
//       const following = connectionsResponse.data.following || []
//       const pendingRequests = requestsResponse.data.requests || []
//       const sentRequests = sentRequestsResponse.data.sentRequests || []

//       setConnections({
//         followers: followers.filter((follow) => follow.status === "accepted"),
//         following: following.filter((follow) => follow.status === "accepted"),
//         pending: pendingRequests,
//         sent: sentRequests
//       })
//     } catch (error) {
//       console.error("Error fetching connections:", error)
//       // Handle errors for each endpoint individually
//       try {
//         // Fallback to get connections only if the other endpoints fail
//         const response = await axios.get(`${API_BASE_URL}/api/users/connections`, config)
//         setConnections({
//           followers: response.data.followers || [],
//           following: response.data.following || [],
//           pending: response.data.requests || [],
//           sent: []
//         })
//       } catch (fallbackError) {
//         console.error("Fallback error:", fallbackError)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/users/respond/${requestId}`, { action: "accept" }, config)
//       // Update connections after accepting
//       fetchConnections()
//     } catch (error) {
//       console.error("Error accepting request:", error)
//     }
//   }

//   const handleRejectRequest = async (requestId) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/users/respond/${requestId}`, { action: "reject" }, config)
//       // Update connections after rejecting
//       fetchConnections()
//     } catch (error) {
//       console.error("Error rejecting request:", error)
//     }
//   }

//   const handleCancelRequest = async (requestId) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/api/users/follow/${requestId}`, config)
//       // Update connections after canceling
//       fetchConnections()
//     } catch (error) {
//       console.error("Error canceling request:", error)
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-semibold text-indigo-700">Your Connections</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="px-4 py-2">
//           <Tab.Group>
//             <Tab.List className="flex space-x-1 rounded-xl bg-indigo-100 p-1">
//               <Tab
//                 className={({ selected }) =>
//                   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                   ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
//                 }
//               >
//                 Followers ({connections.followers.length})
//               </Tab>
//               <Tab
//                 className={({ selected }) =>
//                   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                   ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
//                 }
//               >
//                 Following ({connections.following.length})
//               </Tab>
//               <Tab
//                 className={({ selected }) =>
//                   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                   ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
//                 }
//               >
//                 Received Requests ({connections.pending.length})
//               </Tab>
//               <Tab
//                 className={({ selected }) =>
//                   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                   ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
//                 }
//               >
//                 Sent Requests ({connections.sent.length})
//               </Tab>
//             </Tab.List>
//             <Tab.Panels className="mt-2">
//               {/* Followers Panel */}
//               <Tab.Panel className="rounded-xl bg-white p-3">
//                 <div className="overflow-y-auto max-h-[50vh]">
//                   {loading ? (
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
//                     </div>
//                   ) : connections.followers.length > 0 ? (
//                     <div className="divide-y divide-gray-100">
//                       {connections.followers.map((connection) => {
//                         const user = connection.follower
//                         return (
//                           <div key={connection._id} className="flex items-center p-4 hover:bg-gray-50">
//                             <ProfilePhoto src={getProfilePhotoUrl(user)} alt={user.name} size="lg" />
//                             <div className="ml-4 flex-grow">
//                               <h3 className="font-medium text-gray-900">{user.name}</h3>
//                               <p className="text-sm text-gray-500">{user.email}</p>
//                               <p className="text-xs text-gray-500 capitalize">{user.role || ""}</p>
//                             </div>
//                             <a
//                               href={`/profile/${user._id}`}
//                               className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
//                             >
//                               View Profile
//                             </a>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-600">No followers yet</p>
//                     </div>
//                   )}
//                 </div>
//               </Tab.Panel>

//               {/* Following Panel */}
//               <Tab.Panel className="rounded-xl bg-white p-3">
//                 <div className="overflow-y-auto max-h-[50vh]">
//                   {loading ? (
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
//                     </div>
//                   ) : connections.following.length > 0 ? (
//                     <div className="divide-y divide-gray-100">
//                       {connections.following.map((connection) => {
//                         const user = connection.following
//                         return (
//                           <div key={connection._id} className="flex items-center p-4 hover:bg-gray-50">
//                             <ProfilePhoto src={getProfilePhotoUrl(user)} alt={user.name} size="lg" />
//                             <div className="ml-4 flex-grow">
//                               <h3 className="font-medium text-gray-900">{user.name}</h3>
//                               <p className="text-sm text-gray-500">{user.email}</p>
//                               <p className="text-xs text-gray-500 capitalize">{user.role || ""}</p>
//                             </div>
//                             <a
//                               href={`/profile/${user._id}`}
//                               className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
//                             >
//                               View Profile
//                             </a>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-600">You are not following anyone yet</p>
//                     </div>
//                   )}
//                 </div>
//               </Tab.Panel>

//               {/* Received Requests Panel */}
//               <Tab.Panel className="rounded-xl bg-white p-3">
//                 <div className="overflow-y-auto max-h-[50vh]">
//                   {loading ? (
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
//                     </div>
//                   ) : connections.pending.length > 0 ? (
//                     <div className="divide-y divide-gray-100">
//                       {connections.pending.map((request) => (
//                         <div key={request._id} className="flex items-center p-4 hover:bg-gray-50">
//                           <ProfilePhoto
//                             src={getProfilePhotoUrl(request.follower)}
//                             alt={request.follower.name}
//                             size="lg"
//                           />
//                           <div className="ml-4 flex-grow">
//                             <h3 className="font-medium text-gray-900">{request.follower.name}</h3>
//                             <p className="text-sm text-gray-500">{request.follower.email}</p>
//                             <p className="text-xs text-gray-500 capitalize">{request.follower.role || ""}</p>
//                           </div>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleRejectRequest(request._id)}
//                               className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
//                             >
//                               Reject
//                             </button>
//                             <button
//                               onClick={() => handleAcceptRequest(request._id)}
//                               className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
//                             >
//                               Accept
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-600">No pending requests</p>
//                     </div>
//                   )}
//                 </div>
//               </Tab.Panel>

//               {/* Sent Requests Panel */}
//               <Tab.Panel className="rounded-xl bg-white p-3">
//                 <div className="overflow-y-auto max-h-[50vh]">
//                   {loading ? (
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
//                     </div>
//                   ) : connections.sent.length > 0 ? (
//                     <div className="divide-y divide-gray-100">
//                       {connections.sent.map((request) => (
//                         <div key={request._id} className="flex items-center p-4 hover:bg-gray-50">
//                           <ProfilePhoto
//                             src={getProfilePhotoUrl(request.following)}
//                             alt={request.following.name}
//                             size="lg"
//                           />
//                           <div className="ml-4 flex-grow">
//                             <h3 className="font-medium text-gray-900">{request.following.name}</h3>
//                             <p className="text-sm text-gray-500">{request.following.email}</p>
//                             <p className="text-xs text-gray-500 capitalize">{request.following.role || ""}</p>
//                           </div>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleCancelRequest(request._id)}
//                               className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//                             >
//                               Cancel Request
//                             </button>
//                             <a
//                               href={`/profile/${request.following._id}`}
//                               className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
//                             >
//                               View Profile
//                             </a>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-600">No sent requests</p>
//                     </div>
//                   )}
//                 </div>
//               </Tab.Panel>
//             </Tab.Panels>
//           </Tab.Group>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ConnectionsModal

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tab } from "@headlessui/react"
import ProfilePhoto from "./ProfilePhoto"
import { useNavigate } from "react-router-dom"

const ConnectionsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [connections, setConnections] = useState({
    followers: [],
    following: [],
    pending: [],
    sent: [], // Added state for sent requests
  })
  const [loading, setLoading] = useState(true)

  // API base URL
  const API_BASE_URL = "http://localhost:5005"

  // Get token from localStorage
  const token = localStorage.getItem("token")

  // Set up axios headers
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // Format profile photo URL correctly
  const getProfilePhotoUrl = (user) => {
    if (!user.profilePhotoUrl) {
      return "/default-profile.jpg"
    }

    // If the URL already includes the full domain, use it as is
    if (user.profilePhotoUrl.startsWith("http")) {
      return user.profilePhotoUrl
    }

    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${user.profilePhotoUrl}`
  }

  useEffect(() => {
    if (isOpen) {
      fetchConnections()
    }
  }, [isOpen])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      // Fetch connections
      const connectionsResponse = await axios.get(`${API_BASE_URL}/api/users/connections`, config)

      // Fetch pending requests (received)
      const requestsResponse = await axios.get(`${API_BASE_URL}/api/users/requests`, config)

      // Fetch sent requests that haven't been accepted yet
      const sentRequestsResponse = await axios.get(`${API_BASE_URL}/api/users/sent-requests`, config)

      // Parse and organize connection data
      const followers = connectionsResponse.data.followers || []
      const following = connectionsResponse.data.following || []
      const pendingRequests = requestsResponse.data.requests || []
      const sentRequests = sentRequestsResponse.data.sentRequests || []

      setConnections({
        followers: followers.filter((follow) => follow.status === "accepted"),
        following: following.filter((follow) => follow.status === "accepted"),
        pending: pendingRequests,
        sent: sentRequests,
      })
    } catch (error) {
      console.error("Error fetching connections:", error)
      // Handle errors for each endpoint individually
      try {
        // Fallback to get connections only if the other endpoints fail
        const response = await axios.get(`${API_BASE_URL}/api/users/connections`, config)
        setConnections({
          followers: response.data.followers || [],
          following: response.data.following || [],
          pending: response.data.requests || [],
          sent: [],
        })
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/users/respond/${requestId}`, { action: "accept" }, config)

      // Remove the accepted request from pending requests immediately
      setConnections((prev) => ({
        ...prev,
        pending: prev.pending.filter((request) => request._id !== requestId),
      }))

      // Refresh all connections data to get updated followers/following
      setTimeout(() => {
        fetchConnections()
      }, 500)
    } catch (error) {
      console.error("Error accepting request:", error)
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/users/respond/${requestId}`, { action: "reject" }, config)

      // Remove the rejected request from pending requests immediately
      setConnections((prev) => ({
        ...prev,
        pending: prev.pending.filter((request) => request._id !== requestId),
      }))

      // Update connections after rejecting
      setTimeout(() => {
        fetchConnections()
      }, 500)
    } catch (error) {
      console.error("Error rejecting request:", error)
    }
  }

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/follow/${requestId}`, config)

      // Remove the cancelled request from sent requests immediately
      setConnections((prev) => ({
        ...prev,
        sent: prev.sent.filter((request) => request._id !== requestId),
      }))

      // Update connections after canceling
      setTimeout(() => {
        fetchConnections()
      }, 500)
    } catch (error) {
      console.error("Error canceling request:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-indigo-700">Your Connections</h2>
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

        <div className="px-4 py-2">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-indigo-100 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
                }
              >
                Followers ({connections.followers.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
                }
              >
                Following ({connections.following.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
                }
              >
                Received Requests ({connections.pending.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected ? "bg-indigo-600 text-white shadow" : "text-indigo-700 hover:bg-indigo-200"}`
                }
              >
                Sent Requests ({connections.sent.length})
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              {/* Followers Panel */}
              <Tab.Panel className="rounded-xl bg-white p-3">
                <div className="overflow-y-auto max-h-[50vh]">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : connections.followers.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {connections.followers.map((connection) => {
                        const user = connection.follower
                        return (
                          <div key={connection._id} className="flex items-center p-4 hover:bg-gray-50">
                            <ProfilePhoto src={getProfilePhotoUrl(user)} alt={user.name} size="lg" />
                            <div className="ml-4 flex-grow">
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role || ""}</p>
                            </div>
                            <button
                              onClick={() => navigate(`/profile/${user._id}`)}
                              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              View Profile
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No followers yet</p>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Following Panel */}
              <Tab.Panel className="rounded-xl bg-white p-3">
                <div className="overflow-y-auto max-h-[50vh]">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : connections.following.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {connections.following.map((connection) => {
                        const user = connection.following
                        return (
                          <div key={connection._id} className="flex items-center p-4 hover:bg-gray-50">
                            <ProfilePhoto src={getProfilePhotoUrl(user)} alt={user.name} size="lg" />
                            <div className="ml-4 flex-grow">
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role || ""}</p>
                            </div>
                            <button
                              onClick={() => navigate(`/profile/${user._id}`)}
                              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              View Profile
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You are not following anyone yet</p>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Received Requests Panel */}
              <Tab.Panel className="rounded-xl bg-white p-3">
                <div className="overflow-y-auto max-h-[50vh]">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : connections.pending.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {connections.pending.map((request) => (
                        <div key={request._id} className="flex items-center p-4 hover:bg-gray-50">
                          <ProfilePhoto
                            src={getProfilePhotoUrl(request.follower)}
                            alt={request.follower.name}
                            size="lg"
                          />
                          <div className="ml-4 flex-grow">
                            <h3 className="font-medium text-gray-900">{request.follower.name}</h3>
                            <p className="text-sm text-gray-500">{request.follower.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{request.follower.role || ""}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No pending requests</p>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Sent Requests Panel */}
              <Tab.Panel className="rounded-xl bg-white p-3">
                <div className="overflow-y-auto max-h-[50vh]">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : connections.sent.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {connections.sent.map((request) => (
                        <div key={request._id} className="flex items-center p-4 hover:bg-gray-50">
                          <ProfilePhoto
                            src={getProfilePhotoUrl(request.following)}
                            alt={request.following.name}
                            size="lg"
                          />
                          <div className="ml-4 flex-grow">
                            <h3 className="font-medium text-gray-900">{request.following.name}</h3>
                            <p className="text-sm text-gray-500">{request.following.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{request.following.role || ""}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancelRequest(request._id)}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                              Cancel Request
                            </button>
                            <button
                              onClick={() => navigate(`/profile/${request.following._id}`)}
                              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No sent requests</p>
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  )
}

export default ConnectionsModal

