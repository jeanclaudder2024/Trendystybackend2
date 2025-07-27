const multer = require('multer');

// Store in memory, then pipe to GridFSBucket manually
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
