"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import PostImageDisplay from "./PostImageDisplay"
import ImageModal from "./ImageModal"

const SavedPostsModal = ({ isOpen, onClose, userId }) => {
  const [savedPosts, setSavedPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentPostImages, setCurrentPostImages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && userId) {
      fetchSavedPosts()
    }
  }, [isOpen, userId])

  const fetchSavedPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5005/api/posts/saved/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSavedPosts(data)
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const unsavePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5005/api/posts/${postId}/unsave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        setSavedPosts((prev) => prev.filter((post) => post._id !== postId))
      }
    } catch (error) {
      console.error("Error unsaving post:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleUserClick = (userId) => {
    if (userId) {
      onClose()
      navigate(`/profile/${userId}`)
    }
  }

  const openImageModal = (post, imageIndex = 0) => {
    setCurrentPostImages(post.images || [])
    setCurrentImageIndex(imageIndex)
    setShowImageModal(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col z-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-900 text-gray-100 pt-16 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Saved Posts</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-gray-300">Loading saved posts...</span>
                </div>
              ) : savedPosts.length === 0 ? (
                <div className="text-center py-16">
                  <svg
                    className="w-20 h-20 text-gray-500 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-3">No saved posts yet</h3>
                  <p className="text-gray-500">Posts you save will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedPosts.map((post) => (
                    <div key={post._id} className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-full bg-indigo-600 mr-3 flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={() => handleUserClick(post.userId?._id)}
                          >
                            {post.userId && post.userId.image ? (
                              <img
                                src={post.userId.image || "/placeholder.svg?height=40&width=40"}
                                alt={post.userId.name || "User"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=40&width=40"
                                }}
                              />
                            ) : (
                              <span className="text-xl text-white">
                                {post.userId?.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4
                              className="font-semibold text-white cursor-pointer hover:text-indigo-300 transition-colors"
                              onClick={() => handleUserClick(post.userId?._id)}
                            >
                              {post.userId?.name || "User"}
                            </h4>
                            <p className="text-xs text-indigo-300 capitalize">{post.userId?.role || "Member"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">{formatDate(post.createdAt)}</span>
                          <button
                            onClick={() => unsavePost(post._id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                            title="Unsave post"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      {post.content && (
                        <div className="text-indigo-100 whitespace-pre-wrap break-words overflow-wrap-anywhere mb-3">
                          {post.content}
                        </div>
                      )}

                      {/* Post Images */}
                      <PostImageDisplay
                        images={post.images}
                        onImageClick={(imageIndex) => openImageModal(post, imageIndex)}
                        onViewAllClick={(imageIndex) => openImageModal(post, imageIndex)}
                      />

                      {/* Post Stats */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-600">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            👍 {post.likes?.length || 0} likes
                          </span>
                          <span className="flex items-center gap-1">
                            💬 {post.comments?.length || 0} comments
                          </span>
                        </div>
                        <button className="text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={currentPostImages}
        currentIndex={currentImageIndex}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  )
}

export default SavedPostsModal

