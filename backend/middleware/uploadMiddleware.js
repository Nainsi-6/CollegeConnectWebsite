const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Ensure upload directories exist
const createDirIfNotExists = (dirPath) => {
  // Create the full path to the directory
  const fullPath = path.join(__dirname, "..", "public", dirPath)

  // Check if directory exists, if not create it
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`Created directory: ${fullPath}`)
  }
}

// Create upload directories
createDirIfNotExists("uploads/profile")
createDirIfNotExists("uploads/cover")

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the upload path based on the field name
    let uploadPath = "public/uploads/"

    if (file.fieldname === "profilePhoto") {
      uploadPath += "profile"
    } else if (file.fieldname === "coverPhoto") {
      uploadPath += "cover"
    }

    console.log(`Uploading ${file.fieldname} to ${uploadPath}`)
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp and random number
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const filename = file.fieldname + "-" + uniqueSuffix + ext

    console.log(`Generated filename: ${filename}`)
    cb(null, filename)
  },
})

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

// Create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

module.exports = upload


