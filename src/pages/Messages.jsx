"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../component/Navbar"
import ProfilePhoto from "../component/ProfilePhoto"
import ImageModal from "../component/ImageModal"
import {
  FaEllipsisV,
  FaArchive,
  FaTrash,
  FaBan,
  FaFlag,
  FaCheck,
  FaCheckDouble,
  FaInbox,
  FaSearch,
  FaTimes,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaPaperclip,
  FaExternalLinkAlt,
  FaImage,
} from "react-icons/fa"

const Messages = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [archivedConversations, setArchivedConversations] = useState([])
  const [blockedConversations, setBlockedConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
const [modalImages, setModalImages] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState({
    conversations: true,
    archivedConversations: false,
    blockedConversations: false,
    messages: false,
    sending: false,
  })
  const [activeTab, setActiveTab] = useState("conversations")
  const [messageContextMenu, setMessageContextMenu] = useState({
    visible: false,
    messageId: null,
    x: 0,
    y: 0,
  })
  const [notification, setNotification] = useState({
    visible: false,
    message: null,
    sender: null,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [messageSuggestions, setMessageSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)

  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)
  const messageInputRef = useRef(null)
  const fileInputRef = useRef(null)

  const token = localStorage.getItem("token")
  const currentUserId = localStorage.getItem("userId")
  const currentUserName = localStorage.getItem("userName") || "You"

  const config = {
    headers: {
      Authorization: token,
    },
  }

  // API base URL
  const API_BASE_URL = "http://localhost:5005"


  // Enhanced link detection and rendering
  const renderMessageContent = (content, forwardedPost = null) => {
    if (!content) return ""

    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g

    // Split content by URLs and render with clickable links
    const parts = content.split(urlRegex)

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline hover:text-blue-100 inline-flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {part.length > 50 ? `${part.substring(0, 50)}...` : part}
            <FaExternalLinkAlt className="text-xs" />
          </a>
        )
      }
      return part
    })
  }

