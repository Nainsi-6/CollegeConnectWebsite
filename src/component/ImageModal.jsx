"use client"
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa"
import { useEffect } from "react"

const ImageModal = ({ images, currentIndex, isOpen, onClose, onIndexChange }) => {
    
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen])
    
  if (!isOpen || !images || images.length === 0) return null

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    onIndexChange(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    onIndexChange(newIndex)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose()
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = images[currentIndex]
    link.download = `image-${currentIndex + 1}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center"
      style={{ zIndex: 999999999 }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
          style={{ zIndex: 9999999999 }}
        >
          <FaTimes size={20} />
        </button>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-4 right-16 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
          style={{ zIndex: 9999999999 }}
        >
          <FaDownload size={20} />
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3 transition-colors"
              style={{ zIndex: 9999999999 }}
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3 transition-colors"
              style={{ zIndex: 9999999999 }}
            >
              <FaChevronRight size={24} />
            </button>
          </>
        )}

        {/* Main image container */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={images[currentIndex] || "/placeholder.svg?height=600&width=800"}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=600&width=800"
            }}
          />
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4 py-2 bg-black bg-opacity-50 rounded-lg">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                  index === currentIndex ? "border-white scale-110" : "border-gray-500 hover:border-gray-300"
                }`}
              >
                <img
                  src={img || "/placeholder.svg?height=48&width=48"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageModal