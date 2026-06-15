const productRouter = require("./product.router");
const homeRouter = require("./home.router");

module.exports = (app) => {
  // app.get("/", (req, res) => {
  //   res.render("client/pages/home/index", {
  //     titlePage: "Day la trang HOME",
  //   });
  // });
  app.use("/products", productRouter);
  app.use("/", homeRouter);
};
