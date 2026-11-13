// 1. Hàm kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
function isExistedInCart(item, cartItemArr) {
  let myIndex = -1;
  for (let i = 0; i < cartItemArr.length; i++) {
    if (cartItemArr[i].id === item.id) {
      myIndex = i;
      break;
    }
  }
  return myIndex;
}

// 2. Hàm xử lý khi người dùng click "Thêm vào giỏ hàng"
const orderSelectedProduct = (evt) => {
  const nut = evt.currentTarget;
  const sanPham = nut.closest(".product-card");

  if (typeof Storage !== "undefined") {
    const ten = sanPham.querySelector(".product-name").textContent.trim();
    const gia = sanPham.querySelector(".product-price").textContent.trim();
    const anh = sanPham.querySelector("img").getAttribute("src");

    // ILẤY SỐ LƯỢNG MÀ NGƯỜ DÙNG VỪA BẤM CHỌN
    const soLuongInput = sanPham.querySelector(".qty-input");
    const soLuongChon = parseInt(soLuongInput.value);

    let newItem = {
      id: ten,
      name: ten,
      price: gia,
      image: anh,
      quantity: soLuongChon, // Sử dụng số lượng người dùng đã chọn thay vì mặc định là 1
    };

    let updatedCartItems = [];
    if (localStorage.getItem("cartItems") !== null) {
      updatedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    }

    let index = isExistedInCart(newItem, updatedCartItems);
    if (index >= 0) {
      // Có rồi thì cộng thêm số lượng vừa chọn mới vào
      updatedCartItems[index].quantity += soLuongChon;
    } else {
      updatedCartItems.push(newItem);
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    alert("Đã thêm " + soLuongChon + ' "' + newItem.name + '" vào giỏ hàng.');
  } else {
    alert("Trình duyệt của bạn không hỗ trợ Local storage.");
  }
};

// 3. Hàm tạo chức năng cho các nút [+], [-] và nút "Thêm vào giỏ hàng"
function initializeStoreEvents() {
  // Gắn sự kiện cho các nút Thêm vào giỏ hàng
  const add2CartList = document.querySelectorAll(".add-cart");
  for (let i = 0; i < add2CartList.length; i++) {
    add2CartList[i].addEventListener("click", orderSelectedProduct, false);
  }

  // Gắn sự kiện cho nút Trừ (-)
  const minusBtns = document.querySelectorAll(".minus-btn");
  minusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Tìm ô input nằm ngay bên cạnh nút trừ
      const input = this.nextElementSibling;
      let val = parseInt(input.value);
      if (val > 1) {
        input.value = val - 1; // Chỉ giảm nếu giá trị đang lớn hơn 1
      }
    });
  });

  // Gắn sự kiện cho nút Cộng (+)
  const plusBtns = document.querySelectorAll(".plus-btn");
  plusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Tìm ô input nằm ngay đằng trước nút cộng
      const input = this.previousElementSibling;
      let val = parseInt(input.value);
      input.value = val + 1; // Tăng thêm 1
    });
  });
}

// Khi trang web tải xong HTML thì tự động chạy hàm gắn chức năng
window.addEventListener("load", initializeStoreEvents, false);
