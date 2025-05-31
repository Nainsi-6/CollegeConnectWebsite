"use client"

import { useState } from "react"
import CreatePostModal from "./CreatePostModal"

const CreatePostButton = ({ onCreatePost, loading, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Fixed Create Post Button */}
      <div className="bg-gray-700 rounded-lg shadow-md p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left px-4 py-3 bg-gray-600 hover:bg-gray-500 rounded-full text-gray-300 transition-colors duration-200 border border-gray-600"
          >
            What's on your mind, {user?.name?.split(" ")[0] || "there"}?
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Create Post</span>
          </button>

          <div className="text-xs text-gray-400">Share your thoughts with the community</div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePost={onCreatePost}
        loading={loading}
        user={user}
      />
    </>
  )
}

export default CreatePostButton
