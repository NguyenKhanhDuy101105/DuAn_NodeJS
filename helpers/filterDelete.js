module.exports = (req) => {
  let filterDelete = [
    {
      name: "Chua xoa",
      deleted: "false",
      class: "",
    },
    {
      name: "Da xoa",
      deleted: "true",
      class: "",
    },
  ];
  if (req.query.deleted) {
    // Tra ve vi tri phan tu dau tien thoa man dieu kien
    const index = filterDelete.findIndex(
      (item) => item.deleted == req.query.deleted,
    );
    filterDelete[index].class = "active";
  } else {
    filterDelete[0].class = "active";
  }
  return filterDelete;
};
