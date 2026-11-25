// Tác giả: Huỳnh Thiên Bảo - B2405021
// Định dạng số tiền theo tiền Việt Nam (ví dụ 450.000 ₫)
const formatCurrency = (amount, locale = "vi-VN") => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Lấy giá dạng số từ chuỗi giá (ví dụ "450.000đ" -> 450000)
function layGiaSo(price) {
  return Number(String(price).replace(/[^0-9]/g, ""));
}

// Đọc giỏ hàng từ localStorage (key cartItems), số lượng bị lỗi thì đưa về 1
function layGioHang() {
  if (localStorage.getItem('cartItems') === null) {
    return [];
  }
  const customerCart = JSON.parse(localStorage.getItem('cartItems'));
  // Số lượng bị lỗi (trống, chữ, số âm) từ trang Sản phẩm -> đưa về 1
  customerCart.forEach(item => {
    item.quantity = Math.floor(Number(item.quantity));
    if (isNaN(item.quantity) || item.quantity < 1) {
      item.quantity = 1;
    }
  });
  return customerCart;
}

// Lưu giỏ hàng vào localStorage
function luuGioHang(cartItemArr) {
  localStorage.setItem('cartItems', JSON.stringify(cartItemArr));
}


// Lấy thẻ ul chứa danh sách sản phẩm (truy vấn gián tiếp từ khối .danh-sach-gio)
// Nút nguồn: khối danh sách và vùng hẹn giờ -> từ đó duyệt tới nút đích
// .danh-sach-gio: [0]div.dong-tieu-de  [1]ul.ds-san-pham
function layDanhSach() {
  return document.querySelectorAll('.danh-sach-gio')[0].lastElementChild;
}

// Lấy vùng hẹn giờ nhận hàng
function layVungHenGio() {
  return document.querySelectorAll('.vung-hen-gio')[0];
}


// Vẽ lại toàn bộ giỏ hàng (hoặc báo giỏ trống), cập nhật tổng tiền và số trên icon giỏ hàng
// maVuaDoi: mã sản phẩm vừa đổi (để làm nảy thành tiền của dòng đó).
// Không truyền gì (lần đầu mở trang) -> không chạy hiệu ứng nảy.
function hienThiGioHang(maVuaDoi) {
  const customerCart = layGioHang();
  const danhSach = layDanhSach();
  danhSach.textContent = '';

  if (customerCart.length === 0) {
    const dong = document.createElement('li');
    dong.className = 'gio-trong';
    dong.textContent = 'Giỏ hàng của bạn đang trống.';
    danhSach.appendChild(dong);
  } else {
    customerCart.forEach(item => {
      const dong = taoDongSanPham(item);
      if (item.id == maVuaDoi) {
        dong.lastElementChild.classList.add('nhay');   // [5] p.thanh-tien
      }
      danhSach.appendChild(dong);
    });
  }

  capNhatTongTien(maVuaDoi !== undefined);
  capNhatIconGioHang();   // hàm dùng chung trong header-footer.js
}

