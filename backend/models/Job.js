const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "Remote",
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      default: "Full-time",
    },
    description: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      trim: true,
    },
    applicationLink: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["Internal", "LinkedIn", "Unstop", "Other"],
      default: "Internal",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
    postedBy: {
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
  },
  {
    timestamps: true,
  },
)

// Add text index for search functionality
jobSchema.index({ title: "text", company: "text", description: "text" })

const Job = mongoose.model("Job", jobSchema)

module.exports = Job
