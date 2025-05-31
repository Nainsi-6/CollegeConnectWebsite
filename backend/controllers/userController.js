// const User = require("../models/User")
// const { Profile } = require("../models/Profile")
// const Follow = require("../models/Follow")

// // Search users
// exports.searchUsers = async (req, res) => {
//   try {
//     const { query } = req.query
//     const currentUserId = req.user._id

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: "Search query is required",
//       })
//     }

//     // Search for users by name or email, excluding the current user
//     const users = await User.find({
//       $and: [
//         { _id: { $ne: currentUserId } },
//         {
//           $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
//         },
//       ],
//     }).select("_id name email role batch regNumber facultyId department company passedOutBatch")

//     // Get profiles for the users
//     const userIds = users.map((user) => user._id)
//     const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto role")

//     // Map profiles to users
//     const usersWithProfiles = users.map((user) => {
//       const userObj = user.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === user._id.toString())

//       return {
//         ...userObj,
//         profilePhoto: profile?.profilePhoto || "",
//         profilePhotoUrl: profile?.profilePhoto
//           ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//           : "/default-profile.jpg",
//       }
//     })

//     res.status(200).json({
//       success: true,
//       users: usersWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error searching users:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get suggested users
// exports.getSuggestedUsers = async (req, res) => {
//   try {
//     const currentUserId = req.user._id
//     const currentUser = await User.findById(currentUserId)

//     // Find users with the same role or department/batch
//     const query = { _id: { $ne: currentUserId } }

//     if (currentUser.role === "student") {
//       // For students, suggest other students in the same batch or faculty in their department
//       query.$or = [
//         { role: "student", batch: currentUser.batch },
//         { role: "faculty", department: currentUser.department },
//         { role: "alumni", passedOutBatch: currentUser.batch },
//       ]
//     } else if (currentUser.role === "faculty") {
//       // For faculty, suggest other faculty in the same department or students in their department
//       query.$or = [
//         { role: "faculty", department: currentUser.department },
//         { role: "student", department: currentUser.department },
//       ]
//     } else if (currentUser.role === "alumni") {
//       // For alumni, suggest other alumni from the same batch or company
//       query.$or = [
//         { role: "alumni", passedOutBatch: currentUser.passedOutBatch },
//         { role: "alumni", company: currentUser.company },
//         { role: "student", batch: currentUser.passedOutBatch },
//       ]
//     }

//     // Get users who are not already being followed
//     const following = await Follow.find({ follower: currentUserId }).select("following")
//     const followingIds = following.map((f) => f.following)

//     if (followingIds.length > 0) {
//       query._id.$nin = followingIds
//     }

//     // Limit to 10 suggested users
//     const users = await User.find(query)
//       .select("_id name email role batch regNumber facultyId department company passedOutBatch")
//       .limit(10)

//     // Get profiles for the users
//     const userIds = users.map((user) => user._id)
//     const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto")

//     // Map profiles to users
//     const usersWithProfiles = users.map((user) => {
//       const userObj = user.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === user._id.toString())

//       return {
//         ...userObj,
//         profilePhoto: profile?.profilePhoto || "",
//         profilePhotoUrl: profile?.profilePhoto
//           ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//           : "/default-profile.jpg",
//       }
//     })

//     res.status(200).json({
//       success: true,
//       users: usersWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting suggested users:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get connection requests
// exports.getConnectionRequests = async (req, res) => {
//   try {
//     const currentUserId = req.user._id

//     // Find pending follow requests where current user is the target
//     const requests = await Follow.find({
//       following: currentUserId,
//       status: "pending",
//     }).populate({
//       path: "follower",
//       select: "_id name email role",
//     })

//     // Get profiles for the requesters
//     const requesterIds = requests.map((req) => req.follower._id)
//     const profiles = await Profile.find({ userId: { $in: requesterIds } }).select("userId profilePhoto")

//     // Map profiles to requests
//     const requestsWithProfiles = requests.map((request) => {
//       const requestObj = request.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === request.follower._id.toString())

//       return {
//         ...requestObj,
//         follower: {
//           ...requestObj.follower,
//           profilePhoto: profile?.profilePhoto || "",
//           profilePhotoUrl: profile?.profilePhoto
//             ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//             : "/default-profile.jpg",
//         },
//       }
//     })

