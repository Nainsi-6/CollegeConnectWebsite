// const express = require("express"); 
// const router = express.Router();

// const {
//   getProfile,
//   createProfile,
//   updateProfile,
// } = require("../controllers/profileController");

// const { authMiddleware } = require("../middleware/authMiddleware");

// const upload = require("../middleware/multer");

// // GET Profile
// router.get("/", authMiddleware, getProfile);

// // POST Create Profile
// router.post("/", authMiddleware, upload.single("profilePic"), createProfile);

// // PUT Update Profile
// router.put("/", authMiddleware, upload.single("profilePic"), updateProfile);

// // NEW: GET All Profiles
// router.get("/all", authMiddleware, async (req, res) => {
//   try {
//     const profiles = await require("../models/Profile").find().select("-__v");
//     res.json(profiles);
//   } catch (err) {
//     console.error("Fetch all profiles error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;