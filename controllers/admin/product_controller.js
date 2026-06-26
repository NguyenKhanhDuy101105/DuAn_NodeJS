const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const filterDeleteHelper = require("../../helpers/filterDelete");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Goi chuc nang loc da dinh nghia ben Helper
  const filter = filterStatusHelper(req);
  // Vi ham kia tra ve 1 mang Object nen tao bien filter
  const search = searchHelper(req);
  // Goi chuc nang loc theo delete
  const deleteHeper = filterDeleteHelper(req);
  // Tao 1 bien loc theo dieu kien
  let find = {};
  // Doc su thay doi tren url cua web theo bien delete
  if (req.query.deleted) {
    find.deleted = req.query.deleted;
  } else {
    find.deleted = false;
  }
  // Doc su thay doi tren url cua web theo bien status
  if (req.query.status) {
    // Them 1 thuoc tinh cho bien loc, loc theo status
    find.status = req.query.status;
  }
  // Doc su thay doi tren url cua web theo bien keyword
  if (search.regex) {
    // Cai search.regex la cai bien cua object cai ten ma minh nhap trong o nhap
    find.title = search.regex;
  }

  console.log(req.query);
  // Panigation(Phan trang)
  const totalNumberProducts = await Product.countDocuments(find); // lay ra so luong tat ca san pham trong bang products

  let objectPagination = paginationHelper(
    {
      limitedItems: 4, // 4 san pham 1 trang
      currentPage: 1, // trang hien tai dang dung
    },
    req,
    totalNumberProducts,
  );

  // Tao 1 doi tuong sort de sap xep theo lua chon
  let sort = {};
  // Kiem tra xem sau ? co sortKey va sortValue ko
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    // Mac dinh la de no sap theo theo position: desc giam dan
    sort.position = "desc";
  }

  const products = await Product.find(find) // lay tat ca san pham trang thai chua bi xoa
    .sort(sort) // sap xep giam dan theo vi tri position
    .limit(objectPagination.limitedItems) // limit(so san pham): chi lay theo so luong bao nhieu
    .skip(objectPagination.skip); // skip(so): bo qua bao bieu san pham roi moi bat dau lay

  res.render("admin/pages/product/index", {
    products: products,
    filterStatus: filter,
    filterDelete: deleteHeper,
    keyword: search.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params); // tra ve 1 Object chua cac gia tri sau dau : trong duong truyen url
  try {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status }); // Dung de update 1 san pham theo cai id truyen vao
    // va update duoc nhieu thuoc tinh cua san pham do

    // Dung flash-message de hien thong bao
    req.flash("success", "Cap nhat trang thai san pham thanh cong");

    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/products`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl); // Tu dong chuyen huong ve trang trc khi chuyen di
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type; // Lay ra cai gia tri muon thay doi cho san pham
    const ids = req.body.ids.split(", "); // lay ra danh sach cac id san pham nguoi dung da chon
    switch (type) {
      case "active":
        await Product.updateMany({ _id: { $in: ids } }, { status: "active" }); // update nhieu san pham cung 1 luc va duoc nhieu thuoc tinh
        // Dung flash-message de hien thong bao
        req.flash(
          "success",
          `Cap nhat trang thai san pham thanh cong cua: ${ids.length} san pham`,
        );
        break;
      case "inactive":
        await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
        // Dung flash-message de hien thong bao
        req.flash(
          "success",
          `Cap nhat trang thai san pham thanh cong cua: ${ids.length} san pham`,
        );
        break;
      case "deleteAll":
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() },
        );
        // Dung flash-message de hien thong bao
        req.flash("success", `Xoa nhieu san pham thanh cong`);
        break;
      case "changePosition":
        // dung for-of duyet qua cac phan tu cua mang ids vua nhap
        for (const item of ids) {
          // dung destructuring va split de tach id va position
          let [id, position] = item.split("-");
          // ep kieu position ve number
          position = parseInt(position);
          // cap nhat lai thong tin cho cac phan tu duoc chon
          await Product.updateOne({ _id: id }, { position: position });
        }
        // Dung flash-message de hien thong bao
        req.flash(
          "success",
          `Doi vi tri san pham thanh cong cua: ${ids.length} san pham`,
        );
        break;
      default:
        break;
    }
    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/products`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  console.log(req.params); // tra ve 1 Object chua cac gia tri sau dau : trong duong truyen url
  try {
    const id = req.params.id; // Lay ra id san pham tu url
    await Product.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() },
    ); // Dung de xoa 1 san pham theo cai id truyen vao

    // Dung flash-message de hien thong bao
    req.flash("success", `Xoa san pham thanh cong`);

    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/products`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl); // Tu dong chuyen huong ve trang trc khi chuyen di
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
  try {
    const id = req.params.id; // lay ra id san pham tu url
    await Product.updateOne(
      { _id: id },
      { deleted: false, restoredAt: new Date() },
    );

    // Dung flash-message de hien thong bao
    req.flash("success", `Khoi phuc san pham thanh cong`);

    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/products`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl); // Tu dong chuyen huong ve trang trc khi chuyen di
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/create => dan den form nhap
module.exports.createGet = (req, res) => {
  res.render("admin/pages/product/create", {
    titlePage: "Them moi san pham",
  });
};
// [POST] /admin/products/${systemConfig.prefixAdmin}/products => gui du lieu len server
module.exports.createPost = async (req, res) => {
  // Chuyen doi ve dung kieu du lieu luu trong database
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  // position tu tang
  if (req.body.position === "") {
    // Lay so luong ban ghi trong mongoo
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    // Truong hop nguoi dung dien so vao
    req.body.position = parseInt(req.body.position);
  }
  // Gan trang thai xoa ban dau bang false
  req.body.deleted = false;
  // Them thoi gian tao moi san pham
  req.body.createAt = new Date();
  // Khi dung multer them hinh anh cho san pham thi
  // no tu them thuoc tinh file cho req
  // console.log(req.file);
  // if (req.file) {
  //   // Luu duong link file anh vao thuoc tinh anh
  //   req.body.thumbnail = `/uploads/${req.file.filename}`; // filename len ten multer tao cho anh khi upload
  // }
  // Tao moi san pham nhung chua luu trong mongoo
  const product = new Product(req.body);
  // No se nhan du lieu tu form ng dung gui len va nam trong body
  console.log(req.body);
  // Cau lenh de luu san pham vao mongoo
  await product.save();
  // Dung flash-message de hien thong bao
  req.flash("success", `Them moi san pham thanh cong`);
  // Quay lai trang danh sach san pham
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id => dan den form sua san pham
module.exports.edit = async (req, res) => {
  try {
    var product = await Product.findById(req.params.id, { deleted: false });
    res.render("admin/pages/product/edit", {
      titlePage: "Them moi san pham",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id => nhan du lieu sua va cap nhat trong mongoose
module.exports.editProduct = async (req, res) => {
  // Van nhan dc noi dung gui trong req.body lam tuong tu nhu them moi
  // Chuyen doi ve dung kieu du lieu luu trong database
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.position = parseInt(req.body.position);
  // if (req.file) {
  //   // Luu duong link file anh vao thuoc tinh anh
  //   req.body.thumbnail = `/uploads/${req.file.filename}`; // filename len ten multer tao cho anh khi upload
  // }
  try {
    // Lay ra san pham trung id, va cap nhat thong tin moi
    await Product.updateOne({ _id: req.params.id }, req.body);
    // Dung flash-message de hien thong bao
    req.flash("success", `Cap nhat san pham thanh cong`);
  } catch (error) {
    req.flash("error", `Cap nhat san pham that bai`);
  }

  // Quay lai trang danh sach san pham
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] admin/products/detail/:id => xem chi tiet san pham
module.exports.getDetail = async (req, res) => {
  try {
    var product = await Product.findOne({ _id: req.params.id });
    res.render("admin/pages/product/detail", {
      titlePage: "Chi tiet san pham",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// So sanh giua req.params va req.query va req.body
// req.params: tra ve Object chua cac gia tri cua cac bien duoc dinh nghia bien dong : trong dg dan url
// req.params: Chọc thẳng vào 1 đối tượng cụ thể
// req.query: tra ve Object chua cac gia tri cua cac bien sau dau ? cac cap key-value noi nhau bang dau &
// req.query: Tác động lên cả danh sách (Lọc/Tìm/Phân trang)
// req.body: tra ve Object chua cac gia tri dc gui len tu phia Client
// req.body: Lấy toàn bộ dữ liệu nằm ẩn bên trong thân của Form hoặc gói tin dữ liệu gửi lên.
//  Muốn lấy ô nào thì chỉ cần chấm tới thuộc tính name của ô đó (Ví dụ: req.body.type, req.body.ids).
