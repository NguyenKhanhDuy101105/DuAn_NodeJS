const express = require("express");
const router = express.Router();
const multer = require("multer"); // Cai dat them phuong thuc de upload anh

// Import Middleware upload Cloudinary vừa viết ở bước 1
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");
const storageMulter = require("../../helpers/storageMulter");
const validateCategory = require("../../validate/admin/categoryValidate");
// Cac ham middleware bo tro cho viec upload va validation du lieu khi them moi danh muc

const controllerCateogries = require("../../controllers/admin/categories_controller");

// Cấu hình lưu tạm vào RAM để đẩy lên Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controllerCateogries.getAllCategories);

router.get("/create", controllerCateogries.createGet);

router.post(
  "/create",
  upload.single("thumbnail"), // 1. Đón file từ ô input (name="thumbnail")
  uploadCloud.upload, // 2. Chạy qua trung gian đẩy lên Cloudinary
  validateCategory.validateCreatePost, // 3. Kiểm tra tiêu đề đầu vào
  controllerCateogries.createPost, // 4. Controller Backend bốc req.body.thumbnail lưu vào Database
);

router.get("/edit/:id", controllerCateogries.editGet);
router.post(
  "/edit/:id",
  upload.single("thumbnail"), // 1. Đón file từ ô input (name="thumbnail")
  uploadCloud.upload, // 2. Chạy qua trung gian đẩy lên Cloudinary
  validateCategory.validateCreatePost, // 3. Kiểm tra tiêu đề đầu vào
  controllerCateogries.editPost, // 4. Controller Backend bốc req.body.thumbnail lưu vào Database
);

router.patch("/change-status/:status/:id", controllerCateogries.changeStatus);

router.delete("/delete/:id", controllerCateogries.delete);

router.patch("/restore/:id", controllerCateogries.restore);

// tao router xem chi tiet danh muc
router.get("/detail/:id", controllerCateogries.detail);

router.patch("/change-multi", controllerCateogries.changeMulti);

module.exports = router;
