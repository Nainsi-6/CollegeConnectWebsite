// const express = require("express");
// const router = express.Router();
// const Post = require("../models/Post");
// const User = require("../models/User");

// Get all posts (visible to everyone)
// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch posts." });
//   }
// });

// cghjkl;'
// ';kjhgcgvhjkll;''

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const Post = require("../models/post");
// const User = require("../models/User");


// // Storage config
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const uploadPath = path.join(__dirname, "../uploads");
// //     if (!fs.existsSync(uploadPath)) {
// //       fs.mkdirSync(uploadPath);
// //     }
// //     cb(null, uploadPath);
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + "-" + file.originalname);
// //   },
// // });

// // const upload = multer({ storage });

// const multer = require("multer")
// const fs = require("fs")

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads")
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true })
//     }
//     cb(null, uploadPath)
//   },
//   filename: (req, file, cb) => {
//     // Create a unique filename with original extension
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
//     const ext = path.extname(file.originalname)
//     cb(null, uniqueSuffix + ext)
//   },
// })

// // Import necessary modules and define router, Post, and upload
// // const router = express.Router()
// // const Post = require("../models/Post") // Adjust the path as needed
// const upload = multer({ storage: storage })

// // 3. Make sure your GET route for posts populates the user information
// // Update your GET route in postRoutes.js:

// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("userId", "name image") // Populate user details
//       .sort({ createdAt: -1 })
//     res.json(posts)
//   } catch (err) {
//     console.error("Error fetching posts:", err)
//     res.status(500).json({ error: "Server error" })
//   }
// })

// // 4. Ensure your POST route for creating posts correctly handles the image paths
// // Update your POST route in postRoutes.js:

// router.post("/", upload.array("images", 5), async (req, res) => {
//   try {
//     const { content, userId, username } = req.body

//     // Create proper URLs for the images
//     const serverUrl = `${req.protocol}://${req.get("host")}`
//     const imagePaths = req.files.map((file) => `${serverUrl}/uploads/${file.filename}`)

//     const newPost = new Post({
//       content,
//       userId,
//       username,
//       images: imagePaths,
//     })

//     const savedPost = await newPost.save()

//     // Populate user info before sending response
//     const populatedPost = await Post.findById(savedPost._id).populate("userId", "name image")

//     res.status(201).json(populatedPost)
//   } catch (err) {
//     console.error("Error creating post:", err)
//     res.status(500).json({ error: "Error creating post" })
//   }
// })
  
//   // Dislike a post
// router.post("/:id/dislike", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     if (!post.dislikes.includes(userId)) {
//       post.dislikes.push(userId);
//       post.likes = post.likes.filter(id => id.toString() !== userId);
//     }

//     await post.save();
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: "Error disliking post" });
//   }
// });

  
//   router.post("/:id/comment", (req, res) => {
//     const { text } = req.body;
//     const post = posts.find(p => p.id == req.params.id);
//     if (!post) return res.status(404).json({ error: "Post not found" });
  
//     const newComment = {
//       id: Date.now(),
//       text,
//       createdAt: new Date()
//     };
  
//     post.comments.push(newComment);
//     res.status(201).json(newComment);
//   });
  

// module.exports = router;


// Create a post
// router.post("/", async (req, res) => {
//   try {
//     const { title, content, userId } = req.body;
//     if (!title || !content || !userId) return res.status(400).json({ error: "All fields are required." });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found." });

//     const newPost = new Post({
//       title,
//       content,
//       userId,
//       username: user.name || "Anonymous",
//     });

//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create post." });
//   }
// });

// // Like a post
// router.put("/:id/like", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: "Post not found." });

//     if (!post.likes.includes(userId)) {
//       post.likes.push(userId);
//       post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
//     }

//     await post.save();
//     res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to like post." });
//   }
// });

// // Dislike a post
// router.put("/:id/dislike", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: "Post not found." });

//     if (!post.dislikes.includes(userId)) {
//       post.dislikes.push(userId);
//       post.likes = post.likes.filter(id => id.toString() !== userId);
//     }

//     await post.save();
//     res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to dislike post." });
//   }
// });

// // Add a comment
// router.post("/:id/comment", async (req, res) => {
//   try {
//     const { userId, text } = req.body;
//     const post = await Post.findById(req.params.id);
//     const user = await User.findById(userId);

//     if (!post || !user) return res.status(404).json({ error: "Post or User not found." });

