const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "public/uploads/glb/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "model/gltf-binary") {
    cb(null, true);
  } else {
    cb(new Error("Only .glb files are allowed!"), false);
  }
};

// Increase limits for both the file size and number of files
const uploadGlb = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  },
});

module.exports = { uploadGlb };
