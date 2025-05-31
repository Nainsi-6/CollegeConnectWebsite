const multer = require('multer');

// Set up memory storage to handle file buffer (if you need buffer handling)
const storage = multer.memoryStorage();

// Optional: Limit file size for this specific use case (5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
}).single('file');  // 'file' is the field name in the form

module.exports = upload;
