function createTree(arr, parentId = "") {
  const tree = [];

  arr.forEach((item) => {
    const newItem = item.toObject ? item.toObject() : item;

    if (String(newItem.parent_id) === String(parentId)) {
      // Gọi lại chính tên hàm đã khai báo ở trên
      const children = createTree(arr, newItem._id);

      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });

  return tree;
}

// Export hàm có tên cụ thể ra ngoài
module.exports = createTree;
