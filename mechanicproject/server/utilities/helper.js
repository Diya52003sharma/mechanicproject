const cloudinary = require("cloudinary").v2;
require('dotenv').config();
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadImage = (filePath, publicId) => {
  return cloudinary.uploader
    .upload(filePath, { public_id: publicId || undefined })
    .then((uploadResult) => {
      console.log(uploadResult);
      return uploadResult.secure_url;
    })
    .catch(() => null);
};

const getOptimizedImageUrl = (imageId) => {
  return cloudinary.url(imageId, {
    fetch_format: "auto",
    quality: "auto",
  });
};

const getCroppedImageUrl = (imageId) => {
  return cloudinary.url(imageId, {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });
};

const uploadImg = (fileBuffer, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { publicId },
      (error, uploadResult) => {
        if (error) reject({ error: "Upload failed", details: error });
        else resolve(uploadResult.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  uploadImage,
  getOptimizedImageUrl,
  getCroppedImageUrl,
  uploadImg,
};
