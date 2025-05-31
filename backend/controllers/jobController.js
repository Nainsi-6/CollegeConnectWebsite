// // Fixed jobController.js
// const Job = require("../models/Job");
// const User = require("../models/User");
// const UserPreference = require("../models/UserPreference");
// const { Profile } = require("../models/Profile");

// const natural = require("natural");
// const { TfIdf } = natural;

// // Get all jobs with filtering
// exports.getJobs = async (req, res) => {
//   try {
//     const { 
//       search, 
//       type, 
//       location, 
//       company, 
//       skills, 
//       source,
//       page = 1, 
//       limit = 10 
//     } = req.query;
    
//     const query = { isActive: true };
    
//     // Apply filters
//     if (search) {
//       query.$text = { $search: search };
//     }
    
//     if (type) {
//       query.type = type;
//     }
    
//     if (location) {
//       query.location = { $regex: location, $options: "i" };
//     }
    
//     if (company) {
//       query.company = { $regex: company, $options: "i" };
//     }
    
//     if (skills) {
//       const skillsArray = skills.split(",").map(skill => skill.trim());
//       query.skills = { $in: skillsArray };
//     }
    
//     if (source) {
//       query.source = source;
//     }
    
//     // Pagination
//     const skip = (page - 1) * limit;
    
//     // Get jobs from database
//     const jobs = await Job.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .populate("postedBy", "name email");
    
//     // Get total count for pagination
//     const total = await Job.countDocuments(query);
    
