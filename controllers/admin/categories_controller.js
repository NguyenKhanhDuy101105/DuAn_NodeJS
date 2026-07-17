// IMPORT CAC THANH PHAN CAN SU DUNG
const Category = require("../../models/category.model"); // Lay ra model Category de su dung
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const filterDeleteHelper = require("../../helpers/filterDelete");
const createTree = require("../../helpers/createTree");

// [GET] /admin/categories
module.exports.getAllCategories = async (req, res) => {
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
  const totalNumberProducts = await Category.countDocuments(find); // lay ra so luong tat ca san pham trong bang categories

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

  const categories = await Category.find(find); // lay tat ca san pham trang thai chua bi xoa
  // .sort(sort) // sap xep giam dan theo vi tri position
  // .limit(objectPagination.limitedItems) // limit(so san pham): chi lay theo so luong bao nhieu
  // .skip(objectPagination.skip); // skip(so): bo qua bao bieu san pham roi moi bat dau lay

  let newList = createTree(categories);

  res.render("admin/pages/categories/index", {
    categories: newList,
    filterStatus: filter,
    filterDelete: deleteHeper,
    keyword: search.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/categories/create
module.exports.createGet = async (req, res) => {
  let condition = {
    deleted: false,
  };

  let listCategories = await Category.find(condition);
  let newList = createTree(listCategories);

  res.render("admin/pages/categories/create", {
    titlePage: "Tạo mới danh mục",
    newList: newList,
  });
};

// [POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
  // Kiem tra xem position nguoi dung tu tang hay tang tu dong
  if (!req.body.position) {
    // Neu chua nhap
    let count = await Category.countDocuments(); // countDocuments() dem so luong ban ghi cua ban Categories trong Mongoose
    req.body.position = count + 1;
  } else {
    // Neu nguoi dung tu nhap tu chuyen sang int
    req.body.position = parseInt(req.body.position);
  }
  // Gan thai ban dau cho danh muc
  req.body.deleted = false;
  // Them thoi gian khi tao moi
  req.body.createAt = new Date();
  // Tao moi danh moi nhung chua luu trong mongoo
  const category = new Category(req.body);
  // Cau lenh de luu danh muc vao mongoo
  await category.save();
  // Dung flash-message de hien thong bao
  req.flash("success", `Them moi danh muc thanh cong`);
  // Quay lai trang danh sach san pham
  res.redirect(`${systemConfig.prefixAdmin}/categories`);
};

// [GET] /admin/categories/edit/:id => dan den form sua san pham
module.exports.editGet = async (req, res) => {
  try {
    let condition = {
      deleted: false,
    };

    let listCategories = await Category.find(condition);
    let newList = createTree(listCategories);

    var category = await Category.findById(req.params.id, { deleted: false });
    res.render("admin/pages/categories/edit", {
      titlePage: "Chinh sua danh muc",
      category: category,
      newList: newList,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

// [PATCH] /admin/categories/edit/:id => nhan du lieu sua va cap nhat trong mongoose
module.exports.editPost = async (req, res) => {
  req.body.position = parseInt(req.body.position);
  try {
    // Lay ra danh muc trung id, va cap nhat thong tin moi
    await Category.updateOne({ _id: req.params.id }, req.body);
    // Dung flash-message de hien thong bao
    req.flash("success", `Cap nhat danh muc thanh cong`);
  } catch (error) {
    req.flash("error", `Cap nhat danh muc that bai`);
  }

  // Quay lai trang danh sach san pham
  res.redirect(`${systemConfig.prefixAdmin}/categories`);
};

// [PATCH] /admin/categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params); // tra ve 1 Object chua cac gia tri sau dau : trong duong truyen url
  try {
    const status = req.params.status;
    const id = req.params.id;

    await Category.updateOne({ _id: id }, { status: status }); // Dung de update 1 danh muc theo cai id truyen vao
    // va update duoc nhieu thuoc tinh cua san pham do

    // Dung flash-message de hien thong bao
    req.flash("success", "Cap nhat trang thai danh muc thanh cong");

    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/categories`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl); // Tu dong chuyen huong ve trang trc khi chuyen di
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

// [DELETE] /admin/categories/delete/:id
module.exports.delete = async (req, res) => {
  console.log(req.params); // tra ve 1 Object chua cac gia tri sau dau : trong duong truyen url
  try {
    const id = req.params.id; // Lay ra id danh muc tu url
    await Category.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() },
    ); // Dung de xoa 1 danh muc theo cai id truyen vao

    // Dung flash-message de hien thong bao
    req.flash("success", `Xoa danh muc thanh cong`);

    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/categories`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl); // Tu dong chuyen huong ve trang trc khi chuyen di
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

// [PATCH] /admin/categories/restore/:id
module.exports.restore = async (req, res) => {
  try {
    const id = req.params.id; // lay ra id danh muc tu url
    await Category.updateOne(
      { _id: id },
      { deleted: false, restoredAt: new Date() },
    );

    // Dung flash-message de hien thong bao
    req.flash("success", `Khoi phuc danh muc thanh cong`);

    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/categories`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl); // Tu dong chuyen huong ve trang trc khi chuyen di
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

// [GET] admin/categories/detail/:id => xem chi tiet danh muc
module.exports.detail = async (req, res) => {
  try {
    var category = await Category.findOne({ _id: req.params.id });
    res.render("admin/pages/categories/detail", {
      titlePage: "Chi tiet danh muc",
      category: category,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};

// [PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type; // Lay ra cai gia tri muon thay doi cho danh muc
    const ids = req.body.ids.split(", "); // lay ra danh sach cac id danh muc nguoi dung da chon
    switch (type) {
      case "active":
        await Category.updateMany({ _id: { $in: ids } }, { status: "active" }); // update nhieu danh muc cung 1 luc va duoc nhieu thuoc tinh
        // Dung flash-message de hien thong bao
        req.flash(
          "success",
          `Cap nhat trang thai danh muc thanh cong cua: ${ids.length} danh muc`,
        );
        break;
      case "inactive":
        await Category.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" },
        );
        // Dung flash-message de hien thong bao
        req.flash(
          "success",
          `Cap nhat trang thai danh muc thanh cong cua: ${ids.length} danh muc`,
        );
        break;
      case "deleteAll":
        await Category.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() },
        );
        // Dung flash-message de hien thong bao
        req.flash("success", `Xoa nhieu danh muc thanh cong`);
        break;
      case "changePosition":
        // dung for-of duyet qua cac phan tu cua mang ids vua nhap
        for (const item of ids) {
          // dung destructuring va split de tach id va position
          let [id, position] = item.split("-");
          // ep kieu position ve number
          position = parseInt(position);
          // cap nhat lai thong tin cho cac phan tu duoc chon
          await Category.updateOne({ _id: id }, { position: position });
        }
        // Dung flash-message de hien thong bao
        req.flash(
          "success",
          `Doi vi tri danh muc thanh cong cua: ${ids.length} danh muc`,
        );
        break;
      default:
        break;
    }
    const backUrl =
      req.get("Referer") || `${systemConfig.prefixAdmin}/categories`; // lay ra chinh xac trang trc khi chuyen huong
    res.redirect(backUrl);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
  }
};
