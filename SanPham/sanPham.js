// Tác giả: Lê Diệu Ái – B2505507
// Tìm sản phẩm trong giỏ hàng: trả về vị trí của nó (so theo id), chưa có thì trả về -1.
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
    const ten = the.querySelector(".product-name").textContent.trim();
    const gia = the.querySelector(".product-price").textContent.trim();
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

// Gắn sự kiện click cho nút thêm vào giỏ và nút + / - của tất cả thẻ sản phẩm.
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

// Đọc từ khóa (?search=) và loại (?loai=) trên thanh địa chỉ
const thamSo = new URLSearchParams(window.location.search);
const tuKhoa = thamSo.get("search");
const loaiTuURL = thamSo.get("loai");
const cacOLoai = document.querySelectorAll('input[name="loai"]');

// Dòng báo khi không có sản phẩm nào khớp: tạo một lần, đặt ở cuối lưới sản phẩm
const luoiSanPham = document.querySelectorAll(".main-section")[0];
const thongBaoRong = document.createElement("p");
thongBaoRong.className = "khong-tim-thay hidden";
luoiSanPham.appendChild(thongBaoRong);

// Lọc sản phẩm:
// Ẩn/hiện từng thẻ sản phẩm theo loại đang tick và từ khóa tìm kiếm.
function locSanPham() {
  const dsLoai = [];
  cacOLoai.forEach((o) => {
    if (o.checked) {
      dsLoai.push(o.value);
    }
  });

  const cacThe = document.querySelectorAll(".product-card");
  let soTheHien = 0;   // đếm số sản phẩm còn hiện sau khi lọc
  cacThe.forEach((the) => {
    let hien = true;

    if (dsLoai.length > 0 && !dsLoai.includes(the.getAttribute("data-loai"))) {
      hien = false;
    }

    if (tuKhoa) {
      const ten = the.querySelector(".product-name").textContent.toLowerCase();
      if (!ten.includes(tuKhoa.toLowerCase())) {
        hien = false;
      }
    }

    if (hien) {
      the.classList.remove("hidden");
      soTheHien++;
    } else {
      the.classList.add("hidden");
    }
  });

  // Không còn sản phẩm nào -> hiện dòng báo thay vì để trang trống
  if (soTheHien === 0) {
    if (tuKhoa) {
      thongBaoRong.textContent = 'Không tìm thấy sản phẩm nào phù hợp với "' + tuKhoa + '".';
    } else {
      thongBaoRong.textContent = "Không có sản phẩm nào thuộc loại đã chọn.";
    }
    thongBaoRong.classList.remove("hidden");
  } else {
    thongBaoRong.classList.add("hidden");
  }
}

//Chạy khi trang tải xong
ganSuKien();

// Tick ô lọc thì lọc lại
cacOLoai.forEach((o) => {
  o.addEventListener("change", locSanPham);
});

// Từ trang chủ bấm vào một loại (?loai=...): tick sẵn ô tương ứng
if (loaiTuURL) {
  cacOLoai.forEach((o) => {
    if (o.value === loaiTuURL) {
      o.checked = true;
    }
  });
}

// Lọc ngay lúc tải trang (áp dụng ?loai=, ?search= và cả ô trình duyệt tự tick lại khi F5)
locSanPham();