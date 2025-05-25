const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinaryglb");

const uploadGlbFile = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const { path } = file;
      const uploadedFile = await cloudinaryUploadImg(path);
      fs.unlinkSync(path); // Delete local file
      return uploadedFile;
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    res.status(200).json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ message: "GLB file upload failed: " + error.message });
  }
});

const deleteGlbFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const response = await cloudinaryDeleteImg(id);
    res
      .status(200)
      .json({ success: true, message: "File deleted successfully", response });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "GLB file deletion failed" });
  }
});

module.exports = {
  uploadGlbFile,
  deleteGlbFile,
};
