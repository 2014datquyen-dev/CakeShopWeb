document.getElementById("orderToggle").addEventListener("click", function () {
    const orderBox = document.querySelector(".right");
    orderBox.classList.toggle("order-open");
});

const btn = document.getElementById('liquidate');
const nameInput = document.getElementById('fullname');
const nameError = nameInput.nextElementSibling.nextElementSibling;
const emailInput = document.getElementById('email');
const emailError = emailInput.nextElementSibling.nextElementSibling;
const phoneInput = document.getElementById('phone');
const phoneError = phoneInput.nextElementSibling.nextElementSibling;
const addressInput = document.getElementById('address');
const addressError = addressInput.nextElementSibling.nextElementSibling;



const validationFullname = () => {
    const name = nameInput.value;

    if (name!==""){
        nameInput.classList.remove('input-error');
        nameError.innerText = '';
        return true;
    } else {
        nameInput.classList.add('input-error');
        nameError.innerText = 'Vui lòng nhập họ tên vào';
        return false;
    }
};

const validationEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailInput.value;

    if (emailRegex.test(email)){
        emailInput.classList.remove('input-error');
        emailError.innerText = '';
        return true;
    } else {
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email hợp lệ';
        return false;
    }  
}

const validationPhone = () => {
    const phoneRegex = /^0\d{9}$/;    
    const phone = phoneInput.value;
    
    if (phoneRegex.test(phone)){
        phoneInput.classList.remove('input-error');
        phoneError.innerText='';
        return true;
    } else {
        phoneInput.classList.add('input-error');
        phoneError.innerText='Vui lòng nhập số điện thoại hợp lệ';
        return false;
    }
}

function validationAddress(){
    const address=addressInput.value;
    
    if (address!==''){
        addressInput.classList.remove('input-error');
        addressError.innerText='';
        return true;
    } else {
        addressInput.classList.add('input-error');
        addressError.innerText='Vui lòng nhập vào địa chỉ';
        return false;
    }
}

btn.addEventListener('click', (event) => {
    event.preventDefault();

    btn.style.opacity = '0.7';
    btn.style.cursor='wait';
    document.body.style.cursor = 'wait';
    setTimeout( () => {
        btn.style.opacity = '';
        btn.style.cursor='';      
        document.body.style.cursor = '';

        validationFullname();
        validationEmail();
        validationPhone();
        validationAddress();

        if (products.length === 0) {
            alert('Giỏ hàng đang trống, không thể đặt hàng.');
            return;
        }

        if (validationFullname()&&validationEmail()&&validationPhone()&&validationAddress()){
            const donHang = taoDonHang();
            luuDonHang(donHang);
            hienThiDonHang(donHang);
            document.getElementById("successPopup").classList.add("show");
        }
    }, 750);

});

nameInput.addEventListener('input', () => {
    nameInput.classList.remove('input-error');
    nameError.innerText = '';
});

emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input-error');
    emailError.innerText = '';
});

phoneInput.addEventListener('input', () => {
    phoneInput.classList.remove('input-error');
    phoneError.innerText = '';
});

addressInput.addEventListener('input', () => {
    addressInput.classList.remove('input-error');
    addressError.innerText = '';
});


// ===== ĐỊNH DẠNG TIỀN (giống formatCurrency trong show-cart.js) =====
const formatCurrency = (amount, locale = "vi-VN") => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

// "450.000đ" -> 450000
function layGiaSo(price) {
    return Number(String(price).replace(/[^0-9]/g, ""));
}

function laySoLuong(product) {
    const soLuong = Math.floor(Number(product.quantity));
    return (isNaN(soLuong) || soLuong < 1) ? 1 : soLuong;
}


// ===== HIỂN THỊ SẢN PHẨM VÀ TÍNH TIỀN =====
const data = localStorage.getItem('cartItems');
const products = JSON.parse(data) || [];
const productList = document.querySelector('.product-list');
let tongTien = 0;

products.forEach((product) => {
    const thanhTien = layGiaSo(product.price) * laySoLuong(product);
    tongTien += thanhTien;
    productList.innerHTML += `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <p>${product.name}</p>
                <small>${laySoLuong(product)} x ${formatCurrency(layGiaSo(product.price))}</small>
            </div>
            <span class="price">${formatCurrency(thanhTien)}</span>
        </div>
    `;
});

if (products.length === 0) {
    productList.innerHTML = '<p>Giỏ hàng đang trống.</p>';
}

