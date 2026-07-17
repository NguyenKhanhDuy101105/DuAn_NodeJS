const { default: mongoose } = require("mongoose");
// Import thu vien mongoose de tuong tac voi MongoDB
var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
// Tao Schema(luoc do) cho san pham
const productSchema = new mongoose.Schema(
  {
    product_category_id: {
      type: String,
      default: "",
    },
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
    deletedAt: Date,
    restoredAt: Date,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Tao Model
const Product = mongoose.model("products", productSchema, "products");
// thamso1: Tên của Mode se tuong tac trong NodeJS
// thamso2: Schema da tao o tren
// thamso3: Tên collection trong MongoDB (neu khong co se tu dong them "s" vao sau ten model)
module.exports = Product;

// thuoc tinh timestamps: true se tu dong them 2 truong createdAt va updatedAt vao trong schema,
// va tu dong cap nhat gia tri cho 2 truong nay khi tao moi hoac cap nhat san pham

// slug la: 1. mot thu vien duoc su dung de tao ra cac URL thân thiện với SEO từ các trường dữ liệu trong MongoDB.
// 2. Nó giúp tạo ra các URL dễ đọc và dễ nhớ cho các tài nguyên trên trang web của bạn, thay vì sử dụng các ID hoặc chuỗi ngẫu nhiên.
// 3. Ví dụ: Nếu bạn có một sản phẩm có tiêu đề "Áo thun nam", slug có thể được tạo thành "ao-thun-nam" và URL của sản phẩm sẽ trở nên thân thiện hơn như "www.example.com/products/ao-thun-nam".
