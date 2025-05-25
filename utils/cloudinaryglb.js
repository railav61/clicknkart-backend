const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dmqwpwo6c",
  api_key: process.env.API_KEY || "341643281674123",
  api_secret: process.env.SECRET_KEY || "SU4f_FvQSJxTK0Yx0lkMs5qtzlY",
});

const cloudinaryUploadImg = async (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload,
      { resource_type: "auto", folder: "glb_files" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

const cloudinaryDeleteImg = async (filePublicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(filePublicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
