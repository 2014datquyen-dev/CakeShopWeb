// Lê Thị Khánh Ly - B2404868
var anh = [
    "../images/Anh3.jpg",
    "../images/Anh2.jpg",
    "../images/Anh1.jpg"
];

var link = [
    "../TrangChu/trangChu.html",
    "../TrangChu/trangChu.html",
    "../SanPham/sanPham.html"
];

var i=0;
function doiAnh() {
    i=i+1;
    //het anh thi quanh ve
    if (i==anh.length){
        i=0;
    }
    document.getElementById("bannerImg").src=anh[i];
    document.getElementById("bannerLink").href = link[i];
}

setInterval(doiAnh,3000);

// ===== HỎI ĐÁP: BẤM CÂU HỎI THÌ MỞ / ĐÓNG =====
var cacCauHoi = document.querySelectorAll(".cau-hoi");

for (var n = 0; n < cacCauHoi.length; n++) {
    cacCauHoi[n].onclick = function () {
        // this là nút vừa bấm, parentElement là khối .hd-item chứa nó
      var cauTraLoi = this.nextElementSibling; // thẻ <p> ngay sau nút
        cauTraLoi.classList.toggle("hien");
    };
}

function timTrongGio(sp, gio) {
  for (let i = 0; i < gio.length; i++) {
    if (gio[i].id === sp.id) {
      return i;
    }
  }
  return -1;
}

// Xử lý khi bấm nút "Thêm vào giỏ hàng"
function themVaoGio(e) {
  const nut = e.currentTarget;
  const the = nut.parentElement; // thẻ .product-card chứa nút (truy vấn gián tiếp)

  if (typeof Storage !== "undefined") {
    const ten = the.querySelector("h4").textContent.trim();
    const gia = the.querySelector(".gia").textContent.trim();
    const anh = the.querySelector("img").getAttribute("src");
    const soLuong = parseInt(the.querySelector(".qty-input").value);

    // Tên thuộc tính (id, name, price...) giữ nguyên vì trang Giỏ hàng đọc đúng các tên này
    const spMoi = {
      id: ten,
      name: ten,
      price: gia,
      image: anh,
      quantity: soLuong,
    };

    // Lấy giỏ cũ ra, chưa có thì tạo mảng rỗng
    let gio = [];
    if (localStorage.getItem("cartItems") !== null) {
      gio = JSON.parse(localStorage.getItem("cartItems"));
    }

    // Có rồi thì cộng dồn số lượng, chưa có thì thêm mới
    const viTri = timTrongGio(spMoi, gio);
    if (viTri >= 0) {
      gio[viTri].quantity += soLuong;
    } else {
      gio.push(spMoi);
    }

    localStorage.setItem("cartItems", JSON.stringify(gio));
    capNhatIconGioHang(); // hàm này nằm trong header-footer.js
    alert("Đã thêm " + soLuong + ' "' + spMoi.name + '" vào giỏ hàng.');
  } else {
    alert("Trình duyệt của bạn không hỗ trợ Local storage.");
  }
}

// Gắn sự kiện cho nút thêm vào giỏ và nút + / -
function ganSuKien() {
  const cacNutThem = document.querySelectorAll(".add-cart");
  for (let i = 0; i < cacNutThem.length; i++) {
    cacNutThem[i].addEventListener("click", themVaoGio, false);
  }

  // Nút giảm: ô số nằm ngay sau nút
  const cacNutGiam = document.querySelectorAll(".minus-btn");
  cacNutGiam.forEach((nut) => {
    nut.addEventListener("click", function () {
      const oSo = this.nextElementSibling;
      const so = parseInt(oSo.value);
      if (so > 1) {
        oSo.value = so - 1;
      }
    });
  });

  // Nút tăng: ô số nằm ngay trước nút
  const cacNutTang = document.querySelectorAll(".plus-btn");
  cacNutTang.forEach((nut) => {
    nut.addEventListener("click", function () {
      const oSo = this.previousElementSibling;
      oSo.value = parseInt(oSo.value) + 1;
    });
  });
}

ganSuKien();
