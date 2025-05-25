const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);

      // Now safely delete the file after Cloudinary has it
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    res.json(urls);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ status: "fail", message: "Image upload failed" });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadGlb = asyncHandler(async (req, res) => {
  try {
    
    if (!req.file) throw new Error("No GLB file uploaded");

    const { path } = req.file;

    const newPath = await cloudinaryUploadImg(path, "raw");
    res.json(newPath);
  } catch (error) {
    console.log(error);
    res.json(error);
    // throw new Error(error.message);
  }
});

// Deleting GLB file
const deleteGlb = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await cloudinaryDeleteImg(id, "raw");
  res.json({ message: "GLB deleted", id: id });
});

module.exports = {
  uploadImages,
  deleteImages,
  uploadGlb,
  deleteGlb,
};
