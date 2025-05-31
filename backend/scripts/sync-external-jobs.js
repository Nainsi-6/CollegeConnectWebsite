require("dotenv").config()
const mongoose = require("mongoose")
const Job = require("../models/Job")

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Sample LinkedIn jobs
const linkedInJobs = [
  {
    title: "Frontend Developer",
    company: "LinkedIn Company",
    location: "Remote",
    type: "Full-time",
    description: "Frontend development role using React and TypeScript",
    skills: ["React", "TypeScript", "CSS", "HTML"],
    salary: "$80,000 - $100,000",
    applicationLink: "https://linkedin.com/jobs/123",
    source: "LinkedIn",
  },
  {
    title: "Backend Engineer",
    company: "Tech Solutions via LinkedIn",
    location: "New York, NY",
    type: "Full-time",
    description: "Backend development using Node.js and MongoDB",
    skills: ["Node.js", "Express", "MongoDB", "API Design"],
    salary: "$90,000 - $120,000",
    applicationLink: "https://linkedin.com/jobs/456",
    source: "LinkedIn",
  },
  {
    title: "Full Stack Developer",
    company: "Innovative Tech via LinkedIn",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Full stack development with React and Node.js",
    skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
    salary: "$100,000 - $130,000",
    applicationLink: "https://linkedin.com/jobs/789",
    source: "LinkedIn",
  },
]

// Sample Unstop jobs
const unstopJobs = [
  {
    title: "Software Engineering Intern",
    company: "Startup via Unstop",
    location: "Remote",
    type: "Internship",
    description: "3-month internship for computer science students",
    skills: ["Java", "Python", "Data Structures"],
    salary: "$20/hr",
    applicationLink: "https://unstop.com/internships/123",
    source: "Unstop",
  },
  {
    title: "Machine Learning Research Assistant",
    company: "AI Lab via Unstop",
    location: "Bangalore, India",
    type: "Part-time",
    description: "Research assistant position for ML enthusiasts",
    skills: ["Python", "TensorFlow", "Machine Learning"],
    salary: "$25/hr",
    applicationLink: "https://unstop.com/jobs/456",
    source: "Unstop",
  },
  {
    title: "Web Development Intern",
    company: "Tech Startup via Unstop",
    location: "Delhi, India",
    type: "Internship",
    description: "Web development internship for college students",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    salary: "$15/hr",
    applicationLink: "https://unstop.com/internships/789",
    source: "Unstop",
  },
]

// Combine all jobs
const allJobs = [...linkedInJobs, ...unstopJobs]

// Function to save jobs to database
async function saveJobs() {
  try {
    let newJobsCount = 0

    for (const jobData of allJobs) {
      // Check if job already exists
      const existingJob = await Job.findOne({
        title: jobData.title,
        company: jobData.company,
        source: jobData.source,
      })

      if (!existingJob) {
        const job = new Job({
          ...jobData,
          isActive: true,
          createdAt: new Date(),
        })

        await job.save()
        newJobsCount++
        console.log(`Added job: ${jobData.title} from ${jobData.source}`)
      } else {
        console.log(`Job already exists: ${jobData.title} from ${jobData.source}`)
      }
    }

    console.log(`Successfully added ${newJobsCount} new jobs`)
    process.exit(0)
  } catch (error) {
    console.error("Error saving jobs:", error)
    process.exit(1)
  }
}

// Run the function
saveJobs()
