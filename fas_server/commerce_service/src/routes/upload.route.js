import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import uploadController from "../controllers/upload.controller.js";

const router = express.Router();

// ensure tmp upload dir exists
const tmpDir = path.join(process.cwd(), "tmp", "uploads");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Configure multer with limits: max 10 files, max 5MB per file (tune as needed)
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 10,
  },
});

// POST /api/uploads/images -> handle multipart form-data files (field name: images)
// Wrap handler to catch Multer errors (PayloadTooLarge -> 413)
router.post("/images", (req, res, next) => {
  const handler = upload.array("images", 10);
  handler(req, res, (err) => {
    if (err) {
      // Multer errors have a name property 'MulterError'
      if (
        err.code === "LIMIT_FILE_SIZE" ||
        err.message?.includes("File too large")
      ) {
        return res
          .status(413)
          .json({ message: "File too large", detail: err.message });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res
          .status(413)
          .json({ message: "Too many files", detail: err.message });
      }
      return next(err);
    }
    return uploadController.uploadImages(req, res, next);
  });
});

// DELETE /api/uploads/images -> body: { imageUrl: string } or { imageUrls: [..] }
router.delete("/images", uploadController.deleteImages);

export default router;
