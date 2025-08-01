// "use client"

// import { useState } from "react"
// import ImageModal from "./ImageModal"
// import EmojiPicker from "./EmojiPicker"

// const CreatePostModal = ({ isOpen, onClose, onCreatePost, loading, user }) => {
//   const [postText, setPostText] = useState("")
//   const [selectedImages, setSelectedImages] = useState([])
//   const [showImageModal, setShowImageModal] = useState(false)
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files || [])

//     files.forEach((file) => {
//       if (selectedImages.length < 10) {
//         const reader = new FileReader()
//         reader.onload = (event) => {
//           setSelectedImages((prev) => [
//             ...prev,
//             {
//               file,
//               url: event.target?.result,
//             },
//           ])
//         }
//         reader.readAsDataURL(file)
//       }
//     })
//   }

//   const removeImage = (index) => {
//     setSelectedImages((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleSubmit = async () => {
//     if (!postText.trim() && selectedImages.length === 0) return

//     await onCreatePost({
//       content: postText,
//       images: selectedImages.map((img) => img.file),
//     })

//     // Reset form
//     setPostText("")
//     setSelectedImages([])
//     setShowEmojiPicker(false)
//     onClose()
//   }

//   const handleClose = () => {
//     setPostText("")
//     setSelectedImages([])
//     setShowEmojiPicker(false)
//     onClose()
//   }

//   const openImageModal = (imageIndex = 0) => {
//     setCurrentImageIndex(imageIndex)
//     setShowImageModal(true)
//   }

//   const handleEmojiSelect = (emoji) => {
//     setPostText((prev) => prev + emoji)
//   }

//   const getImageUrls = () => {
//     return selectedImages.map((img) => img.url)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 99999,  position: 'fixed'  }}>
//       <div className="bg-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="border-b border-gray-600 p-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-white">Create a post</h2>
//             <button
//               onClick={handleClose}
//               className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-600 transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4 max-h-[calc(90vh-160px)] overflow-y-auto">
//           {/* User Info */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold overflow-hidden">
//               {user?.image ? (
//                 <img
//                   src={user.image || "/placeholder.svg?height=48&width=48"}
//                   alt={user.name || "User"}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "/placeholder.svg?height=48&width=48"
//                   }}
//                 />
//               ) : (
//                 <span className="text-lg">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
//               )}
//             </div>
//             <div>
//               <h3 className="font-semibold text-white">{user?.name || "User"}</h3>
//               <p className="text-sm text-indigo-300 capitalize">{user?.role || "Member"}</p>
//             </div>
//           </div>

//           {/* Post Content */}
//           <div className="mb-4">
//             <textarea
//               placeholder="What do you want to talk about?"
//               value={postText}
//               onChange={(e) => setPostText(e.target.value)}
//               className="w-full min-h-[150px] bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-base leading-relaxed"
//               style={{ fontSize: "16px" }}
//             />
//           </div>

//           {/* Image Preview using PostImageDisplay pattern */}
//           {selectedImages.length > 0 && (
//             <div className="mb-4">
//               <div className="bg-gray-800 rounded-lg p-3">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm text-gray-300 font-medium">
//                     {selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""} selected
//                   </span>
//                   <button
//                     onClick={() => setSelectedImages([])}
//                     className="text-red-400 hover:text-red-300 text-sm transition-colors"
//                   >
//                     Remove all
//                   </button>
//                 </div>

//                 {selectedImages.length === 1 ? (
//                   <div className="relative group">
//                     <img
//                       src={selectedImages[0].url || "/placeholder.svg"}
//                       alt="Selected image"
//                       className="w-full max-h-64 object-cover rounded-lg cursor-pointer"
//                       onClick={() => openImageModal(0)}
//                     />
//                     <button
//                       onClick={() => removeImage(0)}
//                       className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <img
//                       src={selectedImages[0].url || "/placeholder.svg"}
//                       alt="Selected image 1"
//                       className="w-full h-48 object-cover rounded-lg cursor-pointer"
//                       onClick={() => openImageModal(0)}
//                     />
//                     {selectedImages.length > 1 && (
//                       <div
//                         className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
//                         onClick={() => openImageModal(0)}
//                       >
//                         <div className="text-center">
//                           <div className="text-white text-2xl font-bold mb-1">+{selectedImages.length - 1}</div>
//                           <div className="text-white text-sm font-medium">
//                             more {selectedImages.length - 1 === 1 ? "image" : "images"}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     <button
//                       onClick={() => openImageModal(0)}
//                       className="mt-2 text-indigo-300 hover:text-indigo-200 text-sm transition-colors font-medium flex items-center gap-1"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                       View all images ({selectedImages.length})
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-gray-600 p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 relative">
//               <label className="cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   disabled={selectedImages.length >= 10}
//                 />
//                 <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors">
//                   <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <span className="text-sm font-medium text-gray-300">Photo</span>
//                 </div>
//               </label>

