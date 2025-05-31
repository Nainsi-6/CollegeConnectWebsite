"use client"

const PostImageDisplay = ({ images, onImageClick, onViewAllClick,size}) => {
     const imageSize = size === "small" ? "w-10 h-10" : "w-24 h-24"; // Adjust size here
  if (!images || images.length === 0) return null

  // Single image display
  if (images.length === 1) {
    return (
      <div className="mt-3">
        <div className="relative">
          <img
            src={images[0] || "/placeholder.svg?height=400&width=600"}
            alt="Post image"
            className="rounded-lg w-full max-h-72 object-cover cursor-pointer hover:opacity-95 transition-opacity shadow-md px-2"
            onClick={() => onImageClick(0)}
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=400&width=600"
            }}
          />
        </div>
      </div>
    )
  }

  // Multiple images display
  return (
    <div className="mt-3">
      <div className="relative">
        {/* Main image with overlay */}
     {/* Main image with overlay */}
<img
  src={images[0] || "/placeholder.svg?height=300&width=600"}
  alt="Post image 1"
  className="rounded-lg w-full h-72 object-cover cursor-pointer hover:opacity-95 transition-opacity shadow-md px-2"
  onClick={() => onImageClick(0)}
  onError={(e) => {
    e.target.src = "/placeholder.svg?height=300&width=600"
  }}
/>


        {/* Overlay for additional images */}
        {images.length > 1 && (
          <div
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
            onClick={() => onImageClick(0)}
          >
            <div className="text-center">
              <div className="text-white text-3xl font-bold mb-1">+{images.length - 1}</div>
              <div className="text-white text-sm font-medium">more {images.length - 1 === 1 ? "image" : "images"}</div>
            </div>
          </div>
        )}
      </div>

      {/* View all images button */}
      <button
        type="button"
        onClick={() => onViewAllClick(0)}
        className="mt-2 text-indigo-300 hover:text-indigo-200 text-sm transition-colors font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        View all images ({images.length})
      </button>
    </div>
  )
}

export default PostImageDisplay
