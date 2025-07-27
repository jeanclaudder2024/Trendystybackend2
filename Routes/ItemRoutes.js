const express = require("express");
const mongoose = require("mongoose");
const Item = require("../Models/Item");
const upload = require("../Middleware/Upload"); // Multer memory storage
const { GridFSBucket, ObjectId } = require("mongodb");

const multer = require("../Middleware/Upload"); // using memoryStorage
const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// GET single item by ID
router.get("/:id", async (req, res) => {
  const item = await Item.findOne({ id: parseInt(req.params.id) });
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// POST new item with image (GridFSBucket)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const {
      name,
      country,
      topSelling,
      banner,
      link,
      top3,
      topbrand,
      category,
      rating,
      price,
      discount,
      totalSales,
    } = req.body;

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async (file) => {
      const newItem = new Item({
        name,
        country,
        topSelling: topSelling === "true",
        banner: banner === "true",
        link,
        top3: top3 === "true",
        topbrand: topbrand === "true",
        category,
        rating: parseFloat(rating),
        price: parseFloat(price),
        discount: parseFloat(discount),
        totalSales: parseInt(totalSales),
        imageFileId: uploadStream.id,
      });

      await newItem.save();
      res.status(201).json(newItem);
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create item" });
  }
});

router.put("/:id", multer.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await Item.findOne({ id });

    if (!item) return res.status(404).json({ error: "Item not found" });

    // Step 1: Prepare update object
    const updateData = {
      name: req.body.name,
      country: req.body.country,
      topSelling: req.body.topSelling === "true",
      banner: req.body.banner === "true",
      link: req.body.link,
      top3: req.body.top3 === "true",
      topbrand: req.body.topbrand === "true",
      category: req.body.category,
      rating: parseFloat(req.body.rating),
      price: parseFloat(req.body.price),
      discount: parseFloat(req.body.discount),
      totalSales: parseInt(req.body.totalSales),
    };

    // Step 2: If image uploaded, store new one in GridFS and replace imageFileId
    if (req.file) {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "images",
      });

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", async () => {
        updateData.imageFileId = uploadStream.id;

        const updatedItem = await Item.findOneAndUpdate({ id }, updateData, {
          new: true,
        });
        res.status(200).json(updatedItem);
      });

      uploadStream.on("error", (err) => {
        console.error("Image upload failed:", err);
        res.status(500).json({ error: "Image upload failed" });
      });

      return; // Exit early — response will be sent from `on('finish')`
    }

    // Step 3: No image uploaded — update only data
    const updatedItem = await Item.findOneAndUpdate({ id }, updateData, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ error: "Update failed" });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  const deleted = await Item.findOneAndDelete({ id: parseInt(req.params.id) });
  if (!deleted) return res.status(404).json({ error: "Item not found" });
  res.json({ message: "Item deleted" });
});

// GET image by GridFS file ID
router.get("/image/file/:fileId", async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });

    const id = new ObjectId(req.params.fileId);
    res.set("Content-Type", "image/jpeg");

    bucket
      .openDownloadStream(id)
      .on("error", () => res.status(404).send("Image not found"))
      .pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error streaming image" });
  }
});

module.exports = router;
