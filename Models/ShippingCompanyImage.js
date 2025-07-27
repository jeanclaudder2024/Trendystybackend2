const mongoose = require('mongoose');

const ShippingCompanyImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShippingCompanyImage', ShippingCompanyImageSchema);
