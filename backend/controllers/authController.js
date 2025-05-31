const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile");

// signup function
exports.signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      batch,
      regNumber,
      facultyId,
      department,
      company,
      passedOutBatch,
    } = req.body;

    // Validate required fields based on the role
    if (role === "student" && (!batch || !regNumber)) {
      
      return res.status(400).json({ message: "Batch and Registration Number are required for students!" });
    }
    console.log("asd")
    if (role === "faculty" && (!facultyId || !department)) {
      return res.status(400).json({ message: "Faculty ID and Department are required for faculty!" });
    }
    console.log("asd12")
    if (role === "alumni" && (!company || !passedOutBatch)) {
      return res.status(400).json({ message: "Company and Passed Out Batch are required for alumni!" });
    }
    console.log("asd123")

    // Check if the user already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    console.log("asd23")


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role,
      batch: role === "student" ? batch : "",
      regNumber: role === "student" ? regNumber : "",
      facultyId: role === "faculty" ? facultyId : "",
      department: role === "faculty" ? department : "",
      company: role === "alumni" ? company : "",
      passedOutBatch: role === "alumni" ? passedOutBatch : "",
    });
    console.log(newUser)
    // Save the user to the database
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);

    // Create the profile for the user based on their role
    await createUserProfile(savedUser);

    res.status(201).json({ message: "✅ Signup Successful! Please log in." });
  } catch (error) {
    console.error("Signup Error:", error);

    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }

    res.status(500).json({ message: "Server error, please try again later!", error: error.message });
  }
};

// Create profile based on user role
// Create profile based on user role
async function createUserProfile(user) {
  try {
    let profile;
    console.log('reached profile')
    const username = user.name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

    // Create the profile based on user role
    switch (user.role) {
      case "student":
        // StudentProfile({})
        profile = new StudentProfile({
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          batch: user.batch,
          regNumber: user.regNumber,
        });
        break;
      case "faculty":
        profile = new FacultyProfile({
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          facultyId: user.facultyId,
          department: user.department,
        });
        break;
      case "alumni":
        profile = new AlumniProfile({
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          passedOutBatch: user.passedOutBatch,
        });
        break;
      default:
        throw new Error("Invalid role when creating user profile.");
    }
    console.log(profile)
    console.log('dhdhdh')
    // Save the profile to the database
    const savedProfile = await profile.save();
    console.log("Profile created:", savedProfile);
  } catch (error) {
    console.error("Profile Creation Error:", error);
    throw new Error("Error while creating user profile.");
  }
}


