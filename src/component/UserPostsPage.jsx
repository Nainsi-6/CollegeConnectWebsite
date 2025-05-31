"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { useUser } from "../contexts/UserContext"
import PostActionsDropdown from "./PostActionsDropdown"
import PostImageDisplay from "./PostImageDisplay"
import ImageModal from "./ImageModal"
import ForwardPostModal from "./ForwardPostModal"

const UserPostsPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const [posts, setPosts] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showComments, setShowComments] = useState({})
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentPostImages, setCurrentPostImages] = useState([])
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [postToForward, setPostToForward] = useState(null)

  useEffect(() => {
    fetchUserPosts()
    fetchUserInfo()
  }, [userId])

  const fetchUserPosts = async () => {
    try {
      setLoading(true)
      const targetUserId = userId || user?._id

      if (!targetUserId) {
        setError("User not found")
        return
      }

      const response = await fetch(`http://localhost:5005/api/posts/user/${targetUserId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`)
      }

      const data = await response.json()
      setPosts(data)
    } catch (err) {
      console.error("Error fetching user posts:", err)
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const targetUserId = userId || user?._id

      if (!targetUserId) return

      const response = await fetch(`http://localhost:5005/api/users/${targetUserId}`)

      if (response.ok) {
        const data = await response.json()
        setUserInfo(data)
      }
    } catch (err) {
      console.error("Error fetching user info:", err)
    }
  }

  const handleLikePost = async (postId) => {
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
      setPosts((prevPosts) => prevPosts.map((post) => (post._id === postId ? updatedPost : post)))
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleDislikePost = async (postId) => {
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
      setPosts((prevPosts) => prevPosts.map((post) => (post._id === postId ? updatedPost : post)))
    } catch (err) {
      console.error("Error disliking post:", err)
    }
  }

  const handleAddComment = async (postId, text) => {
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
      setPosts((prevPosts) => prevPosts.map((post) => (post._id === postId ? updatedPost : post)))
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  const handleDeletePost = async (postId) => {
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

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post: " + err.message)
    }
  }

  const handleReportPost = async (postId) => {
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

  const handleSavePost = async (postId) => {
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

  const handleForwardPost = (post) => {
    setPostToForward(post)
    setShowForwardModal(true)
  }

  const handleForwardComplete = (conversation) => {
    alert(`Post forwarded to ${conversation.participants?.find((p) => p._id !== user._id)?.name || "user"}`)
    setShowForwardModal(false)
    setPostToForward(null)
  }

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`)
    }
  }

  const openPostImageModal = (post, imageIndex = 0) => {
    setCurrentPostImages(post.images || [])
    setCurrentImageIndex(imageIndex)
    setShowImageModal(true)
  }

  const isOwnPosts = !userId || userId === user?._id

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <div className="container mx-auto py-20 px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 flex items-center text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-white">
              {isOwnPosts ? "Your Posts" : `${userInfo?.name || "User"}'s Posts`}
            </h1>
          </div>
          <div className="text-indigo-300">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </div>
        </div>

        {/* Posts */}
        <div className="max-w-2xl mx-auto">
          {posts.length === 0 ? (
            <div className="bg-gray-700 p-8 rounded-lg shadow-md text-center">
              <p className="text-indigo-200 text-lg">
                {isOwnPosts ? "You haven't created any posts yet." : "This user hasn't created any posts yet."}
              </p>
              {isOwnPosts && (
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-700 p-4 rounded-lg shadow-md mb-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-indigo-600 mr-3 flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={() => handleUserClick(post.userId?._id || post.userId)}
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
                        <span className="text-xl">👤</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className="font-semibold text-white cursor-pointer hover:text-indigo-300 transition-colors"
                        onClick={() => handleUserClick(post.userId?._id || post.userId)}
                      >
                        {post.userId?.name || post.username || "User"}
                      </p>
                      <p className="text-xs text-indigo-300">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/post/${post._id}`)}
                      className="text-indigo-300 hover:text-indigo-200 text-sm transition-colors"
                    >
                      View Post
                    </button>
                    <PostActionsDropdown
                      post={post}
                      currentUser={user}
                      onDelete={handleDeletePost}
                      onReport={handleReportPost}
                      onSave={handleSavePost}
                      onForward={handleForwardPost}
                    />
                  </div>
                </div>

                {post.title && <h3 className="text-lg font-semibold mb-2">{post.title}</h3>}

                <div className="text-indigo-100 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {post.content}
                </div>

                {/* Images */}
                <PostImageDisplay
                  images={post.images}
                  onImageClick={(imageIndex) => openPostImageModal(post, imageIndex)}
                  onViewAllClick={(imageIndex) => openPostImageModal(post, imageIndex)}
                />

                {/* Like, dislike, comment buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded ${
                      post.likes?.includes(user?._id)
                        ? "bg-indigo-500 text-white"
                        : "text-indigo-300 hover:text-indigo-200"
                    } transition-colors`}
                  >
                    👍 {post.likes?.length || 0}
                  </button>

                  <button
                    onClick={() => handleDislikePost(post._id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded ${
                      post.dislikes?.includes(user?._id) ? "bg-red-600 text-white" : "text-red-300 hover:text-red-200"
                    } transition-colors`}
                  >
                    👎 {post.dislikes?.length || 0}
                  </button>

                  <button
                    onClick={() =>
                      setShowComments((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }))
                    }
                    className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors"
                  >
                    💬 {post.comments?.length || 0} Comments
                  </button>
                </div>

                {/* Comments section */}
                {showComments[post._id] && (
                  <div className="mt-4 bg-gray-600 p-3 rounded-lg">
                    <h4 className="text-white mb-2 font-medium">Comments</h4>
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {post.comments.map((comment, cIndex) => (
                          <div key={cIndex} className="bg-gray-800 p-2 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-white">{comment.username || "User"}</span>
                              <span className="text-xs text-indigo-100">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-white text-sm font-thin break-words">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-indigo-300 text-sm">No comments yet</p>
                    )}

                    {user ? (
                      <form
                        className="mt-3"
                        onSubmit={(e) => {
                          e.preventDefault()
                          const form = e.target
                          const commentInput = form.elements.commentText
                          handleAddComment(post._id, commentInput.value)
                          commentInput.value = ""
                        }}
                      >
                        <div className="flex gap-2">
                          <input
                            name="commentText"
                            className="flex-1 bg-indigo-900 border border-indigo-600 rounded-lg p-2 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Add a comment..."
                            required
                          />
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors"
                          >
                            Post
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-red-300 mt-2 text-sm">Log in to comment.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
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

      {/* Forward Post Modal */}
      <ForwardPostModal
        isOpen={showForwardModal}
        onClose={() => {
          setShowForwardModal(false)
          setPostToForward(null)
        }}
        onForward={handleForwardComplete}
        post={postToForward}
      />
    </div>
  )
}

export default UserPostsPage
