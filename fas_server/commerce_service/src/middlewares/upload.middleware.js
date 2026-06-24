// middlewares/upload.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "./uploads";

// Đảm bảo thư mục uploads tồn tại
const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✓ Created uploads directory");
  }
};

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 4,
  },
});

export const removeImage = (file) => {
  if (file && file.filename) {
    const filePath = path.resolve("uploads", file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete file:", err.message);
        } else {
          console.log("Deleted temp file:", filePath);
        }
      });
    }
  }
};
