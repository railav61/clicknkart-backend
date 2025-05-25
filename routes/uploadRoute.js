const express = require("express");
const {
  uploadImages,
  deleteImages,
  uploadGlb,
  deleteGlb,
} = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
  uploadGlbFile,
} = require("../middlewares/uploadImage");
const multer = require("multer");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  (req, res, next) => {
    req.files.forEach((file) =>
      console.log(file.originalname, file.size + " bytes")
    );
    next();
  },
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);
const test = async (req, res, next) => {
  console.log("hello");
  next();
};
const handleGlbUpload = (req, res, next) => {
  uploadGlbFile(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("Multer error:", err.message);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.log("Unknown error:", err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
router.post("/glb", authMiddleware, isAdmin, handleGlbUpload, uploadGlb);
router.delete("/delete-glb/:id", authMiddleware, isAdmin, deleteGlb);

module.exports = router;
