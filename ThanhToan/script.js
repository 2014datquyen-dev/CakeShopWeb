// Tác giả: Diệp Đạt Quyền - B2408813
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

if (products.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Giỏ hàng đang trống.';
    productList.textContent = '';
    productList.appendChild(empty);
} else {
    products.forEach((product) => {
        const soLuong = laySoLuong(product);
        const donGia = layGiaSo(product.price);
        tongTien += donGia * soLuong;   // tổng tiền vẫn tính theo số lượng

        const divProduct = document.createElement('div');
        divProduct.className = 'product';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        const divInfo = document.createElement('div');
        divInfo.className = 'product-info';

        const pName = document.createElement('p');
        pName.textContent = product.name;

        const small = document.createElement('small');
        small.textContent = `Số lượng: ${soLuong}`;

        divInfo.appendChild(pName);
        divInfo.appendChild(small);

        const spanPrice = document.createElement('span');
        spanPrice.className = 'price';
        spanPrice.textContent = formatCurrency(donGia);   // giá gốc 1 sản phẩm

        divProduct.appendChild(img);
        divProduct.appendChild(divInfo);
        divProduct.appendChild(spanPrice);
        productList.appendChild(divProduct);
    });
}


// .summary: [0]Tạm tính [1]Phí vận chuyển [2]Giảm giá (chỉ có khi đã dùng mã)
document.querySelectorAll('.summary')[0].firstElementChild.lastElementChild.textContent = formatCurrency(tongTien);


// ===== MÃ GIẢM GIÁ =====
// Danh sách mã cố định trong code (không dùng back-end)
//  loai 'phan-tram': giảm giaTri % (tối đa toiDa đồng, 0 = không giới hạn)
//  loai 'tien'     : giảm thẳng giaTri đồng
//  donToiThieu     : tạm tính phải từ mức này mới dùng được mã
const dsMaGiamGia = [
    { ma: 'FRESH10', moTa: 'Giảm 10%', loai: 'phan-tram', giaTri: 10, toiDa: 0, donToiThieu: 0 },
    { ma: 'GIAM50K', moTa: 'Giảm 50.000₫', loai: 'tien', giaTri: 50000, toiDa: 0, donToiThieu: 300000 },
    { ma: 'BANMOI', moTa: 'Giảm 20%, tối đa 100.000₫', loai: 'phan-tram', giaTri: 20, toiDa: 100000, donToiThieu: 200000 }
];

let maDangDung = null;   // mã đang áp dụng (null = chưa dùng mã)
let tienGiam = 0;

// div.discount-container: [0]input [1]label [2]span thông báo [3]nút "Sử dụng"
const nutSuDung = document.querySelectorAll('.discount-container')[0].lastElementChild;
const oMaGiamGia = nutSuDung.parentElement.firstElementChild;   // truy vấn gián tiếp
const thongBaoMa = nutSuDung.previousElementSibling;
// div.ds-ma-giam-gia nằm ngay sau div.discount-container
const khungDsMa = nutSuDung.parentElement.nextElementSibling;

function timMaGiamGia(ma) {
    for (let i = 0; i < dsMaGiamGia.length; i++) {
        if (dsMaGiamGia[i].ma === ma) {
            return dsMaGiamGia[i];
        }
    }
    return null;
}

function tinhTienGiam(maGG, tamTinh) {
    let tien = 0;
    if (maGG.loai === 'phan-tram') {
        tien = Math.round(tamTinh * maGG.giaTri / 100);
        if (maGG.toiDa > 0 && tien > maGG.toiDa) {
            tien = maGG.toiDa;
        }
    } else {
        tien = maGG.giaTri;
    }
    return Math.min(tien, tamTinh);   // không giảm quá số tiền của đơn
}

function hienThongBaoMa(noiDung, hopLe) {
    thongBaoMa.textContent = noiDung;
    if (hopLe) {
        thongBaoMa.classList.add('ma-hop-le');
        oMaGiamGia.classList.remove('input-error');
    } else {
        thongBaoMa.classList.remove('ma-hop-le');
        oMaGiamGia.classList.add('input-error');
    }
}

