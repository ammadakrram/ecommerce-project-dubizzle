const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');

// Use S3 storage for production
const upload = require('../config/s3');

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // S3 uploads provide the URL in the location property
    const fileUrl = req.file.location;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl
    });
  });
});

// @desc    Upload multiple images (max 5)
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, admin, (req, res, next) => {
  upload.array('images', 5)(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // For S3 storage, get the URLs from the location property
    const fileUrls = req.files.map(file => file.location);

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      urls: fileUrls
    });
  });
});

module.exports = router;