// Modified login function to check if profile exists
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "❌ Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid credentials" });
    }

    // Check if profile exists based on role
    let profileExists = false;

    if (user.role === "student") {
      profileExists = await StudentProfile.exists({ userId: user._id });
    } else if (user.role === "faculty") {
      profileExists = await FacultyProfile.exists({ userId: user._id });
    } else if (user.role === "alumni") {
      profileExists = await AlumniProfile.exists({ userId: user._id });
    } else {
      return res.status(400).json({ message: "❌ Invalid user role" });
    }

    // if (!profileExists) {
    //   return res.status(400).json({ message: "❌ Profile not found. Please complete signup properly." });
    // }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// Get current user from token
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    const user = await User.findById(req.user._id)
      .select("_id name email role batch regNumber facultyId department company passedOutBatch")
      .lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      ...user,
    })
  } catch (error) {
    console.error("Error fetching current user:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile");

// // signup function
// exports.signup = async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       role,
//       batch,
//       regNumber,
//       facultyId,
//       department,
//       company,
//       passedOutBatch,
//     } = req.body;

//     // Validate required fields based on the role
//     if (role === "student" && (!batch || !regNumber)) {
      
//       return res.status(400).json({ message: "Batch and Registration Number are required for students!" });
//     }
//     console.log("asd")
//     if (role === "faculty" && (!facultyId || !department)) {
//       return res.status(400).json({ message: "Faculty ID and Department are required for faculty!" });
//     }
//     console.log("asd12")
//     if (role === "alumni" && (!company || !passedOutBatch)) {
//       return res.status(400).json({ message: "Company and Passed Out Batch are required for alumni!" });
//     }
//     console.log("asd123")

//     // Check if the user already exists

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists!" });
//     }
//     console.log("asd23")


//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user
//     const newUser = new User({
//       name: username,
//       email,
//       password: hashedPassword,
//       role,
//       batch: role === "student" ? batch : "",
//       regNumber: role === "student" ? regNumber : "",
//       facultyId: role === "faculty" ? facultyId : "",
//       department: role === "faculty" ? department : "",
//       company: role === "alumni" ? company : "",
//       passedOutBatch: role === "alumni" ? passedOutBatch : "",
//     });
//     console.log(newUser)
//     // Save the user to the database
//     const savedUser = await newUser.save();
//     console.log("User saved:", savedUser);

//     // Create the profile for the user based on their role
//     // await createUserProfile(savedUser);

//     res.status(201).json({ message: "✅ Signup Successful! Please log in." });
//   } catch (error) {
//     console.error("Signup Error:", error);

//     // Check for validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: "Validation failed", errors: error.errors });
//     }

//     res.status(500).json({ message: "Server error, please try again later!", error: error.message });
//   }
// };

// // Create profile based on user role
// // Create profile based on user role
// async function createUserProfile(user) {
//   try {
//     let profile;

//     // Create the profile based on user role
//     switch (user.role) {
//       case "student":
//         profile = new StudentProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           batch: user.batch,
//           regNumber: user.regNumber,
//         });
//         break;
//       case "faculty":
//         profile = new FacultyProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           facultyId: user.facultyId,
//           department: user.department,
//         });
//         break;
//       case "alumni":
//         profile = new AlumniProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           company: user.company,
//           passedOutBatch: user.passedOutBatch,
//         });
//         break;
//       default:
//         throw new Error("Invalid role when creating user profile.");
//     }

//     // Save the profile to the database
//     const savedProfile = await profile.save();
//     console.log("Profile created:", savedProfile);
//   } catch (error) {
//     console.error("Profile Creation Error:", error);
//     throw new Error("Error while creating user profile.");
//   }
// }


// // Modified login function to check if profile exists
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "❌ Email and password are required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "❌ User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

//     // Check if user has a profile based on their role
//     let existingProfile = null;
//     switch (user.role) {
//       case "student":
//         existingProfile = await StudentProfile.findOne({ userId: user._id });
//         break;
//       case "faculty":
//         existingProfile = await FacultyProfile.findOne({ userId: user._id });
//         break;
//       case "alumni":
//         existingProfile = await AlumniProfile.findOne({ userId: user._id });
//         break;
//       default:
//         throw new Error("Invalid role when checking profile.");
//     }

//     if (!existingProfile) {
//       await createUserProfile(user);
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({ message: "✅ Login successful", token, user });
//   } catch (error) {
//     res.status(500).json({ message: "❌ An error occurred", error: error.message });
//   }
// };

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile");

// // signup function
// exports.signup = async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       role,
//       batch,
//       regNumber,
//       facultyId,
//       department,
//       company,
//       passedOutBatch,
//     } = req.body;
//     console.log(req.body);
//     // Validate required fields based on the role
//     if (role === "student" && (!batch || !regNumber)) {
//       return res.status(400).json({ message: "Batch and Registration Number are required for students!" });
//     }
    
//     if (role === "faculty" && (!facultyId || !department)) {
//       return res.status(400).json({ message: "Faculty ID and Department are required for faculty!" });
//     }
    
//     if (role === "alumni" && (!company || !passedOutBatch)) {
//       return res.status(400).json({ message: "Company and Passed Out Batch are required for alumni!" });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists!" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user
//     const newUser = new User({
//       name: username,
//       email,
//       password: hashedPassword,
//       role,
//       batch: role === "student" ? batch : "",
//       regNumber: role === "student" ? regNumber : "",
//       facultyId: role === "faculty" ? facultyId : "",
//       department: role === "faculty" ? department : "",
//       company: role === "alumni" ? company : "",
//       passedOutBatch: role === "alumni" ? passedOutBatch : "",
//     });
    
//     // Save the user to the database
//     const savedUser = await newUser.save();
//     console.log("User saved:", savedUser);

//     // Create the profile for the user based on their role - wrapped in try/catch to prevent failure
//     try {
//       await createUserProfile(savedUser);
//       console.log("Profile created successfully");
//     } catch (profileError) {
//       console.error("Profile Creation Error:", profileError);
//       // Continue with signup even if profile creation fails
//       // We'll create the profile when they log in if it doesn't exist
//     }

//     res.status(201).json({ message: "✅ Signup Successful! Please log in." });
//   } catch (error) {
//     console.error("Signup Error:", error);

//     // Check for validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: "Validation failed", errors: error.errors });
//     }

//     res.status(500).json({ message: "Server error, please try again later!", error: error.message });
//   }
// };

// // Create profile based on user role
// async function createUserProfile(user) {
//   try {
//     let profile;

//     // Create the profile based on user role
//     switch (user.role) {
//       case "student":
//         profile = new StudentProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           batch: user.batch,
//           regNumber: user.regNumber,
//         });
//         break;
//       case "faculty":
//         profile = new FacultyProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           facultyId: user.facultyId,
//           department: user.department,
//         });
//         break;
//       case "alumni":
//         profile = new AlumniProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           company: user.company,
//           passedOutBatch: user.passedOutBatch,
//         });
//         break;
//       default:
//         throw new Error("Invalid role when creating user profile.");
//     }

//     // Save the profile to the database
//     const savedProfile = await profile.save();
//     return savedProfile;
//   } catch (error) {
//     console.error("Profile Creation Error:", error);
//     throw error; // Re-throw to be caught by the caller
//   }
// }

// // Modified login function to check if profile exists and create it if missing
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ message: "❌ Email and password are required" });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "❌ User not found" });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "❌ Invalid credentials" });
//     }

