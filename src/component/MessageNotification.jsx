"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const MessageNotification = ({ userId, token }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const navigate = useNavigate()

  const fetchUnreadMessages = async () => {
    if (!token || !userId) return

    try {
      const response = await fetch("https://localhost:5005/api/messages/conversations", {
        headers: {
          Authorization: token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.conversations) {
          const totalUnread = data.conversations.reduce((total, conv) => {
            return total + (conv.unreadCount || 0)
          }, 0)

          const hadUnread = unreadCount > 0
          setUnreadCount(totalUnread)

          // Show animation for new messages
          if (totalUnread > unreadCount && hadUnread) {
            setHasNewMessages(true)
            setTimeout(() => setHasNewMessages(false), 3000)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchUnreadMessages()

    // Set up polling every 10 seconds
    const interval = setInterval(fetchUnreadMessages, 10000)

    return () => clearInterval(interval)
  }, [userId, token])

  if (unreadCount === 0) return null

  return (
    <button
      onClick={() => navigate("/messages")}
      className={`relative inline-flex items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-300 ${
        hasNewMessages ? "animate-pulse" : ""
      }`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
      <span className="sr-only">Messages</span>
      <div
        className={`absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 ${
          hasNewMessages ? "animate-bounce" : ""
        }`}
      >
        {unreadCount > 99 ? "99+" : unreadCount}
      </div>
    </button>
  )
}

export default MessageNotification
