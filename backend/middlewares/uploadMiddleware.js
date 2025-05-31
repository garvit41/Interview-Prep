const multer = require('multer');
const path = require('path');

// Multer storage configuration for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 'uploads' folder mein save karna
  },
  filename: (req, file, cb) => {
    // Unique filename with timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File upload filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedFileTypes.includes(file.mimetype)) {
    return cb(new Error('Only PDF and image files are allowed'));
  }
  cb(null, true);
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Max 10MB size
  fileFilter: fileFilter,
});

module.exports = upload;