//     // Check if profile exists based on role
//     let profileExists = false;
//     let profile = null;

//     if (user.role === "student") {
//       profile = await StudentProfile.findOne({ userId: user._id });
//     } else if (user.role === "faculty") {
//       profile = await FacultyProfile.findOne({ userId: user._id });
//     } else if (user.role === "alumni") {
//       profile = await AlumniProfile.findOne({ userId: user._id });
//     }

//     profileExists = !!profile;

//     // If profile doesn't exist, create it
//     if (!profileExists) {
//       try {
//         await createUserProfile(user);
//         console.log("Profile created during login for user:", user._id);
//       } catch (error) {
//         console.error("Failed to create profile during login:", error);
//         // Continue with login even if profile creation fails
//       }
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "✅ Login successful",
//       token,
//       user,
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "❌ Server error", error: error.message });
//   }
// };

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile");

// // signup function
// exports.signup = async (req, res) => {
//   try {
//     const {
//       username, // From frontend form
//       email,
//       password,
//       role,
//       batch,
//       regNumber,
//       facultyId,
//       department,
//       company,
//       passedOutBatch,
//     } = req.body;

//     // Validate required fields
//     if (!username || !email || !password || !role) {
//       return res.status(400).json({ message: "Username, email, password and role are required fields!" });
//     }

//     // Validate required fields based on the role
//     if (role === "student" && (!batch || !regNumber)) {
//       return res.status(400).json({ message: "Batch and Registration Number are required for students!" });
//     }
    
//     if (role === "faculty" && (!facultyId || !department)) {
//       return res.status(400).json({ message: "Faculty ID and Department are required for faculty!" });
//     }
    
//     if (role === "alumni" && (!company || !passedOutBatch)) {
//       return res.status(400).json({ message: "Company and Passed Out Batch are required for alumni!" });
//     }

 
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//        // Check if the user already exists
//        const existingUser = await User.findOne({ email });
//        if (existingUser) {
//          return res.status(400).json({ message: "User already exists!" });
//        }
   


//     // Create the new user with name as username
//     const newUser = new User({
//       name: username, // Map username from frontend to name in backend
//       email,
//       password: hashedPassword,
//       role,
//       batch: role === "student" ? batch : "",
//       regNumber: role === "student" ? regNumber : "",
//       facultyId: role === "faculty" ? facultyId : "",
//       department: role === "faculty" ? department : "",
//       company: role === "alumni" ? company : "",
//       passedOutBatch: role === "alumni" ? passedOutBatch : "",
//     });
    
//     // Save the user to the database
//     const savedUser = await newUser.save();
//     console.log("User saved:", savedUser);

//     // Create the profile for the user based on their role
//     try {
//       await createUserProfile(savedUser);
//       res.status(201).json({ message: "✅ Signup Successful! Please log in." });
//     } catch (profileError) {
//       // If profile creation fails, delete the user to maintain consistency
//       await User.findByIdAndDelete(savedUser._id);
//       throw profileError;
//     }
//   } catch (error) {
//     console.error("Signup Error:", error);

//     // Check for validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: "Validation failed", errors: error.errors });
//     }
    
//     // Check for duplicate key errors
//    // In your catch block
// // In your signup controller, update the error handling:
// if (error.code === 11000) {
//   const field = Object.keys(error.keyPattern)[0];
//   return res.status(400).json({ 
//     message: `Duplicate ${field} error. This ${field} may already be in use.` 
//   });
// }

//     res.status(500).json({ message: "Server error, please try again later!", error: error.message });
//   }
// };

// // Create profile based on user role
// async function createUserProfile(user) {
//   try {
//     // First check if a profile already exists for this user
//     let existingProfile;
//     switch (user.role) {
//       case "student":
//         existingProfile = await StudentProfile.findOne({ userId: user._id });
//         break;
//       case "faculty":
//         existingProfile = await FacultyProfile.findOne({ userId: user._id });
//         break;
//       case "alumni":
//         existingProfile = await AlumniProfile.findOne({ userId: user._id });
//         break;
//     }
    
//     if (existingProfile) {
//       console.log("Profile already exists for this user");
//       return existingProfile;
//     }
    
//     let profile;

