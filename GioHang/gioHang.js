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
    return [];   // giỏ hàng chưa tồn tại
  }
  return JSON.parse(localStorage.getItem('cartItems'));
}

function luuGioHang(cartItemArr) {
  localStorage.setItem('cartItems', JSON.stringify(cartItemArr));
}


function hienThiGioHang() {
  const customerCart = layGioHang();
  const tblBody = document.querySelector('.danh-sach-sp');
  tblBody.innerHTML = '';   // xóa các dòng cũ trước khi vẽ lại

  if (customerCart.length === 0) {
    const row = document.createElement('tr');
    row.className = 'dong-trong';   // để CSS responsive nhận biết dòng thông báo
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
  nutXoa.addEventListener('click', () => xoaSanPham(item.id), false);
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
  thTen.appendChild(ten);
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

  const oSo = document.createElement('input');
  oSo.type = 'number';
  oSo.min = 1;
  oSo.step = 1;
  oSo.value = item.quantity;
  oSo.setAttribute('aria-label', 'Số lượng ' + item.name);

  const nutTang = document.createElement('button');
  nutTang.type = 'button';
  nutTang.textContent = '+';
  nutTang.setAttribute('aria-label', 'Tăng số lượng');

  nutGiam.addEventListener('click', () => capNhatSoLuong(item.id, item.quantity - 1), false);
  nutTang.addEventListener('click', () => capNhatSoLuong(item.id, item.quantity + 1), false);
  oSo.addEventListener('change', () => capNhatSoLuong(item.id, Number(oSo.value)), false);

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

function capNhatTongTien() {
  let total = 0;
  layGioHang().forEach(item => {
    total += layGiaSo(item.price) * Number(item.quantity);
  });
  document.getElementById('tong-tien').textContent = formatCurrency(total);
}

function capNhatSoLuongTrenIcon() {
  let numberOfItems = 0;
  layGioHang().forEach(item => {
    numberOfItems += Number(item.quantity);
  });
  const badge = document.querySelector('.so-luong-gio');
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

  const oNgay = document.getElementById('ngay-nhan');
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
  document.getElementById('ngay-nhan').min = layNgayHomNay();
  document.querySelector('.bo-cuc').addEventListener('submit', kiemTraThanhToan, false);
  hienThiGioHang();
}
