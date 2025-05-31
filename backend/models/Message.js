const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // CRITICAL: Add images field for image attachments
  images: [String],
  read: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reportReason: {
    type: String,
  },
  forwardedPost: {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    originalContent: String,
    images: [String],
    author: String,
    postLink: String,
    isClickable: Boolean,
    verified: Boolean,
    createdAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  lastMessageText: {
    type: String,
  },
  lastMessageDate: {
    type: Date,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
messageSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

conversationSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const Message = mongoose.model("Message", messageSchema)
const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = { Message, Conversation }