//     res.status(200).json({
//       success: true,
//       jobs,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / limit),
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error("Error getting jobs:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Get recommended jobs for a user
// exports.getRecommendedJobs = async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     // Get user profile and preferences
//     const user = await User.findById(userId);
//     const userPreference = await UserPreference.findOne({ userId }) || { jobPreferences: { skills: [], roles: [] } };
//     const userProfile = await Profile.findOne({ userId });
    
//     // Extract user skills and interests
//     const userSkills = [
//       ...(userProfile?.skills || []),
//       ...(userPreference.jobPreferences?.skills || [])
//     ];
    
//     const userRoles = [
//       user.role,
//       ...(userPreference.jobPreferences?.roles || [])
//     ];
    
//     // Build query based on user profile
//     const query = { isActive: true };
    
//     // If user has skills, prioritize jobs that match those skills
//     if (userSkills.length > 0) {
//       query.$or = [
//         { skills: { $in: userSkills } },
//         { title: { $in: userRoles.map(role => new RegExp(role, 'i')) } }
//       ];
//     }
    
//     // Get jobs that match user profile
//     let jobs = await Job.find(query)
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .populate("postedBy", "name email");
    
//     // Use TF-IDF to rank jobs based on relevance to user skills and interests
//     if (userSkills.length > 0 && jobs.length > 0) {
//       const tfidf = new TfIdf();
      
//       // Add user profile as a document
//       tfidf.addDocument(userSkills.join(' ') + ' ' + userRoles.join(' '));
      
//       // Add each job as a document
//       jobs.forEach((job, index) => {
//         const jobText = `${job.title} ${job.company} ${job.description} ${job.skills.join(' ')}`;
//         tfidf.addDocument(jobText);
//       });
      
//       // Calculate similarity scores
//       const scores = jobs.map((_, index) => {
//         let score = 0;
//         tfidf.tfidfs(userSkills.join(' '), (i, measure) => {
//           if (i === index + 1) { // +1 because user profile is the first document
//             score = measure;
//           }
//         });
//         return score;
//       });
      
//       // Sort jobs by relevance score
//       jobs = jobs.map((job, index) => ({
//         ...job.toObject(),
//         relevanceScore: scores[index]
//       })).sort((a, b) => b.relevanceScore - a.relevanceScore);
//     }
    
//     res.status(200).json({
//       success: true,
//       jobs: jobs.slice(0, 10) // Return top 10 most relevant jobs
//     });
//   } catch (error) {
//     console.error("Error getting recommended jobs:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Sync jobs from external sources
// exports.syncExternalJobs = async (req, res) => {
//   try {
//     const { sources = ["LinkedIn", "Unstop"] } = req.body;
//     let newJobsCount = 0;
    
//     for (const source of sources) {
//       // Placeholder for external API calls
//       console.log(`Fetching jobs from ${source} API`);
//       const externalJobs = [];
      
//       // Process and save each job
//       for (const jobData of externalJobs) {
//         // Check if job already exists
//         const existingJob = await Job.findOne({
//           title: jobData.title,
//           company: jobData.company,
//           source: source
//         });
        
//         if (!existingJob) {
//           const job = new Job({
//             ...jobData,
//             source: source
//           });
          
//           await job.save();
//           newJobsCount++;
//         }
//       }
//     }
    
//     res.status(200).json({
//       success: true,
//       message: `Successfully synced ${newJobsCount} new jobs from external sources`,
//       newJobsCount
//     });
//   } catch (error) {
//     console.error("Error syncing external jobs:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // View job details and track user interaction
// exports.viewJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user._id;
    
//     // Increment view count
//     const job = await Job.findByIdAndUpdate(
//       jobId,
//       { $inc: { views: 1 } },
//       { new: true }
//     ).populate("postedBy", "name email");
    
//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found"
//       });
//     }
    
//     // Track user interaction for recommendation system
//     await UserPreference.findOneAndUpdate(
//       { userId },
//       { 
//         $push: { 
//           viewedJobs: { 
//             jobId, 
//             viewedAt: new Date() 
//           } 
//         } 
//       },
//       { upsert: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       job
//     });
//   } catch (error) {
//     console.error("Error viewing job:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Apply for a job
// exports.applyForJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user._id;
    
//     // Increment application count
//     const job = await Job.findByIdAndUpdate(
//       jobId,
//       { $inc: { applications: 1 } },
//       { new: true }
//     );
    
//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found"
//       });
//     }
    
//     // Track user application for recommendation system
//     await UserPreference.findOneAndUpdate(
//       { userId },
//       { 
//         $push: { 
//           appliedJobs: { 
//             jobId, 
//             appliedAt: new Date() 
//           } 
//         } 
//       },
//       { upsert: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       message: "Successfully applied for job",
//       applicationLink: job.applicationLink
//     });
//   } catch (error) {
//     console.error("Error applying for job:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Update user job preferences
// exports.updateJobPreferences = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { roles, skills, locations, jobTypes, industries, salaryRange } = req.body;
    
//     const updatedPreferences = await UserPreference.findOneAndUpdate(
//       { userId },
//       { 
//         $set: { 
//           jobPreferences: {
//             roles: roles || [],
//             skills: skills || [],
//             locations: locations || [],
//             jobTypes: jobTypes || [],
//             industries: industries || [],
//             salaryRange: salaryRange || { min: 0, max: 0 }
//           }
//         } 
//       },
//       { upsert: true, new: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       message: "Job preferences updated successfully",
//       preferences: updatedPreferences.jobPreferences
//     });
//   } catch (error) {
//     console.error("Error updating job preferences:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// ??????????????????????????????????????????///////////////////////////////

// const Job = require("../models/Job")
// const User = require("../models/User")
// const UserPreference = require("../models/UserPreference")
// const { Profile, StudentProfile, FacultyProfile, AlumniProfile } = require("../models/Profile")
// const natural = require("natural")
// const { TfIdf } = natural

// // Get all jobs with filtering
// exports.getJobs = async (req, res) => {
//   try {
//     const { search, type, location, company, skills, source, page = 1, limit = 10 } = req.query

//     const query = { isActive: true }

//     // Apply filters
//     if (search) {
//       query.$text = { $search: search }
//     }

//     if (type) {
//       query.type = type
//     }

//     if (location) {
//       query.location = { $regex: location, $options: "i" }
//     }

//     if (company) {
//       query.company = { $regex: company, $options: "i" }
//     }

//     if (skills) {
//       const skillsArray = skills.split(",").map((skill) => skill.trim())
//       query.skills = { $in: skillsArray }
//     }

//     if (source) {
//       query.source = source
//     }

//     // Pagination
//     const skip = (page - 1) * limit

//     // Get jobs from database
//     const jobs = await Job.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number.parseInt(limit))
//       .populate("postedBy", "name email")

//     // Get total count for pagination
//     const total = await Job.countDocuments(query)

//     res.status(200).json({
//       success: true,
//       jobs,
//       pagination: {
//         total,
//         page: Number.parseInt(page),
//         pages: Math.ceil(total / limit),
//         limit: Number.parseInt(limit),
//       },
//     })
//   } catch (error) {
//     console.error("Error getting jobs:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Get recommended jobs for a user
// exports.getRecommendedJobs = async (req, res) => {
//   try {
//     const userId = req.user._id
//     console.log(`Finding recommended jobs for user: ${userId}`)

//     // Get user profile and preferences
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Get user preferences
//     const userPreference = await UserPreference.findOne({ userId })

//     // Get user profile - using Profile model with userId filter
//     const userProfile = await Profile.findOne({ userId })

//     // Extract user skills and interests
//     const userSkills = [...(userProfile?.skills || []), ...(userPreference?.jobPreferences?.skills || [])]

//     const userRoles = [user.role, ...(userPreference?.jobPreferences?.roles || [])]

//     console.log(`User skills: ${userSkills.join(", ")}`)
//     console.log(`User roles: ${userRoles.join(", ")}`)

//     // Build query based on user profile
//     const query = { isActive: true }

//     // If user has skills, prioritize jobs that match those skills
//     if (userSkills.length > 0 || userRoles.length > 0) {
//       query.$or = []

//       if (userSkills.length > 0) {
//         // Match any job that has at least one skill matching the user's skills
//         query.$or.push({ skills: { $in: userSkills } })
//       }

//       if (userRoles.length > 0) {
//         // Match jobs with titles containing any of the user's roles
//         const roleRegexes = userRoles.map((role) => new RegExp(role, "i"))
//         query.$or.push({ title: { $in: roleRegexes } })
//       }
//     }

//     console.log("Job query:", JSON.stringify(query))

//     // Get jobs from all sources including LinkedIn and Unstop
//     let jobs = await Job.find(query).sort({ createdAt: -1 }).limit(20).populate("postedBy", "name email")

//     console.log(`Found ${jobs.length} matching jobs`)

//     // Use TF-IDF to rank jobs based on relevance to user skills and interests
//     if ((userSkills.length > 0 || userRoles.length > 0) && jobs.length > 0) {
//       const tfidf = new TfIdf()

//       // Add user profile as a document
//       const userDoc = [...userSkills, ...userRoles].join(" ")
//       tfidf.addDocument(userDoc)

//       // Add each job as a document
//       jobs.forEach((job, index) => {
//         const jobText = `${job.title} ${job.company} ${job.description || ""} ${job.skills ? job.skills.join(" ") : ""}`
//         tfidf.addDocument(jobText)
//       })

//       // Calculate similarity scores
//       const scores = jobs.map((_, index) => {
//         let score = 0
//         tfidf.tfidfs(userDoc, (i, measure) => {
//           if (i === index + 1) {
//             // +1 because user profile is the first document
//             score = measure
//           }
//         })
//         return score
//       })

//       // Sort jobs by relevance score
//       const scoredJobs = jobs
//         .map((job, index) => ({
//           ...job.toObject(),
//           relevanceScore: scores[index],
//         }))
//         .sort((a, b) => b.relevanceScore - a.relevanceScore)

//       // Return top 10 most relevant jobs
//       jobs = scoredJobs.slice(0, 10)
//     }

//     res.status(200).json({
//       success: true,
//       jobs,
//     })
//   } catch (error) {
//     console.error("Error getting recommended jobs:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Sync jobs from external sources (LinkedIn and Unstop)
// exports.syncExternalJobs = async (req, res) => {
//   try {
//     const { sources = ["LinkedIn", "Unstop"] } = req.body
//     let newJobsCount = 0

//     for (const source of sources) {
//       console.log(`Fetching jobs from ${source} API`)

//       // Fetch jobs from external sources
//       let externalJobs = []

//       if (source === "LinkedIn") {
//         // LinkedIn API integration
//         try {
//           const linkedinJobs = await fetchLinkedInJobs()
//           externalJobs = [...externalJobs, ...linkedinJobs]
//           console.log(`Fetched ${linkedinJobs.length} jobs from LinkedIn`)
//         } catch (error) {
//           console.error(`Error fetching LinkedIn jobs: ${error.message}`)
//         }
//       }

//       if (source === "Unstop") {
//         // Unstop API integration
//         try {
//           const unstopJobs = await fetchUnstopJobs()
//           externalJobs = [...externalJobs, ...unstopJobs]
//           console.log(`Fetched ${unstopJobs.length} jobs from Unstop`)
//         } catch (error) {
//           console.error(`Error fetching Unstop jobs: ${error.message}`)
//         }
//       }

//       // Process and save each job
//       for (const jobData of externalJobs) {
//         // Check if job already exists
//         const existingJob = await Job.findOne({
//           title: jobData.title,
//           company: jobData.company,
//           source: source,
//         })

//         if (!existingJob) {
//           const job = new Job({
//             title: jobData.title,
//             company: jobData.company,
//             location: jobData.location,
//             type: jobData.type,
//             description: jobData.description,
//             skills: jobData.skills || [],
//             salary: jobData.salary,
//             applicationLink: jobData.applicationLink,
//             source: source,
//             isActive: true,
//             createdAt: new Date(),
//           })

//           await job.save()
//           newJobsCount++
//         }
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: `Successfully synced ${newJobsCount} new jobs from external sources`,
//       newJobsCount,
//     })
//   } catch (error) {
//     console.error("Error syncing external jobs:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Helper function to fetch LinkedIn jobs
// async function fetchLinkedInJobs() {
//   // This is a placeholder for the actual LinkedIn API integration
//   // You would replace this with actual API calls to LinkedIn

//   // For testing purposes, return some sample LinkedIn jobs
//   return [
//     {
//       title: "Frontend Developer",
//       company: "LinkedIn Company",
//       location: "Remote",
//       type: "Full-time",
//       description: "Frontend development role using React and TypeScript",
//       skills: ["React", "TypeScript", "CSS", "HTML"],
//       salary: "$80,000 - $100,000",
//       applicationLink: "https://linkedin.com/jobs/123",
//     },
//     {
//       title: "Backend Engineer",
//       company: "Tech Solutions via LinkedIn",
//       location: "New York, NY",
//       type: "Full-time",
//       description: "Backend development using Node.js and MongoDB",
//       skills: ["Node.js", "Express", "MongoDB", "API Design"],
//       salary: "$90,000 - $120,000",
//       applicationLink: "https://linkedin.com/jobs/456",
//     },
//   ]
// }

// // Helper function to fetch Unstop jobs
// async function fetchUnstopJobs() {
//   // This is a placeholder for the actual Unstop API integration
//   // You would replace this with actual API calls to Unstop

//   // For testing purposes, return some sample Unstop jobs
//   return [
//     {
//       title: "Software Engineering Intern",
//       company: "Startup via Unstop",
//       location: "Remote",
//       type: "Internship",
//       description: "3-month internship for computer science students",
//       skills: ["Java", "Python", "Data Structures"],
//       salary: "$20/hr",
//       applicationLink: "https://unstop.com/internships/123",
//     },
//     {
//       title: "Machine Learning Research Assistant",
//       company: "AI Lab via Unstop",
//       location: "Bangalore, India",
//       type: "Part-time",
//       description: "Research assistant position for ML enthusiasts",
//       skills: ["Python", "TensorFlow", "Machine Learning"],
//       salary: "$25/hr",
//       applicationLink: "https://unstop.com/jobs/456",
//     },
//   ]
// }

// // View job details and track user interaction
// exports.viewJob = async (req, res) => {
//   try {
//     const { jobId } = req.params
//     const userId = req.user._id

//     // Increment view count
//     const job = await Job.findByIdAndUpdate(jobId, { $inc: { views: 1 } }, { new: true }).populate(
//       "postedBy",
//       "name email",
//     )

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       })
//     }

