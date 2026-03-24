import multer from 'multer';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
// import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// --- INITIALIZATION ---
// Safe absolute path to the root 'uploads' folder
const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure local uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const uploadToCloudinary = async (filePath) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) return filePath;

    const result = await cloudinary.uploader.upload(filePath, { 
      folder: 'dream-tickets',
      resource_type: 'auto', 
      flags: "attachment" 
    });

    // Cleanup: Delete local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw new Error("File upload to Cloudinary failed: " + error.message);
  }
};

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `ticket-${Date.now()}-${path.extname(file.originalname) || '.bin'}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter: (req, file, cb) => {
    const allowed = /image\/(jpeg|png|gif|webp)|application\/pdf|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.ms-excel|text\/csv/;
    if (allowed.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only Images, PDFs, and Excel files are allowed'));
  },
});

export const uploadTicketFiles = upload;