function apDungMaGiamGia() {
    const ma = oMaGiamGia.value.trim().toUpperCase();
    oMaGiamGia.value = ma;

    // Xóa trống ô rồi bấm "Sử dụng" -> bỏ mã đang dùng
    if (ma === '') {
        maDangDung = null;
        tienGiam = 0;
        thongBaoMa.textContent = '';
        oMaGiamGia.classList.remove('input-error');
        capNhatTienThanhToan();
        return;
    }

    const maGG = timMaGiamGia(ma);
    if (products.length === 0) {
        hienThongBaoMa('Giỏ hàng đang trống.', false);
    } else if (maGG === null) {
        hienThongBaoMa('Mã giảm giá không tồn tại.', false);
    } else if (tongTien < maGG.donToiThieu) {
        hienThongBaoMa('Mã ' + ma + ' chỉ dùng cho đơn từ ' + formatCurrency(maGG.donToiThieu) + '.', false);
    } else {
        maDangDung = maGG;
        tienGiam = tinhTienGiam(maGG, tongTien);
        hienThongBaoMa('Đã áp dụng mã ' + ma + ': ' + maGG.moTa + '.', true);
        capNhatTienThanhToan();
        return;
    }

    // Mã không hợp lệ -> bỏ mã đang dùng trước đó (nếu có)
    maDangDung = null;
    tienGiam = 0;
    capNhatTienThanhToan();
}

// Cập nhật dòng "Giảm giá" và tổng tiền phải trả
function capNhatTienThanhToan() {
    const canTra = tongTien - tienGiam;
    document.querySelectorAll('.order-toggle')[0].lastElementChild.textContent = formatCurrency(canTra);
    document.querySelectorAll('.total-price')[0].lastElementChild.textContent = formatCurrency(canTra);

    const khungTien = document.querySelectorAll('.summary')[0];
    let dongGiam = khungTien.children[2];
    if (tienGiam > 0) {
        if (!dongGiam) {
            dongGiam = document.createElement('div');
            dongGiam.className = 'summary-row dong-giam-gia';
            dongGiam.appendChild(document.createElement('span'));
            dongGiam.appendChild(document.createElement('span'));
            khungTien.appendChild(dongGiam);
        }
        dongGiam.firstElementChild.textContent = 'Giảm giá (' + maDangDung.ma + ')';
        dongGiam.lastElementChild.textContent = '- ' + formatCurrency(tienGiam);
    } else if (dongGiam) {
        khungTien.removeChild(dongGiam);
    }

    hienThiDanhSachMa();   // vẽ lại danh sách để cập nhật trạng thái từng mã
}

// ===== DANH SÁCH MÃ GIẢM GIÁ CHO KHÁCH CHỌN =====
// Mỗi mã: [0]div thông tin (mã, mô tả, điều kiện)  [1]nút Dùng / Bỏ mã
function taoTheMa(maGG) {
    const the = document.createElement('div');
    the.className = 'the-ma';

    const thongTin = document.createElement('div');
    const tenMa = document.createElement('strong');
    tenMa.textContent = maGG.ma;
    const moTa = document.createElement('p');
    moTa.textContent = maGG.moTa;
    const dieuKien = document.createElement('small');
    if (maGG.donToiThieu > 0) {
        dieuKien.textContent = 'Cho đơn từ ' + formatCurrency(maGG.donToiThieu);
    } else {
        dieuKien.textContent = 'Áp dụng cho mọi đơn hàng';
    }
    thongTin.appendChild(tenMa);
    thongTin.appendChild(moTa);
    thongTin.appendChild(dieuKien);

    const nut = document.createElement('button');
    nut.type = 'button';

    if (maDangDung !== null && maDangDung.ma === maGG.ma) {
        // Mã đang dùng -> cho phép bỏ
        the.classList.add('dang-dung');
        nut.textContent = 'Bỏ mã';
        nut.addEventListener('click', () => {
            oMaGiamGia.value = '';
            apDungMaGiamGia();   // ô trống -> bỏ mã
        });
    } else if (tongTien < maGG.donToiThieu) {
        // Chưa đủ điều kiện -> làm mờ, báo còn thiếu bao nhiêu
        the.classList.add('chua-du');
        nut.textContent = 'Dùng';
        nut.disabled = true;
        dieuKien.textContent += ' (mua thêm ' + formatCurrency(maGG.donToiThieu - tongTien) + ')';
    } else {
        nut.textContent = 'Dùng';
        nut.addEventListener('click', () => {
            oMaGiamGia.value = maGG.ma;
            apDungMaGiamGia();
        });
    }

    the.appendChild(thongTin);
    the.appendChild(nut);
    return the;
}

