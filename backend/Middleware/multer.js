const multer = require('multer');
const path = require('path');

// Memory storage (for Cloudinary)
const storage = multer.memoryStorage();

// Allowed file types
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const fileFilter = (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, JPEG, PNG, and WEBP profilePic are allowed!'));
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

// Middleware to handle errors properly
const uploadMiddleware = (req, res, next) => {
    upload.single('profilePic')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        next();
    });
};

module.exports = { upload, uploadMiddleware };