// Truy xuất gián tiếp: lấy nút nguồn rồi duyệt tới ô hiển thị tiền
// .order-toggle: [0]span.toggle-label [1]span.toggle-price
document.querySelectorAll('.order-toggle')[0].lastElementChild.textContent = formatCurrency(tongTien);
// .summary: [0]dòng Tạm tính > [0]chữ [1]số tiền
document.querySelectorAll('.summary')[0].firstElementChild.lastElementChild.textContent = formatCurrency(tongTien);
// .total-price: [0]small "VND" [1]strong
document.querySelectorAll('.total-price')[0].lastElementChild.textContent = formatCurrency(tongTien);


// ===== TẠO, LƯU VÀ HIỂN THỊ ĐƠN HÀNG =====
function taoDonHang() {
    const nhanHang = JSON.parse(localStorage.getItem('thongTinNhanHang')) || {};
    // radio đang chọn -> phần tử ngay sau nó là tên phương thức
    const phuongThuc = document.querySelector('input[name="payment-method"]:checked').nextElementSibling.textContent;

    return {
        maDon: 'FC' + Date.now().toString().slice(-6),
        ngayDat: new Date().toLocaleString('vi-VN'),
        hoTen: nameInput.value.trim(),
        email: emailInput.value.trim(),
        soDienThoai: phoneInput.value.trim(),
        diaChi: addressInput.value.trim(),
        thanhToan: phuongThuc,
        ngayNhan: nhanHang.ngayNhan || '',
        thoiGian: nhanHang.thoiGian || '',
        xuatHoaDon: nhanHang.xuatHoaDon || false,
        ghiChu: nhanHang.ghiChu || '',
        sanPham: products.map(product => ({
            name: product.name,
            price: layGiaSo(product.price),
            quantity: laySoLuong(product)
        })),
        tongTien: tongTien
    };
}

// Lưu đơn vào 'danhSachDonHang' rồi xóa giỏ hàng
function luuDonHang(donHang) {
    const danhSach = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
    danhSach.push(donHang);
    localStorage.setItem('danhSachDonHang', JSON.stringify(danhSach));
    localStorage.removeItem('cartItems');
    localStorage.removeItem('thongTinNhanHang');
}

// "2026-11-20" -> "20/11/2026"
function doiNgay(ngay) {
    if (ngay === '') return '';
    const phan = ngay.split('-');
    return phan[2] + '/' + phan[1] + '/' + phan[0];
}

function taoDongThongTin(nhan, giaTri) {
    const dong = document.createElement('p');
    dong.className = 'info-row';
    const oNhan = document.createElement('span');
    oNhan.textContent = nhan;
    const oGiaTri = document.createElement('strong');
    oGiaTri.textContent = giaTri;
    dong.appendChild(oNhan);
    dong.appendChild(oGiaTri);
    return dong;
}

// .success-popup: [0]icon [1]h2 [2]p [3]div.order-info [4]a
function hienThiDonHang(donHang) {
    const khung = document.querySelectorAll('.success-popup')[0].children[3];
    khung.innerHTML = '';

    khung.appendChild(taoDongThongTin('Mã đơn hàng', donHang.maDon));
    khung.appendChild(taoDongThongTin('Ngày đặt', donHang.ngayDat));
    khung.appendChild(taoDongThongTin('Người nhận', donHang.hoTen));
    khung.appendChild(taoDongThongTin('Số điện thoại', donHang.soDienThoai));
    khung.appendChild(taoDongThongTin('Email', donHang.email));
    khung.appendChild(taoDongThongTin('Địa chỉ', donHang.diaChi));
    if (donHang.ngayNhan !== '') {
        khung.appendChild(taoDongThongTin('Nhận hàng', doiNgay(donHang.ngayNhan) + ' - ' + donHang.thoiGian));
    }
    khung.appendChild(taoDongThongTin('Thanh toán', donHang.thanhToan));
    if (donHang.xuatHoaDon) {
        khung.appendChild(taoDongThongTin('Hóa đơn công ty', 'Có'));
    }
    if (donHang.ghiChu !== '') {
        khung.appendChild(taoDongThongTin('Ghi chú', donHang.ghiChu));
    }

    const dsSanPham = document.createElement('ul');
    dsSanPham.className = 'order-items';
    donHang.sanPham.forEach(item => {
        const sp = document.createElement('li');
        const ten = document.createElement('span');
        ten.textContent = item.name + ' x ' + item.quantity;
        const tien = document.createElement('span');
        tien.textContent = formatCurrency(item.price * item.quantity);
        sp.appendChild(ten);
        sp.appendChild(tien);
        dsSanPham.appendChild(sp);
    });
    khung.appendChild(dsSanPham);

    const tong = taoDongThongTin('Tổng cộng', formatCurrency(donHang.tongTien));
    tong.classList.add('order-total');
    khung.appendChild(tong);
}
