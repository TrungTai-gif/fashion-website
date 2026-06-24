import cloudinary from "../config/cloudinary.js";
import fs from "fs";

class UploadService {
  async uploadImages(files, folder = "uploads") {
    const uploaded = [];
    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto" },
            { format: "webp" },
          ],
        });
        uploaded.push(result.secure_url);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      } catch (err) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        throw err;
      }
    }
    return uploaded;
  }

  async deleteImages(urls = []) {
    if (!urls.length) return;

    const extractPublicId = (url) => {
      const clean = String(url).split("?")[0];
      const match = clean.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
      if (match) return decodeURIComponent(match[1]);
      return decodeURIComponent(
        clean
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "") || ""
      );
    };

    const publicIds = urls.map(extractPublicId).filter(Boolean);
    if (!publicIds.length) return;

    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      console.log("🧹 Deleted from Cloudinary:", result.deleted);
      return result;
    } catch (err) {
      console.error("Cloudinary cleanup error:", err.message);

      // fallback: try deleting one by one
      for (const pid of publicIds) {
        try {
          await cloudinary.uploader.destroy(pid, { resource_type: "image" });
        } catch (e) {
          console.error(`❌ Failed to delete ${pid}:`, e.message);
        }
      }
    }
  }
}

export default new UploadService();
