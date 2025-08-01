const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "❌ Access Denied - No token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("Decoded token:", decoded);
    
    // Check if user still exists - fixed to use decoded.id instead of decoded._id
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "❌ Invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "❌ Token expired" 
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: "❌ Not authorized to access this resource" 
    });
  }
};

// Role-based access control middleware (unchanged)
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `❌ Forbidden - ${req.user.role} role not authorized`
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};

//     *************rest of code
// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

// module.exports = async (req, res, next) => {
//   try {
//     // Get token from header
//     const token = req.header("Authorization")

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token, authorization denied",
//       })
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     // Find user by id
//     const user = await User.findById(decoded.id)
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Attach user to request
//     req.user = user
//     next()
//   } catch (error) {
//     console.error("Auth middleware error:", error)

//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       })
//     }

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Token expired",
//       })
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({ success: false, message: "❌ Access Denied - No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ success: false, message: "❌ Invalid token" });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ success: false, message: "❌ Token expired" });
//     }
//     res.status(401).json({ success: false, message: "❌ Not authorized to access this resource" });
//   }
// };

// module.exports = authMiddleware;