// Tạo một dòng sản phẩm: nút xóa, ảnh, tên, đơn giá, bộ chọn số lượng, thành tiền
// li.san-pham: [0]nút xóa [1]ảnh [2]div.thong-tin [3]đơn giá [4]div.chon-so-luong [5]thành tiền
function taoDongSanPham(item) {
  const dong = document.createElement('li');
  dong.className = 'san-pham';

  const nutXoa = document.createElement('button');
  nutXoa.type = 'button';
  nutXoa.className = 'nut-xoa';
  nutXoa.textContent = '×';
  nutXoa.setAttribute('aria-label', 'Xóa ' + item.name);
  nutXoa.addEventListener('click', xuLyXoa, false);

  const anh = document.createElement('img');
  anh.className = 'anh-sp';
  anh.src = item.image || '../image/anhnen.jpg';
  anh.alt = item.name;

  const thongTin = document.createElement('div');
  thongTin.className = 'thong-tin';
  const ten = document.createElement('p');
  ten.className = 'ten-sp';
  ten.textContent = item.name;
  const maSP = document.createElement('p');
  maSP.className = 'item-id';
  maSP.hidden = true;
  maSP.textContent = item.id;
  thongTin.appendChild(ten);
  thongTin.appendChild(maSP);
  if (item.id != item.name) {
    const phu = document.createElement('p');
    phu.className = 'thong-tin-sp';
    phu.textContent = 'Mã SP: ' + item.id;
    thongTin.appendChild(phu);
  }

  const donGia = document.createElement('p');
  donGia.className = 'gia don-gia';
  donGia.textContent = formatCurrency(layGiaSo(item.price));

  const khung = document.createElement('div');
  khung.className = 'chon-so-luong';

  const nutGiam = document.createElement('button');
  nutGiam.type = 'button';
  nutGiam.textContent = '-';
  nutGiam.setAttribute('aria-label', 'Giảm số lượng');
  nutGiam.disabled = (item.quantity <= 1);
  nutGiam.addEventListener('click', xuLyGiam, false);

  const oSo = document.createElement('input');
  oSo.type = 'number';
  oSo.min = 1;
  oSo.step = 1;
  oSo.value = item.quantity;
  oSo.setAttribute('aria-label', 'Số lượng ' + item.name);
  oSo.addEventListener('change', xuLyNhapSo, false);

  const nutTang = document.createElement('button');
  nutTang.type = 'button';
  nutTang.textContent = '+';
  nutTang.setAttribute('aria-label', 'Tăng số lượng');
  nutTang.addEventListener('click', xuLyTang, false);

  khung.appendChild(nutGiam);
  khung.appendChild(oSo);
  khung.appendChild(nutTang);

  const thanhTien = document.createElement('p');
  thanhTien.className = 'gia thanh-tien';
  thanhTien.textContent = formatCurrency(layGiaSo(item.price) * item.quantity);

  dong.appendChild(nutXoa);
  dong.appendChild(anh);
  dong.appendChild(thongTin);
  dong.appendChild(donGia);
  dong.appendChild(khung);
  dong.appendChild(thanhTien);
  return dong;
}


// Lấy mã sản phẩm từ một dòng li
// Từ 1 dòng <li>: phần tử con thứ 3 (div.thong-tin) -> con thứ 2 (p.item-id) chứa mã sản phẩm
function layMaSanPham(dong) {
  return dong.children[2].children[1].textContent;
}

// Bấm nút × thì xóa sản phẩm của dòng đó
// button -> li
function xuLyXoa(evt) {
  const dong = evt.target.parentElement;
  xoaSanPham(layMaSanPham(dong), dong);
}

// Bấm nút − thì giảm số lượng đi 1
// button -> div.chon-so-luong -> li ; ô số nằm ngay sau nút giảm
function xuLyGiam(evt) {
  const nut = evt.target;
  const oSo = nut.nextElementSibling;
  const dong = nut.parentElement.parentElement;
  capNhatSoLuong(layMaSanPham(dong), Number(oSo.value) - 1);
}

// Bấm nút + thì tăng số lượng thêm 1
// ô số nằm ngay trước nút tăng
function xuLyTang(evt) {
  const nut = evt.target;
  const oSo = nut.previousElementSibling;
  const dong = nut.parentElement.parentElement;
  capNhatSoLuong(layMaSanPham(dong), Number(oSo.value) + 1);
}

// Nhập trực tiếp số lượng vào ô số
function xuLyNhapSo(evt) {
  const oSo = evt.target;
  const dong = oSo.parentElement.parentElement;
  capNhatSoLuong(layMaSanPham(dong), Number(oSo.value));
}


// Tìm vị trí sản phẩm trong giỏ theo mã (không có thì trả về -1)
function isExistedInCart(id, cartItemArr) {
  let myIndex = -1;
  for (let i = 0; i < cartItemArr.length; i++) {
    if (cartItemArr[i].id == id) {
      myIndex = i;
      break;
    }
  }
  return myIndex;
}

// Cập nhật số lượng (tối thiểu là 1), lưu lại và vẽ lại giỏ hàng
function capNhatSoLuong(id, soLuongMoi) {
  const customerCart = layGioHang();
  const index = isExistedInCart(id, customerCart);
  if (index < 0) return;

  soLuongMoi = Math.floor(soLuongMoi);
  if (isNaN(soLuongMoi) || soLuongMoi < 1) {
    soLuongMoi = 1;
  }

  customerCart[index].quantity = soLuongMoi;
  luuGioHang(customerCart);
  hienThiGioHang(id);
}

