const { default: mongoose } = require("mongoose");
const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({}); // lay tat ca ban ghi trong bang products
  const productsActive = await Product.find({
    status: "active", // Lay ra cac san pham co trang thai status = "active"
    deleted: false,
  }).sort({ position: "asc" }); // sap xep theo tang dan position

  res.render("client/pages/products/index", {
    titlePage: "Day la trang san pham",
    products: products,
  });
};

// [GET] products/detail/:id => xem chi tiet san pham ben client bang id
// module.exports.getDetailClientById = async (req, res) => {
//   const product = await Product.findOne({ _id: req.params.id });

//   res.render("client/pages/products/detail", {
//     titlePage: "Day la trang chi tiet san pham",
//     product: product,
//   });
// };

// [GET] products/detail/:slug => xem chi tiet san pham ben client bang slug
module.exports.getDetailClientBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      // Neu san pham ko co thuoc tinh slug nen product ko ton tai
      res.redirect(`/products`); // Chuyen ve trang danh sach san pham
    }
    res.render("client/pages/products/detail", {
      titlePage: "Day la trang chi tiet san pham",
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
