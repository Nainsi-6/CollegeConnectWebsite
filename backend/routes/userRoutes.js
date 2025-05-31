// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const { authMiddleware } = require("../middleware/authMiddleware");

// // Apply auth middleware to all routes
// router.use(authMiddleware);

// // Get the current user's profile
// router.get("/", userController.getCurrentUser);

// // Get a specific user by ID
// router.get("/:id", userController.getUserById);

// // Search users
// router.get("/search", userController.searchUsers);

// // Get suggested users
// router.get("/suggested", userController.getSuggestedUsers);

// // Get connection requests
// router.get("/requests", userController.getConnectionRequests);

// // Follow a user
// router.post("/follow/:userId", userController.followUser);

// // Respond to a follow request
// router.put("/request/:requestId", userController.respondToFollowRequest);

// // Get followers and following
// router.get("/connections/:userId?", userController.getConnections);

// // Public routes
// router.get("/search", userController.searchUsers)

// // Protected routes
// router.get("/current", authMiddleware, userController.getCurrentUser)
// router.get("/suggested", authMiddleware, userController.getSuggestedUsers)
// router.get("/requests", authMiddleware, userController.getConnectionRequests)
// router.get("/connections", authMiddleware, userController.getConnections)
// router.get("/connections/:userId", authMiddleware, userController.getConnections)
// router.get("/:id", authMiddleware, userController.getUserById)
// router.post("/follow/:userId", authMiddleware, userController.followUser)
// router.post("/respond/:requestId", authMiddleware, userController.respondToFollowRequest)

// module.exports = router;

// =======================================================================================================

// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const { authMiddleware } = require("../middleware/authMiddleware");

// // Apply auth middleware to all routes
// router.use(authMiddleware);

// // Get the current user's profile
// router.get("/", userController.getCurrentUser);

// // Get a specific user by ID
// router.get("/:id", userController.getUserById);

// // Search users
// router.get("/search", userController.searchUsers);

// // Get suggested users
// router.get("/suggested", userController.getSuggestedUsers);

// // Get connection requests
// router.get("/requests", userController.getConnectionRequests);

// // Follow a user
// router.post("/follow/:userId", userController.followUser);

// // Respond to a follow request
// router.put("/request/:requestId", userController.respondToFollowRequest);

// // Get followers and following
// router.get("/connections/:userId?", userController.getConnections);

// // Public routes
// router.get("/search", userController.searchUsers)


// module.exports = router;


// Update these routes in your router file (typically routes/userRoutes.js)

const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware")

// Public routes
router.get("/search", authMiddleware, userController.searchUsers)

// Protected routes - require authentication
router.get("/current", authMiddleware, userController.getCurrentUser)
router.get("/suggested", authMiddleware, userController.getSuggestedUsers)
router.get("/requests", authMiddleware, userController.getConnectionRequests)
router.get("/sent-requests", authMiddleware, userController.getSentRequests) // New route for sent requests
router.get("/connections", authMiddleware, userController.getConnections)
router.get("/connections/:userId", authMiddleware, userController.getConnections)
router.get("/:id", authMiddleware, userController.getUserById)
router.post("/follow/:userId", authMiddleware, userController.followUser)
router.post("/respond/:requestId", authMiddleware, userController.respondToFollowRequest)
router.delete("/follow/:requestId", authMiddleware, userController.cancelFollowRequest) // New route for canceling requests
router.put("/profile", authMiddleware, userController.updateUserProfile)
router.delete("/:id", authMiddleware, userController.deleteUser)

// Admin routes
router.get("/", authMiddleware, roleMiddleware("admin"), userController.getAllUsers)
router.put("/role/:id", authMiddleware, roleMiddleware("admin"), userController.updateUserRole)

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (err) {
    console.error("Error fetching user:", err)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router