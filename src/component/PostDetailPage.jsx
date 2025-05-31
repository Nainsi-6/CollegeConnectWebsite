"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { useUser } from "../contexts/UserContext"
import PostActionsDropdown from "./PostActionsDropdown"
import PostImageDisplay from "./PostImageDisplay"
import ImageModal from "./ImageModal"
import ForwardPostModal from "./ForwardPostModal"

const PostDetailPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showComments, setShowComments] = useState(true)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showForwardModal, setShowForwardModal] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5005/api/posts/${postId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError("Post not found")
        } else {
          throw new Error(`Failed to fetch post: ${response.statusText}`)
        }
        return
      }

      const data = await response.json()
      setPost(data)
    } catch (err) {
      console.error("Error fetching post:", err)
      setError("Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async () => {
    if (!user) {
      alert("Please log in to like posts")
      return
    }

    try {
      const res = await fetch(`http://localhost:5005/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      })

      if (!res.ok) {
        throw new Error("Failed to like post")
      }

      const updatedPost = await res.json()
      setPost(updatedPost)
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleDislikePost = async () => {
    if (!user) {
      alert("Please log in to dislike posts")
      return
    }

    try {
      const res = await fetch(`http://localhost:5005/api/posts/${postId}/dislike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      })

      if (!res.ok) {
        throw new Error("Failed to dislike post")
      }

      const updatedPost = await res.json()
      setPost(updatedPost)
    } catch (err) {
      console.error("Error disliking post:", err)
    }
  }

  const handleAddComment = async (text) => {
    if (!user) {
      alert("Please log in to comment")
      return
    }

    if (!text.trim()) return

    try {
      const res = await fetch(`http://localhost:5005/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          userId: user._id,
          username: user.name,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to add comment")
      }

      const updatedPost = await res.json()
      setPost(updatedPost)
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  const handleDeletePost = async () => {
    if (!user) return

    if (!window.confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const res = await fetch(`http://localhost:5005/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete post")
      }

      alert("Post deleted successfully")
      navigate("/")
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post: " + err.message)
    }
  }

  const handleReportPost = async () => {
    if (!user) {
      alert("Please log in to report posts")
      return
    }

    const reason = prompt("Please provide a reason for reporting this post:")
    if (!reason) return

    try {
      const response = await fetch(`http://localhost:5005/api/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, reason }),
      })

      if (response.ok) {
        alert("Post reported successfully")
      } else {
        alert("Failed to report post")
      }
    } catch (error) {
      console.error("Error reporting post:", error)
      alert("Failed to report post")
    }
  }

  const handleSavePost = async () => {
    if (!user) {
      alert("Please log in to save posts")
      return
    }

    try {
      const response = await fetch(`http://localhost:5005/api/posts/${postId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      })

      if (response.ok) {
        alert("Post saved successfully")
      } else {
        alert("Failed to save post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    }
  }

  const handleForwardPost = () => {
    setShowForwardModal(true)
  }

  const handleForwardComplete = (conversation) => {
    alert(`Post forwarded to ${conversation.participants?.find((p) => p._id !== user._id)?.name || "user"}`)
    setShowForwardModal(false)
  }

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`)
    }
  }

  const openImageModal = (imageIndex = 0) => {
    setCurrentImageIndex(imageIndex)
    setShowImageModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="container mx-auto py-20 px-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">{error}</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="container mx-auto py-20 px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-400 mb-4">Post not found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <div className="container mx-auto py-20 px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-indigo-300 hover:text-indigo-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Post content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className="w-12 h-12 rounded-full bg-indigo-600 mr-4 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => handleUserClick(post.userId?._id || post.userId)}
                >
                  {post.userId && post.userId.image ? (
                    <img
                      src={post.userId.image || "/placeholder.svg?height=48&width=48"}
                      alt={post.userId.name || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=48&width=48"
                      }}
                    />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div>
                  <p
                    className="font-semibold text-white cursor-pointer hover:text-indigo-300 transition-colors text-lg"
                    onClick={() => handleUserClick(post.userId?._id || post.userId)}
                  >
                    {post.userId?.name || post.username || "User"}
                  </p>
                  <p className="text-sm text-indigo-300">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <PostActionsDropdown
                post={post}
                currentUser={user}
                onDelete={handleDeletePost}
                onReport={handleReportPost}
                onSave={handleSavePost}
                onForward={handleForwardPost}
              />
            </div>

            {post.title && <h1 className="text-2xl font-bold mb-4">{post.title}</h1>}

            <div className="text-indigo-100 whitespace-pre-wrap break-words overflow-wrap-anywhere text-lg leading-relaxed mb-4">
              {post.content}
            </div>

            {/* Images */}
            <PostImageDisplay images={post.images} onImageClick={openImageModal} onViewAllClick={openImageModal} />

            {/* Like, dislike, comment buttons */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-600">
              <button
                onClick={handleLikePost}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  post.likes?.includes(user?._id)
                    ? "bg-indigo-500 text-white"
                    : "text-indigo-300 hover:text-indigo-200 hover:bg-gray-600"
                } transition-colors`}
              >
                👍 {post.likes?.length || 0}
              </button>

              <button
                onClick={handleDislikePost}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  post.dislikes?.includes(user?._id)
                    ? "bg-red-600 text-white"
                    : "text-red-300 hover:text-red-200 hover:bg-gray-600"
                } transition-colors`}
              >
                👎 {post.dislikes?.length || 0}
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="text-indigo-300 hover:text-indigo-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                💬 {post.comments?.length || 0} Comments
              </button>
            </div>

            {/* Comments section */}
            {showComments && (
              <div className="mt-6 pt-4 border-t border-gray-600">
                <h3 className="text-white mb-4 font-medium text-lg">Comments</h3>

                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {post.comments.map((comment, cIndex) => (
                      <div key={cIndex} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-white">{comment.username || "User"}</span>
                          <span className="text-sm text-indigo-300">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-white break-words">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-indigo-300 mb-6">No comments yet. Be the first to comment!</p>
                )}

                {user ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const form = e.target
                      const commentInput = form.elements.commentText
                      handleAddComment(commentInput.value)
                      commentInput.value = ""
                    }}
                  >
                    <div className="flex gap-3">
                      <input
                        name="commentText"
                        className="flex-1 bg-indigo-900 border border-indigo-600 rounded-lg p-3 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Add a comment..."
                        required
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-red-300 text-center">
                    <button
                      onClick={() => navigate("/login")}
                      className="text-indigo-300 hover:text-indigo-200 underline"
                    >
                      Log in
                    </button>{" "}
                    to comment on this post.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={post.images || []}
        currentIndex={currentImageIndex}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onIndexChange={setCurrentImageIndex}
      />

      {/* Forward Post Modal */}
      <ForwardPostModal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        onForward={handleForwardComplete}
        post={post}
      />
    </div>
  )
}

export default PostDetailPage
