module.exports = (req) => {
  let filterStatus = [
    {
      name: "Tat ca",
      status: "",
      class: "",
    },
    {
      name: "Hoat dong",
      status: "active",
      class: "",
    },
    {
      name: "Dung hoat dong",
      status: "inactive",
      class: "",
    },
  ];
  if (req.query.status) {
    // Tra ve vi tri phan tu dau tien thoa man dieu kien
    const index = filterStatus.findIndex(
      (item) => item.status == req.query.status,
    );
    filterStatus[index].class = "active";
  } else {
    // Tim luon doi tuong co req.query.status = "" tuc la tat ca va gan cho o active
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }
  return filterStatus;
};
