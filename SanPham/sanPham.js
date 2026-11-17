// Tác giả: Lê Diệu Ái – B2505507
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

const orderSelectedProduct = (evt) => {
  const nut = evt.currentTarget;
  const sanPham = nut.closest(".product-card");

  if (typeof Storage !== "undefined") {
    const ten = sanPham.querySelector(".product-name").textContent.trim();
    const gia = sanPham.querySelector(".product-price").textContent.trim();
    const anh = sanPham.querySelector("img").getAttribute("src");

    const soLuongInput = sanPham.querySelector(".qty-input");
    const soLuongChon = parseInt(soLuongInput.value);

    let newItem = {
      id: ten,
      name: ten,
      price: gia,
      image: anh,
      quantity: soLuongChon,
    };

    let updatedCartItems = [];
    if (localStorage.getItem("cartItems") !== null) {
      updatedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    }

    let index = isExistedInCart(newItem, updatedCartItems);
    if (index >= 0) {
      updatedCartItems[index].quantity += soLuongChon;
    } else {
      updatedCartItems.push(newItem);
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    capNhatIconGioHang();
    alert("Đã thêm " + soLuongChon + ' "' + newItem.name + '" vào giỏ hàng.');
  } else {
    alert("Trình duyệt của bạn không hỗ trợ Local storage.");
  }
};

function initializeStoreEvents() {
  const add2CartList = document.querySelectorAll(".add-cart");
  for (let i = 0; i < add2CartList.length; i++) {
    add2CartList[i].addEventListener("click", orderSelectedProduct, false);
  }
  const minusBtns = document.querySelectorAll(".minus-btn");
  minusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.nextElementSibling;
      let val = parseInt(input.value);
      if (val > 1) {
        input.value = val - 1;
      }
    });
  });

  const plusBtns = document.querySelectorAll(".plus-btn");
  plusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.previousElementSibling;
      let val = parseInt(input.value);
      input.value = val + 1;
    });
  });
}

function locSanPham(arry) {
  const data = document.querySelectorAll(".product-card");
  data.forEach((e) => {
    var check = false;
    arry.forEach((i) => {
      const currloai = e.getAttribute("data-loai");
      if (currloai === i) {
        check = true;
        e.classList.remove("hidden");
      }
    });
    if (!check) e.classList.add("hidden");
  });
}
var temp;
window.addEventListener("load", initializeStoreEvents, false);
const loais = document.querySelectorAll('input[name="loai"]');
loais.forEach((e) => {
  e.addEventListener("change", function () {
    const duocchon = document.querySelectorAll('input[name="loai"]:checked');
    var temp = Array.from(duocchon).map(function (item) {
      return item.value;
    });
    if (temp.length) {
      locSanPham(temp);
    } else {
      const data = document.querySelectorAll(".product-card");
      data.forEach((e) => {
        e.classList.remove("hidden");
      });
    }
  });
});

window.addEventListener("load", initializeStoreEvents, false);


const params = new URLSearchParams(window.location.search);
const keyword = params.get("search");
if (keyword) {
    const products = document.querySelectorAll(".product-card");

    products.forEach((product) => {
        const name = product.querySelector(".product-name")
                            .textContent.toLowerCase();

        if (name.includes(keyword.toLowerCase())) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }
    });
}

// ===== ĐỌC LOẠI TỪ TRANG CHỦ =====
var loaiTuTrangChu = new URLSearchParams(window.location.search).get("loai");
console.log("loai nhan duoc:", loaiTuTrangChu);

if (loaiTuTrangChu) {
  var oTick = document.querySelector('input[name="loai"][value="' + loaiTuTrangChu + '"]');
  console.log("o tick tim duoc:", oTick);

  if (oTick) {
    oTick.checked = true;
    locSanPham([loaiTuTrangChu]);
  }
}
