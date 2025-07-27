const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');
const ShippingCompanyImage = require('../Models/ShippingCompanyImage');
const upload = require('../Middleware/uploadShippingImages');

const router = express.Router();

// Upload shipping company image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file || !req.file.id) {
      return res.status(400).json({ error: 'File not uploaded correctly' });
    }

    const imageFileId = req.file.id;

    const newImage = new ShippingCompanyImage({ name, imageFileId });
    await newImage.save();

    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});


// Get image file by ID
router.get('/image/:fileId', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'shippingImages' });
    const id = new ObjectId(req.params.fileId);

    res.set('Content-Type', 'image/jpeg');
    bucket.openDownloadStream(id).on('error', () => res.sendStatus(404)).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Image fetch failed' });
  }
});

// Get all shipping company image metadata
router.get('/', async (req, res) => {
  const data = await ShippingCompanyImage.find().sort({ createdAt: -1 });
  res.json(data);
});

router.get('/image/file/:fileId', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'shippingImages' });
    const fileId = new ObjectId(req.params.fileId);

    res.set('Content-Type', 'image/jpeg'); // or detect dynamically if needed
    bucket.openDownloadStream(fileId)
      .on('error', () => res.status(404).send('Image file not found'))
      .pipe(res);
  } catch (err) {
    console.error('Error streaming image:', err);
    res.status(500).json({ error: 'Error retrieving image' });
  }
});

module.exports = router;
