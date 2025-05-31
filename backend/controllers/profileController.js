const { Profile, StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile")
const User = require("../models/User")
const fs = require("fs")
const path = require("path")

// Get profile by user ID
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id

    console.log(`Fetching profile for user ID: ${userId}`)

    // Find profile
    const profile = await Profile.findOne({ userId }).lean()

    if (!profile) {
      // If no profile exists yet, return basic user info
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      console.log(`No profile found, returning basic user info for: ${user.name}`)
      return res.status(200).json({
        success: true,
        profile: {
          name: user.name,
          email: user.email,
          role: user.role,
          stats: { followers: 0, following: 0, posts: 0 },
        },
      })
    }

    // Add full URLs for profile and cover photos
    if (profile.profilePhoto) {
      profile.profilePhotoUrl = `/uploads/profile/${path.basename(profile.profilePhoto)}`
      console.log(`Profile photo URL: ${profile.profilePhotoUrl}`)
    }

    if (profile.coverPhoto) {
      profile.coverPhotoUrl = `/uploads/cover/${path.basename(profile.coverPhoto)}`
      console.log(`Cover photo URL: ${profile.coverPhotoUrl}`)
    }

    res.status(200).json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Create or update profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("Update profile request received")
    console.log("Files:", req.files ? Object.keys(req.files) : "No files")
    console.log("Body fields:", Object.keys(req.body))

    const userId = req.user._id

    // Get user to determine role
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Common profile data
    const profileData = {
      userId,
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      role: user.role,
      about: req.body.about || "",
    }

    // Handle skills - ensure it's an array
    if (req.body.skills) {
      if (typeof req.body.skills === "string") {
        profileData.skills = req.body.skills.split(",").map((skill) => skill.trim())
      } else if (Array.isArray(req.body.skills)) {
        profileData.skills = req.body.skills
      }
    }

    // Find existing profile to get old photo paths
    const existingProfile = await Profile.findOne({ userId })

    // Handle file uploads
    if (req.files) {
      console.log("Processing uploaded files:", req.files)

      // Handle profile photo upload
      if (req.files.profilePhoto && req.files.profilePhoto.length > 0) {
        const profilePhotoFile = req.files.profilePhoto[0]
        console.log("Profile photo file:", profilePhotoFile)

        // Store only the filename in the database
        profileData.profilePhoto = profilePhotoFile.filename
        console.log("New profile photo saved as:", profileData.profilePhoto)

        // Delete old profile photo if it exists
        if (existingProfile && existingProfile.profilePhoto) {
          try {
            const oldPath = path.join(__dirname, "..", "public", "uploads", "profile", existingProfile.profilePhoto)
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath)
              console.log(`Deleted old profile photo: ${oldPath}`)
            }
          } catch (err) {
            console.error("Error deleting old profile photo:", err)
          }
        }
      } else if (existingProfile && existingProfile.profilePhoto) {
        // Keep existing profile photo if no new one is uploaded
        profileData.profilePhoto = existingProfile.profilePhoto
      }

      // Handle cover photo upload
      if (req.files.coverPhoto && req.files.coverPhoto.length > 0) {
        const coverPhotoFile = req.files.coverPhoto[0]
        console.log("Cover photo file:", coverPhotoFile)

        // Store only the filename in the database
        profileData.coverPhoto = coverPhotoFile.filename
        console.log("New cover photo saved as:", profileData.coverPhoto)

        // Delete old cover photo if it exists
        if (existingProfile && existingProfile.coverPhoto) {
          try {
            const oldPath = path.join(__dirname, "..", "public", "uploads", "cover", existingProfile.coverPhoto)
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath)
              console.log(`Deleted old cover photo: ${oldPath}`)
            }
          } catch (err) {
            console.error("Error deleting old cover photo:", err)
          }
        }
      } else if (existingProfile && existingProfile.coverPhoto) {
        // Keep existing cover photo if no new one is uploaded
        profileData.coverPhoto = existingProfile.coverPhoto
      }
    } else if (existingProfile) {
      // If no files are uploaded, keep existing photos
      if (existingProfile.profilePhoto) {
        profileData.profilePhoto = existingProfile.profilePhoto
      }
      if (existingProfile.coverPhoto) {
        profileData.coverPhoto = existingProfile.coverPhoto
      }
    }

    // Role-specific data
    let roleSpecificData = {}

    switch (user.role) {
      case "student":
        roleSpecificData = {
          branch: req.body.branch || "",
          yearOfStudy: req.body.yearOfStudy || "",
          resumeLink: req.body.resumeLink || "",
        }
        break
      case "faculty":
        roleSpecificData = {
          department: req.body.department || "",
          designation: req.body.designation || "",
        }

        // Handle research interests
        if (req.body.researchInterests) {
          if (typeof req.body.researchInterests === "string") {
            roleSpecificData.researchInterests = req.body.researchInterests
              .split(",")
              .map((interest) => interest.trim())
          } else if (Array.isArray(req.body.researchInterests)) {
            roleSpecificData.researchInterests = req.body.researchInterests
          }
        } else {
          roleSpecificData.researchInterests = []
        }
        break
      case "alumni":
        roleSpecificData = {
          currentJobTitle: req.body.currentJobTitle || "",
          company: req.body.company || "",
          graduationYear: req.body.graduationYear || "",
          linkedinProfile: req.body.linkedinProfile || "",
        }
        break
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user role",
        })
    }

    // Combine common and role-specific data
    const updatedData = { ...profileData, ...roleSpecificData }
    console.log("Updated profile data:", updatedData)

    // Find and update or create profile
    let profile

    if (existingProfile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate({ userId }, { $set: updatedData }, { new: true })
      console.log("Updated existing profile")
    } else {
      // Create new profile based on role
      const ProfileModel =
        user.role === "student" ? StudentProfile : user.role === "faculty" ? FacultyProfile : AlumniProfile

      profile = await ProfileModel.create(updatedData)
      console.log("Created new profile")
    }

    // Add full URLs for profile and cover photos in the response
    const responseProfile = profile.toObject()

    if (profile.profilePhoto) {
      responseProfile.profilePhotoUrl = `/uploads/profile/${profile.profilePhoto}`
      console.log("Response profile photo URL:", responseProfile.profilePhotoUrl)
    }

    if (profile.coverPhoto) {
      responseProfile.coverPhotoUrl = `/uploads/cover/${profile.coverPhoto}`
      console.log("Response cover photo URL:", responseProfile.coverPhotoUrl)
    }

    res.status(200).json({
      success: true,
      profile: responseProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get profile by post author ID
exports.getPostAuthorProfile = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Find profile
    const profile = await Profile.findOne({ userId }).lean()

    if (!profile) {
      // If no profile exists yet, return basic user info
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      return res.status(200).json({
        success: true,
        profile: {
          name: user.name,
          email: user.email,
          role: user.role,
          stats: { followers: 0, following: 0, posts: 0 },
        },
      })
    }

    // Add full URLs for profile and cover photos
    if (profile.profilePhoto) {
      profile.profilePhotoUrl = `/uploads/profile/${profile.profilePhoto}`
    }

    if (profile.coverPhoto) {
      profile.coverPhotoUrl = `/uploads/cover/${profile.coverPhoto}`
    }

    res.status(200).json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("Error fetching post author profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
