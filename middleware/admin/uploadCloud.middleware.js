const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.upload = (req, res, next) => {
  // Nếu người dùng không upload ảnh mới, cho phép bỏ qua để đi tiếp luôn sang controller
  if (!req.file) {
    next();
    return;
  }

  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) resolve(result);
        else reject(error);
      });
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  streamUpload(req.file.buffer)
    .then((result) => {
      // Gán link ảnh online do Cloudinary cấp vào req.body.thumbnail
      req.body.thumbnail = result.secure_url;
      next(); // Bật đèn xanh cho phép chạy tiếp sang hàm validate và controller lưu DB
    })
    .catch((error) => {
      res.status(500).json({ error: "Upload ảnh thất bại!", detail: error });
    });
};
