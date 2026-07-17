tinymce.init({
  selector: "textarea.textarea-mce",
  license_key: "gpl",
  plugins: "lists link image table code help wordcount",
  toolbar: "undo redo | blocks | bold italic | image | code",

  // Kích hoạt icon duyệt file nội bộ
  image_title: true,
  automatic_uploads: true,
  file_picker_types: "image",

  // Cấu hình hàm callback theo tài liệu
  file_picker_callback: (cb, value, meta) => {
    // 1. Tự tạo thẻ input file bằng JS
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];

      // 2. Tự xử lý đọc file và gửi lên server (Hoặc chuyển thành Base64 tạm thời)
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const id = "blobid" + new Date().getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        // 3. Trả đường dẫn tạm thời về cho khung nhập của TinyMCE
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    // Kích hoạt hộp thoại chọn file của máy tính
    input.click();
  },
});