//     res.status(200).json({
//       success: true,
//       requests: requestsWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting connection requests:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Follow a user
// exports.followUser = async (req, res) => {
//   try {
//     const { userId } = req.params
//     const currentUserId = req.user._id

//     // Check if user exists
//     const userToFollow = await User.findById(userId)
//     if (!userToFollow) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Check if already following
//     const existingFollow = await Follow.findOne({
//       follower: currentUserId,
//       following: userId,
//     })

//     if (existingFollow) {
//       return res.status(400).json({
//         success: false,
//         message: "Already following or request pending",
//       })
//     }

//     // Create new follow request
//     const follow = new Follow({
//       follower: currentUserId,
//       following: userId,
//       status: "pending",
//     })

//     await follow.save()

//     res.status(200).json({
//       success: true,
//       message: "Follow request sent",
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

// // Accept or reject a follow request
// exports.respondToFollowRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params
//     const { action } = req.body
//     const currentUserId = req.user._id

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

// // Get following and followers
// exports.getConnections = async (req, res) => {
//   try {
//     const userId = req.params.userId || req.user._id

//     // Get followers (users who follow the specified user)
//     const followers = await Follow.find({
//       following: userId,
//       status: "accepted",
//     }).populate({
//       path: "follower",
//       select: "_id name email role",
//     })

//     // Get following (users the specified user follows)
//     const following = await Follow.find({
//       follower: userId,
//       status: "accepted",
//     }).populate({
//       path: "following",
//       select: "_id name email role",
//     })

//     // Get profiles for followers and following
//     const followerIds = followers.map((f) => f.follower._id)
//     const followingIds = following.map((f) => f.following._id)
//     const allUserIds = [...new Set([...followerIds, ...followingIds])]

//     const profiles = await Profile.find({ userId: { $in: allUserIds } }).select("userId profilePhoto")

//     // Map profiles to followers
//     const followersWithProfiles = followers.map((follow) => {
//       const followObj = follow.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === follow.follower._id.toString())

//       return {
//         ...followObj,
//         follower: {
//           ...followObj.follower,
//           profilePhoto: profile?.profilePhoto || "",
//           profilePhotoUrl: profile?.profilePhoto
//             ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//             : "/default-profile.jpg",
//         },
//       }
//     })

//     // Map profiles to following
//     const followingWithProfiles = following.map((follow) => {
//       const followObj = follow.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === follow.following._id.toString())

//       return {
//         ...followObj,
//         following: {
//           ...followObj.following,
//           profilePhoto: profile?.profilePhoto || "",
//           profilePhotoUrl: profile?.profilePhoto
//             ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//             : "/default-profile.jpg",
//         },
//       }
//     })

//     res.status(200).json({
//       success: true,
//       followers: followersWithProfiles,
//       following: followingWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting connections:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }


// 


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// 

// 99999999999999999999999999999999999999999999999999999999999

// const User = require("../models/User")
// const { Profile } = require("../models/Profile")
// const Follow = require("../models/Follow")

// // Search users
// exports.searchUsers = async (req, res) => {
//   try {
//     const { query } = req.query
//     const currentUserId = req.user._id

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: "Search query is required",
//       })
//     }

//     // Search for users by name or email, excluding the current user
//     const users = await User.find({
//       $and: [
//         { _id: { $ne: currentUserId } },
//         {
//           $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
//         },
//       ],
//     }).select("_id name email role batch regNumber facultyId department company passedOutBatch")

//     // Get profiles for the users
//     const userIds = users.map((user) => user._id)
//     const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto role")

//     // Map profiles to users
//     const usersWithProfiles = users.map((user) => {
//       const userObj = user.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === user._id.toString())

//       return {
//         ...userObj,
//         profilePhoto: profile?.profilePhoto || "",
//         profilePhotoUrl: profile?.profilePhoto
//           ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//           : "/default-profile.jpg",
//       }
//     })

//     res.status(200).json({
//       success: true,
//       users: usersWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error searching users:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get suggested users
// exports.getSuggestedUsers = async (req, res) => {
//   try {
//     const currentUserId = req.user._id
//     const currentUser = await User.findById(currentUserId)

