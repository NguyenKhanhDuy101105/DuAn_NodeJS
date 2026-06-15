module.exports = (objectPagination, req, totalNumberProducts) => {
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitedItems;

  // Tinh toan so luong trang can co
  //   const totalNumberProducts = await Product.countDocuments(find); // lay ra so luong tat ca san pham trong bang products
  const totalPage = Math.ceil(
    totalNumberProducts / objectPagination.limitedItems,
  ); // Tong so trang can phan trang, dung Math.ceil() de lam tron
  objectPagination.totalPage = totalPage;

  return objectPagination;
};
