//1. Hàm kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
function isExistedInCart(item, cartItemArr) {
  let myIndex = -1;
  for (let i = 0; i < cartItemArr.length; i++) { //kiem tra cai ID do ton tai chua? -->
    if (cartItemArr[i].id === item.id) {
      myIndex = i;
      break;
    }
  }
  return myIndex;
}

// 2. Hàm xử lý khi người dùng click "Thêm vào giỏ hàng"
const orderSelectedProduct = (evt) => {
  // Tìm cái khung sản phẩm to nhất (.product-card) chứa cái nút vừa bị click
  const nut = evt.currentTarget;
  const sanPham = nut.closest(".product-card");

  if (typeof Storage !== "undefined") {
    // Nhặt thông tin dựa vào các class HTML mà bạn đã đặt
    const ten = sanPham.querySelector(".product-name").textContent.trim();
    const gia = sanPham.querySelector(".product-price").textContent.trim();
    const anh = sanPham.querySelector("img").getAttribute("src");

    // Tạo đối tượng sản phẩm mới
    let newItem = {
      id: ten,
      name: ten,
      price: gia,
      image: anh,
      quantity: 1,
    };

    // Lấy giỏ hàng cũ từ localStorage (nếu có)
    let updatedCartItems = [];
    if (localStorage.getItem("cartItems") !== null) {
      updatedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    }

    // Kiểm tra xem bánh này đã có trong giỏ chưa
    let index = isExistedInCart(newItem, updatedCartItems);
    if (index >= 0) {
      // Có rồi thì tăng số lượng
      updatedCartItems[index].quantity++;
    } else {
      // Chưa có thì thêm mới vào cuối mảng
      updatedCartItems.push(newItem);
    }

    // Lưu mảng mới ngược lại vào localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Thông báo cho người dùng
    alert('Đã thêm "' + newItem.name + '" vào giỏ hàng.');
  } else {
    alert("Trình duyệt của bạn không hỗ trợ Local storage.");
  }
};

// 3. Hàm dò tìm tất cả các nút có chữ "add-cart" và gắn chức năng click cho nó
function addEventToAllCartButtons() {
  const add2CartList = document.querySelectorAll(".add-cart");
  for (let i = 0; i < add2CartList.length; i++) {
    add2CartList[i].addEventListener("click", orderSelectedProduct, false);
  }
}

// Khi trang web tải xong HTML thì tự động chạy hàm gắn chức năng (Hàm số 3)
window.addEventListener("load", addEventToAllCartButtons, false);
