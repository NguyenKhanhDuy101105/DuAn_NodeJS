const systemConfig = require("../../config/system");

module.exports.validateCreatePost = (req, res, next) => {
  if (req.body.title == "") {
    // kiem tra neu ko nhap title hien thi loi
    // Dung flash-message de hien thong bao
    req.flash("error", `Vui long nhap tieu de`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  if (req.body.description == "") {
    req.flash("error", `Vui long nhap mo ta`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  next(); // Cho phep thuc hien hanh dong tiep theo
};

// Day la middleware: ham trung gian xu ly validate
