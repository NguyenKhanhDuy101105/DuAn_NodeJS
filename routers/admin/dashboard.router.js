const express = require("express");
const router = express.Router();

const controllerDashBoard = require("../../controllers/admin/dashboard_controller");

router.get("/", controllerDashBoard.dashboard);

module.exports = router;
