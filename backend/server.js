/*require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow frontend to communicate with backend

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Post Schema & Model (✅ Fixed)
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", PostSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "✅ User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error signing up", error: error.message });
  }
});
app.post("/signup", async (req, res) => {
  console.log("Incoming Signup Request:", req.body); // Debugging

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    console.log("✅ User added to DB:", newUser); // Debugging

    res.json({ message: "✅ User registered successfully!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "❌ Error signing up", error: error.message });
  }
});
const corsOptions = {
  origin: "http://localhost:3000", // Adjust based on frontend URL
  credentials: true,
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));


// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "❌ Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "✅ Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});



// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "❌ Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "❌ Invalid Token" });
  }
};

// ✅ Fixed Post Route (Now Using Correct Model)
app.post("/posts", async (req, res) => {
  console.log("Incoming Data:", req.body);

  try {
    const { title, content } = req.body;

    if (!title || !content) {
      console.log("❌ Missing Data");
      return res.status(400).json({ error: "Title and content required" });
    }

    const newPost = new Post({ title, content });
    await newPost.save();
    console.log("✅ Post saved:", newPost);

    res.status(201).json({ message: "✅ Post added", post: newPost });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start Server (✅ Change Port to Avoid Conflict)
const PORT = process.env.PORT || 5001; // Changed to 5001 if 5000 is busy
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));*/
/*require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow frontend to communicate with backend

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Post Schema & Model (✅ Fixed)
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", PostSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "✅ User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error signing up", error: error.message });
  }
});
app.post("/signup", async (req, res) => {
  console.log("Incoming Signup Request:", req.body); // Debugging

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    console.log("✅ User added to DB:", newUser); // Debugging

    res.json({ message: "✅ User registered successfully!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "❌ Error signing up", error: error.message });
  }
});
const corsOptions = {
  origin: "http://localhost:3000", // Adjust based on frontend URL
  credentials: true,
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));


// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "❌ Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "✅ Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});



// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "❌ Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "❌ Invalid Token" });
  }
};

// ✅ Fixed Post Route (Now Using Correct Model)
app.post("/posts", async (req, res) => {
  console.log("Incoming Data:", req.body);

  try {
    const { title, content } = req.body;

    if (!title || !content) {
      console.log("❌ Missing Data");
      return res.status(400).json({ error: "Title and content required" });
    }

    const newPost = new Post({ title, content });
    await newPost.save();
    console.log("✅ Post saved:", newPost);

    res.status(201).json({ message: "✅ Post added", post: newPost });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start Server (✅ Change Port to Avoid Conflict)
const PORT = process.env.PORT || 5001; // Changed to 5001 if 5000 is busy
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));*/



// const axios = require("axios");
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require('fs');

// const announcementRoutes = require("./routes/announcementRoutes")
// const achievementRoutes = require("./routes/achievementsRoutes");

// const connectDB = require("./config/db");
// const User = require("./models/User");  // Importing User Model
// const authRoutes = require("./routes/authRoutes");
// const bodyParser = require("body-parser");
// const eventsRoutes = require("./routes/eventsRoutes");
// const postRoutes = require("./routes/postRoutes");
// const profileRoutes = require('./routes/profileRoutes');
// const path = require("path")
// const app = express();
// // app.use(express.json());
// app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// app.use(bodyParser.json());
// // Make sure your app has the proper middleware for handling file uploads
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// // Create upload directories if they don't exist
// const createUploadDirs = () => {
//   const dirs = [
//     path.join('public', 'uploads'),
//     path.join('public', 'uploads', 'profile'),
//     path.join('public', 'uploads', 'cover'),
//     path.join('public', 'uploads', 'posts')
//   ];
  
//   dirs.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`Created directory: ${dir}`);
//     }
//   });
// };

// // Create necessary directories
// createUploadDirs();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB Connection
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/profiles', profileRoutes);


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Server Error',
//     error: process.env.NODE_ENV === 'production' ? {} : err
//   });
// });



// //Announcements
// //Auth Routes
// app.use("/api/auth", authRoutes); 
// app.use("/api/announcements", announcementRoutes);
// //Achievements
// app.use("/api/achievements", achievementRoutes);
 
// // Use Profile Routes
// app.use("/api/profile", profileRoutes);
// //Events Routes
// // Routes
// app.use("/api/events", eventsRoutes);

// app.use("/api/posts", postRoutes);
// app.use('/api/profiles', profileRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
//   });
// });

// // Server Setup
// const PORT =  5005;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");

// dotenv.config();

// const authRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const announcementRoutes = require("./routes/announcementRoutes");
// const achievementRoutes = require("./routes/achievementsRoutes");
// const eventsRoutes = require("./routes/eventsRoutes");
// const postRoutes = require("./routes/postRoutes");
// // Add this to your imports
// const userRoutes = require("./routes/userRoutes");
// // Add this to your imports
// const messageRoutes = require("./routes/messageRoutes")
// // Add these to your imports
// const jobRoutes = require("./routes/jobRoutes");
// const eventRecommendationRoutes = require("./routes/eventRecommendationRoutes");
// const followRoutes = require("./routes/followRoutes")




// const app = express();

// // Middleware
// app.use(cors({
//   origin: "*",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(morgan("dev"));
// app.use(bodyParser.json()); // parse application/json
// app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// // Serve static files
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
// app.use("/uploads/profile", express.static(path.join(__dirname, "public", "uploads", "profile")));
// app.use("/uploads/cover", express.static(path.join(__dirname, "public", "uploads", "cover")));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Routes
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Server is running correctly", timestamp: new Date().toISOString() });
// });

// app.use("/api/auth", authRoutes); // ✅ Signup route should be defined inside authRoutes.js
// app.use("/api/profiles", profileRoutes);
// app.use("/api/announcements", announcementRoutes);
// app.use("/api/achievements", achievementRoutes);
// // Add this to your routes section
// app.use("/api/messages", messageRoutes)
// app.use("/api/events", eventsRoutes);
// app.use("/api/posts", postRoutes);
// // Add this to your routes section
// app.use("/api/users", userRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/event-recommendations", eventRecommendationRoutes);
// app.use("/api/users", followRoutes)


// // Error handling
// app.use((err, req, res, next) => {
//   console.error("Error:", err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Server error",
//     error: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5005;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
// });


//////////////////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const achievementRoutes = require("./routes/achievementsRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const jobRoutes = require("./routes/jobRoutes");
const eventRecommendationRoutes = require("./routes/eventRecommendationRoutes");
const followRoutes = require("./routes/followRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/uploads/profile", express.static(path.join(__dirname, "public", "uploads", "profile")));
app.use("/uploads/cover", express.static(path.join(__dirname, "public", "uploads", "cover")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running correctly", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/event-recommendations", eventRecommendationRoutes);
app.use("/api/users", followRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
  });
});

// Socket.io Configuration
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { message, conversationId, recipientId } = data;

      io.to(recipientId).emit("newMessage", {
        message,
        conversationId,
      });

      io.to(recipientId).emit("messageDelivered", {
        messageId: message._id,
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("markAsRead", async (data) => {
    try {
      const { messageIds, senderId } = data;

      io.to(senderId).emit("messagesRead", {
        messageIds,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5005;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
});
