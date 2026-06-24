import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log(" Cloudinary connected successfully:", result);
  } catch (error) {
    console.error(" Cloudinary connection failed:", error.message);
  }
};

// Utility functions
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: "fashion-store",
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    };

    const uploadOptions = { ...defaultOptions, ...options };
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export const getCloudinaryUrl = (publicId, transformation = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformation,
  });
};

testCloudinaryConnection();

export default cloudinary;
