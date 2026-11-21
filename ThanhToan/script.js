// Tác giả: Diệp Đạt Quyền - B2408813
// querySelectorAll trả về danh sách tất cả nút dùng để ẩn/hiện mật khẩu.
const toggleBtns = document.querySelectorAll('.toggle-password');

// forEach duyệt từng nút; mỗi nút được gắn một hàm xử lý click.
toggleBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', function () {
        // parentElement là phần tử cha của nút; querySelector tìm ô mật khẩu ở cùng vùng chứa.
        const password = toggleBtn.parentElement.querySelector('.password-input');
        // Nếu input đang có type=password (ký tự bị che), chuyển thành text để hiện mật khẩu.
        if (password.type === 'password') {
            password.type = 'text';
            // Xóa nội dung nút cũ rồi tạo ảnh biểu tượng mắt tương ứng.
            toggleBtn.textContent='';
            // createElement tạo thẻ img mới trong bộ nhớ; setAttribute gán thuộc tính src/alt.
            const eye = document.createElement('img');
            eye.setAttribute('src', '../images/icons/eye-off.png');
            eye.setAttribute('alt', 'Ẩn mật khẩu');
            // appendChild thêm ảnh vào bên trong nút.
            toggleBtn.appendChild(eye);
        // Ngược lại: đổi type về password để che mật khẩu và thay biểu tượng.
        } else {
            password.type = 'password';
            toggleBtn.textContent='';
            const eyeOff = document.createElement('img');
            // Đường dẫn ảnh là đường dẫn tương đối tính từ trang HTML đang tải script.
            eyeOff.setAttribute('src', '../images/icons/eye.png');
            eyeOff.setAttribute('alt', 'Hiện mật khẩu');
            toggleBtn.appendChild(eyeOff);
        };
    });
});


document.querySelectorAll('.order-toggle')[0].lastElementChild.textContent = formatCurrency(tongTien);
document.querySelectorAll('.summary')[0].firstElementChild.lastElementChild.textContent = formatCurrency(tongTien);
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
        tongTien: tongTien,
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

    const tong = taoDongThongTin('Tổng cộng', formatCurrency(donHang.tongTien));
    tong.classList.add('order-total');
    khung.appendChild(tong);
}

// ===== ĐÃ ĐĂNG NHẬP: TỰ ĐIỀN THÔNG TIN GIAO HÀNG =====
// Tên, email, số điện thoại lấy từ tài khoản (lưu lúc đăng ký).
// Địa chỉ lấy từ đơn hàng gần nhất của tài khoản (lúc đăng ký chưa nhập địa chỉ).
// Các ô vẫn sửa được, phòng khi người dùng muốn giao cho người khác.
function dienThongTinTaiKhoan() {
    if (!localStorage.getItem('isLogin')) {
        return;   // chưa đăng nhập -> khách tự nhập như cũ
    }

    const email = localStorage.getItem('email');
    nameInput.value = localStorage.getItem('name') || '';
    emailInput.value = email || '';
    phoneInput.value = localStorage.getItem('phone') || '';

    // Duyệt từ đơn mới nhất về đơn cũ nhất, gặp đơn của tài khoản này thì lấy địa chỉ
    const tatCa = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
    for (let i = tatCa.length - 1; i >= 0; i--) {
        const don = tatCa[i];
        if (don.taiKhoan === email || (!don.taiKhoan && don.email === email)) {
            addressInput.value = don.diaChi;
            break;
        }
    }

    // Đã đăng nhập thì thay dòng "Bạn đã có tài khoản? Đăng nhập" bằng lời chào
    // div.form-group chứa ô họ tên -> phần tử ngay trước nó là thẻ <p> đó (truy vấn gián tiếp)
    const dongDangNhap = nameInput.parentElement.previousElementSibling;
    dongDangNhap.textContent = 'Xin chào ' + localStorage.getItem('name')
        + '! Thông tin đã được điền sẵn, bạn có thể sửa nếu muốn giao cho người khác.';
}

dienThongTinTaiKhoan();
