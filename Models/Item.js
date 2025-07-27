const mongoose = require('mongoose');
const Counter = require('./Counter');

const itemSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  imageFileId: { type: mongoose.Schema.Types.ObjectId, required: false },
  country: { type: String },
  topSelling: { type: Boolean, default: false },
  banner: { type: Boolean, default: false },
  link: { type: String },
  top3: { type: Boolean, default: false },
  topbrand: { type: Boolean, default: false },
  category: {
    type: String,
    enum: [
      "Health and Beauty",
      "Electronic Gadgets",
      "Unique Items",
      "Exotic Foods",
      "Sports and Fitness",
      "Home Appliance and Decor",
      "Kids and Babies",
      "Travel & Outdoor",
      "Office & Stationery",
      "Toys & Hobbies",
      "Auto & Accessories",
      "Books & Learning",
      "Gifts & Occasions",
      "Home Cleaning & Storage",
    ],
  },
  rating: { type: Number, min: 1, max: 5 },
  price: { type: Number },
  discount: { type: Number },
  totalSales: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});


// Auto-increment ID before saving
itemSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: 'itemId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
