const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true },  // unique identifier
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const pageContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'privacy_policy'
  title: { type: String, required: true },            // e.g., 'Privacy Policy'
  sections: [sectionSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PageContent', pageContentSchema);