//     // Find users with the same role or department/batch
//     const query = { _id: { $ne: currentUserId } }

//     if (currentUser.role === "student") {
//       // For students, suggest other students in the same batch or faculty in their department
//       query.$or = [
//         { role: "student", batch: currentUser.batch },
//         { role: "faculty", department: currentUser.department },
//         { role: "alumni", passedOutBatch: currentUser.batch },
//       ]
//     } else if (currentUser.role === "faculty") {
//       // For faculty, suggest other faculty in the same department or students in their department
//       query.$or = [
//         { role: "faculty", department: currentUser.department },
//         { role: "student", department: currentUser.department },
//       ]
//     } else if (currentUser.role === "alumni") {
//       // For alumni, suggest other alumni from the same batch or company
//       query.$or = [
//         { role: "alumni", passedOutBatch: currentUser.passedOutBatch },
//         { role: "alumni", company: currentUser.company },
//         { role: "student", batch: currentUser.passedOutBatch },
//       ]
//     }

//     // Get users who are not already being followed
//     const following = await Follow.find({ follower: currentUserId }).select("following")
//     const followingIds = following.map((f) => f.following)

//     if (followingIds.length > 0) {
//       query._id.$nin = followingIds
//     }

//     // Limit to 10 suggested users
//     const users = await User.find(query)
//       .select("_id name email role batch regNumber facultyId department company passedOutBatch")
//       .limit(10)

//     // Get profiles for the users
//     const userIds = users.map((user) => user._id)
//     const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto")

//     // Map profiles to users
//     const usersWithProfiles = users.map((user) => {
//       const userObj = user.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === user._id.toString())

//       return {
//         ...userObj,
//         profilePhoto: profile?.profilePhoto || "",
//         profilePhotoUrl: profile?.profilePhoto
//           ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//           : "/default-profile.jpg",
//       }
//     })

//     res.status(200).json({
//       success: true,
//       users: usersWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting suggested users:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get connection requests
// exports.getConnectionRequests = async (req, res) => {
//   try {
//     const currentUserId = req.user._id

//     // Find pending follow requests where current user is the target
//     const requests = await Follow.find({
//       following: currentUserId,
//       status: "pending",
//     }).populate({
//       path: "follower",
//       select: "_id name email role",
//     })

//     // Get profiles for the requesters
//     const requesterIds = requests.map((req) => req.follower._id)
//     const profiles = await Profile.find({ userId: { $in: requesterIds } }).select("userId profilePhoto")

//     // Map profiles to requests
//     const requestsWithProfiles = requests.map((request) => {
//       const requestObj = request.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === request.follower._id.toString())

//       return {
//         ...requestObj,
//         follower: {
//           ...requestObj.follower,
//           profilePhoto: profile?.profilePhoto || "",
//           profilePhotoUrl: profile?.profilePhoto
//             ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//             : "/default-profile.jpg",
//         },
//       }
//     })

//     res.status(200).json({
//       success: true,
//       requests: requestsWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting connection requests:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Follow a user
// exports.followUser = async (req, res) => {
//   try {
//     const { userId } = req.params
//     const currentUserId = req.user._id

//     // Check if user exists
//     const userToFollow = await User.findById(userId)
//     if (!userToFollow) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Check if already following
//     const existingFollow = await Follow.findOne({
//       follower: currentUserId,
//       following: userId,
//     })

//     if (existingFollow) {
//       return res.status(400).json({
//         success: false,
//         message: "Already following or request pending",
//       })
//     }

//     // Create new follow request
//     const follow = new Follow({
//       follower: currentUserId,
//       following: userId,
//       status: "pending",
//     })

//     await follow.save()

//     res.status(200).json({
//       success: true,
//       message: "Follow request sent",
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

// // Accept or reject a follow request
// exports.respondToFollowRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params
//     const { action } = req.body
//     const currentUserId = req.user._id

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

// // Get following and followers
// exports.getConnections = async (req, res) => {
//   try {
//     const userId = req.params.userId || req.user._id