//     post.comments.push({
//       userId,
//       username: user.name || "Anonymous",
//       text
//     });

//     await post.save();
//     res.status(201).json(post.comments);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add comment." });
//   }
// });

// module.exports = router;



// const express = require("express")
// const router = express.Router()
// const multer = require("multer")
// const path = require("path")
// const fs = require("fs")
// const Post = require("../models/post")
// const User = require("../models/User")

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, "../uploads")
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir)
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
//     const ext = path.extname(file.originalname)
//     cb(null, uniqueSuffix + ext)
//   },
// })

// // File filter to only accept images
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true)
//   } else {
//     cb(new Error("Only image files are allowed!"), false)
//   }
// }

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
// })

// // Get all posts
// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find().populate("userId", "name image role department year branch").sort({ createdAt: -1 })
//     res.json(posts)
//   } catch (err) {
//     console.error("Error fetching posts:", err)
//     res.status(500).json({ error: "Server error" })
//   }
// })

// // Create a new post
// router.post("/", upload.array("images", 5), async (req, res) => {
//   try {
//     console.log("Creating post with data:", req.body)
//     console.log("Files received:", req.files)

//     const { content, userId, username } = req.body

//     if (!content && (!req.files || req.files.length === 0)) {
//       return res.status(400).json({ error: "Post must have content or images" })
//     }

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" })
//     }

//     // Create image URLs
//     const imagePaths = req.files
//       ? req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
//       : []

//     const newPost = new Post({
//       content,
//       userId,
//       username,
//       images: imagePaths,
//     })

//     const savedPost = await newPost.save()

//     // Populate user info before sending response
//     const populatedPost = await Post.findById(savedPost._id).populate(
//       "userId",
//       "name image role department year branch",
//     )

//     res.status(201).json(populatedPost)
//   } catch (err) {
//     console.error("Error creating post:", err)
//     res.status(500).json({ error: err.message || "Error creating post" })
//   }
// })

// // Like a post
// router.post("/:id/like", async (req, res) => {
//   try {
//     const { userId } = req.body

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" })
//     }

//     const post = await Post.findById(req.params.id)
//     if (!post) return res.status(404).json({ error: "Post not found" })

//     // Check if already liked
//     if (!post.likes.includes(userId)) {
//       // Add to likes, remove from dislikes if present
//       post.likes.push(userId)
//       post.dislikes = post.dislikes.filter((id) => id.toString() !== userId)
//       await post.save()
//     }

//     // Return populated post
//     const populatedPost = await Post.findById(post._id).populate("userId", "name image role department year branch")

//     res.json(populatedPost)
//   } catch (err) {
//     console.error("Error liking post:", err)
//     res.status(500).json({ error: err.message || "Error liking post" })
//   }
// })

// // Dislike a post
// router.post("/:id/dislike", async (req, res) => {
//   try {
//     const { userId } = req.body

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" })
//     }

//     const post = await Post.findById(req.params.id)
//     if (!post) return res.status(404).json({ error: "Post not found" })

//     // Check if already disliked
//     if (!post.dislikes.includes(userId)) {
//       // Add to dislikes, remove from likes if present
//       post.dislikes.push(userId)
//       post.likes = post.likes.filter((id) => id.toString() !== userId)
//       await post.save()
//     }

//     // Return populated post
//     const populatedPost = await Post.findById(post._id).populate("userId", "name image role department year branch")

//     res.json(populatedPost)
//   } catch (err) {
//     console.error("Error disliking post:", err)
//     res.status(500).json({ error: err.message || "Error disliking post" })
//   }
// })

// // Add a comment
// router.post("/:id/comment", async (req, res) => {
//   try {
//     const { text, userId, username } = req.body

//     if (!text || !userId) {
//       return res.status(400).json({ error: "Comment text and user ID are required" })
//     }

//     const post = await Post.findById(req.params.id)
//     if (!post) return res.status(404).json({ error: "Post not found" })

//     const newComment = {
//       userId,
//       username,
//       text,
//       createdAt: new Date(),
//     }

//     post.comments.push(newComment)
//     await post.save()

//     // Return populated post
//     const populatedPost = await Post.findById(post._id).populate("userId", "name image role department year branch")

//     res.json(populatedPost)
//   } catch (err) {
//     console.error("Error adding comment:", err)
//     res.status(500).json({ error: err.message || "Error adding comment" })
//   }
// })