//     // Track user interaction for recommendation system
//     await UserPreference.findOneAndUpdate(
//       { userId },
//       {
//         $push: {
//           viewedJobs: {
//             jobId,
//             viewedAt: new Date(),
//           },
//         },
//       },
//       { upsert: true },
//     )

//     res.status(200).json({
//       success: true,
//       job,
//     })
//   } catch (error) {
//     console.error("Error viewing job:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Apply for a job
// exports.applyForJob = async (req, res) => {
//   try {
//     const { jobId } = req.params
//     const userId = req.user._id

//     // Increment application count
//     const job = await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } }, { new: true })

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       })
//     }

//     // Track user application for recommendation system
//     await UserPreference.findOneAndUpdate(
//       { userId },
//       {
//         $push: {
//           appliedJobs: {
//             jobId,
//             appliedAt: new Date(),
//           },
//         },
//       },
//       { upsert: true },
//     )

//     res.status(200).json({
//       success: true,
//       message: "Successfully applied for job",
//       applicationLink: job.applicationLink,
//     })
//   } catch (error) {
//     console.error("Error applying for job:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // Update user job preferences
// exports.updateJobPreferences = async (req, res) => {
//   try {
//     const userId = req.user._id
//     const { roles, skills, locations, jobTypes, industries, salaryRange } = req.body