//     // Get followers (users who follow the specified user)
//     const followers = await Follow.find({
//       following: userId,
//       status: "accepted",
//     }).populate({
//       path: "follower",
//       select: "_id name email role",
//     })

//     // Get following (users the specified user follows)
//     const following = await Follow.find({
//       follower: userId,
//       status: "accepted",
//     }).populate({
//       path: "following",
//       select: "_id name email role",
//     })

//     // Get profiles for followers and following
//     const followerIds = followers.map((f) => f.follower._id)
//     const followingIds = following.map((f) => f.following._id)
//     const allUserIds = [...new Set([...followerIds, ...followingIds])]

//     const profiles = await Profile.find({ userId: { $in: allUserIds } }).select("userId profilePhoto")

//     // Map profiles to followers
//     const followersWithProfiles = followers.map((follow) => {
//       const followObj = follow.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === follow.follower._id.toString())

//       return {
//         ...followObj,
//         follower: {
//           ...followObj.follower,
//           profilePhoto: profile?.profilePhoto || "",
//           profilePhotoUrl: profile?.profilePhoto
//             ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//             : "/default-profile.jpg",
//         },
//       }
//     })

//     // Map profiles to following
//     const followingWithProfiles = following.map((follow) => {
//       const followObj = follow.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === follow.following._id.toString())

//       return {
//         ...followObj,
//         following: {
//           ...followObj.following,
//           profilePhoto: profile?.profilePhoto || "",
//           profilePhotoUrl: profile?.profilePhoto
//             ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//             : "/default-profile.jpg",
//         },
//       }
//     })

//     res.status(200).json({
//       success: true,
//       followers: followersWithProfiles,
//       following: followingWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting connections:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Update the getSuggestedUsers function in userController.js

// exports.getSuggestedUsers = async (req, res) => {
//   try {
//     const currentUserId = req.user._id
//     const currentUser = await User.findById(currentUserId)

//     if (!currentUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Build a more inclusive query to show all user types
//     const query = { _id: { $ne: currentUserId } }

//     // Get users who are not already being followed
//     const following = await Follow.find({ follower: currentUserId }).select("following")
//     const followingIds = following.map((f) => f.following)

//     if (followingIds.length > 0) {
//       query._id.$nin = followingIds
//     }

//     // Get pending follow requests
//     const pendingRequests = await Follow.find({
//       follower: currentUserId,
//       status: "pending",
//     }).select("following")
    
//     const pendingRequestIds = pendingRequests.map((r) => r.following)

//     // Limit to 15 suggested users
//     const users = await User.find(query)
//       .select("_id name email role batch regNumber facultyId department company passedOutBatch")
//       .limit(15)

//     // Get profiles for the users
//     const userIds = users.map((user) => user._id)
//     const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto")

//     // Map profiles to users and mark pending requests
//     const usersWithProfiles = users.map((user) => {
//       const userObj = user.toObject()
//       const profile = profiles.find((p) => p.userId.toString() === user._id.toString())
//       const isPending = pendingRequestIds.includes(user._id.toString())

//       return {
//         ...userObj,
//         profilePhoto: profile?.profilePhoto || "",
//         profilePhotoUrl: profile?.profilePhoto
//           ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//           : "/default-profile.jpg",
//         requestSent: isPending,
//       }
//     })

//     res.status(200).json({
//       success: true,
//       users: usersWithProfiles,
//     })
//   } catch (error) {
//     console.error("Error getting suggested users:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Add these methods to your existing userController.js file

// // Get current user
// exports.getCurrentUser = async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     // Get user without password field
//     const user = await User.findById(userId).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     // Get user profile
//     const profile = await Profile.findOne({ userId });
    
//     const userWithProfile = {
//       ...user.toObject(),
//       profile: profile || {},
//       profilePhoto: profile?.profilePhoto || "",
//       profilePhotoUrl: profile?.profilePhoto
//         ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//         : "/default-profile.jpg",
//     };
    
//     res.status(200).json({
//       success: true,
//       user: userWithProfile
//     });
//   } catch (error) {
//     console.error("Error getting current user:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Get user by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Get user without password field
//     const user = await User.findById(id).select("-password");
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     // Get user profile
//     const profile = await Profile.findOne({ userId: id });
    
