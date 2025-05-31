const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const { authMiddleware } = require("../middleware/authMiddleware")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads/messages")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"public/uploads/messages/"
)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "message-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Apply auth middleware to all routes
router.use(authMiddleware)

// IMPORTANT: Specific routes must come BEFORE parameterized routes
// Get archived conversations
router.get("/conversations/archived", messageController.getArchivedConversations)

// Get blocked conversations
router.get("/conversations/blocked", messageController.getBlockedConversations)

// Get unread count for all conversations
router.get("/unread-count", messageController.getUnreadCount)

// Get all conversations for the current user
router.get("/conversations", messageController.getConversations)

// Delete a conversation and all its messages
router.delete("/conversations/:conversationId", messageController.deleteConversation)

// Get unread messages for a specific conversation
router.get("/conversations/:conversationId/unread", messageController.getUnreadMessages)

// Get messages for a specific conversation (must come AFTER specific routes)
router.get("/conversations/:conversationId", messageController.getMessages)

// Send a message with images - THIS IS THE CRITICAL ROUTE
router.post("/with-images", upload.array("images", 5), messageController.sendMessageWithImages)

// Send a message (original route)
router.post("/", messageController.sendMessage)

// Forward a post in message
router.post("/forward-post", messageController.forwardPost)

// Delete a message
router.delete("/:messageId", messageController.deleteMessage)

// Report a message
router.post("/report/:messageId", messageController.reportMessage)

// Archive a conversation
router.post("/archive/:conversationId", messageController.archiveConversation)

// Unarchive a conversation
router.post("/unarchive/:conversationId", messageController.unarchiveConversation)

// Block a conversation
router.post("/block/:conversationId", messageController.blockConversation)

// Unblock a conversation
router.post("/unblock/:conversationId", messageController.unblockConversation)

// Mark messages as delivered
router.post("/delivered/:conversationId", messageController.markAsDelivered)

module.exports = router