function hienThiDanhSachMa() {
    khungDsMa.textContent = '';
    if (products.length === 0) {
        return;   // giỏ trống thì không hiện danh sách
    }

    const tieuDe = document.createElement('h4');
    tieuDe.textContent = 'Mã giảm giá dành cho bạn';
    khungDsMa.appendChild(tieuDe);

    dsMaGiamGia.forEach(maGG => {
        khungDsMa.appendChild(taoTheMa(maGG));
    });
}

nutSuDung.addEventListener('click', apDungMaGiamGia);
// Nhấn Enter trong ô mã cũng áp dụng
oMaGiamGia.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        apDungMaGiamGia();
    }
});
// Đang gõ lại thì bỏ báo lỗi
oMaGiamGia.addEventListener('input', () => {
    oMaGiamGia.classList.remove('input-error');
    if (!thongBaoMa.classList.contains('ma-hop-le')) {
        thongBaoMa.textContent = '';
    }
});

capNhatTienThanhToan();


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
        tamTinh: tongTien,
        maGiamGia: maDangDung ? maDangDung.ma : '',
        tienGiam: tienGiam,
        tongTien: tongTien - tienGiam,   // số tiền phải trả sau khi giảm
        // email tài khoản đang đăng nhập -> để popup Thông tin tài khoản lọc lịch sử mua hàng
        taiKhoan: localStorage.getItem('isLogin') ? localStorage.getItem('email') : ''
    };
}

// Lưu đơn vào 'danhSachDonHang' rồi xóa giỏ hàng
function luuDonHang(donHang) {
    const danhSach = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
    danhSach.push(donHang);
    localStorage.setItem('danhSachDonHang', JSON.stringify(danhSach));
    localStorage.removeItem('cartItems');
    localStorage.removeItem('thongTinNhanHang');

    // Đơn đầu tiên của tài khoản: lưu địa chỉ vừa nhập làm địa chỉ của tài khoản.
    // Các đơn sau (có thể giao cho người khác) không làm đổi địa chỉ này.
    if (donHang.taiKhoan !== '' && !localStorage.getItem('address')) {
        localStorage.setItem('address', donHang.diaChi);
    }
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
    khung.textContent = '';

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

    if (donHang.tienGiam > 0) {
        khung.appendChild(taoDongThongTin('Tạm tính', formatCurrency(donHang.tamTinh)));
        khung.appendChild(taoDongThongTin('Giảm giá (' + donHang.maGiamGia + ')', '- ' + formatCurrency(donHang.tienGiam)));
    }

    const tong = taoDongThongTin('Tổng cộng', formatCurrency(donHang.tongTien));
    tong.classList.add('order-total');
    khung.appendChild(tong);
}

// ===== ĐÃ ĐĂNG NHẬP: TỰ ĐIỀN THÔNG TIN GIAO HÀNG =====
// Tên, email, số điện thoại lấy từ tài khoản (lưu lúc đăng ký).
// Địa chỉ lấy từ key 'address' (lưu ở đơn đầu tiên, vì lúc đăng ký chưa nhập địa chỉ).
// Các ô vẫn sửa được, phòng khi người dùng muốn giao cho người khác.
function dienThongTinTaiKhoan() {
    if (!localStorage.getItem('isLogin')) {
        return;   // chưa đăng nhập -> khách tự nhập như cũ
    }

    const email = localStorage.getItem('email');
    nameInput.value = localStorage.getItem('name') || '';
    emailInput.value = email || '';
    phoneInput.value = localStorage.getItem('phone') || '';

    const diaChi = localStorage.getItem('address');
    if (diaChi) {
        addressInput.value = diaChi;
    } else {
        // Tài khoản đặt hàng trước khi có key 'address':
        // duyệt từ đơn mới nhất về đơn cũ nhất, gặp đơn của tài khoản này thì lấy địa chỉ
        const tatCa = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
        for (let i = tatCa.length - 1; i >= 0; i--) {
            const don = tatCa[i];
            if (don.taiKhoan === email || (!don.taiKhoan && don.email === email)) {
                addressInput.value = don.diaChi;
                break;
            }
        }
    }

    // Đã đăng nhập thì thay dòng "Bạn đã có tài khoản? Đăng nhập" bằng lời chào
    // div.form-group chứa ô họ tên -> phần tử ngay trước nó là thẻ <p> đó (truy vấn gián tiếp)
    const dongDangNhap = nameInput.parentElement.previousElementSibling;
    dongDangNhap.textContent = 'Xin chào ' + localStorage.getItem('name')
        + '! Thông tin đã được điền sẵn, bạn có thể sửa nếu muốn giao cho người khác.';
}

dienThongTinTaiKhoan();
