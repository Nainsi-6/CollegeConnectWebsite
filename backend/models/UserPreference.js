const mongoose = require("mongoose")

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    jobPreferences: {
      roles: {
        type: [String],
        default: [],
      },
      skills: {
        type: [String],
        default: [],
      },
      locations: {
        type: [String],
        default: [],
      },
      jobTypes: {
        type: [String],
        default: [],
      },
      industries: {
        type: [String],
        default: [],
      },
      salaryRange: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 0,
        },
      },
    },
    eventPreferences: {
      categories: {
        type: [String],
        default: [],
      },
      formats: {
        type: [String],
        default: [],
      },
      interests: {
        type: [String],
        default: [],
      },
    },
    viewedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    viewedEvents: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attendedEvents: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema)

module.exports = UserPreference
