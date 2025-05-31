// const mongoose = require("mongoose")
// const Schema = mongoose.Schema

// const FollowSchema = new Schema(
//   {
//     follower: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     following: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "accepted", "rejected"],
//       default: "pending",
//     },
//   },
//   { timestamps: true },
// )

// // Compound index to ensure a user can only follow another user once
// FollowSchema.index({ follower: 1, following: 1 }, { unique: true })

// module.exports = mongoose.model("Follow", FollowSchema)


const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FollowSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create a compound index to ensure a user can only follow another user once
FollowSchema.index({ follower: 1, following: 1 }, { unique: true })

module.exports = mongoose.model("Follow", FollowSchema)
