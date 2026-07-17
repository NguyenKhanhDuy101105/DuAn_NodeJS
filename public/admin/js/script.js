// Button status
// lay cac the button co attribute = button-status
const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  // Lay ra url cua man hinh hien tai:
  let url = new URL(window.location.href);

  buttonStatus.forEach((item) => {
    item.addEventListener("click", () => {
      // lay ra gia tri cua attribute
      const status = item.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      console.log(url.href);
      // Chuyen huong man hinh den dia chi url vua tao ra
      window.location.href = url.href;
    });
  });
}

// lay ra form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    // e.target.elements: tap hop cac phan tu co trong form do
    // Co the co nhieu radio, button hoac input
    // e.target.elements.keyword: lay ra phan tu trong form co name = "keyword"
    const keyword = e.target.elements.keyword.value; // lay ra noi dung o input trong form
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    // Chuyen huong man hinh den dia chi url vua tao ra
    window.location.href = url.href;
  });
}

// lay ra danh sach cac nut phan trang
const listElementPagination = document.querySelectorAll("[button-pagination]");

if (listElementPagination.length > 0) {
  // Lay ra url cua man hinh hien tai:
  let url = new URL(window.location.href);

  listElementPagination.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(item.getAttribute("button-pagination")); // lay ra tri cua page hien tai
      url.searchParams.set("page", page);
      // Chuyen huong man hinh den dia chi url vua tao ra
      window.location.href = url.href;
    });
  });
}

// LOGIC CAP NHAT TRANG THAI NHIEU SAN PHAM
// Lay ra cai bang san pham de lam chuc nang checkAll
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
  // Lay ra element checkAll
  const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
  // Lay cac o check cua san pham
  const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");
  // Xu ly logic khi bam vao all thi tat ca neu khac checked va bam lan nua thi unchecked
  inputCheckAll.addEventListener("click", (e) => {
    const isCheckAll = inputCheckAll.checked;
    inputsId.forEach((item) => {
      item.checked = isCheckAll;
    });
  });
  // Xu ly logic khi chon tung o rieng le
  inputsId.forEach((item) => {
    item.addEventListener("click", (e) => {
      const countChecked = checkBoxMulti.querySelectorAll(
        "input[name='id']:checked",
      ).length; // lay ra cac o checkbox co trang thai checked
      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// Lay ra form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    // Lay ra cai table
    const checkBoxMulti = document.querySelector("[checkbox-multi]");
    // Lay ra cac o input da checked
    const inputsChecked = checkBoxMulti.querySelectorAll(
      "input[name='id']:checked",
    );

    // Lay ra gia tri ma nguoi dung chon o option
    const typeChoose = e.target.elements.type.value; // lay ra gia tri phan tu trong khoi nay
    // co name = type va lay ra gia tri
    if (typeChoose == "deleteAll") {
      const isConfirm = confirm(
        "Ban co chac chan muon xoa cac san pham nay khong?",
      );
      if (!isConfirm) {
        return;
      }
    }

    // Lay ra o input nhap co name = ids
    const inputIds = document.querySelector("input[name='ids']");
    if (inputsChecked.length > 0) {
      let ids = [];
      // Duyet cac the dang duoc tich
      inputsChecked.forEach((item) => {
        const id = item.getAttribute("value");
        if (typeChoose == "changePosition") {
          const position = item
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id); // Day id cua cac input dc chon vao mang ids
        }
      });
      inputIds.value = ids.join(", "); // dien gia tri cac id vua duoc chon vao o, de hien thi cho nguoi dung

      formChangeMulti.submit();
    } else {
      alert("Vui long chon san pham");
    }
  });
}
// KET THUC

