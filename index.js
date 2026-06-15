require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override"); // Nhung cai ghi de phuong thuc POST
const bodyParser = require("body-parser"); // Nhung cai de doc du lieu body Client gui request len
const flash = require("express-flash"); // Nhung cai de hien thi thong bao sau khi chuyen huong

const app = express(); // la toan bo chuong trinh
const port = process.env.PORT; // cong

//Import 2 thư viện quản lý session độc lập
const cookieParser = require("cookie-parser");
const session = require("express-session");

// 1. ĐẶT TOÀN BỘ CẤU HÌNH MIDDLEWARE LÊN TRÊN ĐẦU
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public")); // Cau lenh de public du lieu ra ngoai

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// Chuyển dòng này lên trên TRƯỚC KHI gọi các hàm Router
app.use(methodOverride("_method"));

// Cấu hình biến toàn cục cho Pug dùng chung
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Cau hinh Flash de hien thong bao
app.use(cookieParser("NguyenKhanhDuy")); // Sử dụng biến cookieParser vừa require ở trên
app.use(
  session({
    secret: "NguyenKhanhDuy", // Thêm khóa bí mật để mã hóa session
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
);
app.use(flash()); // Đặt express-flash nằm DƯỚI session thì nó mới hoạt động được

// 2. SAU ĐÓ MỚI ĐẾN GỌI CÁC ROUTER CHẠY
const routerClient = require("./routers/client/index.router");
const routerAdmin = require("./routers/admin/index.router");
routerClient(app);
routerAdmin(app);

// 3. CUỐI CÙNG LÀ KẾT NỐI DATABASE VÀ KHỞI CHẠY SERVER
const database = require("./config/database");
database.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
