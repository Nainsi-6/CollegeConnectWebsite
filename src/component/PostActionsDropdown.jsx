"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  EllipsisVerticalIcon,
  UserIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  FlagIcon,
  TrashIcon
} from "@heroicons/react/24/outline"

const PostActionsDropdown = ({
  post,
  currentUser,
  onDelete,
  onReport,
  onSave,
  onForward,
  onFollow,
  isFollowing = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localRequestSent, setLocalRequestSent] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const isOwnPost =
    (post.userId && typeof post.userId === "object" && post.userId._id === currentUser?._id) ||
    (post.userId && typeof post.userId === "string" && post.userId === currentUser?._id) ||
    (post.username && post.username === currentUser?.name)

  const getUserId = () => {
    if (post.userId) {
      if (typeof post.userId === "object" && post.userId._id) return post.userId._id
      if (typeof post.userId === "string") return post.userId
    }
    return null
  }

  const handleFollow = () => {
    const userId = getUserId()
    if (!isFollowing && !localRequestSent && userId) {
      setLocalRequestSent(true)
      onFollow?.(userId)
    }
  }

  const handleAction = (action) => {
    setIsOpen(false)
    const userId = getUserId()

    switch (action) {
      case "delete":
        onDelete?.(post._id)
        break
      case "report":
        onReport?.(post._id)
        break
      case "save":
        onSave?.(post._id)
        break
      case "forward":
        onForward?.(post)
        break
      case "profile":
        if (userId) {
          navigate(`/profile/${userId}`)
        } else {
          alert("Unable to view profile - user information not available")
        }
        break
      case "follow":
        handleFollow()
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-800 hover:text-gray-200 p-1 rounded-full hover:bg-indigo-400 transition-colors"
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-900 font-bold" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-b-md shadow-lg z-50 border border-gray-600">
          <div className="py-1">
            {!isOwnPost && (
              <>
                <button
                  onClick={() => handleAction("profile")}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-600 flex items-center"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  View Profile
                </button>

                <button
                  onClick={() => handleAction("forward")}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-600 flex items-center"
                >
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  Forward in Chat
                </button>

                <button
                  onClick={() => handleAction("save")}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-600 flex items-center"
                >
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Save Post
                </button>

                <button
                  onClick={() => handleAction("report")}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold hover:bg-gray-600 flex items-center"
                >
                  <FlagIcon className="w-4 h-4 mr-2 text-red-500" />
                  Report Post
                </button>
              </>
            )}

            {isOwnPost && (
              <button
                onClick={() => handleAction("delete")}
                className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold hover:bg-gray-600 flex items-center"
              >
                <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                Delete Post
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostActionsDropdown
