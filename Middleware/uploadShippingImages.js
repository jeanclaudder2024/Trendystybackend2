const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `shipping_${Date.now()}_${file.originalname}`,
      bucketName: 'shippingImages' // must match in your GridFSBucket config
    };
  }
});

storage.on('connection', (db) => {
  console.log('Connected to GridFS');
});

storage.on('connectionFailed', (err) => {
  console.error('GridFS connection failed', err);
});

module.exports = multer({ storage });
