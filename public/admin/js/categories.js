// Change-Status
// Lay ra cac nut bam chuyen trang thai tren san pham
const buttonChangeStatus = document.querySelectorAll("[button-chang-status]");

if (buttonChangeStatus.length > 0) {
  // Lay ra cai form
  const formChangeStatus = document.querySelector("#form-change-status");
  // Lay ra gia tri cua thuoc tinh path tren form
  const path = formChangeStatus.getAttribute("data-path");
  // bat su kien khi click vao nut trang thai tren 1 san pham
  buttonChangeStatus.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      // lay gia tri status cua san pham do
      const status = item.getAttribute("data-status");
      // lay id cua san pham do
      const id = item.getAttribute("data-id");
      // Chuyen status thanh gia tri nguoc lai
      let statusChange = status == "active" ? "inactive" : "active";
      // ket noi duong dan de dan den url mong muon
      const action = path + `/${statusChange}/${id}?_method=PATCH`;

      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