//     const updatedPreferences = await UserPreference.findOneAndUpdate(
//       { userId },
//       {
//         $set: {
//           jobPreferences: {
//             roles: roles || [],
//             skills: skills || [],
//             locations: locations || [],
//             jobTypes: jobTypes || [],
//             industries: industries || [],
//             salaryRange: salaryRange || { min: 0, max: 0 },
//           },
//         },
//       },
//       { upsert: true, new: true },
//     )

//     res.status(200).json({
//       success: true,
//       message: "Job preferences updated successfully",
//       preferences: updatedPreferences.jobPreferences,
//     })
//   } catch (error) {
//     console.error("Error updating job preferences:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }


/////////////////////////////////////////////////////////////////////////////////

const Job = require("../models/Job")
const User = require("../models/User")
const UserPreference = require("../models/UserPreference")
const { Profile } = require("../models/Profile")
const natural = require("natural")
const { TfIdf } = natural
const jobScraperService = require("../services/jobScraperService")

// Get all jobs with filtering
exports.getJobs = async (req, res) => {
  try {
    const { search, type, location, company, skills, source, page = 1, limit = 10 } = req.query

    const query = { isActive: true }

    // Apply filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (type) {
      query.type = { $regex: type, $options: "i" }
    }

    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    if (company) {
      query.company = { $regex: company, $options: "i" }
    }

    if (skills && skills.length > 0) {
      // Handle both string and array formats
      const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills
      query.skills = { $in: skillsArray }
    }

    if (source) {
      query.source = source
    }

    console.log("Filter query:", JSON.stringify(query))

    // Pagination
    const skip = (page - 1) * limit

    // Get jobs from database
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("postedBy", "name email")

    // Get total count for pagination
    const total = await Job.countDocuments(query)

    console.log(`Found ${jobs.length} jobs matching filters (total: ${total})`)

    // Check if we have jobs - if not, trigger a scrape
    if (total === 0) {
      // Start a background scrape without waiting for it to complete
      console.log("No jobs found in database, triggering background scrape")
      this.syncExternalJobsBackground()

      return res.status(200).json({
        success: true,
        message: "No jobs found. Started background job scraping. Please check back in a few minutes.",
        jobs: [],
        pagination: {
          total: 0,
          page: Number.parseInt(page),
          pages: 0,
          limit: Number.parseInt(limit),
        },
      })
    }

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        limit: Number.parseInt(limit),
      },
    })
  } catch (error) {
    console.error("Error getting jobs:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get recommended jobs for a user
exports.getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user._id
    console.log(`Finding recommended jobs for user: ${userId}`)

    // Get user profile and preferences
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user preferences
    const userPreference = await UserPreference.findOne({ userId })

    // Get user profile - using Profile model with userId filter
    const userProfile = await Profile.findOne({ userId })

    // Extract user skills and interests
    const userSkills = [...(userProfile?.skills || []), ...(userPreference?.jobPreferences?.skills || [])]
    const userRoles = [user.role, ...(userPreference?.jobPreferences?.roles || [])]

    console.log(`User skills: ${userSkills.join(", ")}`)
    console.log(`User roles: ${userRoles.join(", ")}`)

    // Check if we have any jobs in the database
    const jobCount = await Job.countDocuments({ isActive: true })

    // If no jobs, trigger a background scrape
    if (jobCount === 0) {
      console.log("No jobs found in database, triggering background scrape")
      this.syncExternalJobsBackground()

      return res.status(200).json({
        success: true,
        message: "No jobs found. Started background job scraping. Please check back in a few minutes.",
        jobs: [],
      })
    }

    // Get all jobs first - we'll rank them based on relevance
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 }).limit(100)

    console.log(`Found ${jobs.length} jobs to rank for recommendations`)

    // If user has no skills or roles, just return recent jobs
    if (userSkills.length === 0 && userRoles.length === 0) {
      return res.status(200).json({
        success: true,
        jobs: jobs.slice(0, 10), // Return the 10 most recent jobs
      })
    }

    // Use TF-IDF to rank jobs based on relevance to user skills and interests
    const tfidf = new TfIdf()

    // Add user profile as a document
    const userDoc = [...userSkills, ...userRoles].join(" ")
    tfidf.addDocument(userDoc)

    // Add each job as a document
    jobs.forEach((job) => {
      const jobText = `${job.title} ${job.company} ${job.description || ""} ${job.skills ? job.skills.join(" ") : ""}`
      tfidf.addDocument(jobText)
    })

    // Calculate similarity scores
    const scoredJobs = jobs.map((job, index) => {
      let score = 0
      tfidf.tfidfs(userDoc, (i, measure) => {
        if (i === index + 1) {
          // +1 because user profile is the first document
          score = measure
        }
      })

      return {
        ...job.toObject(),
        relevanceScore: score,
      }
    })

    // Sort jobs by relevance score
    const rankedJobs = scoredJobs.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Return top 10 most relevant jobs
    res.status(200).json({
      success: true,
      jobs: rankedJobs.slice(0, 10),
    })
  } catch (error) {
    console.error("Error getting recommended jobs:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Background job sync function (doesn't wait for completion)
exports.syncExternalJobsBackground = () => {
  // Run the scraping in the background without waiting
  jobScraperService
    .scrapeAllJobs()
    .then(async (scrapedJobs) => {
      console.log(`Background scrape completed. Processing ${scrapedJobs.length} jobs.`)

      let newJobsCount = 0

      // Process and save each job
      for (const jobData of scrapedJobs) {
        try {
          // Check if job already exists by using a more specific query
          const existingJob = await Job.findOne({
            title: jobData.title,
            company: jobData.company,
            applicationLink: jobData.applicationLink,
          })

          if (!existingJob) {
            // Create a new job document
            const job = new Job({
              title: jobData.title,
              company: jobData.company,
              location: jobData.location || "Remote",
              type: jobData.type || "Full-time",
              description: jobData.description || "",
              skills: jobData.skills || [],
              salary: jobData.salary || "Not specified",
              applicationLink: jobData.applicationLink,
              source: jobData.source,
              isActive: true,
              views: 0,
              applications: 0,
              createdAt: new Date(),
            })

            // Save the job to the database
            await job.save()
            console.log(`Saved new job: ${job.title} at ${job.company}`)
            newJobsCount++
          }
        } catch (err) {
          console.error(`Error saving job: ${err.message}`)
        }
      }

      console.log(`Background job sync completed. Added ${newJobsCount} new jobs.`)
    })
    .catch((error) => {
      console.error(`Background job sync error: ${error.message}`)
    })
}

// Sync jobs from external sources (LinkedIn, Unstop, Indeed)
exports.syncExternalJobs = async (req, res) => {
  try {
    const { sources = ["LinkedIn", "Unstop", "Indeed"] } = req.body

    console.log(`Starting job sync with sources: ${sources.join(", ")}`)

    // Check if we already have jobs in the database
    const existingJobsCount = await Job.countDocuments({ isActive: true })

    // Start a background scrape
    this.syncExternalJobsBackground()

    // Immediately return success to the user
    res.status(200).json({
      success: true,
      message: "Job scraping started in the background. New jobs will be available soon.",
      existingJobsCount,
    })
  } catch (error) {
    console.error("Error starting job sync:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// View job details and track user interaction
exports.viewJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user._id

    // Increment view count
    const job = await Job.findByIdAndUpdate(jobId, { $inc: { views: 1 } }, { new: true }).populate(
      "postedBy",
      "name email",
    )

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Track user interaction for recommendation system
    await UserPreference.findOneAndUpdate(
      { userId },
      {
        $push: {
          viewedJobs: {
            jobId,
            viewedAt: new Date(),
          },
        },
      },
      { upsert: true },
    )

    res.status(200).json({
      success: true,
      job,
    })
  } catch (error) {
    console.error("Error viewing job:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user._id

    // Increment application count
    const job = await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } }, { new: true })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Track user application for recommendation system
    await UserPreference.findOneAndUpdate(
      { userId },
      {
        $push: {
          appliedJobs: {
            jobId,
            appliedAt: new Date(),
          },
        },
      },
      { upsert: true },
    )

    res.status(200).json({
      success: true,
      message: "Successfully applied for job",
      applicationLink: job.applicationLink,
    })
  } catch (error) {
    console.error("Error applying for job:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Update user job preferences
exports.updateJobPreferences = async (req, res) => {
  try {
    const userId = req.user._id
    const { roles, skills, locations, jobTypes, industries, salaryRange } = req.body

    const updatedPreferences = await UserPreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          jobPreferences: {
            roles: roles || [],
            skills: skills || [],
            locations: locations || [],
            jobTypes: jobTypes || [],
            industries: industries || [],
            salaryRange: salaryRange || { min: 0, max: 0 },
          },
        },
      },
      { upsert: true, new: true },
    )

    res.status(200).json({
      success: true,
      message: "Job preferences updated successfully",
      preferences: updatedPreferences.jobPreferences,
    })
  } catch (error) {
    console.error("Error updating job preferences:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