// Enhanced forwarded post rendering
const renderForwardedPost = (message) => {
  const { forwardedPost } = message || {}

  if (
    !forwardedPost ||
    (!forwardedPost.originalContent &&
      (!forwardedPost.images || forwardedPost.images.length === 0) &&
      !forwardedPost.postLink)
  ) {
    return null
  }

  return (
    <div className="mt-2 p-3 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-30">
      <div className="flex items-center gap-2 mb-2">
        <FaPaperclip className="text-xs" />
        <span className="text-xs font-semibold">Forwarded Post</span>
      </div>

      {forwardedPost.originalContent && (
        <p className="text-sm mb-2 opacity-90">{forwardedPost.originalContent}</p>
      )}

      {forwardedPost.images && forwardedPost.images.length > 0 && (
        <div className="flex items-center gap-1 text-xs mb-2 opacity-80">
          <FaImage />
          <span>{forwardedPost.images.length} image(s)</span>
        </div>
      )}

      {forwardedPost.author && (
        <div className="text-xs opacity-80 mb-2">By: {forwardedPost.author}</div>
      )}

      {forwardedPost.postLink && (
        <button
          onClick={() => {
            const postId = forwardedPost.postId || forwardedPost.postLink.split("/").pop()
            navigate(`/post/${postId}`)
          }}
          className="inline-flex items-center gap-1 text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
        >
          <FaExternalLinkAlt />
          View Original Post
        </button>
      )}
    </div>
  )
}


  // Handle image selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files])
    }
  }

  // Remove selected image
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Enhanced send message with image support
  const sendMessage = async (e) => {
    e?.preventDefault()
    if ((!newMessage.trim() && selectedImages.length === 0) || !selectedConversation) return

    if (selectedConversation.isBlocked) {
      const isBlockedByCurrentUser = selectedConversation.blockedBy?.toString() === currentUserId
      if (isBlockedByCurrentUser) {
        toast.warning("You've blocked this conversation. Unblock to send messages.")
        return
      } else {
        toast.error("You cannot message this user as they have blocked you.")
        return
      }
    }

    const messageContent = newMessage.trim()
    const tempId = `temp-${Date.now()}`

    try {
      setLoading((prev) => ({ ...prev, sending: true }))

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("conversationId", selectedConversation._id)
      formData.append("content", messageContent || "Sent images")

      // Add images to FormData
      selectedImages.forEach((image, index) => {
        formData.append("images", image)
      })

      // Add optimistic message
      const optimisticMessage = {
        _id: tempId,
        conversationId: selectedConversation._id,
        sender: {
          _id: currentUserId,
          name: currentUserName,
        },
        content: messageContent || "Sending images...",
        images: selectedImages.map((img) => URL.createObjectURL(img)),
        read: false,
        delivered: false,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")
      setSelectedImages([])

      const response = await axios.post(`${API_BASE_URL}/api/messages/with-images`, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data && response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId
              ? {
                  ...response.data.message,
                  isOptimistic: false,
                }
              : msg,
          ),
        )
        fetchConversations()
      } else {
        console.error("Failed to send message:", response.data)
        toast.error(response.data?.message || "Failed to send message")
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error(error.response?.data?.message || "Failed to send message")
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }))
    }
  }




  // Message suggestions based on context
  const generateSuggestions = (receiverName) => {
    return [
      `Hi ${receiverName}, how are you doing today?`,
      `Hello ${receiverName}, I'd like to connect with you.`,
      `Thanks for your message, ${receiverName}.`,
      `Great to hear from you, ${receiverName}!`,
      `I'd like to discuss a potential opportunity with you, ${receiverName}.`,
    ]
  }

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [navigate, token])

  // Add console logs to debug API calls
  const fetchConversations = async () => {
    try {
      // Don't show loading state for quick fetches
      // setLoading((prev) => ({ ...prev, conversations: true }))

      console.log("Fetching conversations from:", `${API_BASE_URL}/api/messages/conversations`)
      const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, config)
      console.log("Conversations response:", response.data)
      if (response.data && response.data.success) {
        // Filter out blocked conversations from the main inbox
        const allConversations = response.data.conversations || []
        const nonBlockedConversations = allConversations.filter((conv) => !conv.isBlocked)
        setConversations(nonBlockedConversations)
      } else {
        console.error("Failed to load conversations:", response.data)
        toast.error(response.data?.message || "Failed to load conversations")
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
      console.error("Error details:", error.response || error.message)
      toast.error(error.response?.data?.message || "Failed to load conversations")
    } finally {
      setLoading((prev) => ({ ...prev, conversations: false }))
    }
  }

  // Fetch conversations (simplified version)
  // const fetchConversations = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, config)
  //     if (response.data && response.data.success) {
  //       const nonBlockedConversations = response.data.conversations.filter((conv) => !conv.isBlocked)
  //       setConversations(nonBlockedConversations)
  //     }
  //   } catch (error) {
  //     console.error("Error fetching conversations:", error)
  //     toast.error("Failed to load conversations")
  //   } finally {
  //     setLoading((prev) => ({ ...prev, conversations: false }))
  //   }
  // }

  // Fetch messages (simplified version)
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return

    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, config)
      if (response.data && response.data.success) {
        setMessages(response.data.messages || [])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages")
    }
  }

  // const handleSelectConversation = (conversation) => {
  //   if (conversation.isBlocked) {
  //     const isBlockedByCurrentUser = conversation.blockedBy?.toString() === currentUserId
  //     if (isBlockedByCurrentUser) {
  //       toast.warning("You've blocked this conversation. Unblock to send messages.")
  //     } else {
  //       toast.error("You cannot message this user as they have blocked you.")
  //       return
  //     }
  //   }

  //   setSelectedConversation(conversation)
  //   fetchMessages(conversation._id)
  // }

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      fetchConversations()
    }
  }, [navigate, token])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // const formatMessageTime = (dateString) => {
  //   if (!dateString) return ""
  //   try {
  //     const date = new Date(dateString)
  //     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  //   } catch (error) {
  //     return ""
  //   }
  // }

  const fetchArchivedConversations = async () => {
    try {
      // Don't show loading state for quick fetches
      // setLoading((prev) => ({ ...prev, archivedConversations: true }))

      const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/archived`, config)
      if (response.data && response.data.success) {
        setArchivedConversations(response.data.conversations || [])
      } else {
        console.error("Failed to load archived conversations:", response.data)
        toast.error(response.data?.message || "Failed to load archived conversations")
      }
    } catch (error) {
      console.error("Error fetching archived conversations:", error)
      toast.error(error.response?.data?.message || "Failed to load archived conversations")
    } finally {
      setLoading((prev) => ({ ...prev, archivedConversations: false }))
    }
  }

  const fetchBlockedConversations = async () => {
    try {
      // Don't show loading state for quick fetches
      // setLoading((prev) => ({ ...prev, blockedConversations: true }))

      const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/blocked`, config)
      if (response.data && response.data.success) {
        setBlockedConversations(response.data.conversations || [])
      } else {
        console.error("Failed to load blocked conversations:", response.data)
        toast.error(response.data?.message || "Failed to load blocked conversations")
      }
    } catch (error) {
      console.error("Error fetching blocked conversations:", error)
      toast.error(error.response?.data?.message || "Failed to load blocked conversations")
    } finally {
      setLoading((prev) => ({ ...prev, blockedConversations: false }))
    }
  }

  // const fetchMessages = async (conversationId) => {
  //   if (!conversationId) return

  //   try {
  //     // Don't show loading state for quick fetches
  //     // setLoading((prev) => ({ ...prev, messages: true }))

  //     // Try to get messages from localStorage first
  //     const cachedMessages = localStorage.getItem(`messages_${conversationId}`)
  //     if (cachedMessages) {
  //       setMessages(JSON.parse(cachedMessages))
  //     }

  //     const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, config)
  //     if (response.data && response.data.success) {
  //       setMessages(response.data.messages || [])
  //       // Update cache
  //       localStorage.setItem(`messages_${conversationId}`, JSON.stringify(response.data.messages || []))
  //     } else {
  //       console.error("Failed to load messages:", response.data)
  //       toast.error(response.data?.message || "Failed to load messages")
  //     }

  //     // Mark messages as delivered
  //     markMessagesAsDelivered(conversationId)
  //   } catch (error) {
  //     console.error("Error fetching messages:", error)
  //     toast.error(error.response?.data?.message || "Failed to load messages")
  //   } finally {
  //     setLoading((prev) => ({ ...prev, messages: false }))
  //   }
  // }

  const markMessagesAsDelivered = async (conversationId) => {
    if (!conversationId) return

    try {
      await axios.post(`${API_BASE_URL}/api/messages/delivered/${conversationId}`, {}, config)
    } catch (error) {
      console.error("Failed to mark messages as delivered", error)
    }
  }

  // const sendMessage = async (e) => {
  //   e?.preventDefault()
  //   if (!newMessage.trim() || !selectedConversation) return

  //   // Check if the conversation is blocked
  //   if (selectedConversation.isBlocked) {
  //     const isBlockedByCurrentUser = selectedConversation.blockedBy?.toString() === currentUserId

  //     if (isBlockedByCurrentUser) {
  //       toast.warning("You've blocked this conversation. Unblock to send messages.")
  //       return
  //     } else {
  //       toast.error("You cannot message this user as they have blocked you.")
  //       return
  //     }
  //   }

  //   const messageContent = newMessage.trim()
  //   const tempId = `temp-${Date.now()}`

  //   try {
  //     setLoading((prev) => ({ ...prev, sending: true }))
  //     setShowSuggestions(false)

  //     // Add optimistic message
  //     const optimisticMessage = {
  //       _id: tempId,
  //       conversationId: selectedConversation._id,
  //       sender: {
  //         _id: currentUserId,
  //         name: currentUserName,
  //       },
  //       content: messageContent,
  //       read: false,
  //       delivered: false,
  //       createdAt: new Date().toISOString(),
  //       isOptimistic: true,
  //     }

  //     setMessages((prev) => [...prev, optimisticMessage])
  //     setNewMessage("")

  //     const response = await axios.post(
  //       `${API_BASE_URL}/api/messages`,
  //       {
  //         conversationId: selectedConversation._id,
  //         content: messageContent,
  //       },
  //       config,
  //     )

  //     if (response.data && response.data.success) {
  //       // Replace optimistic message with real one
  //       setMessages((prev) =>
  //         prev.map((msg) =>
  //           msg._id === tempId
  //             ? {
  //                 ...response.data.message,
  //                 isOptimistic: false,
  //               }
  //             : msg,
  //         ),
  //       )
  //       fetchConversations() // Refresh conversations to update last message
  //     } else {
  //       console.error("Failed to send message:", response.data)
  //       toast.error(response.data?.message || "Failed to send message")
  //       // Remove optimistic message on failure
  //       setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error)
  //     toast.error(error.response?.data?.message || "Failed to send message")
  //     // Remove optimistic message on failure
  //     setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
  //   } finally {
  //     setLoading((prev) => ({ ...prev, sending: false }))
  //   }
  // }
  const handleSelectConversation = (conversation) => {
    // Check if the conversation is blocked
    if (conversation.isBlocked) {
      const isBlockedByCurrentUser = conversation.blockedBy?.toString() === currentUserId

      if (isBlockedByCurrentUser) {
        toast.warning("You've blocked this conversation. Unblock to send messages.")
      } else {
        toast.error("You cannot message this user as they have blocked you.")
        return // Don't select the conversation
      }
    }

    setSelectedConversation(conversation)
    fetchMessages(conversation._id)

    // Generate message suggestions based on the recipient's name
    const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
    if (otherParticipant && otherParticipant.name) {
      setMessageSuggestions(generateSuggestions(otherParticipant.name))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleMessageContextMenu = (e, messageId) => {
    e.preventDefault()
    setMessageContextMenu({
      visible: true,
      messageId,
      x: e.clientX,
      y: e.clientY,
    })
  }

  const closeContextMenu = () => {
    setMessageContextMenu({
      visible: false,
      messageId: null,
      x: 0,
      y: 0,
    })
  }

  const toggleDropdown = (id) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null)
    } else {
      setDropdownOpen(id)
    }
  }

  const closeAllDropdowns = () => {
    setDropdownOpen(null)
  }

  const deleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/messages/${messageId}`, config)
      if (response.data && response.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
        toast.success("Message deleted")
      } else {
        console.error("Failed to delete message:", response.data)
        toast.error(response.data?.message || "Failed to delete message")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error(error.response?.data?.message || "Failed to delete message")
    } finally {
      closeContextMenu()
    }
  }

  const deleteConversation = async (conversationId) => {
    try {
      // First confirm with the user
      if (!window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
        return
      }

      // Delete all messages in the conversation
      const response = await axios.delete(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, config)

      if (response.data && response.data.success) {
        // Remove from UI
        setConversations((prev) => prev.filter((c) => c._id !== conversationId))
        setArchivedConversations((prev) => prev.filter((c) => c._id !== conversationId))

        if (selectedConversation?._id === conversationId) {
          setMessages([])
          setSelectedConversation(null)
        }

        toast.success("Conversation deleted")
      } else {
        console.error("Failed to delete conversation:", response.data)
        toast.error(response.data?.message || "Failed to delete conversation")
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
      toast.error("Failed to delete conversation")
    } finally {
      closeAllDropdowns()
    }
  }

  const reportMessage = async (messageId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/report/${messageId}`,
        {
          reason: "Inappropriate content",
        },
        config,
      )

      if (response.data && response.data.success) {
        toast.success("Message reported")
      } else {
        console.error("Failed to report message:", response.data)
        toast.error(response.data?.message || "Failed to report message")
      }
    } catch (error) {
      console.error("Error reporting message:", error)
      toast.error(error.response?.data?.message || "Failed to report message")
    } finally {
      closeContextMenu()
    }
  }

  const archiveConversation = async (conversationId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/archive/${conversationId}`, {}, config)

      if (response.data && response.data.success) {
        // Update UI
        const conversation = conversations.find((c) => c._id === conversationId)
        if (conversation) {
          setArchivedConversations((prev) => [...prev, conversation])
          setConversations((prev) => prev.filter((c) => c._id !== conversationId))
        }

        if (selectedConversation?._id === conversationId) {
          setSelectedConversation(null)
          setMessages([])
        }

        toast.success("Conversation archived")
      } else {
        console.error("Failed to archive conversation:", response.data)
        toast.error(response.data?.message || "Failed to archive conversation")
      }
    } catch (error) {
      console.error("Error archiving conversation:", error)
      toast.error(error.response?.data?.message || "Failed to archive conversation")
    } finally {
      closeAllDropdowns()
    }
  }

  const unarchiveConversation = async (conversationId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/unarchive/${conversationId}`, {}, config)

      if (response.data && response.data.success) {
        // Update UI
        const conversation = archivedConversations.find((c) => c._id === conversationId)
        if (conversation) {
          setConversations((prev) => [...prev, conversation])
          setArchivedConversations((prev) => prev.filter((c) => c._id !== conversationId))
        }

        toast.success("Conversation unarchived")
      } else {
        console.error("Failed to unarchive conversation:", response.data)
        toast.error(response.data?.message || "Failed to unarchive conversation")
      }
    } catch (error) {
      console.error("Error unarchiving conversation:", error)
      toast.error(error.response?.data?.message || "Failed to unarchive conversation")
    }
  }

  const blockConversation = async (conversationId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/block/${conversationId}`, {}, config)

      if (response.data && response.data.success) {
        // Update UI
        const conversation = conversations.find((c) => c._id === conversationId)
        if (conversation) {
          setBlockedConversations((prev) => [...prev, conversation])
          setConversations((prev) => prev.filter((c) => c._id !== conversationId))
        }

        if (selectedConversation?._id === conversationId) {
          setSelectedConversation(null)
          setMessages([])
        }

        toast.success("Conversation blocked")
      } else {
        console.error("Failed to block conversation:", response.data)
        toast.error(response.data?.message || "Failed to block conversation")
      }
    } catch (error) {
      console.error("Error blocking conversation:", error)
      toast.error(error.response?.data?.message || "Failed to block conversation")
    } finally {
      closeAllDropdowns()
    }
  }

  const unblockConversation = async (conversationId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/unblock/${conversationId}`, {}, config)

      if (response.data && response.data.success) {
        // Update UI
        const conversation = blockedConversations.find((c) => c._id === conversationId)
        if (conversation) {
          setConversations((prev) => [...prev, conversation])
          setBlockedConversations((prev) => prev.filter((c) => c._id !== conversationId))
        }

        toast.success("Conversation unblocked")
      } else {
        console.error("Failed to unblock conversation:", response.data)
        toast.error(response.data?.message || "Failed to unblock conversation")
      }
    } catch (error) {
      console.error("Error unblocking conversation:", error)
      toast.error(error.response?.data?.message || "Failed to unblock conversation")
    }
  }

  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`)
  }

  const handleMessageInputFocus = () => {
    if (newMessage.trim() === "" && messageSuggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleMessageInputChange = (e) => {
    setNewMessage(e.target.value)
    if (e.target.value.trim() === "") {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    if (selectedSuggestion) {
      setNewMessage(selectedSuggestion)
      setShowSuggestions(false)
      messageInputRef.current?.focus()
      setSelectedSuggestion(null)
    }
  }, [selectedSuggestion])

  const useSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion)
  }

  useEffect(() => {
    if (token) {
      fetchConversations()
    }
  }, [token])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up click listener to close context menu and dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (messageContextMenu.visible) {
        closeContextMenu()
      }

      // Don't close dropdowns if clicking on a dropdown toggle button
      if (!e.target.closest(".dropdown-toggle")) {
        closeAllDropdowns()
      }

      // Close suggestions if clicking outside the suggestions area
      if (!e.target.closest(".message-suggestions") && !e.target.closest(".message-input")) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [messageContextMenu.visible])

  const formatMessageTime = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      console.error("Error formatting message time:", error)
      return ""
    }
  }

  const formatConversationDate = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (date.toDateString() === today.toDateString()) return "Today"
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    } catch (error) {
      console.error("Error formatting conversation date:", error)
      return ""
    }
  }

  const filteredConversations = (list) => {
    if (!list || !Array.isArray(list)) return []
    if (!searchQuery) return list

    return list.filter((conversation) => {
      if (!conversation || !conversation.participants) return false

      const otherParticipant = conversation.participants.find((p) => p && p._id !== currentUserId)
      return (
        otherParticipant &&
        otherParticipant.name &&
        otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }

  // Get the other participant in the selected conversation
  const getRecipient = () => {
    if (!selectedConversation || !selectedConversation.participants) return null
    return selectedConversation.participants.find((p) => p && p._id !== currentUserId)
  }

  // Add this after other useEffect hooks
  useEffect(() => {
    // Save messages to localStorage when they change
    if (selectedConversation && messages.length > 0) {
      localStorage.setItem(`messages_${selectedConversation._id}`, JSON.stringify(messages))
    }
  }, [messages, selectedConversation])

  // Add this function after the fetchMessages function
  const checkForNewMessages = async (conversationId) => {
    if (!conversationId) return

    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/${conversationId}/unread`, config)
      if (response.data && response.data.success && response.data.hasUnread) {
        // Show notification for new messages
        const newMessage = response.data.latestMessage
        if (newMessage) {
          // Play notification sound
          const audio = new Audio("/notification.mp3")
          audio.play().catch((e) => console.log("Audio play failed:", e))

          // Show visual notification
          setNotification({
            visible: true,
            message: newMessage,
            sender: newMessage.sender,
          })

          toast.info(`New message from ${newMessage.sender.name}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })

          // Update the conversation with unread count
          setConversations((prev) =>
            prev.map((conv) =>
              conv._id === conversationId ? { ...conv, unreadCount: response.data.unreadCount || 1 } : conv,
            ),
          )
        }
      }
    } catch (error) {
      console.error("Error checking for new messages:", error)
    }
  }

  // Add this to the useEffect that fetches conversations
  // Modify the useEffect to avoid dependency on conversations array which causes infinite loop
  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion)
  }

  // 11. Add a function to handle the initial loading of conversations more smoothly
  // Add this function after the fetchConversationsWithMinimumLoadingTime function:
  const handleInitialLoad = async () => {
    // Don't show loading state for quick fetches
    // setLoading((prev) => ({ ...prev, conversations: true }))

    // Try to get conversations from localStorage first for immediate display
    const cachedConversations = localStorage.getItem("cached_conversations")
    if (cachedConversations) {
      try {
        const parsed = JSON.parse(cachedConversations)
        setConversations(parsed)
      } catch (e) {
        console.error("Error parsing cached conversations:", e)
      }
    }

    // Then fetch fresh data
    await fetchConversationsWithMinimumLoadingTime()

    // Cache the fresh conversations
    localStorage.setItem("cached_conversations", JSON.stringify(conversations))
  }

  // 12. Update the useEffect to use the new initial load function
  // Replace the useEffect that calls fetchConversationsWithMinimumLoadingTime:
  useEffect(() => {
    if (token) {
      // handleInitialLoad()

      // Set up polling for new messages
      const intervalId = setInterval(() => {
        fetchConversations()

        // Check for new messages in each conversation
        if (conversations.length > 0) {
          conversations.forEach((conversation) => {
            if (conversation && conversation._id) {
              checkForNewMessages(conversation._id)
            }
          })
        }
      }, 20000) // Check every 10 seconds

      return () => clearInterval(intervalId)
    }
  }, [token]) // Remove conversations from dependency array

  const fetchConversationsWithMinimumLoadingTime = async () => {
    try {
      // Don't show loading state for quick fetches
      // setLoading((prev) => ({ ...prev, conversations: true }))

      console.log("Fetching conversations from:", `${API_BASE_URL}/api/messages/conversations`)
      const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, config)
      console.log("Conversations response:", response.data)
      if (response.data && response.data.success) {
        // Filter out blocked conversations from the main inbox
        const allConversations = response.data.conversations || []
        const nonBlockedConversations = allConversations.filter((conv) => !conv.isBlocked)
        setConversations(nonBlockedConversations)
      } else {
        console.error("Failed to load conversations:", response.data)
        toast.error(response.data?.message || "Failed to load conversations")
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
      console.error("Error details:", error.response || error.message)
      toast.error(error.response?.data?.message || "Failed to load conversations")
    } finally {
      setLoading((prev) => ({ ...prev, conversations: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-blue-200">
      <Navbar />

      <div className="container mx-auto px-2 pt-20 pb-4 max-w-8xl">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex h-[calc(100vh-100px)]">
            {/* Sidebar with tabs */}
            <div className="w-1/4 border-r border-gray-200 flex flex-col bg-gray px-3 pb-2">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white">
                <button
                  className={`flex-1 px-4 py-2 text-center font-medium ${
                    activeTab === "conversations"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab("conversations")
                    fetchConversations()
                  }}
                >
                  Inbox
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center font-medium ${
                    activeTab === "archived"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 "
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab("archived")
                    fetchArchivedConversations()
                  }}
                >
                  Archived
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center font-medium ${
                    activeTab === "blocked"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab("blocked")
                    fetchBlockedConversations()
                  }}
                >
                  Blocked
                </button>
              </div>

              {/* Search */}
              <div className="p-2 mb-1 border-b border-gray-200 bg-blue-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery("")}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto bg-blue-100">
                {activeTab === "conversations" && (
                  <>
                    {loading.conversations ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-6 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredConversations(conversations).length > 0 ? (
                      <div>
                        {filteredConversations(conversations).map((conversation) => {
                          if (!conversation) return null

                          const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
                          if (!otherParticipant) return null

                          return (
                            <div
                              key={conversation._id}
                              className={`flex items-center space-x-4 p-3 cursor-pointer transition-colors rounded-r-lg border-l-4 relative group
                                ${
                                  selectedConversation?._id === conversation._id
                                    ? "bg-indigo-100 border-indigo-600"
                                    : "border-transparent hover:bg-gray-50 hover:border-indigo-400"
                                }`}
                            >
                              <div
                                className="flex-grow flex items-center space-x-4"
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <div className="relative">
                                  <ProfilePhoto
                                    src={
                                      otherParticipant?.profilePhotoUrl
                                        ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
                                        : null
                                    }
                                    alt={otherParticipant?.name || "User"}
                                    size="lg"
                                  />
                                  {conversation.unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                                      {conversation.unreadCount}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate font-serif">
                                      {otherParticipant?.name}
                                    </h3>
                                    <span className="text-sm text-gray-800">
                                      {formatConversationDate(conversation.updatedAt)}
                                    </span>
                                  </div>
                                  {conversation.lastMessageText && (
                                    <p
                                      className={`text-sm truncate mt-1 ${conversation.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-700"}`}
                                    >
                                      {conversation.lastMessageText.length > 30
                                        ? conversation.lastMessageText.substring(0, 30) + "..."
                                        : conversation.lastMessageText}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Conversation actions button */}
                              <div className="opacity-0 group-hover:opacity-100">
                                <div className="relative">
                                  <button
                                    className="p-1 rounded-full hover:bg-gray-400 dropdown-toggle"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleDropdown(`list-${conversation._id}`)
                                    }}
                                  >
                                    <FaEllipsisV className="text-blue-500" />
                                  </button>

                                  {/* Dropdown menu */}
                                  {dropdownOpen === `list-${conversation._id}` && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                      <div className="py-1">
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            archiveConversation(conversation._id)
                                          }}
                                        >
                                          <FaArchive className="mr-2 text-gray-500" /> Archive
                                        </button>
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 flex items-center"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            blockConversation(conversation._id)
                                          }}
                                        >
                                          <FaBan className="mr-2 text-red-500" /> Block
                                        </button>
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-100 flex items-center"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteConversation(conversation._id)
                                          }}
                                        >
                                          <FaTrash className="mr-2" /> Delete Chat
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 font-medium">
                        {searchQuery ? "No conversations match your search" : "No conversations yet"}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "archived" && (
                  <>
                    {loading.archivedConversations ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredConversations(archivedConversations).length > 0 ? (
                      <div>
                        {filteredConversations(archivedConversations).map((conversation) => {
                          if (!conversation) return null

                          const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
                          if (!otherParticipant) return null

                          return (
                            <div
                              key={conversation._id}
                              className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-100"
                            >
                              <div
                                className="flex items-center space-x-3 flex-1 cursor-pointer"
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <ProfilePhoto
                                  src={
                                    otherParticipant?.profilePhotoUrl
                                      ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
                                      : null
                                  }
                                  alt={otherParticipant?.name || "User"}
                                  size="md"
                                />
                                <div>
                                  <h3 className="font-medium text-gray-900">{otherParticipant?.name}</h3>
                                  {conversation.lastMessageText && (
                                    <p
                                      className={`text-sm truncate mt-1 ${conversation.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"}`}
                                    >
                                      {conversation.lastMessageText.length > 30
                                        ? conversation.lastMessageText.substring(0, 30) + "..."
                                        : conversation.lastMessageText}
                                    </p>
                                  )}
                                  {/* {conversation.lastMessageText && (
                                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessageText}</p>
                                  )} */}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  unarchiveConversation(conversation._id)
                                }}
                                className=" px-3 py-1 mb-7 bg-gray-200 hover:bg-blue-200 text-gray-900 rounded-md text-sm flex items-center"
                              >
                                <FaInbox className="mr-1" /> Unarchive
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 font-medium">No archived conversations</div>
                    )}
                  </>
                )}

                {activeTab === "blocked" && (
                  <>
                    {loading.blockedConversations ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredConversations(blockedConversations).length > 0 ? (
                      <div>
                        {filteredConversations(blockedConversations).map((conversation) => {
                          if (!conversation) return null

                          const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
                          if (!otherParticipant) return null

                          return (
                            <div
                              key={conversation._id}
                              className="flex items-center justify-between p-4 border-b border-gray-100"
                            >
                              <div className="flex items-center space-x-3">
                                <ProfilePhoto
                                  src={
                                    otherParticipant?.profilePhotoUrl
                                      ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
                                      : null
                                  }
                                  alt={otherParticipant?.name || "User"}
                                  size="md"
                                />
                                <div>
                                  <h3 className="font-medium text-gray-900">{otherParticipant?.name}</h3>
                                  <p className="text-xs text-red-500">Blocked</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  unblockConversation(conversation._id)
                                }}
                                className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
                              >
                                Unblock
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 font-medium">No blocked conversations</div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Messages Section - Reduced to 3/4 width */}
            <div className="w-3/4 flex">
              <div className="w-2/3 flex flex-col bg-gray-100 border-r border-gray-200 ">
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-700 to-indigo-600  shadow-sm px-3 pt-4 pb-1">
                      <div
                        className="flex items-center space-x-4 cursor-pointer"
                        onClick={() => {
                          const otherParticipant = selectedConversation.participants?.find(
                            (p) => p && p._id !== currentUserId,
                          )
                          if (otherParticipant) {
                            viewProfile(otherParticipant._id)
                          }
                        }}
                      >
                        {(() => {
                          const otherParticipant = selectedConversation.participants?.find(
                            (p) => p && p._id !== currentUserId,
                          )
                          if (!otherParticipant) return null

                          return (
                            <>
                              <ProfilePhoto
                                src={
                                  otherParticipant?.profilePhotoUrl
                                    ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
                                    : null
                                }
                                alt={otherParticipant?.name || "User"}
                                size="md"
                              />
                              <div>
                                <h3 className="font-semibold text-white font-serif text-base">{otherParticipant?.name}</h3>
                                <p className="text-sm font-semibold text-gray-200">{otherParticipant?.role}</p>
                              </div>
                            </>
                          )
                        })()}
                      </div>

                      {/* Conversation actions */}
                      <div className="relative">
                        <button
                          className="p-2 rounded-full hover:bg-blue-200 dropdown-toggle"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(`header-${selectedConversation._id}`)
                          }}
                        >
                          <FaEllipsisV className="text-white" />
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen === `header-${selectedConversation._id}` && (
                          <div className="absolute right-0 mt-2 w-48 bg-indigo-200 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  archiveConversation(selectedConversation._id)
                                }}
                              >
                                <FaArchive className="mr-2 text-gray-500" /> Archive conversation
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  blockConversation(selectedConversation._id)
                                }}
                              >
                                <FaBan className="mr-2 text-red-500" /> Block user
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  deleteConversation(selectedConversation._id)
                                }}
                              >
                                <FaTrash className="mr-2" /> Delete chat
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Messages List */}
                    <div
                      ref={messageListRef}
                      className="flex-1 p-2 overflow-y-auto space-y-2 bg-blue-200"
                      style={{ backgroundColor: "#ffffff", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {loading.messages ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((message) => {
                          if (!message) return null

                          const isSentByCurrentUser = message.sender?._id === currentUserId
                          const isOptimistic = message.isOptimistic

                          return (
                            <div
                              key={message._id}
                              className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-1`}
                            >
                              <div
  className={`relative max-w-[80%] rounded-lg px-3 py-1.5 shadow-sm group break-words whitespace-pre-wrap
    ${
      isSentByCurrentUser
        ? isOptimistic
          ? "bg-blue-500 text-white"
          : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
        : "bg-gradient-to-r from-purple-400 to-purple-300 text-gray-800 font-medium border border-indigo-200 shadow-md"
    }`}
  onContextMenu={(e) => handleMessageContextMenu(e, message._id)}
>
  {!isSentByCurrentUser && message.sender?.name && (
    <p
      className={`text-sm font-semibold mb-0.5 ${
        isSentByCurrentUser ? "text-blue-100" : "text-blue-700"
      }`}
    >
      {message.sender.name}
    </p>
  )}
  <div className="text-sm break-words whitespace-pre-wrap">
    {renderMessageContent(message.content, message.forwardedPost)}
  </div>

                                    {/* Render images */}
                           {message.images && message.images.length > 0 && (
  <div className="mt-2 relative w-[160px] h-[160px]">
    {/* Thumbnail (first image only) */}
    <img
      src={
        message.images[0].startsWith("blob:")
          ? message.images[0]
          : `${API_BASE_URL}${message.images[0]}`
      }
      alt="Attachment"
      className="rounded-lg w-full h-full object-cover cursor-pointer"
      onClick={() => {
        const fullUrls = message.images.map((img) =>
          img.startsWith("blob:") ? img : `${API_BASE_URL}${img}`
        );
        setModalImages(fullUrls);
        setCurrentIndex(0);
        setIsModalOpen(true);
      }}
    />

    {/* +X Overlay */}
    {message.images.length > 1 && (
      <div
        className="absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg flex items-center justify-center text-white text-lg font-semibold cursor-pointer"
        onClick={() => {
          const fullUrls = message.images.map((img) =>
            img.startsWith("blob:") ? img : `${API_BASE_URL}${img}`
          );
          setModalImages(fullUrls);
          setCurrentIndex(0);
          setIsModalOpen(true);
        }}
      >
        +{message.images.length - 1}
      </div>
    )}
  </div>
)}
<ImageModal
  images={modalImages}
  currentIndex={currentIndex}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onIndexChange={setCurrentIndex}
/>


                            {/* Render forwarded post */}
                            {/* Render forwarded post only if it exists */}
               {message.forwardedPost && Object.keys(message.forwardedPost).length > 0 && renderForwardedPost(message)}



                                <div
                                  className={`flex items-center justify-end mt-0.5 space-x-1 text-xs ${
                                    isSentByCurrentUser ? "text-green-200" : "text-gray-500"
                                  }`}
                                >
                                  <span className="text-xs">{formatMessageTime(message.createdAt)}</span>
                                  {isSentByCurrentUser && !isOptimistic && (
                                    <span className="ml-1">
                                      {message.read ? (
                                        <FaCheckDouble className="text-blue-300" size={12} />
                                      ) : message.delivered ? (
                                        <FaCheckDouble className="text-green-200" size={12} />
                                      ) : (
                                        <FaCheck className="text-green-200" size={12} />
                                      )}
                                    </span>
                                  )}
                                  {isSentByCurrentUser && isOptimistic && (
                                    <span className="text-green-200 animate-pulse text-xs">Sending...</span>
                                  )}
                                </div>

                                {/* Message actions button - visible on hover */}
                                {!isOptimistic && (
                                  <button
                                    className={`absolute ${isSentByCurrentUser ? "-left-6" : "-right-6"} top-1 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200`}
                                    onClick={(e) => handleMessageContextMenu(e, message._id)}
                                  >
                                    <FaEllipsisV className="text-gray-500 text-sm" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center text-gray-400 mt-12">No messages yet. Say hello!</div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
               <div className="border-t border-gray-200 bg-white">
                    {/* Selected Images Preview */}
                    {selectedImages.length > 0 && (
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                alt={`Selected ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={sendMessage} className="p-4 flex items-end space-x-3">
                      <div className="flex-1">
                        <div className="flex items-end space-x-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            disabled={loading.sending}
                          >
                            <FaImage className="w-5 h-5" />
                          </button>
                          <textarea
                            ref={messageInputRef}
                            className="flex-1 resize-none rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2 text-sm"
                            placeholder={
                              selectedConversation?.isBlocked
                                ? "You cannot send messages in this conversation"
                                : "Type your message..."
                            }
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={loading.sending || selectedConversation?.isBlocked}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage(e)
                              }
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={
                          loading.sending ||
                          (!newMessage.trim() && selectedImages.length === 0) ||
                          selectedConversation?.isBlocked
                        }
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading.sending ? "Sending..." : "Send"}
                      </button>
                    </form>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
                  <FaEnvelope className="text-6xl mb-4" />
                  <p className="text-lg">Select a conversation to start messaging</p>
                </div>
              )}
            </div>


              {/* Profile Section - 1/3 of the 3/4 width (1/4 of total) */}
              <div className="w-1/3 bg-gradient-to-b from-blue-200 to-blue-100 p-4 border-l border-gray-200">
                {selectedConversation ? (
                  <div className="h-full flex flex-col">
                    <div className="text-center mb-6 bg-white p-1 rounded-xl  shadow-sm border border-gray-100">
                      <div className="mx-auto mb-4 px-4">
                        {(() => {
                          const recipient = getRecipient()
                          return (
                            <ProfilePhoto
                              src={recipient?.profilePhotoUrl ? `${API_BASE_URL}${recipient.profilePhotoUrl}` : null}
                              alt={recipient?.name || "User"}
                              size="xl"
                            />
                          )
                        })()}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{getRecipient()?.name}</h2>
                      <p className="text-sm text-blue-600">{getRecipient()?.role || "User"}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
                      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-500 mr-3" />
                          <span className="text-gray-700">{getRecipient()?.email || "Email not available"}</span>
                        </div>
                        <div className="flex items-center">
                          <FaPhone className="text-gray-500 mr-3" />
                          <span className="text-gray-700">Phone not available</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
                      <h3 className="text-lg font-semibold mb-3">Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => viewProfile(getRecipient()?._id)}
                          className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition shadow-sm font-medium"
                        >
                          <FaUserCircle className="mr-2" /> View Full Profile
                        </button>
                        <button
                          onClick={() => blockConversation(selectedConversation._id)}
                          className="w-full flex items-center justify-center py-2.5 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium"
                        >
                          <FaBan className="mr-2" /> Block User
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4 flex-grow">
                      <h3 className="text-lg font-semibold mb-3">Shared Links</h3>
                      <div className="text-center text-gray-500 italic">
                        <p>No shared links yet</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FaUserCircle className="text-6xl mb-4 text-gray-300" />
                    <p>Select a conversation to view profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Context Menu */}
      {messageContextMenu.visible && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1"
          style={{
            top: messageContextMenu.y,
            left: messageContextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {messages.find((m) => m && m._id === messageContextMenu.messageId)?.sender?._id === currentUserId ? (
            <>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                onClick={() => deleteMessage(messageContextMenu.messageId)}
              >
                <FaTrash className="mr-2" /> Delete Message
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                onClick={() => closeContextMenu()}
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 flex items-center"
                onClick={() => reportMessage(messageContextMenu.messageId)}
              >
                <FaFlag className="mr-2" /> Report Message
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                onClick={() => closeContextMenu()}
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </>
          )}
        </div>
      )}

      {/* New Message Notification */}
      {notification.visible && notification.message && (
        <div
          className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm cursor-pointer animate-bounce-in"
          onClick={() => {
            // Find the conversation
            const conversation = conversations.find((c) => c && c._id === notification.message.conversationId)
            if (conversation) {
              handleSelectConversation(conversation)
            }
            setNotification({ visible: false, message: null, sender: null })
          }}
        >
          <div className="flex items-start space-x-3">
            <div>
              <h4 className="font-semibold text-gray-900">{notification.sender?.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{notification.message.content}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes bounce-in {
          0% { transform: translateY(100%); opacity: 0; }
          60% { transform: translateY(-10px); }
          80% { transform: translateY(5px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .overflow-y-auto {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  )
}

export default Messages




// ????????????????????????????????????????????????????? YAHA TAK EDITED H




// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "../component/Navbar"
// import ProfilePhoto from "../component/ProfilePhoto"
// import {
//   FaEllipsisV,
//   FaArchive,
//   FaTrash,
//   FaBan,
//   FaFlag,
//   FaCheck,
//   FaCheckDouble,
//   FaInbox,
//   FaSearch,
//   FaTimes,
//   FaUserCircle,
//   FaEnvelope,
//   FaPhone,
// } from "react-icons/fa"

// const Messages = () => {
//   const navigate = useNavigate()
//   const [conversations, setConversations] = useState([])
//   const [archivedConversations, setArchivedConversations] = useState([])
//   const [blockedConversations, setBlockedConversations] = useState([])
//   const [selectedConversation, setSelectedConversation] = useState(null)
//   const [messages, setMessages] = useState([])
//   const [newMessage, setNewMessage] = useState("")
//   const [loading, setLoading] = useState({
//     conversations: true,
//     archivedConversations: false,
//     blockedConversations: false,
//     messages: false,
//     sending: false,
//   })
//   const [activeTab, setActiveTab] = useState("conversations")
//   const [messageContextMenu, setMessageContextMenu] = useState({
//     visible: false,
//     messageId: null,
//     x: 0,
//     y: 0,
//   })
//   const [notification, setNotification] = useState({
//     visible: false,
//     message: null,
//     sender: null,
//   })
//   const [searchQuery, setSearchQuery] = useState("")
//   const [dropdownOpen, setDropdownOpen] = useState(null)
//   const [messageSuggestions, setMessageSuggestions] = useState([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [selectedSuggestion, setSelectedSuggestion] = useState(null)

//   const messagesEndRef = useRef(null)
//   const messageListRef = useRef(null)
//   const messageInputRef = useRef(null)

//   const token = localStorage.getItem("token")
//   const currentUserId = localStorage.getItem("userId")
//   const currentUserName = localStorage.getItem("userName") || "You"

//   const config = {
//     headers: {
//       Authorization: token,
//     },
//   }

//   // API base URL
//   const API_BASE_URL = "http://localhost:5005"

//   // Message suggestions based on context
//   const generateSuggestions = (receiverName) => {
//     return [
//       `Hi ${receiverName}, how are you doing today?`,
//       `Hello ${receiverName}, I'd like to connect with you.`,
//       `Thanks for your message, ${receiverName}.`,
//       `Great to hear from you, ${receiverName}!`,
//       `I'd like to discuss a potential opportunity with you, ${receiverName}.`,
//     ]
//   }

//   useEffect(() => {
//     if (!token) {
//       navigate("/login")
//     }
//   }, [navigate, token])

//   const fetchConversations = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, conversations: true }))
//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, config)
//       if (response.data && response.data.success) {
//         // Filter out blocked conversations from the main inbox
//         const allConversations = response.data.conversations || []
//         const nonBlockedConversations = allConversations.filter((conv) => !conv.isBlocked)
//         setConversations(nonBlockedConversations)
//       } else {
//         console.error("Failed to load conversations:", response.data)
//         toast.error(response.data?.message || "Failed to load conversations")
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error)
//       toast.error(error.response?.data?.message || "Failed to load conversations")
//     } finally {
//       setLoading((prev) => ({ ...prev, conversations: false }))
//     }
//   }

//   const fetchArchivedConversations = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, archivedConversations: true }))
//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/archived`, config)
//       if (response.data && response.data.success) {
//         setArchivedConversations(response.data.conversations || [])
//       } else {
//         console.error("Failed to load archived conversations:", response.data)
//         toast.error(response.data?.message || "Failed to load archived conversations")
//       }
//     } catch (error) {
//       console.error("Error fetching archived conversations:", error)
//       toast.error(error.response?.data?.message || "Failed to load archived conversations")
//     } finally {
//       setLoading((prev) => ({ ...prev, archivedConversations: false }))
//     }
//   }

//   const fetchBlockedConversations = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, blockedConversations: true }))
//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/blocked`, config)
//       if (response.data && response.data.success) {
//         setBlockedConversations(response.data.conversations || [])
//       } else {
//         console.error("Failed to load blocked conversations:", response.data)
//         toast.error(response.data?.message || "Failed to load blocked conversations")
//       }
//     } catch (error) {
//       console.error("Error fetching blocked conversations:", error)
//       toast.error(error.response?.data?.message || "Failed to load blocked conversations")
//     } finally {
//       setLoading((prev) => ({ ...prev, blockedConversations: false }))
//     }
//   }

//   const fetchMessages = async (conversationId) => {
//     if (!conversationId) return

//     try {
//       setLoading((prev) => ({ ...prev, messages: true }))

//       // Try to get messages from localStorage first
//       const cachedMessages = localStorage.getItem(`messages_${conversationId}`)
//       if (cachedMessages) {
//         setMessages(JSON.parse(cachedMessages))
//       }

//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, config)
//       if (response.data && response.data.success) {
//         setMessages(response.data.messages || [])
//         // Update cache
//         localStorage.setItem(`messages_${conversationId}`, JSON.stringify(response.data.messages || []))
//       } else {
//         console.error("Failed to load messages:", response.data)
//         toast.error(response.data?.message || "Failed to load messages")
//       }

//       // Mark messages as delivered
//       markMessagesAsDelivered(conversationId)
//     } catch (error) {
//       console.error("Error fetching messages:", error)
//       toast.error(error.response?.data?.message || "Failed to load messages")
//     } finally {
//       setLoading((prev) => ({ ...prev, messages: false }))
//     }
//   }

//   const markMessagesAsDelivered = async (conversationId) => {
//     if (!conversationId) return

//     try {
//       await axios.post(`${API_BASE_URL}/api/messages/delivered/${conversationId}`, {}, config)
//     } catch (error) {
//       console.error("Failed to mark messages as delivered", error)
//     }
//   }

//   const sendMessage = async (e) => {
//     e?.preventDefault()
//     if (!newMessage.trim() || !selectedConversation) return

//     // Check if the conversation is blocked
//     if (selectedConversation.isBlocked) {
//       const isBlockedByCurrentUser = selectedConversation.blockedBy?.toString() === currentUserId

//       if (isBlockedByCurrentUser) {
//         toast.warning("You've blocked this conversation. Unblock to send messages.")
//         return
//       } else {
//         toast.error("You cannot message this user as they have blocked you.")
//         return
//       }
//     }

//     const messageContent = newMessage.trim()
//     const tempId = `temp-${Date.now()}`

//     try {
//       setLoading((prev) => ({ ...prev, sending: true }))
//       setShowSuggestions(false)

//       // Add optimistic message
//       const optimisticMessage = {
//         _id: tempId,
//         conversationId: selectedConversation._id,
//         sender: {
//           _id: currentUserId,
//           name: currentUserName,
//         },
//         content: messageContent,
//         read: false,
//         delivered: false,
//         createdAt: new Date().toISOString(),
//         isOptimistic: true,
//       }

//       setMessages((prev) => [...prev, optimisticMessage])
//       setNewMessage("")

//       const response = await axios.post(
//         `${API_BASE_URL}/api/messages`,
//         {
//           conversationId: selectedConversation._id,
//           content: messageContent,
//         },
//         config,
//       )

//       if (response.data && response.data.success) {
//         // Replace optimistic message with real one
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg._id === tempId
//               ? {
//                   ...response.data.message,
//                   isOptimistic: false,
//                 }
//               : msg,
//           ),
//         )
//         fetchConversations() // Refresh conversations to update last message
//       } else {
//         console.error("Failed to send message:", response.data)
//         toast.error(response.data?.message || "Failed to send message")
//         // Remove optimistic message on failure
//         setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//       toast.error(error.response?.data?.message || "Failed to send message")
//       // Remove optimistic message on failure
//       setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
//     } finally {
//       setLoading((prev) => ({ ...prev, sending: false }))
//     }
//   }
//   const handleSelectConversation = (conversation) => {
//     // Check if the conversation is blocked
//     if (conversation.isBlocked) {
//       const isBlockedByCurrentUser = conversation.blockedBy?.toString() === currentUserId

//       if (isBlockedByCurrentUser) {
//         toast.warning("You've blocked this conversation. Unblock to send messages.")
//       } else {
//         toast.error("You cannot message this user as they have blocked you.")
//         return // Don't select the conversation
//       }
//     }

//     setSelectedConversation(conversation)
//     fetchMessages(conversation._id)

//     // Generate message suggestions based on the recipient's name
//     const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
//     if (otherParticipant && otherParticipant.name) {
//       setMessageSuggestions(generateSuggestions(otherParticipant.name))
//     }
//   }

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const handleMessageContextMenu = (e, messageId) => {
//     e.preventDefault()
//     setMessageContextMenu({
//       visible: true,
//       messageId,
//       x: e.clientX,
//       y: e.clientY,
//     })
//   }

//   const closeContextMenu = () => {
//     setMessageContextMenu({
//       visible: false,
//       messageId: null,
//       x: 0,
//       y: 0,
//     })
//   }

//   const toggleDropdown = (id) => {
//     if (dropdownOpen === id) {
//       setDropdownOpen(null)
//     } else {
//       setDropdownOpen(id)
//     }
//   }

//   const closeAllDropdowns = () => {
//     setDropdownOpen(null)
//   }

//   const deleteMessage = async (messageId) => {
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/api/messages/${messageId}`, config)
//       if (response.data && response.data.success) {
//         setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
//         toast.success("Message deleted")
//       } else {
//         console.error("Failed to delete message:", response.data)
//         toast.error(response.data?.message || "Failed to delete message")
//       }
//     } catch (error) {
//       console.error("Error deleting message:", error)
//       toast.error(error.response?.data?.message || "Failed to delete message")
//     } finally {
//       closeContextMenu()
//     }
//   }

//   const deleteConversation = async (conversationId) => {
//     try {
//       // First confirm with the user
//       if (!window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
//         return
//       }

//       // Delete all messages in the conversation
//       const response = await axios.delete(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, config)

//       if (response.data && response.data.success) {
//         // Remove from UI
//         setConversations((prev) => prev.filter((c) => c._id !== conversationId))
//         setArchivedConversations((prev) => prev.filter((c) => c._id !== conversationId))

//         if (selectedConversation?._id === conversationId) {
//           setMessages([])
//           setSelectedConversation(null)
//         }

//         toast.success("Conversation deleted")
//       } else {
//         console.error("Failed to delete conversation:", response.data)
//         toast.error(response.data?.message || "Failed to delete conversation")
//       }
//     } catch (error) {
//       console.error("Error deleting conversation:", error)
//       toast.error("Failed to delete conversation")
//     } finally {
//       closeAllDropdowns()
//     }
//   }

//   const reportMessage = async (messageId) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/messages/report/${messageId}`,
//         {
//           reason: "Inappropriate content",
//         },
//         config,
//       )

//       if (response.data && response.data.success) {
//         toast.success("Message reported")
//       } else {
//         console.error("Failed to report message:", response.data)
//         toast.error(response.data?.message || "Failed to report message")
//       }
//     } catch (error) {
//       console.error("Error reporting message:", error)
//       toast.error(error.response?.data?.message || "Failed to report message")
//     } finally {
//       closeContextMenu()
//     }
//   }

//   const archiveConversation = async (conversationId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/messages/archive/${conversationId}`, {}, config)

//       if (response.data && response.data.success) {
//         // Update UI
//         const conversation = conversations.find((c) => c._id === conversationId)
//         if (conversation) {
//           setArchivedConversations((prev) => [...prev, conversation])
//           setConversations((prev) => prev.filter((c) => c._id !== conversationId))
//         }

//         if (selectedConversation?._id === conversationId) {
//           setSelectedConversation(null)
//           setMessages([])
//         }

//         toast.success("Conversation archived")
//       } else {
//         console.error("Failed to archive conversation:", response.data)
//         toast.error(response.data?.message || "Failed to archive conversation")
//       }
//     } catch (error) {
//       console.error("Error archiving conversation:", error)
//       toast.error(error.response?.data?.message || "Failed to archive conversation")
//     } finally {
//       closeAllDropdowns()
//     }
//   }

//   const unarchiveConversation = async (conversationId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/messages/unarchive/${conversationId}`, {}, config)

//       if (response.data && response.data.success) {
//         // Update UI
//         const conversation = archivedConversations.find((c) => c._id === conversationId)
//         if (conversation) {
//           setConversations((prev) => [...prev, conversation])
//           setArchivedConversations((prev) => prev.filter((c) => c._id !== conversationId))
//         }

//         toast.success("Conversation unarchived")
//       } else {
//         console.error("Failed to unarchive conversation:", response.data)
//         toast.error(response.data?.message || "Failed to unarchive conversation")
//       }
//     } catch (error) {
//       console.error("Error unarchiving conversation:", error)
//       toast.error(error.response?.data?.message || "Failed to unarchive conversation")
//     }
//   }

//   const blockConversation = async (conversationId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/messages/block/${conversationId}`, {}, config)

//       if (response.data && response.data.success) {
//         // Update UI
//         const conversation = conversations.find((c) => c._id === conversationId)
//         if (conversation) {
//           setBlockedConversations((prev) => [...prev, conversation])
//           setConversations((prev) => prev.filter((c) => c._id !== conversationId))
//         }

//         if (selectedConversation?._id === conversationId) {
//           setSelectedConversation(null)
//           setMessages([])
//         }

//         toast.success("Conversation blocked")
//       } else {
//         console.error("Failed to block conversation:", response.data)
//         toast.error(response.data?.message || "Failed to block conversation")
//       }
//     } catch (error) {
//       console.error("Error blocking conversation:", error)
//       toast.error(error.response?.data?.message || "Failed to block conversation")
//     } finally {
//       closeAllDropdowns()
//     }
//   }

//   const unblockConversation = async (conversationId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/messages/unblock/${conversationId}`, {}, config)

//       if (response.data && response.data.success) {
//         // Update UI
//         const conversation = blockedConversations.find((c) => c._id === conversationId)
//         if (conversation) {
//           setConversations((prev) => [...prev, conversation])
//           setBlockedConversations((prev) => prev.filter((c) => c._id !== conversationId))
//         }

//         toast.success("Conversation unblocked")
//       } else {
//         console.error("Failed to unblock conversation:", response.data)
//         toast.error(response.data?.message || "Failed to unblock conversation")
//       }
//     } catch (error) {
//       console.error("Error unblocking conversation:", error)
//       toast.error(error.response?.data?.message || "Failed to unblock conversation")
//     }
//   }

//   const viewProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   const handleMessageInputFocus = () => {
//     if (newMessage.trim() === "" && messageSuggestions.length > 0) {
//       setShowSuggestions(true)
//     }
//   }

//   const handleMessageInputChange = (e) => {
//     setNewMessage(e.target.value)
//     if (e.target.value.trim() === "") {
//       setShowSuggestions(true)
//     } else {
//       setShowSuggestions(false)
//     }
//   }

//   useEffect(() => {
//     if (selectedSuggestion) {
//       setNewMessage(selectedSuggestion)
//       setShowSuggestions(false)
//       messageInputRef.current?.focus()
//       setSelectedSuggestion(null)
//     }
//   }, [selectedSuggestion])

//   const useSuggestion = (suggestion) => {
//     setSelectedSuggestion(suggestion)
//   }

//   useEffect(() => {
//     if (token) {
//       fetchConversations()
//     }
//   }, [token])

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   // Set up click listener to close context menu and dropdowns
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (messageContextMenu.visible) {
//         closeContextMenu()
//       }

//       // Don't close dropdowns if clicking on a dropdown toggle button
//       if (!e.target.closest(".dropdown-toggle")) {
//         closeAllDropdowns()
//       }

//       // Close suggestions if clicking outside the suggestions area
//       if (!e.target.closest(".message-suggestions") && !e.target.closest(".message-input")) {
//         setShowSuggestions(false)
//       }
//     }

//     document.addEventListener("click", handleClickOutside)
//     return () => {
//       document.removeEventListener("click", handleClickOutside)
//     }
//   }, [messageContextMenu.visible])

//   const formatMessageTime = (dateString) => {
//     if (!dateString) return ""

//     try {
//       const date = new Date(dateString)
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     } catch (error) {
//       console.error("Error formatting message time:", error)
//       return ""
//     }
//   }

//   const formatConversationDate = (dateString) => {
//     if (!dateString) return ""

//     try {
//       const date = new Date(dateString)
//       const today = new Date()
//       const yesterday = new Date(today)
//       yesterday.setDate(yesterday.getDate() - 1)

//       if (date.toDateString() === today.toDateString()) return "Today"
//       if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
//       return date.toLocaleDateString([], { month: "short", day: "numeric" })
//     } catch (error) {
//       console.error("Error formatting conversation date:", error)
//       return ""
//     }
//   }

//   const filteredConversations = (list) => {
//     if (!list || !Array.isArray(list)) return []
//     if (!searchQuery) return list

//     return list.filter((conversation) => {
//       if (!conversation || !conversation.participants) return false

//       const otherParticipant = conversation.participants.find((p) => p && p._id !== currentUserId)
//       return (
//         otherParticipant &&
//         otherParticipant.name &&
//         otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     })
//   }

//   // Get the other participant in the selected conversation
//   const getRecipient = () => {
//     if (!selectedConversation || !selectedConversation.participants) return null
//     return selectedConversation.participants.find((p) => p && p._id !== currentUserId)
//   }

//   // Add this after other useEffect hooks
//   useEffect(() => {
//     // Save messages to localStorage when they change
//     if (selectedConversation && messages.length > 0) {
//       localStorage.setItem(`messages_${selectedConversation._id}`, JSON.stringify(messages))
//     }
//   }, [messages, selectedConversation])

//   // Add this function after the fetchMessages function
//   const checkForNewMessages = async (conversationId) => {
//     if (!conversationId) return

//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/${conversationId}/unread`, config)
//       if (response.data && response.data.success && response.data.hasUnread) {
//         // Show notification for new messages
//         const newMessage = response.data.latestMessage
//         if (newMessage) {
//           // Play notification sound
//           const audio = new Audio("/notification.mp3")
//           audio.play().catch((e) => console.log("Audio play failed:", e))

//           // Show visual notification
//           toast.info(`New message from ${newMessage.sender.name}`, {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//           })

//           // Update the conversation with unread count
//           setConversations((prev) =>
//             prev.map((conv) =>
//               conv._id === conversationId ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 } : conv,
//             ),
//           )
//         }
//       }
//     } catch (error) {
//       console.error("Error checking for new messages:", error)
//     }
//   }

//   // Add this to the useEffect that fetches conversations
//   useEffect(() => {
//     if (token) {
//       fetchConversations()

//       // Set up polling for new messages
//       const intervalId = setInterval(() => {
//         fetchConversations()
//       }, 10000) // Check every 10 seconds

//       return () => clearInterval(intervalId)
//     }
//   }, [token])

//   const handleSuggestionClick = (suggestion) => {
//     setSelectedSuggestion(suggestion)
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />

//       <div className="container mx-auto px-1 pt-20 mb-2 py-0">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="flex h-[calc(100vh-120px)]">
//             {/* Sidebar with tabs */}
//             <div className="w-1/4 border-r border-gray-50 flex flex-col">
//               {/* Tabs */}
//               <div className="flex border-b border-gray-200">
//                 <button
//                   className={`flex-1 py-3 px-4 text-center font-medium ${
//                     activeTab === "conversations"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                   onClick={() => {
//                     setActiveTab("conversations")
//                     fetchConversations()
//                   }}
//                 >
//                   Inbox
//                 </button>
//                 <button
//                   className={`flex-1 py-3 px-4 text-center font-medium ${
//                     activeTab === "archived"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                   onClick={() => {
//                     setActiveTab("archived")
//                     fetchArchivedConversations()
//                   }}
//                 >
//                   Archived
//                 </button>
//                 <button
//                   className={`flex-1 py-3 px-4 text-center font-medium ${
//                     activeTab === "blocked"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                   onClick={() => {
//                     setActiveTab("blocked")
//                     fetchBlockedConversations()
//                   }}
//                 >
//                   Blocked
//                 </button>
//               </div>

//               {/* Search */}
//               <div className="p-3 border-b border-gray-200">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search conversations..."
//                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <FaSearch className="absolute left-3 top-3 text-gray-400" />
//                   {searchQuery && (
//                     <button
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                       onClick={() => setSearchQuery("")}
//                     >
//                       <FaTimes />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Conversations List */}
//               <div className="flex-1 overflow-y-auto bg-gray-50">
//                 {activeTab === "conversations" && (
//                   <>
//                     {loading.conversations ? (
//                       <div className="flex justify-center items-center h-32">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                       </div>
//                     ) : filteredConversations(conversations).length > 0 ? (
//                       <div>
//                         {filteredConversations(conversations).map((conversation) => {
//                           if (!conversation) return null

//                           const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
//                           if (!otherParticipant) return null

//                           return (
//                             <div
//                               key={conversation._id}
//                               className={`flex items-center space-x-4 p-4 cursor-pointer transition-colors rounded-r-lg border-l-4 relative group
//                                 ${
//                                   selectedConversation?._id === conversation._id
//                                     ? "bg-blue-50 border-blue-600"
//                                     : "border-transparent hover:bg-gray-100 hover:border-blue-400"
//                                 }`}
//                             >
//                               <div
//                                 className="flex-grow flex items-center space-x-4"
//                                 onClick={() => handleSelectConversation(conversation)}
//                               >
//                                 <div className="relative">
//                                   <ProfilePhoto
//                                     src={
//                                       otherParticipant?.profilePhotoUrl
//                                         ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
//                                         : null
//                                     }
//                                     alt={otherParticipant?.name || "User"}
//                                     size="lg"
//                                   />
//                                   {conversation.unreadCount > 0 && (
//                                     <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-md border-2 border-white">
//                                       {conversation.unreadCount}
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <div className="flex justify-between items-center">
//                                     <h3 className="text-base font-semibold text-gray-900 truncate">
//                                       {otherParticipant?.name}
//                                     </h3>
//                                     <span className="text-sm text-gray-500">
//                                       {formatConversationDate(conversation.updatedAt)}
//                                     </span>
//                                   </div>
//                                   {conversation.lastMessageText && (
//                                     <p
//                                       className={`text-sm truncate mt-1 ${conversation.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"}`}
//                                     >
//                                       {conversation.lastMessageText.length > 30
//                                         ? conversation.lastMessageText.substring(0, 30) + "..."
//                                         : conversation.lastMessageText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* Conversation actions button */}
//                               <div className="opacity-0 group-hover:opacity-100">
//                                 <div className="relative">
//                                   <button
//                                     className="p-1 rounded-full hover:bg-gray-200 dropdown-toggle"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       toggleDropdown(`list-${conversation._id}`)
//                                     }}
//                                   >
//                                     <FaEllipsisV className="text-gray-500" />
//                                   </button>

//                                   {/* Dropdown menu */}
//                                   {dropdownOpen === `list-${conversation._id}` && (
//                                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
//                                       <div className="py-1">
//                                         <button
//                                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                           onClick={(e) => {
//                                             e.stopPropagation()
//                                             archiveConversation(conversation._id)
//                                           }}
//                                         >
//                                           <FaArchive className="mr-2 text-gray-500" /> Archive
//                                         </button>
//                                         <button
//                                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                           onClick={(e) => {
//                                             e.stopPropagation()
//                                             blockConversation(conversation._id)
//                                           }}
//                                         >
//                                           <FaBan className="mr-2 text-red-500" /> Block
//                                         </button>
//                                         <button
//                                           className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
//                                           onClick={(e) => {
//                                             e.stopPropagation()
//                                             deleteConversation(conversation._id)
//                                           }}
//                                         >
//                                           <FaTrash className="mr-2" /> Delete Chat
//                                         </button>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     ) : (
//                       <div className="p-6 text-center text-gray-500 font-medium">
//                         {searchQuery ? "No conversations match your search" : "No conversations yet"}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {activeTab === "archived" && (
//                   <>
//                     {loading.archivedConversations ? (
//                       <div className="flex justify-center items-center h-32">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                       </div>
//                     ) : filteredConversations(archivedConversations).length > 0 ? (
//                       <div>
//                         {filteredConversations(archivedConversations).map((conversation) => {
//                           if (!conversation) return null

//                           const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
//                           if (!otherParticipant) return null

//                           return (
//                             <div
//                               key={conversation._id}
//                               className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-100"
//                             >
//                               <div
//                                 className="flex items-center space-x-3 flex-1 cursor-pointer"
//                                 onClick={() => handleSelectConversation(conversation)}
//                               >
//                                 <ProfilePhoto
//                                   src={
//                                     otherParticipant?.profilePhotoUrl
//                                       ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
//                                       : null
//                                   }
//                                   alt={otherParticipant?.name || "User"}
//                                   size="md"
//                                 />
//                                 <div>
//                                   <h3 className="font-medium text-gray-900">{otherParticipant?.name}</h3>
//                                   {conversation.lastMessageText && (
//                                     <p className="text-sm text-gray-500 truncate">{conversation.lastMessageText}</p>
//                                   )}
//                                 </div>
//                               </div>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   unarchiveConversation(conversation._id)
//                                 }}
//                                 className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center"
//                               >
//                                 <FaInbox className="mr-1" /> Unarchive
//                               </button>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     ) : (
//                       <div className="p-6 text-center text-gray-500 font-medium">No archived conversations</div>
//                     )}
//                   </>
//                 )}

//                 {activeTab === "blocked" && (
//                   <>
//                     {loading.blockedConversations ? (
//                       <div className="flex justify-center items-center h-32">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                       </div>
//                     ) : filteredConversations(blockedConversations).length > 0 ? (
//                       <div>
//                         {filteredConversations(blockedConversations).map((conversation) => {
//                           if (!conversation) return null

//                           const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
//                           if (!otherParticipant) return null

//                           return (
//                             <div
//                               key={conversation._id}
//                               className="flex items-center justify-between p-4 border-b border-gray-100"
//                             >
//                               <div className="flex items-center space-x-3">
//                                 <ProfilePhoto
//                                   src={
//                                     otherParticipant?.profilePhotoUrl
//                                       ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
//                                       : null
//                                   }
//                                   alt={otherParticipant?.name || "User"}
//                                   size="md"
//                                 />
//                                 <div>
//                                   <h3 className="font-medium text-gray-900">{otherParticipant?.name}</h3>
//                                   <p className="text-xs text-red-500">Blocked</p>
//                                 </div>
//                               </div>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   unblockConversation(conversation._id)
//                                 }}
//                                 className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
//                               >
//                                 Unblock
//                               </button>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     ) : (
//                       <div className="p-6 text-center text-gray-500 font-medium">No blocked conversations</div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Messages Section - Reduced to 3/4 width */}
//             <div className="w-3/4 flex">
//               <div className="w-2/3 flex flex-col bg-white border-r border-gray-200">
//                 {selectedConversation ? (
//                   <>
//                     {/* Header */}
//                     <div className="p-3 border-b border-gray-300 flex items-center justify-between bg-blue-100">
//                       <div
//                         className="flex items-center space-x-4 cursor-pointer"
//                         onClick={() => {
//                           const otherParticipant = selectedConversation.participants?.find(
//                             (p) => p && p._id !== currentUserId,
//                           )
//                           if (otherParticipant) {
//                             viewProfile(otherParticipant._id)
//                           }
//                         }}
//                       >
//                         {(() => {
//                           const otherParticipant = selectedConversation.participants?.find(
//                             (p) => p && p._id !== currentUserId,
//                           )
//                           if (!otherParticipant) return null

//                           return (
//                             <>
//                               <ProfilePhoto
//                                 src={
//                                   otherParticipant?.profilePhotoUrl
//                                     ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
//                                     : null
//                                 }
//                                 alt={otherParticipant?.name || "User"}
//                                 size="md"
//                               />
//                               <div>
//                                 <h3 className="font-semibold text-gray-900 text-lg">{otherParticipant?.name}</h3>
//                                 <p className="text-sm text-blue-600">{otherParticipant?.role}</p>
//                               </div>
//                             </>
//                           )
//                         })()}
//                       </div>

//                       {/* Conversation actions */}
//                       <div className="relative">
//                         <button
//                           className="p-2 rounded-full hover:bg-blue-200 dropdown-toggle"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             toggleDropdown(`header-${selectedConversation._id}`)
//                           }}
//                         >
//                           <FaEllipsisV className="text-gray-700" />
//                         </button>

//                         {/* Dropdown menu */}
//                         {dropdownOpen === `header-${selectedConversation._id}` && (
//                           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
//                             <div className="py-1">
//                               <button
//                                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                 onClick={() => {
//                                   archiveConversation(selectedConversation._id)
//                                 }}
//                               >
//                                 <FaArchive className="mr-2 text-gray-500" /> Archive conversation
//                               </button>
//                               <button
//                                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                 onClick={() => {
//                                   blockConversation(selectedConversation._id)
//                                 }}
//                               >
//                                 <FaBan className="mr-2 text-red-500" /> Block user
//                               </button>
//                               <button
//                                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
//                                 onClick={() => {
//                                   deleteConversation(selectedConversation._id)
//                                 }}
//                               >
//                                 <FaTrash className="mr-2" /> Delete chat
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Messages List */}
//                     <div
//                       ref={messageListRef}
//                       className="flex-1 p-2 overflow-y-auto space-y-2"
//                       style={{ backgroundColor: "#f9fafb", scrollbarWidth: "none", msOverflowStyle: "none" }}
//                     >
//                       {loading.messages ? (
//                         <div className="flex justify-center items-center h-full">
//                           <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
//                         </div>
//                       ) : messages.length > 0 ? (
//                         messages.map((message) => {
//                           if (!message) return null

//                           const isSentByCurrentUser = message.sender?._id === currentUserId
//                           const isOptimistic = message.isOptimistic

//                           return (
//                             <div
//                               key={message._id}
//                               className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-1`}
//                             >
//                               <div
//                                 className={`relative max-w-[80%] rounded-lg px-3 py-1.5 shadow-sm group ${
//                                   isSentByCurrentUser
//                                     ? isOptimistic
//                                       ? "bg-blue-300 text-white" // Lighter blue for optimistic messages
//                                       : "bg-teal-500 text-white" // Teal for sent messages
//                                     : "bg-gray-100 text-gray-900 border border-gray-200"
//                                 }`}
//                                 onContextMenu={(e) => handleMessageContextMenu(e, message._id)}
//                               >
//                                 {!isSentByCurrentUser && message.sender?.name && (
//                                   <p
//                                     className={`text-xs font-semibold mb-0.5 ${isSentByCurrentUser ? "text-blue-100" : "text-blue-700"}`}
//                                   >
//                                     {message.sender.name}
//                                   </p>
//                                 )}
//                                 <p className="whitespace-pre-wrap text-sm">{message.content}</p>
//                                 <div
//                                   className={`flex items-center justify-end mt-0.5 space-x-1 text-xs ${
//                                     isSentByCurrentUser ? "text-green-200" : "text-gray-500"
//                                   }`}
//                                 >
//                                   <span className="text-xs">{formatMessageTime(message.createdAt)}</span>
//                                   {isSentByCurrentUser && !isOptimistic && (
//                                     <span className="ml-1">
//                                       {message.read ? (
//                                         <FaCheckDouble className="text-blue-300" size={12} />
//                                       ) : message.delivered ? (
//                                         <FaCheckDouble className="text-green-200" size={12} />
//                                       ) : (
//                                         <FaCheck className="text-green-200" size={12} />
//                                       )}
//                                     </span>
//                                   )}
//                                   {isSentByCurrentUser && isOptimistic && (
//                                     <span className="text-green-200 animate-pulse text-xs">Sending...</span>
//                                   )}
//                                 </div>

//                                 {/* Message actions button - visible on hover */}
//                                 {!isOptimistic && (
//                                   <button
//                                     className={`absolute ${isSentByCurrentUser ? "-left-6" : "-right-6"} top-1 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200`}
//                                     onClick={(e) => handleMessageContextMenu(e, message._id)}
//                                   >
//                                     <FaEllipsisV className="text-gray-500 text-xs" />
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           )
//                         })
//                       ) : (
//                         <div className="text-center text-gray-400 mt-12">No messages yet. Say hello!</div>
//                       )}
//                       <div ref={messagesEndRef} />
//                     </div>

//                     {/* Message Input */}
//                     <div className="relative">
//                       <form
//                         onSubmit={sendMessage}
//                         className="p-2 border-t border-gray-300 bg-white flex items-center space-x-2"
//                       >
//                         <textarea
//                           ref={messageInputRef}
//                           className="flex-1 resize-none rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-1.5 text-gray-800 message-input text-sm"
//                           placeholder={
//                             selectedConversation?.isBlocked
//                               ? "You cannot send messages in this conversation"
//                               : "Type your message..."
//                           }
//                           rows={1}
//                           value={newMessage}
//                           onChange={handleMessageInputChange}
//                           onFocus={handleMessageInputFocus}
//                           disabled={loading.sending || selectedConversation?.isBlocked}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter" && !e.shiftKey) {
//                               e.preventDefault()
//                               sendMessage(e)
//                             }
//                           }}
//                         />
//                         <button
//                           type="submit"
//                           disabled={loading.sending || !newMessage.trim() || selectedConversation?.isBlocked}
//                           className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                         >
//                           {loading.sending ? "Sending..." : "Send"}
//                         </button>
//                       </form>

//                       {/* Message Suggestions */}
//                       {showSuggestions && messageSuggestions.length > 0 && !selectedConversation?.isBlocked && (
//                         <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-300 rounded-t-lg shadow-lg message-suggestions">
//                           <div className="p-2 border-b border-gray-200">
//                             <p className="text-sm font-medium text-gray-500">Suggested messages:</p>
//                           </div>
//                           <div className="max-h-48 overflow-y-auto">
//                             {messageSuggestions.map((suggestion, index) => (
//                               <button
//                                 key={index}
//                                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-100"
//                                 onClick={() => handleSuggestionClick(suggestion)}
//                               >
//                                 {suggestion}
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center flex-grow text-gray-400 text-lg">
//                     Select a conversation to start messaging
//                   </div>
//                 )}
//               </div>

//               {/* Profile Section - 1/3 of the 3/4 width (1/4 of total) */}
//               <div className="w-1/3 bg-white p-4">
//                 {selectedConversation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="text-center mb-6">
//                       <div className="mx-auto mb-4">
//                         {(() => {
//                           const recipient = getRecipient()
//                           return (
//                             <ProfilePhoto
//                               src={recipient?.profilePhotoUrl ? `${API_BASE_URL}${recipient.profilePhotoUrl}` : null}
//                               alt={recipient?.name || "User"}
//                               size="xl"
//                             />
//                           )
//                         })()}
//                       </div>
//                       <h2 className="text-xl font-bold text-gray-900">{getRecipient()?.name}</h2>
//                       <p className="text-sm text-blue-600">{getRecipient()?.role || "User"}</p>
//                     </div>

//                     <div className="border-t border-gray-200 pt-4">
//                       <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
//                       <div className="space-y-3">
//                         <div className="flex items-center">
//                           <FaEnvelope className="text-gray-500 mr-3" />
//                           <span className="text-gray-700">{getRecipient()?.email || "Email not available"}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <FaPhone className="text-gray-500 mr-3" />
//                           <span className="text-gray-700">Phone not available</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border-t border-gray-200 pt-4 mt-4">
//                       <h3 className="text-lg font-semibold mb-3">Actions</h3>
//                       <div className="space-y-2">
//                         <button
//                           onClick={() => viewProfile(getRecipient()?._id)}
//                           className="w-full flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
//                         >
//                           <FaUserCircle className="mr-2" /> View Full Profile
//                         </button>
//                         <button
//                           onClick={() => blockConversation(selectedConversation._id)}
//                           className="w-full flex items-center justify-center py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
//                         >
//                           <FaBan className="mr-2" /> Block User
//                         </button>
//                       </div>
//                     </div>

//                     <div className="border-t border-gray-200 pt-4 mt-4 flex-grow">
//                       <h3 className="text-lg font-semibold mb-3">Shared Links</h3>
//                       <div className="text-center text-gray-500 italic">
//                         <p>No shared links yet</p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                     <FaUserCircle className="text-6xl mb-4 text-gray-300" />
//                     <p>Select a conversation to view profile</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Message Context Menu */}
//       {messageContextMenu.visible && (
//         <div
//           className="fixed bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1"
//           style={{
//             top: messageContextMenu.y,
//             left: messageContextMenu.x,
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {messages.find((m) => m && m._id === messageContextMenu.messageId)?.sender?._id === currentUserId ? (
//             <>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
//                 onClick={() => deleteMessage(messageContextMenu.messageId)}
//               >
//                 <FaTrash className="mr-2" /> Delete Message
//               </button>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
//                 onClick={() => closeContextMenu()}
//               >
//                 <FaTimes className="mr-2" /> Cancel
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 flex items-center"
//                 onClick={() => reportMessage(messageContextMenu.messageId)}
//               >
//                 <FaFlag className="mr-2" /> Report Message
//               </button>
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
//                 onClick={() => closeContextMenu()}
//               >
//                 <FaTimes className="mr-2" /> Cancel
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* New Message Notification */}
//       {notification.visible && notification.message && (
//         <div
//           className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm cursor-pointer animate-bounce-in"
//           onClick={() => {
//             // Find the conversation
//             const conversation = conversations.find((c) => c && c._id === notification.message.conversationId)
//             if (conversation) {
//               handleSelectConversation(conversation)
//             }
//             setNotification({ visible: false, message: null, sender: null })
//           }}
//         >
//           <div className="flex items-start space-x-3">
//             <ProfilePhoto
//               src={
//                 notification.sender?.profilePhotoUrl ? `${API_BASE_URL}${notification.sender.profilePhotoUrl}` : null
//               }
//               alt={notification.sender?.name || "User"}
//               size="md"
//             />
//             <div>
//               <h4 className="font-semibold text-gray-900">{notification.sender?.name}</h4>
//               <p className="text-sm text-gray-600 line-clamp-2">{notification.message.content}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx="true">{`
//         @keyframes bounce-in {
//           0% { transform: translateY(100%); opacity: 0; }
//           60% { transform: translateY(-10px); }
//           80% { transform: translateY(5px); }
//           100% { transform: translateY(0); opacity: 1; }
//         }
//         .animate-bounce-in {
//           animation: bounce-in 0.5s ease-out forwards;
//         }
        
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
//         .animate-pulse {
//           animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }

//         /* Hide scrollbar for Chrome, Safari and Opera */
//         .overflow-y-auto::-webkit-scrollbar {
//           display: none;
//         }
        
//         /* Hide scrollbar for IE, Edge and Firefox */
//         .overflow-y-auto {
//           -ms-overflow-style: none;  /* IE and Edge */
//           scrollbar-width: none;  /* Firefox */
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Messages


 {/* Message Suggestions */}
                      // {showSuggestions && messageSuggestions.length > 0 && !selectedConversation?.isBlocked && (
                      //   <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg message-suggestions w-2/3">
                      //     <div className="p-3 border-b border-gray-200 bg-indigo-50">
                      //       <p className="text-sm font-medium text-indigo-700">Suggested messages:</p>
                      //     </div>
                      //     <div className="max-h-48 overflow-y-auto">
                      //       {messageSuggestions.map((suggestion, index) => (
                      //         <button
                      //           key={index}
                      //           className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 border-b border-gray-100 transition-colors"
                      //           onClick={() => handleSuggestionClick(suggestion)}
                      //         >
                      //           {suggestion}
                      //         </button>
                      //       ))}
                      //     </div>
                      //   </div>
                      // )}





                      /////////////////////////////////// YE NAYA WALA 
    
// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"
// import Navbar from "../component/Navbar"
// import ProfilePhoto from "../component/ProfilePhoto"
// import {
//   FaCheck,
//   FaCheckDouble,
//   FaSearch,
//   FaTimes,
//   FaUserCircle,
//   FaEnvelope,
//   FaImage,
//   FaPaperclip,
//   FaExternalLinkAlt,
// } from "react-icons/fa"

// const Messages = () => {
//   const navigate = useNavigate()
//   const [conversations, setConversations] = useState([])
//   const [selectedConversation, setSelectedConversation] = useState(null)
//   const [messages, setMessages] = useState([])
//   const [newMessage, setNewMessage] = useState("")
//   const [selectedImages, setSelectedImages] = useState([])
//   const [loading, setLoading] = useState({
//     conversations: true,
//     messages: false,
//     sending: false,
//   })
//   const [searchQuery, setSearchQuery] = useState("")
//   const [dropdownOpen, setDropdownOpen] = useState(null)

//   const messagesEndRef = useRef(null)
//   const messageInputRef = useRef(null)
//   const fileInputRef = useRef(null)

//   const token = localStorage.getItem("token")
//   const currentUserId = localStorage.getItem("userId")
//   const currentUserName = localStorage.getItem("userName") || "You"

//   const config = {
//     headers: {
//       Authorization: token,
//     },
//   }

//   const API_BASE_URL = "http://localhost:5005"

//   // Enhanced link detection and rendering
//   const renderMessageContent = (content, forwardedPost = null) => {
//     if (!content) return ""

//     // URL regex pattern
//     const urlRegex = /(https?:\/\/[^\s]+)/g

//     // Split content by URLs and render with clickable links
//     const parts = content.split(urlRegex)

//     return parts.map((part, index) => {
//       if (urlRegex.test(part)) {
//         return (
//           <a
//             key={index}
//             href={part}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-300 underline hover:text-blue-100 inline-flex items-center gap-1"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {part.length > 50 ? `${part.substring(0, 50)}...` : part}
//             <FaExternalLinkAlt className="text-xs" />
//           </a>
//         )
//       }
//       return part
//     })
//   }

//   // Enhanced forwarded post rendering
//   const renderForwardedPost = (message) => {
//     if (!message.forwardedPost) return null

//     const { forwardedPost } = message

//     return (
//       <div className="mt-2 p-3 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-30">
//         <div className="flex items-center gap-2 mb-2">
//           <FaPaperclip className="text-xs" />
//           <span className="text-xs font-semibold">Forwarded Post</span>
//         </div>

//         {forwardedPost.originalContent && <p className="text-sm mb-2 opacity-90">{forwardedPost.originalContent}</p>}

//         {forwardedPost.images && forwardedPost.images.length > 0 && (
//           <div className="flex items-center gap-1 text-xs mb-2 opacity-80">
//             <FaImage />
//             <span>{forwardedPost.images.length} image(s)</span>
//           </div>
//         )}

//         <div className="text-xs opacity-80 mb-2">By: {forwardedPost.author}</div>

//         {forwardedPost.postLink && (
//           <button
//             onClick={() => {
//               // Extract post ID from the link and navigate
//               const postId = forwardedPost.postId || forwardedPost.postLink.split("/").pop()
//               navigate(`/post/${postId}`)
//             }}
//             className="inline-flex items-center gap-1 text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
//           >
//             <FaExternalLinkAlt />
//             View Original Post
//           </button>
//         )}
//       </div>
//     )
//   }

//   // Handle image selection
//   const handleImageSelect = (event) => {
//     const files = Array.from(event.target.files)
//     if (files.length > 0) {
//       setSelectedImages((prev) => [...prev, ...files])
//     }
//   }

//   // Remove selected image
//   const removeImage = (index) => {
//     setSelectedImages((prev) => prev.filter((_, i) => i !== index))
//   }

//   // Enhanced send message with image support
//   const sendMessage = async (e) => {
//     e?.preventDefault()
//     if ((!newMessage.trim() && selectedImages.length === 0) || !selectedConversation) return

//     if (selectedConversation.isBlocked) {
//       const isBlockedByCurrentUser = selectedConversation.blockedBy?.toString() === currentUserId
//       if (isBlockedByCurrentUser) {
//         toast.warning("You've blocked this conversation. Unblock to send messages.")
//         return
//       } else {
//         toast.error("You cannot message this user as they have blocked you.")
//         return
//       }
//     }

//     const messageContent = newMessage.trim()
//     const tempId = `temp-${Date.now()}`

//     try {
//       setLoading((prev) => ({ ...prev, sending: true }))

//       // Create FormData for file upload
//       const formData = new FormData()
//       formData.append("conversationId", selectedConversation._id)
//       formData.append("content", messageContent || "Sent images")

//       // Add images to FormData
//       selectedImages.forEach((image, index) => {
//         formData.append("images", image)
//       })

//       // Add optimistic message
//       const optimisticMessage = {
//         _id: tempId,
//         conversationId: selectedConversation._id,
//         sender: {
//           _id: currentUserId,
//           name: currentUserName,
//         },
//         content: messageContent || "Sending images...",
//         images: selectedImages.map((img) => URL.createObjectURL(img)),
//         read: false,
//         delivered: false,
//         createdAt: new Date().toISOString(),
//         isOptimistic: true,
//       }

//       setMessages((prev) => [...prev, optimisticMessage])
//       setNewMessage("")
//       setSelectedImages([])

//       const response = await axios.post(`${API_BASE_URL}/api/messages/with-images`, formData, {
//         ...config,
//         headers: {
//           ...config.headers,
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       if (response.data && response.data.success) {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg._id === tempId
//               ? {
//                   ...response.data.message,
//                   isOptimistic: false,
//                 }
//               : msg,
//           ),
//         )
//         fetchConversations()
//       } else {
//         console.error("Failed to send message:", response.data)
//         toast.error(response.data?.message || "Failed to send message")
//         setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//       toast.error(error.response?.data?.message || "Failed to send message")
//       setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
//     } finally {
//       setLoading((prev) => ({ ...prev, sending: false }))
//     }
//   }

//   // Fetch conversations (simplified version)
//   const fetchConversations = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, config)
//       if (response.data && response.data.success) {
//         const nonBlockedConversations = response.data.conversations.filter((conv) => !conv.isBlocked)
//         setConversations(nonBlockedConversations)
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error)
//       toast.error("Failed to load conversations")
//     } finally {
//       setLoading((prev) => ({ ...prev, conversations: false }))
//     }
//   }

//   // Fetch messages (simplified version)
//   const fetchMessages = async (conversationId) => {
//     if (!conversationId) return

//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, config)
//       if (response.data && response.data.success) {
//         setMessages(response.data.messages || [])
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error)
//       toast.error("Failed to load messages")
//     }
//   }

//   const handleSelectConversation = (conversation) => {
//     if (conversation.isBlocked) {
//       const isBlockedByCurrentUser = conversation.blockedBy?.toString() === currentUserId
//       if (isBlockedByCurrentUser) {
//         toast.warning("You've blocked this conversation. Unblock to send messages.")
//       } else {
//         toast.error("You cannot message this user as they have blocked you.")
//         return
//       }
//     }

//     setSelectedConversation(conversation)
//     fetchMessages(conversation._id)
//   }

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     if (!token) {
//       navigate("/login")
//     } else {
//       fetchConversations()
//     }
//   }, [navigate, token])

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const formatMessageTime = (dateString) => {
//     if (!dateString) return ""
//     try {
//       const date = new Date(dateString)
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     } catch (error) {
//       return ""
//     }
//   }

//   const getRecipient = () => {
//     if (!selectedConversation || !selectedConversation.participants) return null
//     return selectedConversation.participants.find((p) => p && p._id !== currentUserId)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-20 pb-4 max-w-8xl">
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
//           <div className="flex h-[calc(100vh-100px)]">
//             {/* Sidebar */}
//             <div className="w-1/4 border-r border-gray-200 flex flex-col bg-white">
//               {/* Search */}
//               <div className="p-4 border-b border-gray-200">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search conversations..."
//                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <FaSearch className="absolute left-3 top-3 text-gray-400" />
//                 </div>
//               </div>

//               {/* Conversations List */}
//               <div className="flex-1 overflow-y-auto">
//                 {loading.conversations ? (
//                   <div className="flex justify-center items-center h-32">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : conversations.length > 0 ? (
//                   <div>
//                     {conversations.map((conversation) => {
//                       const otherParticipant = conversation.participants?.find((p) => p && p._id !== currentUserId)
//                       if (!otherParticipant) return null

//                       return (
//                         <div
//                           key={conversation._id}
//                           className={`flex items-center space-x-4 p-4 cursor-pointer transition-colors ${
//                             selectedConversation?._id === conversation._id
//                               ? "bg-indigo-50 border-r-4 border-indigo-600"
//                               : "hover:bg-gray-50"
//                           }`}
//                           onClick={() => handleSelectConversation(conversation)}
//                         >
//                           <ProfilePhoto
//                             src={
//                               otherParticipant?.profilePhotoUrl
//                                 ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
//                                 : null
//                             }
//                             alt={otherParticipant?.name || "User"}
//                             size="md"
//                           />
//                           <div className="flex-1 min-w-0">
//                             <h3 className="text-sm font-semibold text-gray-900 truncate">{otherParticipant?.name}</h3>
//                             {conversation.lastMessageText && (
//                               <p className="text-sm text-gray-500 truncate">{conversation.lastMessageText}</p>
//                             )}
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">No conversations yet</div>
//                 )}
//               </div>
//             </div>

//             {/* Messages Section */}
//             <div className="w-2/3 flex flex-col">
//               {selectedConversation ? (
//                 <>
//                   {/* Header */}
//                   <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-400">
//                     <div className="flex items-center space-x-4">
//                       {(() => {
//                         const otherParticipant = selectedConversation.participants?.find(
//                           (p) => p && p._id !== currentUserId,
//                         )
//                         return (
//                           <>
//                             <ProfilePhoto
//                               src={
//                                 otherParticipant?.profilePhotoUrl
//                                   ? `${API_BASE_URL}${otherParticipant.profilePhotoUrl}`
//                                   : null
//                               }
//                               alt={otherParticipant?.name || "User"}
//                               size="md"
//                             />
//                             <div>
//                               <h3 className="font-semibold text-white">{otherParticipant?.name}</h3>
//                               <p className="text-sm text-blue-100">{otherParticipant?.role}</p>
//                             </div>
//                           </>
//                         )
//                       })()}
//                     </div>
//                   </div>

//                   {/* Messages List */}
//                   <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
//                     {messages.map((message) => {
//                       if (!message) return null

//                       const isSentByCurrentUser = message.sender?._id === currentUserId
//                       const isOptimistic = message.isOptimistic

//                       return (
//                         <div
//                           key={message._id}
//                           className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
//                         >
//                           <div
//                             className={`max-w-[70%] rounded-lg px-4 py-2 ${
//                               isSentByCurrentUser
//                                 ? isOptimistic
//                                   ? "bg-blue-400 text-white"
//                                   : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
//                                 : "bg-white text-gray-800 border border-gray-200"
//                             }`}
//                           >
//                             {!isSentByCurrentUser && message.sender?.name && (
//                               <p className="text-xs font-semibold mb-1 text-blue-600">{message.sender.name}</p>
//                             )}

//                             <div className="text-sm whitespace-pre-wrap">
//                               {renderMessageContent(message.content, message.forwardedPost)}
//                             </div>

//                             {/* Render images */}
//                             {message.images && message.images.length > 0 && (
//                               <div className="mt-2 grid grid-cols-2 gap-2">
//                                 {message.images.map((image, index) => (
//                                   <img
//                                     key={index}
//                                     src={image.startsWith("blob:") ? image : `${API_BASE_URL}${image}`}
//                                     alt={`Attachment ${index + 1}`}
//                                     className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-80"
//                                     onClick={() =>
//                                       window.open(
//                                         image.startsWith("blob:") ? image : `${API_BASE_URL}${image}`,
//                                         "_blank",
//                                       )
//                                     }
//                                   />
//                                 ))}
//                               </div>
//                             )}

//                             {/* Render forwarded post */}
//                             {renderForwardedPost(message)}

//                             <div
//                               className={`flex items-center justify-end mt-1 text-xs ${
//                                 isSentByCurrentUser ? "text-blue-200" : "text-gray-500"
//                               }`}
//                             >
//                               <span>{formatMessageTime(message.createdAt)}</span>
//                               {isSentByCurrentUser && !isOptimistic && (
//                                 <span className="ml-1">
//                                   {message.read ? (
//                                     <FaCheckDouble className="text-green-300" />
//                                   ) : message.delivered ? (
//                                     <FaCheckDouble className="text-blue-300" />
//                                   ) : (
//                                     <FaCheck className="text-blue-300" />
//                                   )}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Message Input */}
//                   <div className="border-t border-gray-200 bg-white">
//                     {/* Selected Images Preview */}
//                     {selectedImages.length > 0 && (
//                       <div className="p-3 border-b border-gray-200">
//                         <div className="flex flex-wrap gap-2">
//                           {selectedImages.map((image, index) => (
//                             <div key={index} className="relative">
//                               <img
//                                 src={URL.createObjectURL(image) || "/placeholder.svg"}
//                                 alt={`Selected ${index + 1}`}
//                                 className="w-16 h-16 object-cover rounded-lg border"
//                               />
//                               <button
//                                 onClick={() => removeImage(index)}
//                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                               >
//                                 <FaTimes />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <form onSubmit={sendMessage} className="p-4 flex items-end space-x-3">
//                       <div className="flex-1">
//                         <div className="flex items-end space-x-2">
//                           <button
//                             type="button"
//                             onClick={() => fileInputRef.current?.click()}
//                             className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                             disabled={loading.sending}
//                           >
//                             <FaImage className="w-5 h-5" />
//                           </button>
//                           <textarea
//                             ref={messageInputRef}
//                             className="flex-1 resize-none rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2 text-sm"
//                             placeholder={
//                               selectedConversation?.isBlocked
//                                 ? "You cannot send messages in this conversation"
//                                 : "Type your message..."
//                             }
//                             rows={1}
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             disabled={loading.sending || selectedConversation?.isBlocked}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault()
//                                 sendMessage(e)
//                               }
//                             }}
//                           />
//                         </div>
//                       </div>
//                       <button
//                         type="submit"
//                         disabled={
//                           loading.sending ||
//                           (!newMessage.trim() && selectedImages.length === 0) ||
//                           selectedConversation?.isBlocked
//                         }
//                         className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {loading.sending ? "Sending..." : "Send"}
//                       </button>
//                     </form>

//                     {/* Hidden file input */}
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageSelect}
//                       className="hidden"
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
//                   <FaEnvelope className="text-6xl mb-4" />
//                   <p className="text-lg">Select a conversation to start messaging</p>
//                 </div>
//               )}
//             </div>

//             {/* Profile Section */}
//             <div className="w-1/3 bg-gradient-to-b from-gray-50 to-blue-50 p-4">
//               {selectedConversation ? (
//                 <div className="h-full flex flex-col">
//                   <div className="text-center mb-6 bg-white p-4 rounded-xl shadow-sm">
//                     {(() => {
//                       const recipient = getRecipient()
//                       return (
//                         <>
//                           <ProfilePhoto
//                             src={recipient?.profilePhotoUrl ? `${API_BASE_URL}${recipient.profilePhotoUrl}` : null}
//                             alt={recipient?.name || "User"}
//                             size="xl"
//                             className="mx-auto mb-4"
//                           />
//                           <h2 className="text-xl font-bold text-gray-900">{recipient?.name}</h2>
//                           <p className="text-sm text-blue-600">{recipient?.role || "User"}</p>
//                         </>
//                       )
//                     })()}
//                   </div>

//                   <div className="bg-white p-4 rounded-xl shadow-sm">
//                     <h3 className="text-lg font-semibold mb-3">Actions</h3>
//                     <div className="space-y-2">
//                       <button
//                         onClick={() => navigate(`/profile/${getRecipient()?._id}`)}
//                         className="w-full flex items-center justify-center py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
//                       >
//                         <FaUserCircle className="mr-2" /> View Profile
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                   <FaUserCircle className="text-6xl mb-4" />
//                   <p>Select a conversation to view profile</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Messages