//     const userWithProfile = {
//       ...user.toObject(),
//       profile: profile || {},
//       profilePhoto: profile?.profilePhoto || "",
//       profilePhotoUrl: profile?.profilePhoto
//         ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
//         : "/default-profile.jpg",
//     };
    
//     res.status(200).json({
//       success: true,
//       user: userWithProfile
//     });
//   } catch (error) {
//     console.error("Error getting user by ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// ************************************************************

const User = require("../models/User")
const { Profile } = require("../models/Profile")
const Follow = require("../models/Follow")

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query
    const currentUserId = req.user._id

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    // Search for users by name or email, excluding the current user
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        {
          $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
        },
      ],
    }).select("_id name email role batch regNumber facultyId department company passedOutBatch")

    // Get profiles for the users
    const userIds = users.map((user) => user._id)
    const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto role")

    // Map profiles to users
    const usersWithProfiles = users.map((user) => {
      const userObj = user.toObject()
      const profile = profiles.find((p) => p.userId.toString() === user._id.toString())

      return {
        ...userObj,
        profilePhoto: profile?.profilePhoto || "",
        profilePhotoUrl: profile?.profilePhoto
          ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
          : "/default-profile.jpg",
      }
    })

    res.status(200).json({
      success: true,
      users: usersWithProfiles,
    })
  } catch (error) {
    console.error("Error searching users:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get suggested users
exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id
    const currentUser = await User.findById(currentUserId)

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Build a more inclusive query to show all user types
    const query = { _id: { $ne: currentUserId } }

    // Add role-specific suggestions
    if (currentUser.role === "student") {
      // For students, suggest other students in the same batch or faculty in their department
      query.$or = [
        { role: "student", batch: currentUser.batch },
        { role: "faculty", department: currentUser.department },
        { role: "alumni", passedOutBatch: currentUser.batch },
      ]
    } else if (currentUser.role === "faculty") {
      // For faculty, suggest other faculty in the same department or students in their department
      query.$or = [
        { role: "faculty", department: currentUser.department },
        { role: "student", department: currentUser.department },
      ]
    } else if (currentUser.role === "alumni") {
      // For alumni, suggest other alumni from the same batch or company
      query.$or = [
        { role: "alumni", passedOutBatch: currentUser.passedOutBatch },
        { role: "alumni", company: currentUser.company },
        { role: "student", batch: currentUser.passedOutBatch },
      ]
    }

    // Get users who are not already being followed
    const following = await Follow.find({ follower: currentUserId }).select("following")
    const followingIds = following.map((f) => f.following)

    if (followingIds.length > 0) {
      query._id.$nin = followingIds
    }

    // Get pending follow requests
    const pendingRequests = await Follow.find({
      follower: currentUserId,
      status: "pending",
    }).select("following")

    const pendingRequestIds = pendingRequests.map((r) => r.following)

    // Limit to 15 suggested users
    const users = await User.find(query)
      .select("_id name email role batch regNumber facultyId department company passedOutBatch")
      .limit(15)

    // Get profiles for the users
    const userIds = users.map((user) => user._id)
    const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId profilePhoto")

    // Map profiles to users and mark pending requests
    const usersWithProfiles = users.map((user) => {
      const userObj = user.toObject()
      const profile = profiles.find((p) => p.userId.toString() === user._id.toString())
      const isPending = pendingRequestIds.some((id) => id.toString() === user._id.toString())

      return {
        ...userObj,
        profilePhoto: profile?.profilePhoto || "",
        profilePhotoUrl: profile?.profilePhoto
          ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
          : "/default-profile.jpg",
        requestSent: isPending,
      }
    })

    res.status(200).json({
      success: true,
      users: usersWithProfiles,
    })
  } catch (error) {
    console.error("Error getting suggested users:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get connection requests
exports.getConnectionRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id

    console.log("Fetching connection requests for user:", currentUserId)

    // Find pending follow requests where current user is the target
    const requests = await Follow.find({
      following: currentUserId,
      status: "pending",
    }).populate({
      path: "follower",
      select: "_id name email role department",
    })

    console.log("Raw requests found:", JSON.stringify(requests))

    // Get profiles for the requesters
    const requesterIds = requests.map((req) => req.follower._id)
    const profiles = await Profile.find({ userId: { $in: requesterIds } }).select("userId profilePhoto")

    console.log("Profiles found:", JSON.stringify(profiles))

    // Map profiles to requests
    const requestsWithProfiles = requests.map((request) => {
      const requestObj = request.toObject()
      const profile = profiles.find((p) => p.userId.toString() === request.follower._id.toString())

      return {
        ...requestObj,
        follower: {
          ...requestObj.follower,
          profilePhoto: profile?.profilePhoto || "",
          profilePhotoUrl: profile?.profilePhoto ? `/uploads/profile/${profile.profilePhoto}` : "/default-profile.jpg",
        },
      }
    })

    console.log("Sending connection requests response:", JSON.stringify(requestsWithProfiles))

    res.status(200).json({
      success: true,
      requests: requestsWithProfiles,
    })
  } catch (error) {
    console.error("Error getting connection requests:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user._id

    // Check if user exists
    const userToFollow = await User.findById(userId)
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    })

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "Already following or request pending",
      })
    }

    // Create new follow request
    const follow = new Follow({
      follower: currentUserId,
      following: userId,
      status: "pending",
    })

    await follow.save()

    res.status(200).json({
      success: true,
      message: "Follow request sent",
      follow,
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

// Accept or reject a follow request
exports.respondToFollowRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { action } = req.body
    const currentUserId = req.user._id

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'accept' or 'reject'",
      })
    }

    // Find the follow request
    const followRequest = await Follow.findById(requestId)

    if (!followRequest) {
      return res.status(404).json({
        success: false,
        message: "Follow request not found",
      })
    }

    // Verify the current user is the target of the follow request
    if (followRequest.following.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to respond to this request",
      })
    }

    // Update the status based on the action
    followRequest.status = action === "accept" ? "accepted" : "rejected"
    await followRequest.save()

    // If accepted, update follower and following counts in profiles
    if (action === "accept") {
      await Profile.findOneAndUpdate({ userId: followRequest.following }, { $inc: { "stats.followers": 1 } })
      await Profile.findOneAndUpdate({ userId: followRequest.follower }, { $inc: { "stats.following": 1 } })
    }

    res.status(200).json({
      success: true,
      message: `Follow request ${action}ed`,
      followRequest,
    })
  } catch (error) {
    console.error(`Error responding to follow request:`, error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get following and followers
exports.getConnections = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id

    // Get followers (users who follow the specified user)
    const followers = await Follow.find({
      following: userId,
      status: "accepted",
    }).populate({
      path: "follower",
      select: "_id name email role",
    })

    // Get following (users the specified user follows)
    const following = await Follow.find({
      follower: userId,
      status: "accepted",
    }).populate({
      path: "following",
      select: "_id name email role",
    })

    // Get profiles for followers and following
    const followerIds = followers.map((f) => f.follower._id)
    const followingIds = following.map((f) => f.following._id)
    const allUserIds = [...new Set([...followerIds, ...followingIds])]

    const profiles = await Profile.find({ userId: { $in: allUserIds } }).select("userId profilePhoto")

    // Map profiles to followers
    const followersWithProfiles = followers.map((follow) => {
      const followObj = follow.toObject()
      const profile = profiles.find((p) => p.userId.toString() === follow.follower._id.toString())

      return {
        ...followObj,
        follower: {
          ...followObj.follower,
          profilePhoto: profile?.profilePhoto || "",
          profilePhotoUrl: profile?.profilePhoto
            ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
            : "/default-profile.jpg",
        },
      }
    })

    // Map profiles to following
    const followingWithProfiles = following.map((follow) => {
      const followObj = follow.toObject()
      const profile = profiles.find((p) => p.userId.toString() === follow.following._id.toString())

      return {
        ...followObj,
        following: {
          ...followObj.following,
          profilePhoto: profile?.profilePhoto || "",
          profilePhotoUrl: profile?.profilePhoto
            ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
            : "/default-profile.jpg",
        },
      }
    })

    res.status(200).json({
      success: true,
      followers: followersWithProfiles,
      following: followingWithProfiles,
    })
  } catch (error) {
    console.error("Error getting connections:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id

    // Get user without password field
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user profile
    const profile = await Profile.findOne({ userId })

    const userWithProfile = {
      ...user.toObject(),
      profile: profile || {},
      profilePhoto: profile?.profilePhoto || "",
      profilePhotoUrl: profile?.profilePhoto
        ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
        : "/default-profile.jpg",
    }

    res.status(200).json({
      success: true,
      user: userWithProfile,
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params

    // Get user without password field
    const user = await User.findById(id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user profile
    const profile = await Profile.findOne({ userId: id })

    const userWithProfile = {
      ...user.toObject(),
      profile: profile || {},
      profilePhoto: profile?.profilePhoto || "",
      profilePhotoUrl: profile?.profilePhoto
        ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
        : "/default-profile.jpg",
    }

    res.status(200).json({
      success: true,
      user: userWithProfile,
    })
  } catch (error) {
    console.error("Error getting user by ID:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { name, email, ...profileData } = req.body

    // Update user basic info
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update or create profile
    let profile = await Profile.findOne({ userId })

    if (profile) {
      profile = await Profile.findOneAndUpdate({ userId }, { ...profileData }, { new: true })
    } else {
      profile = await Profile.create({
        userId,
        ...profileData,
      })
    }

    const userWithProfile = {
      ...updatedUser.toObject(),
      profile: profile || {},
      profilePhoto: profile?.profilePhoto || "",
      profilePhotoUrl: profile?.profilePhoto
        ? `/uploads/profile/${profile.profilePhoto.split("/").pop()}`
        : "/default-profile.jpg",
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userWithProfile,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin access required",
      })
    }

    const users = await User.find().select("-password")

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.error("Error getting all users:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Delete user (self or admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // Check if user is deleting themselves or is an admin
    if (id !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Can only delete your own account or admin access required",
      })
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete associated profile
    await Profile.findOneAndDelete({ userId: id })

    // Delete associated follows
    await Follow.deleteMany({ $or: [{ follower: id }, { following: id }] })

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin access required",
      })
    }

    // Validate role
    const validRoles = ["student", "faculty", "alumni", "admin"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      })
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Add this function to userController.js

// Get sent connection requests
exports.getSentRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id

    // Find pending follow requests where current user is the initiator
    const sentRequests = await Follow.find({
      follower: currentUserId,
      status: "pending"
    }).populate({
      path: "following",
      select: "_id name email role department"
    })

    // Get profiles for the users who received requests
    const receiverIds = sentRequests.map(req => req.following._id)
    const profiles = await Profile.find({ userId: { $in: receiverIds } }).select("userId profilePhoto")

    // Map profiles to requests
    const requestsWithProfiles = sentRequests.map(request => {
      const requestObj = request.toObject()
      const profile = profiles.find(p => p.userId.toString() === request.following._id.toString())

      return {
        ...requestObj,
        following: {
          ...requestObj.following,
          profilePhoto: profile?.profilePhoto || "",
          profilePhotoUrl: profile?.profilePhoto 
            ? `/uploads/profile/${profile.profilePhoto.split('/').pop()}` 
            : "/default-profile.jpg"
        }
      }
    })

    res.status(200).json({
      success: true,
      sentRequests: requestsWithProfiles
    })
  } catch (error) {
    console.error("Error getting sent requests:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}

// Add this function to userController.js

// Cancel a follow request
exports.cancelFollowRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const currentUserId = req.user._id

    // Find and validate the follow request
    const followRequest = await Follow.findById(requestId)

    if (!followRequest) {
      return res.status(404).json({
        success: false,
        message: "Follow request not found"
      })
    }

    // Verify the current user is the one who sent the request
    if (followRequest.follower.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this request"
      })
    }

    // Ensure the request is still pending
    if (followRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request cannot be canceled as it has already been processed"
      })
    }

    // Delete the follow request
    await Follow.findByIdAndDelete(requestId)

    res.status(200).json({
      success: true,
      message: "Follow request canceled successfully"
    })
  } catch (error) {
    console.error("Error canceling follow request:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}

// ?????????????????????????????????????????????????????????????????????????????

