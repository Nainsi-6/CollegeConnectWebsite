const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ConnectionSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Create a compound index to ensure unique connections between users
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true })

module.exports = mongoose.model("Connection", ConnectionSchema)

