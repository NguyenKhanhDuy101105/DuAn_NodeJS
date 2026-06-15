const mongoose = require("mongoose"); // ket noi vs MongooDB

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOODB_URL); // chuoi ket noi
    console.log("Ket noi mongoodb thanh cong");
  } catch (error) {
    console.log("Ket noi that bai");
  }
};