//     // Create the profile based on user role
//     switch (user.role) {
//       case "student":
//         profile = new StudentProfile({
//           userId: user._id,
//           name: user.name, // Using name field consistently
//           email: user.email,
//           role: user.role,
//           batch: user.batch,
//           regNumber: user.regNumber,
//         });
//         break;
//       case "faculty":
//         profile = new FacultyProfile({
//           userId: user._id,
//           name: user.name, // Using name field consistently
//           email: user.email,
//           role: user.role,
//           facultyId: user.facultyId,
//           department: user.department,
//         });
//         break;
//       case "alumni":
//         profile = new AlumniProfile({
//           userId: user._id,
//           name: user.name, // Using name field consistently
//           email: user.email,
//           role: user.role,
//           company: user.company,
//           passedOutBatch: user.passedOutBatch,
//         });
//         break;
//       default:
//         throw new Error("Invalid role when creating user profile.");
//     }

//     // Save the profile to the database
//     const savedProfile = await profile.save();
//     console.log("Profile created:", savedProfile);
//     return savedProfile;
//   } catch (error) {
//     console.error("Profile Creation Error:", error);
//     throw error; // Propagate the error to be handled by the caller
//   }
// }

// // Login function
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ message: "❌ Email and password are required" });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "❌ User not found" });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "❌ Invalid credentials" });
//     }

//     // Find the profile based on role
//     let profile;
    
//     if (user.role === "student") {
//       profile = await StudentProfile.findOne({ userId: user._id });
//     } else if (user.role === "faculty") {
//       profile = await FacultyProfile.findOne({ userId: user._id });
//     } else if (user.role === "alumni") {
//       profile = await AlumniProfile.findOne({ userId: user._id });
//     }

//     // If profile doesn't exist, create it
//     if (!profile) {
//       try {
//         profile = await createUserProfile(user);
//       } catch (err) {
//         console.error("Error creating profile on login:", err);
//         // Continue with login even if profile creation fails
//       }
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Return user information without sensitive data
//     const userToReturn = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       // Include role-specific fields
//       ...(user.role === "student" && { batch: user.batch, regNumber: user.regNumber }),
//       ...(user.role === "faculty" && { facultyId: user.facultyId, department: user.department }),
//       ...(user.role === "alumni" && { company: user.company, passedOutBatch: user.passedOutBatch }),
//     };

//     res.status(200).json({
//       message: "✅ Login successful",
//       token,
//       user: userToReturn,
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "❌ Server error", error: error.message });
//   }
// };

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile");

// // Signup function
// exports.signup = async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       role,
//       batch,
//       regNumber,
//       facultyId,
//       department,
//       company,
//       passedOutBatch,
//     } = req.body;

//     // Validate required fields based on the role
//     if (role === "student" && (!batch || !regNumber)) {
//       return res.status(400).json({ message: "Batch and Registration Number are required for students!" });
//     }

//     if (role === "faculty" && (!facultyId || !department)) {
//       return res.status(400).json({ message: "Faculty ID and Department are required for faculty!" });
//     }

//     if (role === "alumni" && (!company || !passedOutBatch)) {
//       return res.status(400).json({ message: "Company and Passed Out Batch are required for alumni!" });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists!" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user
//     const newUser = new User({
//       name: username,
//       email,
//       password: hashedPassword,
//       role,
//       batch: role === "student" ? batch : "",
//       regNumber: role === "student" ? regNumber : "",
//       facultyId: role === "faculty" ? facultyId : "",
//       department: role === "faculty" ? department : "",
//       company: role === "alumni" ? company : "",
//       passedOutBatch: role === "alumni" ? passedOutBatch : "",
//     });

//     // Save the user to the database
//     const savedUser = await newUser.save();

//     // Create the profile for the user based on their role
//     await createUserProfile(savedUser);

//     res.status(201).json({ message: "✅ Signup Successful! Please log in." });
//   } catch (error) {
//     console.error("Signup Error:", error);

//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: "Validation failed", errors: error.errors });
//     }

//     res.status(500).json({ message: "Server error, please try again later!", error: error.message });
//   }
// };

// // Create profile based on user role
// async function createUserProfile(user) {
//   try {
//     let profile;

//     switch (user.role) {
//       case "student":
//         profile = new StudentProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           batch: user.batch,
//           regNumber: user.regNumber,
//         });
//         break;
//       case "faculty":
//         profile = new FacultyProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           facultyId: user.facultyId,
//           department: user.department,
//         });
//         break;
//       case "alumni":
//         profile = new AlumniProfile({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           company: user.company,
//           passedOutBatch: user.passedOutBatch,
//         });
//         break;
//       default:
//         throw new Error("Invalid role when creating user profile.");
//     }

//     await profile.save();
//   } catch (error) {
//     console.error("Profile Creation Error:", error);
//     throw new Error("Error while creating user profile.");
//   }
// }

// // Login function
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ message: "❌ Email and password are required" });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "❌ User not found" });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "❌ Invalid credentials" });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "✅ Login successful",
//       token,
//       user,
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "❌ Server error", error: error.message });
//   }
// };
