// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  // Additional fields as needed
});

module.exports = mongoose.model('Comment', commentSchema);
