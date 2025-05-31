const express = require("express")
const router = express.Router()
const { authMiddleware } = require("../middleware/authMiddleware")
const followController = require("../controllers/followController")

// Follow a user
router.post("/:userId/follow", authMiddleware, followController.followUser)

// Unfollow a user
router.delete("/:userId/unfollow", authMiddleware, followController.unfollowUser)

// Get followers of a user
router.get("/:userId/followers", followController.getFollowers)

// Get users that a user is following
router.get("/:userId/following", followController.getFollowing)

// Check if current user is following another user
router.get("/:userId/check-follow", authMiddleware, followController.checkFollowStatus)

module.exports = router
