// Tác giả: Diệp Đạt Quyền - B2408813
// Lấy nút đăng nhập và các ô nhập liệu từ HTML để xử lý bằng JavaScript.
const btn = document.querySelector('button[type="submit"]');
const emailPhoneInput = document.getElementById('emailPhone');
// nextElementSibling là phần tử HTML kế tiếp; gọi hai lần để lấy vùng hiển thị lỗi theo cấu trúc HTML hiện tại.
const emailPhoneError = emailPhoneInput.nextElementSibling.nextElementSibling;
const passwordInput = document.getElementById('password');
const passwordError = passwordInput.nextElementSibling.nextElementSibling;

// Hàm kiểm tra email hoặc số điện thoại; trả về true khi khớp dữ liệu đã lưu, ngược lại trả về false.
const validationEmailPhone = () => {
    const emailPhone = emailPhoneInput.value;

    // switch so sánh giá trị người dùng nhập với từng case.
    switch (emailPhone){
        // Trường hợp bỏ trống: thêm viền lỗi, ghi thông báo và đổi màu nhãn.
        case (''):
            emailPhoneInput.classList.add('input-error');
            emailPhoneError.innerText = 'Vui lòng nhập email hoặc số điện thoại vào.';
            emailPhoneInput.nextElementSibling.style.color='red';
            return false;
        // Hai case liên tiếp dùng chung một khối lệnh: chấp nhận email HOẶC số điện thoại trong localStorage.
        case localStorage.getItem('email'):
        case localStorage.getItem('phone'):
            emailPhoneInput.classList.remove('input-error');
            emailPhoneError.innerText = '';
            emailPhoneInput.nextElementSibling.style.color='#4c4b4b';
            return true;
        // default được chạy khi không rơi vào case nào ở trên.
        default:
            emailPhoneInput.classList.add('input-error');
            emailPhoneError.innerText = 'Email hoặc số điện thoại không chính xác';
            emailPhoneInput.nextElementSibling.style.color='red';
            return false;
    }
};

// Hàm kiểm tra mật khẩu nhập vào với mật khẩu đã lưu trong localStorage.
const validationPassword = () => {
    const password = passwordInput.value;

    // Phân biệt ba trường hợp: chưa nhập, nhập đúng và nhập sai.
    switch (password){
        case '':
            passwordInput.classList.add('input-error');
            passwordError.innerText = 'Vui lòng nhập mật khẩu vào.';
            passwordInput.nextElementSibling.style.color='red';
            return false;
        case localStorage.getItem('password'):
            passwordInput.classList.remove('input-error');
            passwordError.innerText = '';
            passwordInput.nextElementSibling.style.color='#4c4b4b';
            return true;
        default:
            passwordInput.classList.add('input-error');
            passwordError.innerText = 'Mật khẩu không chính xác.';
            passwordInput.nextElementSibling.style.color='red';
            return false;
    }
};

// Hàm chính xử lý đăng nhập sau khi người dùng nhấn nút.
const handleLogin = () => {
    // Giảm độ đậm nút và chuyển con trỏ sang trạng thái chờ để báo đang xử lý.
    btn.style.opacity = '0.7';
    btn.style.cursor='wait';
    document.body.style.cursor = 'wait';

    // setTimeout thực hiện hàm sau 1000 mili giây (1 giây); đây chỉ là độ trễ giao diện.
    setTimeout(() => {
        btn.style.opacity = '';
        btn.style.cursor='';      
        document.body.style.cursor = '';   
        
        // Gọi cả hai hàm kiểm tra và giữ kết quả để điều kiện phía dưới dễ đọc.
        const emailPhoneValid = validationEmailPhone();
        const passwordValid = validationPassword();    

        // Chỉ đăng nhập khi cả hai kết quả đều true (toán tử && nghĩa là VÀ).
        if (emailPhoneValid&&passwordValid){
            // Ghi trạng thái đăng nhập vào localStorage; localStorage lưu giá trị dưới dạng chuỗi.
            localStorage.setItem('isLogin', 'true');
            // Giỏ hàng sao lưu lúc đăng xuất (cartBackup) chỉ được khôi phục khi giỏ hiện tại đang trống,
            // để không ghi đè giỏ hàng khách vừa chọn trước khi đăng nhập (ví dụ đang ở trang Thanh toán).
            const saved = localStorage.getItem('cartBackup');
            const gioHienTai = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (saved && gioHienTai.length === 0) {
                localStorage.setItem('cartItems', saved);
            }
            localStorage.removeItem('cartBackup');   // đã dùng (hoặc bỏ qua) thì xóa, tránh ghi đè ở lần sau
            // Đi từ trang Thanh toán (?quayLai=thanhtoan) thì quay lại Thanh toán, còn lại về Trang chủ.
            window.location.href = layTrangQuayLai();
        }
    }, 1000);
}

// Gắn sự kiện click vào nút; e đại diện cho đối tượng sự kiện.
document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    // Ngăn hành vi mặc định của nút submit (ví dụ gửi form và tải lại trang).
    e.preventDefault();
    handleLogin();
});

// Khi người dùng gõ lại, xóa cảnh báo cũ; lỗi sẽ được kiểm tra lại lúc đăng nhập.
emailPhoneInput.addEventListener('input', () => {
    emailPhoneInput.classList.remove('input-error');
    emailPhoneError.innerText = '';
    emailPhoneInput.nextElementSibling.style.color='#4c4b4b';
});

// Tương tự, khi gõ mật khẩu thì bỏ viền đỏ và thông báo lỗi cũ.
passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('input-error');
    passwordError.innerText = '';
    passwordInput.nextElementSibling.style.color='#4c4b4b';
});

// ===== QUAY LẠI TRANG TRƯỚC SAU KHI ĐĂNG NHẬP =====
// Trang Thanh toán mở trang này bằng địa chỉ DangNhap.html?quayLai=thanhtoan.
// URLSearchParams đọc phần sau dấu ? của địa chỉ (giống cách trang Sản phẩm đọc ?search=).
const quayLai = new URLSearchParams(window.location.search).get('quayLai');

// Chỉ nhận đúng giá trị 'thanhtoan', giá trị lạ thì về Trang chủ
function layTrangQuayLai() {
    if (quayLai === 'thanhtoan') {
        return '../ThanhToan/thanhToan.html';
    }
    return '../TrangChu/trangChu.html';
}

// Người dùng bấm sang "Đăng ký ngay" thì gửi tiếp ?quayLai để không bị mất
if (quayLai === 'thanhtoan') {
    const cacLinkDangKy = document.querySelectorAll('a[href="DangKy.html"]');
    cacLinkDangKy.forEach((link) => {
        link.href = 'DangKy.html?quayLai=thanhtoan';
    });
}
