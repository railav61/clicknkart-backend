const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Existing image storage and filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

// 🆕 Add separate storage and filter for .glb files
const glbStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/glbfiles/")); // save .glb separately
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".glb");
  },
});

const glbFilter = (req, file, cb) => {
  if (
    file.mimetype === "model/gltf-binary" ||
    file.originalname.endsWith(".glb")
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format (only .glb allowed)" }, false);
  }
};

const uploadGlbFile = multer({
  storage: glbStorage,
  fileFilter: glbFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
}).single("glb"); 

// Existing product image resize
const productImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  await Promise.all(
    req.files.map(async (file) => {
      const newPath = `public/images/products/${file.filename}`;
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(newPath);
    })
  );

  next();
};

// Existing blog image resize
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
      fs.unlinkSync(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};

// 🆕 Export updated modules
module.exports = {
  uploadPhoto,
  uploadGlbFile,
  productImgResize,
  blogImgResize,
};
