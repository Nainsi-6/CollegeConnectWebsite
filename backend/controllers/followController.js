const Follow = require("../models/Follow")
const Profile = require("../models/Profile").Profile
const User = require("../models/User")
const mongoose = require("mongoose")

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user._id
    const followingId = req.params.userId

    // Check if user is trying to follow themselves
    if (followerId.toString() === followingId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      })
    }

    // Check if the user to follow exists
    const userToFollow = await User.findById(followingId)
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found",
      })
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    })

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user",
      })
    }

    // Create follow relationship
    const follow = new Follow({
      follower: followerId,
      following: followingId,
    })

    await follow.save()

    // Update follower's following count
    await Profile.findOneAndUpdate({ userId: followerId }, { $inc: { "stats.following": 1 } })

    // Update followed user's followers count
    await Profile.findOneAndUpdate({ userId: followingId }, { $inc: { "stats.followers": 1 } })

    res.status(200).json({
      success: true,
      message: "Successfully followed user",
    })
  } catch (error) {
    console.error("Error following user:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user._id
    const followingId = req.params.userId

    // Check if the follow relationship exists
    const follow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    })

    if (!follow) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user",
      })
    }

    // Delete the follow relationship
    await follow.deleteOne()

    // Update follower's following count
    await Profile.findOneAndUpdate({ userId: followerId }, { $inc: { "stats.following": -1 } })

    // Update followed user's followers count
    await Profile.findOneAndUpdate({ userId: followingId }, { $inc: { "stats.followers": -1 } })

    res.status(200).json({
      success: true,
      message: "Successfully unfollowed user",
    })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId

    // Find all follow documents where the user is being followed
    const follows = await Follow.find({ following: userId }).populate({
      path: "follower",
      select: "name email role",
    })

    // Get profiles for each follower
    const followerProfiles = await Promise.all(
      follows.map(async (follow) => {
        const profile = await Profile.findOne({ userId: follow.follower._id }).lean()

        // Prepare response with user info and profile details
        const followerInfo = {
          _id: follow.follower._id,
          name: follow.follower.name,
          email: follow.follower.email,
          role: follow.follower.role,
        }

        // Add profile photo if available
        if (profile && profile.profilePhoto) {
          const filename = require("path").basename(profile.profilePhoto)
          followerInfo.profilePhotoUrl = `/uploads/profile/${filename}`
        }

        return followerInfo
      }),
    )

    res.status(200).json({
      success: true,
      followers: followerProfiles,
    })
  } catch (error) {
    console.error("Error getting followers:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get users that a user is following
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId

    // Find all follow documents where the user is following others
    const follows = await Follow.find({ follower: userId }).populate({
      path: "following",
      select: "name email role",
    })

    // Get profiles for each followed user
    const followingProfiles = await Promise.all(
      follows.map(async (follow) => {
        const profile = await Profile.findOne({ userId: follow.following._id }).lean()

        // Prepare response with user info and profile details
        const followingInfo = {
          _id: follow.following._id,
          name: follow.following.name,
          email: follow.following.email,
          role: follow.following.role,
        }

        // Add profile photo if available
        if (profile && profile.profilePhoto) {
          const filename = require("path").basename(profile.profilePhoto)
          followingInfo.profilePhotoUrl = `/uploads/profile/${filename}`
        }

        return followingInfo
      }),
    )

    res.status(200).json({
      success: true,
      following: followingProfiles,
    })
  } catch (error) {
    console.error("Error getting following:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Check if a user is following another user
exports.checkFollowStatus = async (req, res) => {
  try {
    const followerId = req.user._id
    const followingId = req.params.userId

    const follow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    })

    res.status(200).json({
      success: true,
      isFollowing: !!follow,
    })
  } catch (error) {
    console.error("Error checking follow status:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


// const Follow = require("../models/Follow")
// const Profile = require("../models/Profile").Profile
// const User = require("../models/User")
// const mongoose = require("mongoose")

// // Follow a user
// exports.followUser = async (req, res) => {
//   try {
//     const followerId = req.user._id
//     const followingId = req.params.userId

//     // Check if user is trying to follow themselves
//     if (followerId.toString() === followingId.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: "You cannot follow yourself",
//       })
//     }

//     // Check if the user to follow exists
//     const userToFollow = await User.findById(followingId)
//     if (!userToFollow) {
//       return res.status(404).json({
//         success: false,
//         message: "User to follow not found",
//       })
//     }

//     // Check if already following
//     const existingFollow = await Follow.findOne({
//       follower: followerId,
//       following: followingId,
//     })

//     if (existingFollow) {
//       return res.status(400).json({
//         success: false,
//         message: "You are already following this user or have a pending request",
//         status: existingFollow.status,
//       })
//     }

//     // Create follow relationship
//     const follow = new Follow({
//       follower: followerId,
//       following: followingId,
//       status: "pending", // Add status field for connection requests
//     })

//     await follow.save()

//     res.status(200).json({
//       success: true,
//       message: "Connection request sent",
//       follow,
//     })
//   } catch (error) {
//     console.error("Error following user:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Unfollow a user
// exports.unfollowUser = async (req, res) => {
//   try {
//     const followerId = req.user._id
//     const followingId = req.params.userId

//     // Check if the follow relationship exists
//     const follow = await Follow.findOne({
//       follower: followerId,
//       following: followingId,
//     })

//     if (!follow) {
//       return res.status(400).json({
//         success: false,
//         message: "You are not following this user",
//       })
//     }

//     // Delete the follow relationship
//     await follow.deleteOne()

//     // Only update counts if the status was accepted
//     if (follow.status === "accepted") {
//       // Update follower's following count
//       await Profile.findOneAndUpdate({ userId: followerId }, { $inc: { "stats.following": -1 } })

//       // Update followed user's followers count
//       await Profile.findOneAndUpdate({ userId: followingId }, { $inc: { "stats.followers": -1 } })
//     }

//     res.status(200).json({
//       success: true,
//       message: "Successfully unfollowed user",
//     })
//   } catch (error) {
//     console.error("Error unfollowing user:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get followers of a user
// exports.getFollowers = async (req, res) => {
//   try {
//     const userId = req.params.userId

//     // Find all follow documents where the user is being followed with accepted status
//     const follows = await Follow.find({
//       following: userId,
//       status: "accepted",
//     }).populate({
//       path: "follower",
//       select: "name email role",
//     })

//     // Get profiles for each follower
//     const followerProfiles = await Promise.all(
//       follows.map(async (follow) => {
//         const profile = await Profile.findOne({ userId: follow.follower._id }).lean()

//         // Prepare response with user info and profile details
//         const followerInfo = {
//           _id: follow.follower._id,
//           name: follow.follower.name,
//           email: follow.follower.email,
//           role: follow.follower.role,
//         }

//         // Add profile photo if available
//         if (profile && profile.profilePhoto) {
//           const filename = profile.profilePhoto.split("/").pop()
//           followerInfo.profilePhotoUrl = `/uploads/profile/${filename}`
//         } else {
//           followerInfo.profilePhotoUrl = "/default-profile.jpg"
//         }

//         return followerInfo
//       }),
//     )

//     res.status(200).json({
//       success: true,
//       followers: followerProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting followers:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get users that a user is following
// exports.getFollowing = async (req, res) => {
//   try {
//     const userId = req.params.userId

//     // Find all follow documents where the user is following others with accepted status
//     const follows = await Follow.find({
//       follower: userId,
//       status: "accepted",
//     }).populate({
//       path: "following",
//       select: "name email role",
//     })

//     // Get profiles for each followed user
//     const followingProfiles = await Promise.all(
//       follows.map(async (follow) => {
//         const profile = await Profile.findOne({ userId: follow.following._id }).lean()

//         // Prepare response with user info and profile details
//         const followingInfo = {
//           _id: follow.following._id,
//           name: follow.following.name,
//           email: follow.following.email,
//           role: follow.following.role,
//         }

//         // Add profile photo if available
//         if (profile && profile.profilePhoto) {
//           const filename = profile.profilePhoto.split("/").pop()
//           followingInfo.profilePhotoUrl = `/uploads/profile/${filename}`
//         } else {
//           followingInfo.profilePhotoUrl = "/default-profile.jpg"
//         }

//         return followingInfo
//       }),
//     )

//     res.status(200).json({
//       success: true,
//       following: followingProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting following:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Check if a user is following another user
// exports.checkFollowStatus = async (req, res) => {
//   try {
//     const followerId = req.user._id
//     const followingId = req.params.userId

//     const follow = await Follow.findOne({
//       follower: followerId,
//       following: followingId,
//     })

//     res.status(200).json({
//       success: true,
//       isFollowing: follow ? follow.status === "accepted" : false,
//       status: follow ? follow.status : null,
//     })
//   } catch (error) {
//     console.error("Error checking follow status:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get pending connection requests
// exports.getPendingRequests = async (req, res) => {
//   try {
//     const userId = req.user._id
//     console.log("Fetching pending requests for user:", userId)

//     // Find pending follow requests where current user is the target
//     const requests = await Follow.find({
//       following: userId,
//       status: "pending",
//     }).populate({
//       path: "follower",
//       select: "_id name email role department",
//     })

//     console.log("Raw pending requests found:", requests)

//     // Get profiles for the requesters
//     const requesterIds = requests.map((req) => req.follower._id)
//     const profiles = await Profile.find({ userId: { $in: requesterIds } }).select("userId profilePhoto")

//     console.log("Profiles found for requesters:", profiles)

//     // Map profiles to requests
//     const requestsWithProfiles = requests.map((request) => {
//       const requestObj = request.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === request.follower._id.toString())

//       // Make sure we're handling the path correctly
//       const profilePhotoPath = profile?.profilePhoto || ""
//       const profilePhotoUrl = profilePhotoPath
//         ? `/uploads/profile/${profilePhotoPath.split("/").pop()}`
//         : "/default-profile.jpg"

//       return {
//         ...requestObj,
//         follower: {
//           ...requestObj.follower,
//           profilePhoto: profilePhotoPath,
//           profilePhotoUrl: profilePhotoUrl,
//         },
//       }
//     })

//     console.log("Sending connection requests with profiles:", requestsWithProfiles)

//     res.status(200).json({
//       success: true,
//       requests: requestsWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting pending requests:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Respond to a follow request (accept or reject)
// exports.respondToRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params
//     const { action } = req.body
//     const currentUserId = req.user._id

//     console.log(`Responding to request ${requestId} with action: ${action}`)

//     if (!["accept", "reject"].includes(action)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid action. Must be 'accept' or 'reject'",
//       })
//     }

//     // Find the follow request
//     const followRequest = await Follow.findById(requestId)

//     if (!followRequest) {
//       return res.status(404).json({
//         success: false,
//         message: "Follow request not found",
//       })
//     }

//     // Verify the current user is the target of the follow request
//     if (followRequest.following.toString() !== currentUserId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized to respond to this request",
//       })
//     }

//     // Update the status based on the action
//     followRequest.status = action === "accept" ? "accepted" : "rejected"
//     await followRequest.save()

//     // If accepted, update follower and following counts in profiles
//     if (action === "accept") {
//       await Profile.findOneAndUpdate({ userId: followRequest.following }, { $inc: { "stats.followers": 1 } })
//       await Profile.findOneAndUpdate({ userId: followRequest.follower }, { $inc: { "stats.following": 1 } })
//     }

//     res.status(200).json({
//       success: true,
//       message: `Follow request ${action}ed`,
//       followRequest,
//     })
//   } catch (error) {
//     console.error(`Error responding to follow request:`, error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }
