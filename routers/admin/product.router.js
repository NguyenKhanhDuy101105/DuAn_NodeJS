const express = require("express");
const router = express.Router();
const multer = require("multer"); // Cai dat them phuong thuc de upload anh

// Import Middleware upload Cloudinary vừa viết ở bước 1
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");
const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() }); // Duong dan luu anh tai len
const controllerProduct = require("../../controllers/admin/product_controller");
const validate = require("../../validate/admin/productValidate");

// Cấu hình lưu tạm vào RAM để đẩy lên Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controllerProduct.index);

router.patch("/change-status/:status/:id", controllerProduct.changeStatus);

router.patch("/change-multi", controllerProduct.changeMulti);

router.delete("/delete/:id", controllerProduct.deleteItem);

router.patch("/restore/:id", controllerProduct.restoreItem);

// 1. Tuyến đường TẠO MỚI SẢN PHẨM
router.get("/create", controllerProduct.createGet);
router.post(
  "/create",
  upload.single("thumbnail"), // 1. Đón file từ ô input (name="thumbnail")
  uploadCloud.upload, // 2. Chạy qua trung gian đẩy lên Cloudinary
  validate.validateCreatePost, // 3. Kiểm tra tiêu đề đầu vào
  controllerProduct.createPost, // 4. Controller Backend bốc req.body.thumbnail lưu vào Database
);

// 2. Tuyến đường CHỈNH SỬA SẢN PHẨM
router.get("/edit/:id", controllerProduct.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"), // 1. Đón file ảnh mới (nếu có)
  uploadCloud.upload, // 2. Đẩy lên Cloudinary đổi ảnh mới
  validate.validateCreatePost, // 3. Validate
  controllerProduct.editProduct, // 4. Cập nhật database
);

// tao router xem chi tiet san pham
router.get("/detail/:id", controllerProduct.getDetail);

module.exports = router;

// Middleware: Ham trung gian phai chay qua ham trung gian trc roi moi chay thang tiep theo
