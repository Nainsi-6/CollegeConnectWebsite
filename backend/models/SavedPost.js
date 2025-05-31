const mongoose = require("mongoose")

const savedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure a user can't save the same post twice
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true })

module.exports = mongoose.model("SavedPost", savedPostSchema)