// Hỏi xác nhận, chạy hiệu ứng mờ dần rồi xóa sản phẩm khỏi giỏ hàng
// dong: thẻ li của sản phẩm, dùng để chạy hiệu ứng trước khi xóa
function xoaSanPham(id, dong) {
  const customerCart = layGioHang();
  const index = isExistedInCart(id, customerCart);
  if (index < 0) return;

  if (confirm('Xóa "' + customerCart[index].name + '" khỏi giỏ hàng?')) {
    dong.classList.add('dang-xoa');   // dòng mờ dần và trượt sang phải (CSS)
    // Đợi hiệu ứng chạy xong (0.4 giây) rồi mới xóa thật
    setTimeout(() => {
      customerCart.splice(index, 1);
      luuGioHang(customerCart);
      hienThiGioHang('');   // '' -> không dòng nào nảy, chỉ tổng tiền nảy
    }, 400);
  }
}


// Tính và hiển thị tổng tiền (nảy lên khi giỏ hàng thay đổi)
// Vùng hẹn giờ: [0]h2 [1]label [2]input date [3]label [4]select [5]label [6]p.thanh-tien-tong [7]p [8]submit
// coHieuUng = true -> tổng tiền nảy lên khi giỏ hàng thay đổi
function capNhatTongTien(coHieuUng) {
  let total = 0;
  layGioHang().forEach(item => {
    total += layGiaSo(item.price) * Number(item.quantity);
  });
  const tongTien = layVungHenGio().children[6].lastElementChild;
  tongTien.textContent = formatCurrency(total);

  if (coHieuUng) {
    // Bỏ class rồi gắn lại sau 10ms để hiệu ứng chạy lại ở mỗi lần đổi
    tongTien.classList.remove('nhay');
    setTimeout(() => {
      tongTien.classList.add('nhay');
    }, 10);
  }
}

// Lấy ngày hôm nay dạng yyyy-mm-dd để so sánh với ngày nhận hàng
function layNgayHomNay() {
  const d = new Date();
  const thang = String(d.getMonth() + 1).padStart(2, '0');
  const ngay = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + thang + '-' + ngay;
}

// Khi bấm Thanh toán: chặn giỏ trống, chưa chọn ngày hoặc ngày đã qua; hợp lệ thì lưu thông tin nhận hàng
function kiemTraThanhToan(evt) {
  if (layGioHang().length === 0) {
    evt.preventDefault();
    alert('Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.');
    return;
  }

  const oNgay = layVungHenGio().children[2];
  if (oNgay.value === '') {
    evt.preventDefault();
    alert('Vui lòng chọn ngày nhận hàng.');
    oNgay.focus();
  } else if (oNgay.value < layNgayHomNay()) {
    evt.preventDefault();
    alert('Ngày nhận hàng không được trước hôm nay.');
    oNgay.focus();
  } else {
    luuThongTinNhanHang();   // hợp lệ -> lưu lại để trang Thanh toán đọc
  }
}

// Lưu ngày nhận, thời gian nhận, xuất hóa đơn và ghi chú vào localStorage (key thongTinNhanHang)
// Lưu thông tin hẹn giờ + ghi chú vào localStorage, key 'thongTinNhanHang'
// .vung-san-pham: [0]div.danh-sach-gio [1]a.tiep-tuc [2]p.ghi-chu > [0]label [1]textarea
function luuThongTinNhanHang() {
  const vungHenGio = layVungHenGio();
  const oGhiChu = vungHenGio.previousElementSibling.lastElementChild.lastElementChild;
  const oThoiGian = vungHenGio.children[4];
  const oHoaDon = vungHenGio.children[5].firstElementChild;

  const thongTin = {
    ngayNhan: vungHenGio.children[2].value,
    thoiGian: oThoiGian.options[oThoiGian.selectedIndex].text,
    xuatHoaDon: oHoaDon.checked,
    ghiChu: oGhiChu.value.trim()
  };
  localStorage.setItem('thongTinNhanHang', JSON.stringify(thongTin));
}

// Khởi động trang: đặt ngày nhỏ nhất, gắn sự kiện Thanh toán, vẽ giỏ hàng (lần đầu có hiệu ứng trượt vào)
function setup() {
  const vungHenGio = layVungHenGio();
  vungHenGio.children[2].min = layNgayHomNay();
  vungHenGio.parentElement.addEventListener('submit', kiemTraThanhToan, false);

  // Chỉ lần đầu mở trang: các dòng lần lượt trượt vào (class 'moi-vao' trong CSS)
  const danhSach = layDanhSach();
  danhSach.classList.add('moi-vao');
  hienThiGioHang();
  setTimeout(() => {
    danhSach.classList.remove('moi-vao');   // bỏ đi để bấm +/- không bị trượt lại
  }, 1200);
}
