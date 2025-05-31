"use client"

const ProfilePhoto = ({ src, alt, size = "md", className = "", onClick }) => {
  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20",
    "3xl": "h-44 w-44",
  }

  // Default image if src is not provided or fails to load
  const DEFAULT_PROFILE_IMAGE = "https://tse2.mm.bing.net/th?id=OIP.T60Aago6tLDepIF5alRigwHaHa&pid=Api&P=0&h=180"

  // Process the src URL to ensure it's complete
  const processedSrc = src ? (src.startsWith("http") ? src : `http://localhost:5005${src}`) : DEFAULT_PROFILE_IMAGE

  return (
    <img
      src={processedSrc || "/placeholder.svg"}
      alt={alt || "Profile"}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      onError={(e) => {
        e.target.onerror = null
        e.target.src = DEFAULT_PROFILE_IMAGE
      }}
    />
  )
}

export default ProfilePhoto