// // Delete a post
// router.delete("/:id", async (req, res) => {
//   try {
//     const { userId } = req.body

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" })
//     }

//     const post = await Post.findById(req.params.id)
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" })
//     }

//     // Check if the user is the owner of the post
//     if (post.userId.toString() !== userId) {
//       return res.status(403).json({ error: "Not authorized to delete this post" })
//     }

//     // Delete images from server
//     if (post.images && post.images.length > 0) {
//       post.images.forEach((imageUrl) => {
//         try {
//           // Extract filename from URL
//           const urlParts = imageUrl.split("/")
//           const filename = urlParts[urlParts.length - 1]

//           if (filename) {
//             const fullPath = path.join(uploadDir, filename)
//             if (fs.existsSync(fullPath)) {
//               fs.unlinkSync(fullPath)
//               console.log(`Deleted image: ${fullPath}`)
//             }
//           }
//         } catch (err) {
//           console.error("Error deleting image file:", err)
//           // Continue with post deletion even if image deletion fails
//         }
//       })
//     }

//     await Post.findByIdAndDelete(req.params.id)
//     res.json({ message: "Post deleted successfully" })
//   } catch (err) {
//     console.error("Error deleting post:", err)
//     res.status(500).json({ error: err.message || "Error deleting post" })
//   }
// })

// module.exports = router

const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Post = require("../models/Post")
const User = require("../models/User")
const SavedPost = require("../models/SavedPost") // Add this missing import

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "public", "uploads")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  },
})

// Enhanced file filter to support various image formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${file.mimetype} is not supported. Allowed types: JPEG, PNG, GIF, WebP, BMP, SVG`), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10, // Maximum 10 files
  },
})

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name image role department year branch currentJobTitle company graduationYear passedOutBatch").sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    console.error("Error fetching posts:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Get posts by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ userId })
      .populate("userId", "name image role department year branch currentJobTitle passedOutBatch")
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (err) {
    console.error("Error fetching user posts:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Get post count by user ID
router.get("/user/:userId/count", async (req, res) => {
  try {
    const { userId } = req.params
    const count = await Post.countDocuments({ userId })

    res.json({ count })
  } catch (err) {
    console.error("Error fetching post count:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Get a specific post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "name image role department year branch")

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.json(post)
  } catch (err) {
    console.error("Error fetching post:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Create a new post
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    console.log("Creating post with data:", req.body)
    console.log("Files received:", req.files)

    const { content, userId, username } = req.body

    if (!content && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "Post must have content or images" })
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Create image URLs
    const imagePaths = req.files
      ? req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
      : []

    const newPost = new Post({
      content,
      userId,
      username,
      images: imagePaths,
    })

    const savedPost = await newPost.save()
    console.log("Post saved successfully:", savedPost._id)

    // Update user's post count in their stats
    try {
      await User.findByIdAndUpdate(userId, { $inc: { "stats.posts": 1 } }, { upsert: true })
    } catch (updateErr) {
      console.error("Error updating user post count:", updateErr)
      // Don't fail the post creation if stats update fails
    }

    // Populate user info before sending response
    const populatedPost = await Post.findById(savedPost._id).populate(
      "userId",
      "name image role department year branch",
    )

    res.status(201).json(populatedPost)
  } catch (err) {
    console.error("Error creating post:", err)
    res.status(500).json({ error: err.message || "Error creating post" })
  }
})

// Like a post
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    // Check if already liked
    if (!post.likes.includes(userId)) {
      // Add to likes, remove from dislikes if present
      post.likes.push(userId)
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId)
      await post.save()
    }

    // Return populated post
    const populatedPost = await Post.findById(post._id).populate("userId", "name image role department year branch")

    res.json(populatedPost)
  } catch (err) {
    console.error("Error liking post:", err)
    res.status(500).json({ error: err.message || "Error liking post" })
  }
})

// Dislike a post
router.post("/:id/dislike", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    // Check if already disliked
    if (!post.dislikes.includes(userId)) {
      // Add to dislikes, remove from likes if present
      post.dislikes.push(userId)
      post.likes = post.likes.filter((id) => id.toString() !== userId)
      await post.save()
    }

    // Return populated post
    const populatedPost = await Post.findById(post._id).populate("userId", "name image role department year branch")

    res.json(populatedPost)
  } catch (err) {
    console.error("Error disliking post:", err)
    res.status(500).json({ error: err.message || "Error disliking post" })
  }
})

