const dashBoardRouter = require("../admin/dashboard.router");
const productRouter = require("../admin/product.router");
const systemConfig = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashBoardRouter);
  app.use(PATH_ADMIN + "/products", productRouter);
};
