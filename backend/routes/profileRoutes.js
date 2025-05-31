const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const upload = require('../middleware/uploadMiddleware');

// Configure multer for multiple file uploads
const profileUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]);

// Get current user's profile
router.get('/me', authMiddleware, profileController.getProfile);

// Get profile by post author ID (for clicking on post author)
// This route must come before the /:userId route to avoid conflicts
router.get('/author/:userId', profileController.getPostAuthorProfile);

// Get profile by user ID
router.get('/:userId', profileController.getProfile);

// Create or update profile
router.post('/update', authMiddleware, profileUpload, profileController.updateProfile);

module.exports = router;