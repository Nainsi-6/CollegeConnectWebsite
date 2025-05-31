const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
})

const postSchema = new mongoose.Schema({
  title: String,
  content: { type: String, required: false }, // Changed from required: true to required: false
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  images: [String],
})

// Add a pre-save validation to ensure either content or images exist
postSchema.pre("save", function (next) {
  // If content is empty/null but there are images, that's valid
  if ((!this.content || this.content.trim() === "") && (!this.images || this.images.length === 0)) {
    return next(new Error("Post must have either content or images"))
  }
  next()
})

module.exports = mongoose.model("Post", postSchema)


