const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product_controller");

router.get("/", controller.index);

// Tao router xem chi tiet san pham ben client bang id
// router.get("/detail/:id", controller.getDetailClientById);

// Tao router xem chi tiet san pham ben client bang ten slug
router.get("/detail/:slug", controller.getDetailClientBySlug);

module.exports = router;