//               <div className="relative">
//                 <button
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
//                 >
//                   <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   <span className="text-sm font-medium text-gray-300">Feeling</span>
//                 </button>

//                 <EmojiPicker
//                   isOpen={showEmojiPicker}
//                   onClose={() => setShowEmojiPicker(false)}
//                   onEmojiSelect={handleEmojiSelect}
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading || (!postText.trim() && selectedImages.length === 0)}
//               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Posting...
//                 </div>
//               ) : (
//                 "Post"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Image Modal for preview */}
//       <ImageModal
//         images={getImageUrls()}
//         currentIndex={currentImageIndex}
//         isOpen={showImageModal}
//         onClose={() => setShowImageModal(false)}
//         onIndexChange={setCurrentImageIndex}
//       />
//     </div>
//   )
// }

// export default CreatePostModal

"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import ImageModal from "./ImageModal"
import EmojiPicker from "./EmojiPicker"

const CreatePostModal = ({ isOpen, onClose, onCreatePost, loading, user }) => {
  const [mounted, setMounted] = useState(false)
  const [postText, setPostText] = useState("")
  const [selectedImages, setSelectedImages] = useState([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      if (selectedImages.length < 10) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setSelectedImages((prev) => [
            ...prev,
            {
              file,
              url: event.target?.result,
            },
          ])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!postText.trim() && selectedImages.length === 0) return

    await onCreatePost({
      content: postText,
      images: selectedImages.map((img) => img.file),
    })

    // Reset form
    setPostText("")
    setSelectedImages([])
    setShowEmojiPicker(false)
    onClose()
  }

  const handleClose = () => {
    setPostText("")
    setSelectedImages([])
    setShowEmojiPicker(false)
    onClose()
  }

  const openImageModal = (imageIndex = 0) => {
    setCurrentImageIndex(imageIndex)
    setShowImageModal(true)
  }

  const handleEmojiSelect = (emoji) => {
    setPostText((prev) => prev + emoji)
  }

  const getImageUrls = () => {
    return selectedImages.map((img) => img.url)
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[99999]">
      <div className="bg-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-600 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Create a post</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(90vh-160px)] overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold overflow-hidden">
              {user?.image ? (
                <img
                  src={user.image || "/placeholder.svg?height=48&width=48"}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
              ) : (
                <span className="text-lg">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{user?.name || "User"}</h3>
              <p className="text-sm text-indigo-300 capitalize">{user?.role || "Member"}</p>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <textarea
              placeholder="What do you want to talk about?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full min-h-[150px] bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-base leading-relaxed"
              style={{ fontSize: "16px" }}
            />
          </div>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-300 font-medium">
                    {selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""} selected
                  </span>
                  <button
                    onClick={() => setSelectedImages([])}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Remove all
                  </button>
                </div>

                {selectedImages.length === 1 ? (
                  <div className="relative group">
                    <img
                      src={selectedImages[0].url || "/placeholder.svg"}
                      alt="Selected image"
                      className="w-full max-h-64 object-cover rounded-lg cursor-pointer"
                      onClick={() => openImageModal(0)}
                    />
                    <button
                      onClick={() => removeImage(0)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedImages[0].url || "/placeholder.svg"}
                      alt="Selected image 1"
                      className="w-full h-48 object-cover rounded-lg cursor-pointer"
                      onClick={() => openImageModal(0)}
                    />
                    {selectedImages.length > 1 && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
                        onClick={() => openImageModal(0)}
                      >
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold mb-1">+{selectedImages.length - 1}</div>
                          <div className="text-white text-sm font-medium">
                            more {selectedImages.length - 1 === 1 ? "image" : "images"}
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => openImageModal(0)}
                      className="mt-2 text-indigo-300 hover:text-indigo-200 text-sm transition-colors font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      View all images ({selectedImages.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 relative">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={selectedImages.length >= 10}
                />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-300">Photo</span>
                </div>
              </label>

              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-300">Feeling</span>
                </button>

                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (!postText.trim() && selectedImages.length === 0)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={getImageUrls()}
        currentIndex={currentImageIndex}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onIndexChange={setCurrentImageIndex}
      />
    </div>,
    document.body
  )
}

export default CreatePostModal
