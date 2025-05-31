const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploadDirs = () => {
  const profileDir = path.join("public", "uploads", "profile");
  const coverDir = path.join("public", "uploads", "cover");

  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });
  if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });
};

createUploadDirs();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
      cb(null, "public/uploads/profile");
    } else if (file.fieldname === "coverPhoto") {
      cb(null, "public/uploads/cover");
    } else {
      cb(null, "public/uploads");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