// LOGIC XOA SAN PHAM
// Lay ra nut xoa tren tung san pham
const buttonDelete = document.querySelectorAll("[buttonDelete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonDelete.forEach((item) => {
    item.addEventListener("click", (e) => {
      const isConfirm = confirm(
        "Ban co chac chan muon xoa san pham nay khong?",
      );
      if (isConfirm) {
        const id = item.getAttribute("data-id");
        const action = path + `/${id}?_method=DELETE`;
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}

// LOGIC KHOI PHUC SAN PHAM
// Lay ra cac nut khoi phuc san pham tren san pham da bi xoa
const buttonRestore = document.querySelectorAll("[button-restore]");
// kiem tra xem co cac nut do ko roi tiep tuc logic
if (buttonRestore.length > 0) {
  // lay ra form an de ti submit() gui action moi len url
  const formRestoreItem = document.querySelector("#form-restore-item");
  // lay ra path mac dinh cua form roi ti + them cai id cua san pham roi moi gui di
  const path = formRestoreItem.getAttribute("data-path");
  // Duyet qua tung nut va bat su kien click
  buttonRestore.forEach((item) => {
    item.addEventListener("click", (e) => {
      // lay ra id san pham
      const id = item.getAttribute("data-id");
      // tao chuoi action moi chuan bi gui di
      const action = path + `/${id}?_method=PATCH`;
      // gan lai cho form thuoc tinh action bang action vua tao
      formRestoreItem.action = action;
      // Gui len url action khi form bam submit()
      formRestoreItem.submit();
    });
  });
}

// LOGIC LOC SAN PHAM THEO DELETE
// Lay cac nut loc theo thuoc tinh button-delete
const filterDeleteButtons = document.querySelectorAll("[button-deleted]");
// Kiem tra xem co nut do ko, neu co tiep tuc logic
if (filterDeleteButtons.length > 0) {
  // lay ra url hien tai
  const url = new URL(window.location.href);
  // duyet va tung nut va bat su kien click
  filterDeleteButtons.forEach((item) => {
    item.addEventListener("click", (e) => {
      const isDelete = item.getAttribute("button-deleted"); // gia tri cua nut vua chon
      if (isDelete) {
        // neu ma ton tai gia tri thi them delete vao url
        url.searchParams.set("deleted", isDelete);
      } else {
        url.searchParams.delete("deleted");
      }
      // chuyen huong den url moi
      window.location.href = url.href;
    });
  });
}

// LOGIC DE AN HIEN THONG BAO
// Lay ra cai alert co thuoc tinh show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  // Lay gia tri thoi gian quy dinh va chuyen ve Int
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden"); // Sau 5s them class de an alert di
  }, time);
  // Lay ra nut dong thong bao X
  const closeAlert = document.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

// XU LY LOGIC PREVIEW IMAGE
// Lay ra form nhap anh
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const btnDeletePreview = document.querySelector("[btn-delete-preview]");

  // Kiểm tra lúc load trang, nếu KHÔNG có ảnh cũ (src rỗng hoặc không tồn tại) thì mới ẩn khung preview
  if (
    !uploadImagePreview.getAttribute("src") ||
    uploadImagePreview.getAttribute("src") === ""
  ) {
    uploadImagePreview.classList.add("d-none");
    if (btnDeletePreview) btnDeletePreview.classList.add("d-none");
  }

  // Bắt sự kiện khi thay đổi (chọn) ảnh mới
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.classList.remove("d-none"); // Hiện khung ảnh
      uploadImagePreview.src = URL.createObjectURL(file); // Đổi thành ảnh mới chọn
      if (btnDeletePreview) btnDeletePreview.classList.remove("d-none"); // Hiện nút X
    }
  });

  // Bắt sự kiện khi bấm nút Xóa ảnh (X)
  if (btnDeletePreview) {
    btnDeletePreview.addEventListener("click", (e) => {
      uploadImageInput.value = ""; // Xóa dữ liệu input file
      uploadImagePreview.src = ""; // Xóa đường dẫn ảnh
      btnDeletePreview.classList.add("d-none"); // Ẩn nút X đi
      uploadImagePreview.classList.add("d-none"); // Ẩn luôn khung preview
    });
  }
}

