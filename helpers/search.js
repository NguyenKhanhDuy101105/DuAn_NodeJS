module.exports = (req) => {
  let objectSearch = {
    keyword: "",
  };
  if (req.query.keyword) {
    objectSearch.keyword = req.query.keyword;
    // De tim kiem tuong doi thi can dung regex(bieu thuc chinh quy)
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;
    // lay trang thai can loc bang cai req.query
    // req la 1 doi tuong co thuoc tinh query
    // query se tim gia tri sau dau ? la parament cua cai url
    // req.query.status la lay gia tri cua thuoc tinh status
  }
  return objectSearch;
};
