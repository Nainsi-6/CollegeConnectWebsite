// src/utils/sampleJobs.js
export const getSampleJobs = () => {
  return [
    {
      _id: "job1",
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$80,000 - $100,000",
      skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
      createdAt: new Date().toISOString(),
      views: 45,
      applications: 12,
      applicationLink: "https://example.com/apply",
    },
    {
      _id: "job2",
      title: "Backend Engineer",
      company: "Data Systems Ltd.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      skills: ["Node.js", "Express", "MongoDB", "API Design", "AWS"],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      views: 32,
      applications: 8,
      applicationLink: "https://example.com/apply",
    },
    {
      _id: "job3",
      title: "Full Stack Developer",
      company: "Innovative Apps",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$60/hr",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      views: 67,
      applications: 23,
      applicationLink: "https://example.com/apply",
    },
  ];
};

export const getSampleRecommendedJobs = () => {
  return [
    {
      _id: "rec1",
      title: "Senior React Developer",
      company: "Web Experts Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      skills: ["React", "Next.js", "TypeScript", "GraphQL", "Redux"],
      createdAt: new Date().toISOString(),
      views: 78,
      applications: 34,
      applicationLink: "https://example.com/apply",
      relevanceScore: 0.95,
    },
    {
      _id: "rec2",
      title: "JavaScript Engineer",
      company: "Software Solutions",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$95,000 - $125,000",
      skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      views: 54,
      applications: 21,
      applicationLink: "https://example.com/apply",
      relevanceScore: 0.87,
    },
  ];
};