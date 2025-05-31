// "use client"

// import { useState, useEffect } from "react"
// import { FaTimes, FaSearch, FaUser, FaLink, FaExternalLinkAlt } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"



// const ForwardPostModal = ({ isOpen, onClose, onForward, post }) => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [conversations, setConversations] = useState([])
//   const [filteredConversations, setFilteredConversations] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [selectedConversation, setSelectedConversation] = useState(null)

//   const navigate = useNavigate()
//   const token = localStorage.getItem("token")
//   const currentUserId = localStorage.getItem("userId")

//   useEffect(() => {
//     if (isOpen) {
//       fetchConversations()
//     }
//   }, [isOpen])

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredConversations(conversations)
//     } else {
//       const filtered = conversations.filter((conv) => {
//         const otherParticipant = conv.participants?.find((p) => p && p._id !== currentUserId)
//         return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       })
//       setFilteredConversations(filtered)
//     }
//   }, [searchQuery, conversations, currentUserId])

//   const fetchConversations = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch("http://localhost:5005/api/messages/conversations", {
//         headers: {
//           Authorization: token,
//         },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         if (data.success) {
//           setConversations(data.conversations || [])
//           setFilteredConversations(data.conversations || [])
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleForward = async () => {
//     if (!selectedConversation || !post) return

//     try {
//       // Create a more comprehensive post link
//       const postLink = `${window.location.origin}/post/${post._id}`

//       // Enhanced post content with better formatting
//       const postContent = `📌 *Forwarded Post*\n\n${post.content || ""}\n\n${
//         post.images && post.images.length > 0 ? `🖼️ ${post.images.length} image(s) attached\n\n` : ""
//       }👤 Originally posted by: ${post.userId?.name || post.username || "Unknown User"}\n\n🔗 View original post: ${postLink}`

//       const response = await fetch("http://localhost:5005/api/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//         body: JSON.stringify({
//           conversationId: selectedConversation._id,
//           content: postContent,
//           forwardedPost: {
//             postId: post._id,
//             originalContent: post.content,
//             images: post.images,
//             author: post.userId?.name || post.username,
//             postLink: postLink,
//             createdAt: post.createdAt,
//             isClickable: true,
//             verified: true,
//           },
//         }),
//       })

//       if (response.ok) {
//         onForward(selectedConversation)
//         onClose()
//         setSelectedConversation(null)
//         setSearchQuery("")
//       } else {
//         console.error("Failed to forward post")
//         alert("Failed to forward post. Please try again.")
//       }
//     } catch (error) {
//       console.error("Error forwarding post:", error)
//       alert("Error forwarding post. Please try again.")
//     }
//   }

//   const handleViewOriginalPost = () => {
//     if (post?._id) {
//       navigate(`/post/${post._id}`)
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[85vh] flex flex-col">
//         <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-t-lg">
//           <h3 className="text-lg font-semibold flex items-center gap-2">
//             <FaLink className="text-sm" />
//             Forward Post
//           </h3>
//           <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
//             <FaTimes />
//           </button>
//         </div>

//         <div className="p-4 border-b bg-gray-50">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="p-4 border-b bg-gray-50">
//           <div className="text-sm text-gray-700 mb-2 font-medium">Forwarding:</div>
//           <div className="bg-white p-3 rounded-lg border shadow-sm">
//             <div className="flex items-center mb-2">
//               <FaUser className="text-gray-400 mr-2" />
//               <span className="text-sm font-medium text-gray-800">
//                 {post?.userId?.name || post?.username || "Unknown User"}
//               </span>
//             </div>
//             <p className="text-sm text-gray-800 line-clamp-3 mb-2">{post?.content || "No content"}</p>
//             {post?.images && post.images.length > 0 && (
//               <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded mb-2">
//                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 {post.images.length} image{post.images.length !== 1 ? "s" : ""}
//               </div>
//             )}
//             <button
//               onClick={handleViewOriginalPost}
//               className="inline-flex items-center gap-1 text-base text-indigo-600 hover:text-indigo-800 transition-colors"
//             >
//               <FaExternalLinkAlt />
//               View original post
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {loading ? (
//             <div className="flex justify-center items-center h-32">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//             </div>
//           ) : filteredConversations.length > 0 ? (
//             <div className="p-2">
//               {filteredConversations.map((conversation) => {
//                 const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
//                 if (!otherParticipant) return null

//                 return (
//                   <button
//                     key={conversation._id}
//                     onClick={() => setSelectedConversation(conversation)}
//                     className={`w-full flex items-center p-3 rounded-lg mb-2 transition-all ${
//                       selectedConversation?._id === conversation._id
//                         ? "bg-indigo-100 border-2 border-indigo-500 shadow-md"
//                         : "hover:bg-gray-100 border-2 border-transparent hover:shadow-sm"
//                     }`}
//                   >
//                     <img
//                       src={
//                         otherParticipant.profilePhotoUrl
//                           ? `http://localhost:5005${otherParticipant.profilePhotoUrl}`
//                           : "/placeholder.svg?height=40&width=40"
//                       }
//                       alt={otherParticipant.name}
//                       className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-gray-200"
//                       onError={(e) => {
//                         e.target.src = "/placeholder.svg?height=40&width=40"
//                       }}
//                     />
//                     <div className="flex-1 text-left">
//                       <div className="font-medium text-gray-900">{otherParticipant.name}</div>
//                       <div className="text-sm text-gray-500">{otherParticipant.role || "User"}</div>
//                     </div>
//                     {selectedConversation?._id === conversation._id && (
//                       <div className="text-indigo-600">
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                           <path
//                             fillRule="evenodd"
//                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </div>
//                     )}
//                   </button>
//                 )
//               })}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-32 text-gray-500">
//               <FaSearch className="text-2xl mb-2" />
//               <p>No conversations found</p>
//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleForward}
//             disabled={!selectedConversation}
//             className={`px-6 py-2 rounded-lg font-medium transition-all ${
//               selectedConversation
//                 ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             Forward
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default ForwardPostModal


"use client"

import { useState, useEffect } from "react"
import { FaTimes, FaSearch, FaUser, FaLink, FaExternalLinkAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const DEFAULT_PROFILE_IMAGE = "https://tse2.mm.bing.net/th?id=OIP.T60Aago6tLDepIF5alRigwHaHa&pid=Api&P=0&h=180"

const ForwardPostModal = ({ isOpen, onClose, onForward, post }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState([])
  const [filteredConversations, setFilteredConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUserId = localStorage.getItem("userId")

  useEffect(() => {
    if (isOpen) {
      fetchConversations()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations)
    } else {
      const filtered = conversations.filter((conv) => {
        const otherParticipant = conv.participants?.find((p) => p && p._id !== currentUserId)
        return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      })
      setFilteredConversations(filtered)
    }
  }, [searchQuery, conversations, currentUserId])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5005/api/messages/conversations", {
        headers: {
          Authorization: token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setConversations(data.conversations || [])
          setFilteredConversations(data.conversations || [])
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleForward = async () => {
    if (!selectedConversation || !post) return

    try {
      // Create a more comprehensive post link
      const postLink = `${window.location.origin}/post/${post._id}`

      // Enhanced post content with better formatting
      const postContent = `📌 *Forwarded Post*\n\n${post.content || ""}\n\n${
        post.images && post.images.length > 0 ? `🖼️ ${post.images.length} image(s) attached\n\n` : ""
      }👤 Originally posted by: ${post.userId?.name || post.username || "Unknown User"}\n\n🔗 View original post: ${postLink}`

      const response = await fetch("http://localhost:5005/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          content: postContent,
          forwardedPost: {
            postId: post._id,
            originalContent: post.content,
            images: post.images,
            author: post.userId?.name || post.username,
            postLink: postLink,
            createdAt: post.createdAt,
            isClickable: true,
            verified: true,
          },
        }),
      })

      if (response.ok) {
        onForward(selectedConversation)
        onClose()
        setSelectedConversation(null)
        setSearchQuery("")
      } else {
        console.error("Failed to forward post")
        alert("Failed to forward post. Please try again.")
      }
    } catch (error) {
      console.error("Error forwarding post:", error)
      alert("Error forwarding post. Please try again.")
    }
  }

  const handleViewOriginalPost = () => {
    if (post?._id) {
      navigate(`/post/${post._id}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 h-[90vh] flex flex-col border border-indigo-200/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white flex-shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FaLink className="text-sm" />
            </div>
            Forward Post
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Post Preview */}
          <div className="w-1/2 flex flex-col border-r border-indigo-200">
            {/* Search Section */}
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200 flex-shrink-0">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400">
                  <FaSearch className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-indigo-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Post Preview Section */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
              <div className="text-sm text-indigo-700 mb-3 font-semibold flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                Forwarding Post:
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaUser className="text-indigo-600 text-sm" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {post?.userId?.name || post?.username || "Unknown User"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed max-h-32 overflow-y-auto">
                  {post?.content || "No content"}
                </p>
                {post?.images && post.images.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-indigo-700 bg-gradient-to-r from-indigo-100 to-blue-100 px-3 py-2 rounded-lg mb-3 border border-indigo-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      {post.images.length} image{post.images.length !== 1 ? "s" : ""} attached
                    </span>
                  </div>
                )}
                <button
                  onClick={handleViewOriginalPost}
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 hover:bg-indigo-50 px-2 py-1 rounded-lg"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                  View original post
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Conversations List */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-indigo-200 flex-shrink-0">
              <h4 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                Select Conversation
              </h4>
              <p className="text-sm text-indigo-600 mt-1">Choose who to forward this post to</p>
            </div>

            {/* Conversations List - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-indigo-50">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-full text-indigo-600">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-indigo-200 border-t-indigo-600 mb-4"></div>
                  <p className="text-lg font-medium">Loading conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                <div className="p-6 space-y-3">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
                    if (!otherParticipant) return null

                    const isSelected = selectedConversation?._id === conversation._id

                    return (
                      <button
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full flex items-center p-5 rounded-xl transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-400 shadow-lg transform scale-[1.02]"
                            : "bg-white/60 backdrop-blur-sm hover:bg-white/80 border-2 border-transparent hover:border-indigo-200 hover:shadow-md"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={
                              otherParticipant.profilePhotoUrl
                                ? `https://updatedbackendcc.onrender.com${otherParticipant.profilePhotoUrl}`
                                : DEFAULT_PROFILE_IMAGE
                            }
                            alt={otherParticipant.name}
                            className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                            onError={(e) => {
                              e.target.src = DEFAULT_PROFILE_IMAGE
                            }}
                          />
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left ml-4">
                          <div className={`font-semibold text-lg ${isSelected ? "text-indigo-800" : "text-gray-900"}`}>
                            {otherParticipant.name}
                          </div>
                          <div className={`text-sm ${isSelected ? "text-indigo-600" : "text-gray-500"} capitalize`}>
                            {otherParticipant.role || "User"}
                          </div>
                          {otherParticipant.department && (
                            <div className={`text-xs ${isSelected ? "text-indigo-500" : "text-gray-400"} mt-1`}>
                              {otherParticipant.department}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="text-indigo-600 ml-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-600 p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                    <FaSearch className="text-3xl text-indigo-500" />
                  </div>
                  <p className="font-semibold text-lg">No conversations found</p>
                  <p className="text-sm text-indigo-500 mt-2 text-center">
                    {searchQuery ? "Try adjusting your search terms" : "Start a conversation to forward posts"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-indigo-200 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-indigo-600">
            {selectedConversation ? (
              <span className="font-medium">
                Ready to forward to{" "}
                <span className="text-indigo-800 font-semibold">
                  {selectedConversation.participants?.find((p) => p && p._id !== currentUserId)?.name}
                </span>
              </span>
            ) : (
              "Select a conversation to continue"
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200 hover:bg-indigo-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleForward}
              disabled={!selectedConversation}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedConversation
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedConversation ? "Forward Post" : "Select Conversation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForwardPostModal


