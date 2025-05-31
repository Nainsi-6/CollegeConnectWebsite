// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ProfileSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
//   name: { type: String, },
//   email: { type: String,  },
//   role: { type: String, enum: ["student", "faculty", "alumni"],  },
//   profilePhoto: { type: String, default: "" },
//   coverPhoto: { type: String, default: "" },
//   about: { type: String, default: "" },
//   skills: { type: [String], default: [] },
//   stats: {
//     followers: { type: Number, default: 0 },
//     following: { type: Number, default: 0 },
//     posts: { type: Number, default: 0 }
//   }
// }, {
//   timestamps: true,
//   discriminatorKey: 'roleType'
// });

// // Virtuals for image URLs
// ProfileSchema.virtual('profilePhotoUrl').get(function () {
//   return this.profilePhoto ? `/uploads/profile/${this.profilePhoto}` : '/default-profile.jpg';
// });

// ProfileSchema.virtual('coverPhotoUrl').get(function () {
//   return this.coverPhoto ? `/uploads/cover/${this.coverPhoto}` : '/default-cover.jpg';
// });

// const Profile = mongoose.model("Profile", ProfileSchema);

// // ✅ Student Profile
// const StudentProfile = Profile.discriminator("student", new Schema({
//   branch: { type: String, default: "" },
//   yearOfStudy: { type: String, default: "" },
//   resumeLink: { type: String, default: "" },
//   batch: { type: String, default: "" },
//   regNumber: { type: String, default: "" }
// }));

// // ✅ Faculty Profile
// const FacultyProfile = Profile.discriminator("faculty", new Schema({
//   department: { type: String, default: "" },
//   designation: { type: String, default: "" },
//   researchInterests: { type: [String], default: [] },
//   facultyId: { type: String, default: "" }
// }));

// // ✅ Alumni Profile
// const AlumniProfile = Profile.discriminator("alumni", new Schema({
//   currentJobTitle: { type: String, default: "" },
//   company: { type: String, default: "" },
//   graduationYear: { type: String, default: "" },
//   linkedinProfile: { type: String, default: "" },
//   passedOutBatch: { type: String, default: "" }
// }));

// module.exports = { Profile, StudentProfile, FacultyProfile, AlumniProfile };


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // REMOVE unique: true
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty", "alumni"], required: true },
  profilePhoto: { type: String, default: "" },
  coverPhoto: { type: String, default: "" },
  about: { type: String, default: "" },
  skills: { type: [String], default: [] },
  stats: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    posts: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  discriminatorKey: 'roleType'
});

// Virtuals for image URLs
ProfileSchema.virtual('profilePhotoUrl').get(function () {
  return this.profilePhoto ? `/uploads/profile/${this.profilePhoto}` : '/default-profile.jpg';
});

ProfileSchema.virtual('coverPhotoUrl').get(function () {
  return this.coverPhoto ? `/uploads/cover/${this.coverPhoto}` : '/default-cover.jpg';
});

const Profile = mongoose.model("Profile", ProfileSchema);

// ✅ Student Profile
const StudentProfile = Profile.discriminator("student", new Schema({
  branch: { type: String, default: "" },
  yearOfStudy: { type: String, default: "" },
  resumeLink: { type: String, default: "" },
  batch: { type: String, default: "" },
  regNumber: { type: String, default: "" }
}));

// ✅ Faculty Profile
const FacultyProfile = Profile.discriminator("faculty", new Schema({
  department: { type: String, default: "" },
  designation: { type: String, default: "" },
  researchInterests: { type: [String], default: [] },
  facultyId: { type: String, default: "" }
}));

// ✅ Alumni Profile
const AlumniProfile = Profile.discriminator("alumni", new Schema({
  currentJobTitle: { type: String, default: "" },
  company: { type: String, default: "" },
  graduationYear: { type: String, default: "" },
  linkedinProfile: { type: String, default: "" },
  passedOutBatch: { type: String, default: "" }
}));

module.exports = { Profile, StudentProfile, FacultyProfile, AlumniProfile };