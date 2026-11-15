const formatCurrency = (amount, locale = "vi-VN") => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

function layGiaSo(price) {
  return Number(String(price).replace(/[^0-9]/g, ""));
}

function layGioHang() {
  if (localStorage.getItem('cartItems') === null) {
    return [];
  }
  return JSON.parse(localStorage.getItem('cartItems'));
}

function luuGioHang(cartItemArr) {
  localStorage.setItem('cartItems', JSON.stringify(cartItemArr));
}


// Nút nguồn: bảng và vùng hẹn giờ -> từ đó duyệt tới nút đích
function layBang() {
  return document.querySelectorAll('.bang-gio-hang')[0];
}

function layVungHenGio() {
  return document.querySelectorAll('.vung-hen-gio')[0];
}


function hienThiGioHang() {
  const customerCart = layGioHang();
  const tblBody = layBang().lastElementChild;
  tblBody.innerHTML = '';

  if (customerCart.length === 0) {
    const row = document.createElement('tr');
    row.className = 'dong-trong';
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'gio-trong';
    cell.textContent = 'Giỏ hàng của bạn đang trống.';
    row.appendChild(cell);
    tblBody.appendChild(row);
  } else {
    customerCart.forEach(item => {
      tblBody.appendChild(taoDongSanPham(item));
    });
  }

  capNhatTongTien();
  capNhatSoLuongTrenIcon();
}

function taoDongSanPham(item) {
  const row = document.createElement('tr');

  const tdXoa = document.createElement('td');
  const nutXoa = document.createElement('button');
  nutXoa.type = 'button';
  nutXoa.className = 'nut-xoa';
  nutXoa.textContent = '×';
  nutXoa.setAttribute('aria-label', 'Xóa ' + item.name);
  nutXoa.addEventListener('click', xuLyXoa, false);
  tdXoa.appendChild(nutXoa);

  const tdAnh = document.createElement('td');
  const anh = document.createElement('img');
  anh.className = 'anh-sp';
  anh.src = item.image || '../image/anhnen.jpg';
  anh.alt = item.name;
  tdAnh.appendChild(anh);

  const thTen = document.createElement('th');
  thTen.scope = 'row';
  const ten = document.createElement('p');
  ten.className = 'ten-sp';
  ten.textContent = item.name;
  const maSP = document.createElement('p');
  maSP.className = 'item-id';
  maSP.hidden = true;
  maSP.textContent = item.id;
  thTen.appendChild(ten);
  thTen.appendChild(maSP);
  if (item.id != item.name) {
    const thongTin = document.createElement('p');
    thongTin.className = 'thong-tin-sp';
    thongTin.textContent = 'Mã SP: ' + item.id;
    thTen.appendChild(thongTin);
  }

  const tdGia = document.createElement('td');
  tdGia.className = 'gia';
  tdGia.textContent = formatCurrency(layGiaSo(item.price));

  const tdSoLuong = document.createElement('td');
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
  tdSoLuong.appendChild(khung);

  const tdThanhTien = document.createElement('td');
  tdThanhTien.className = 'gia';
  tdThanhTien.textContent = formatCurrency(layGiaSo(item.price) * item.quantity);

  row.appendChild(tdXoa);
  row.appendChild(tdAnh);
  row.appendChild(thTen);
  row.appendChild(tdGia);
  row.appendChild(tdSoLuong);
  row.appendChild(tdThanhTien);
  return row;
}


// Từ 1 dòng <tr>: ô thứ 3 (th) -> phần tử con thứ 2 (p.item-id) chứa mã sản phẩm
function layMaSanPham(row) {
  return row.children[2].children[1].textContent;
}

// button -> td -> tr
function xuLyXoa(evt) {
  const row = evt.target.parentElement.parentElement;
  xoaSanPham(layMaSanPham(row));
}

// button -> div.chon-so-luong -> td -> tr
function xuLyGiam(evt) {
  const nut = evt.target;
  const oSo = nut.nextElementSibling;
  const row = nut.parentElement.parentElement.parentElement;
  capNhatSoLuong(layMaSanPham(row), Number(oSo.value) - 1);
}

function xuLyTang(evt) {
  const nut = evt.target;
  const oSo = nut.previousElementSibling;
  const row = nut.parentElement.parentElement.parentElement;
  capNhatSoLuong(layMaSanPham(row), Number(oSo.value) + 1);
}

function xuLyNhapSo(evt) {
  const oSo = evt.target;
  const row = oSo.parentElement.parentElement.parentElement;
  capNhatSoLuong(layMaSanPham(row), Number(oSo.value));
}


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
  hienThiGioHang();
}

function xoaSanPham(id) {
  const customerCart = layGioHang();
  const index = isExistedInCart(id, customerCart);
  if (index < 0) return;

  if (confirm('Xóa "' + customerCart[index].name + '" khỏi giỏ hàng?')) {
    customerCart.splice(index, 1);
    luuGioHang(customerCart);
    hienThiGioHang();
  }
}


// Vùng hẹn giờ: [0]h2 [1]label [2]input date [3]label [4]select [5]label [6]p.thanh-tien-tong [7]p [8]submit
function capNhatTongTien() {
  let total = 0;
  layGioHang().forEach(item => {
    total += layGiaSo(item.price) * Number(item.quantity);
  });
  const tongTien = layVungHenGio().children[6].lastElementChild;
  tongTien.textContent = formatCurrency(total);
}

// .header-cart -> a.cart-btn -> span.so-luong-gio
function capNhatSoLuongTrenIcon() {
  let numberOfItems = 0;
  layGioHang().forEach(item => {
    numberOfItems += Number(item.quantity);
  });
  const badge = document.querySelectorAll('.header-cart')[0].firstElementChild.lastElementChild;
  badge.textContent = numberOfItems;
  badge.hidden = (numberOfItems === 0);
}


function layNgayHomNay() {
  const d = new Date();
  const thang = String(d.getMonth() + 1).padStart(2, '0');
  const ngay = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + thang + '-' + ngay;
}

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
  }
}

function setup() {
  const vungHenGio = layVungHenGio();
  vungHenGio.children[2].min = layNgayHomNay();
  vungHenGio.parentElement.addEventListener('submit', kiemTraThanhToan, false);
  hienThiGioHang();
}