// Add a comment
router.post("/:id/comment", async (req, res) => {
  try {
    const { text, userId, username } = req.body

    if (!text || !userId) {
      return res.status(400).json({ error: "Comment text and user ID are required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const newComment = {
      userId,
      username,
      text,
      createdAt: new Date(),
    }

    post.comments.push(newComment)
    await post.save()

    // Return populated post
    const populatedPost = await Post.findById(post._id).populate("userId", "name image role department year branch")

    res.json(populatedPost)
  } catch (err) {
    console.error("Error adding comment:", err)
    res.status(500).json({ error: err.message || "Error adding comment" })
  }
})

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    // Check if the user is the owner of the post
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this post" })
    }

    // Delete images from server
    if (post.images && post.images.length > 0) {
      post.images.forEach((imageUrl) => {
        try {
          // Extract filename from URL
          const urlParts = imageUrl.split("/")
          const filename = urlParts[urlParts.length - 1]

          if (filename) {
            const fullPath = path.join(uploadDir, filename)
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath)
              console.log(`Deleted image: ${fullPath}`)
            }
          }
        } catch (err) {
          console.error("Error deleting image file:", err)
          // Continue with post deletion even if image deletion fails
        }
      })
    }

    // Update user's post count in their stats
    try {
      await User.findByIdAndUpdate(userId, { $inc: { "stats.posts": -1 } }, { upsert: true })
    } catch (updateErr) {
      console.error("Error updating user post count:", updateErr)
      // Don't fail the post deletion if stats update fails
    }

    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: "Post deleted successfully" })
  } catch (err) {
    console.error("Error deleting post:", err)
    res.status(500).json({ error: err.message || "Error deleting post" })
  }
})

// Report a post
router.post("/:id/report", async (req, res) => {
  try {
    const { userId, reason } = req.body

    if (!userId || !reason) {
      return res.status(400).json({ error: "User ID and reason are required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    // You can store reports in a separate collection or add to the post
    // For now, we'll just log it and return success
    console.log(`Post ${req.params.id} reported by user ${userId} for: ${reason}`)

    res.json({ message: "Post reported successfully" })
  } catch (err) {
    console.error("Error reporting post:", err)
    res.status(500).json({ error: err.message || "Error reporting post" })
  }
})

// Save a post
router.post("/:id/save", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    // Check if already saved
    const existingSave = await SavedPost.findOne({
      userId: userId,
      postId: req.params.id,
    })

    if (existingSave) {
      return res.status(400).json({ error: "Post already saved" })
    }

    // Create new saved post
    const savedPost = new SavedPost({
      userId: userId,
      postId: req.params.id,
    })

    await savedPost.save()

    res.json({ message: "Post saved successfully" })
  } catch (err) {
    console.error("Error saving post:", err)
    res.status(500).json({ error: err.message || "Error saving post" })
  }
})

// Unsave a post
router.post("/:id/unsave", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const result = await SavedPost.findOneAndDelete({
      userId: userId,
      postId: req.params.id,
    })

    if (!result) {
      return res.status(404).json({ error: "Saved post not found" })
    }

    res.json({ message: "Post unsaved successfully" })
  } catch (err) {
    console.error("Error unsaving post:", err)
    res.status(500).json({ error: err.message || "Error unsaving post" })
  }
})

// Get saved posts for a user
router.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const savedPosts = await SavedPost.find({ userId })
      .populate({
        path: "postId",
        populate: {
          path: "userId",
          select: "name role",
        },
      })
      .sort({ savedAt: -1 })

    // Filter out any null posts (in case referenced posts were deleted)
    const validSavedPosts = savedPosts.filter((saved) => saved.postId).map((saved) => saved.postId)

    res.json(validSavedPosts)
  } catch (err) {
    console.error("Error fetching saved posts:", err)
    res.status(500).json({ error: err.message || "Error fetching saved posts" })
  }
})

// Check if a post is saved by user
router.get("/:id/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const savedPost = await SavedPost.findOne({
      userId: userId,
      postId: req.params.id,
    })

    res.json({ saved: !!savedPost })
  } catch (err) {
    console.error("Error checking saved status:", err)
    res.status(500).json({ error: err.message || "Error checking saved status" })
  }
})

// Get user profile by ID
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name image role department year branch");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router