// LOGIC SAP XEP THEO TIEU CHI
// Lay ra cai select
const selectSort = document.querySelector("select[name='sort']");
// Kiem tra xem co ton tai ko
if (selectSort) {
  // Lay ra url hien tai cua web
  let url = new URL(window.location.href);
  // Lang nghe su kien option duoc chon trong select
  selectSort.addEventListener("change", (e) => {
    // Lay ra value cua the option do
    const dive = e.target.value.split("-"); // luc dive la 1 mang 2 pham tu ["position","desc"]
    // Dung destructing lay ra sortKey va sortValue
    const [sortKey, sortValue] = dive;
    // Cai key-value vao url hien tai
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    // Sau khi them thi di den url moi
    window.location.href = url.href;
  });

  // Lay ra nut clear sap xep
  const clearSort = document.querySelector("[sort-clear]");
  if (clearSort) {
    // Lang nghe su kien
    clearSort.addEventListener("click", (e) => {
      // Xoa sortKey va valueKey ra khoi url
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
      // Sau khi them thi di den url moi
      window.location.href = url.href;
    });
  }
  // Them seleted = true cho option duoc chon
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  if (sortKey && sortValue) {
    // Ghep gia tri
    const value = `${sortKey}-${sortValue}`;
    // Tim kiem the option theo gia tri value
    const selectedOption = selectSort.querySelector(`option[value='${value}']`);
    selectedOption.selected = true; // selected la thuoc tinh co san cua the option nen co the gan truc tiep, neu ko phai trung setAttribute
  }
}

// LOGIC ACTIVE CHO SIDER
const ul = document.querySelector("[navigation]");
if (ul) {
  const a = ul.querySelectorAll("li a"); // Danh sach cac the a
  // dung foreach duyet cac the a so sanh gia tri href cua no
  // co bang voi url hien tai ko neu co thi them active ko thi bo active
  // Lay ra url hien tai cua web
  let url = new URL(window.location.href); // url nay co thuoc tinh ten la pathname: "/admin/products" vay ta se lay thuoc tinh nay de so sanh
  a.forEach((item) => {
    const href = item.getAttribute("href"); // Lay ra cac gia tri cua thuoc tinh href cua the a
    if (href == url.pathname) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
      item.classList.add("text-white");
    }
  });
}

// LOGIC LOC SAN PHAM THEO DANH MUC
// Lay ra cac select chua cac danh muc cha
const select_category = document.querySelector("[selected_category]");
if (select_category) {
  // Lay url hien tai cua web
  let url = new URL(window.location.href);
  // Lang nghe su kien khi select thay doi gia tri
  select_category.addEventListener("change", (e) => {
    // Them 1 thuoc tinh moi len duong dan url
    url.searchParams.set("selected_category", e.target.value);
    // di den duong dan vua moi tao
    window.location.href = url.href;
  });

  // LOGIC GIAO DIEN KHI CHON LOC SAN PHAM THEO DANH MUC CHA
  let list_option = select_category.querySelectorAll("option");
  // duyet qua tung phan tu trong danh sach cac option cua select
  list_option.forEach((item) => {
    // Lay gia tri cua thuoc tinh selected_category
    let value = url.searchParams.get("selected_category");
    // So sanh xem id cua option co trung voi gia tri khong neu co them thuoc tinh selected vao the option
    if (value === item.value) {
      item.setAttribute("selected", true); // item.selected = true;
    }
  });
  // Lay ra nut xoa loc san pham theo danh muc
  const deleted_category = document.querySelector("[deleted_category_id]");

  if (deleted_category) {
    // Lay nghe su kien no duoc click
    deleted_category.addEventListener("click", (e) => {
      // Lay url hien tai
      let url = new URL(window.location.href);
      // Xoa thuoc tinh selected_category tren url di
      url.searchParams.delete("selected_category");
      // Di den url sau khi xoa thuoc tinh selected_category
      window.location.href = url.href;
    });
  }
}
