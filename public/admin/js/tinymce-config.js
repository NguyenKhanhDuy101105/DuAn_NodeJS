tinymce.init({
  selector: "textarea.textarea-mce",

  // --- THÊM DÒNG NÀY ĐỂ BỎ QUA CẢNH BÁO LICENSE KEY ---
  license_key: "gpl",
  // ---------------------------------------------------

  plugins: "lists link image table code help wordcount",
  toolbar:
    "undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image table | removeformat | code",
  height: 400,
  branding: false,
});
