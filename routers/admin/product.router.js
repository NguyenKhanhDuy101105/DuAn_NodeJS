const express = require("express");
const router = express.Router();
const multer = require("multer"); // Cai dat them phuong thuc de upload anh
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() }); // Duong dan luu anh tai len
const controllerProduct = require("../../controllers/admin/product_controller");
const validate = require("../../validate/admin/productValidate");
router.get("/", controllerProduct.index);

router.patch("/change-status/:status/:id", controllerProduct.changeStatus);

router.patch("/change-multi", controllerProduct.changeMulti);

router.delete("/delete/:id", controllerProduct.deleteItem);

router.patch("/restore/:id", controllerProduct.restoreItem);

// De di den form tao san pham
router.get("/create", controllerProduct.createGet);
// Gui du lieu thong qua body
router.post(
  "/create",
  upload.single("thumbnail"),
  validate.validateCreatePost,
  controllerProduct.createPost,
);

// De di den form chinh sua san pham
router.get("/edit/:id", controllerProduct.edit);
// Gui du lieu sau khi sua san pham
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.validateCreatePost, // Sua thi cung dung middleware de validate
  controllerProduct.editProduct,
);

// tao router xem chi tiet san pham
router.get("/detail/:id", controllerProduct.getDetail);

module.exports = router;

// Middleware: Ham trung gian phai chay qua ham trung gian trc roi moi chay thang tiep theo
