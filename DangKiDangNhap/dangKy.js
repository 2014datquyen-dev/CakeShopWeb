// Tác giả: Diệp Đạt Quyền - B2408813 
// Lấy nút gửi form, các ô nhập liệu và vị trí hiển thị lỗi tương ứng từ HTML.
const btn = document.querySelector('button[type="submit"]');
const nameInput = document.getElementById('fullname');
// nextElementSibling.nextElementSibling: tìm phần tử đứng sau ô nhập hai vị trí để ghi thông báo lỗi; phụ thuộc cấu trúc HTML.
const nameError = nameInput.nextElementSibling.nextElementSibling;
const emailInput = document.getElementById('email');
const emailError = emailInput.nextElementSibling.nextElementSibling;
const phoneInput = document.getElementById('phone');
const phoneError = phoneInput.nextElementSibling.nextElementSibling;
const passwordInput = document.getElementById('password');
const passwordError = passwordInput.nextElementSibling.nextElementSibling;
const confirmPasswordInput = document.getElementById('confirmPassword');
const confirmPasswordError = confirmPasswordInput.nextElementSibling.nextElementSibling;

// Kiểm tra họ tên: không được để trống và phải có ít nhất 5 ký tự.
const validationFullname = () => {
    const name = nameInput.value;
    // Biểu thức chính quy /^.{5,}$/: dấu ^ bắt đầu, . là một ký tự bất kỳ (trừ xuống dòng), {5,} là từ 5 ký tự, $ là kết thúc.
    const nameRegex = /^.{5,}$/;

    // Nếu bỏ trống: đánh dấu lỗi, hiện thông báo và trả về false.
    if (name===''){
        nameInput.classList.add('input-error');
        nameError.innerText = 'Vui lòng nhập tên vào.';
        nameInput.nextElementSibling.style.color='red';
        return false;
    } else if 
    // test(name) trả về true nếu tên khớp với biểu thức chính quy.
    (nameRegex.test(name)){
        nameInput.classList.remove('input-error');
        nameError.innerText = '';
        nameInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    // Có nhập nhưng chưa đủ 5 ký tự thì báo lỗi.
    } else {
        nameInput.classList.add('input-error');
        nameError.innerText = 'Tên phải có ít nhất 5 ký tự.';
        nameInput.nextElementSibling.style.color='red';
        return false;
    } 
};

// Kiểm tra email theo dạng phần trước @, tên miền, dấu chấm và phần đuôi 2 đến 4 ký tự.
const validationEmail = () => {
    // \s là khoảng trắng; [^\s@] nghĩa là một ký tự không phải khoảng trắng hay @.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
    const email = emailInput.value;
    if (email===''){
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email vào.';
        emailInput.nextElementSibling.style.color='red';
        return false;
    } else if 
    (emailRegex.test(email)){
        emailInput.classList.remove('input-error');
        emailError.innerText = '';
        emailInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email hợp lệ.';
        emailInput.nextElementSibling.style.color='red';
        return false;
    }  
}

// Kiểm tra số điện thoại: bắt đầu bằng số 0 và theo sau là đúng 9 chữ số (tổng 10 chữ số).
const validationPhone = () => {
    // \d là một chữ số; {9} yêu cầu xuất hiện đúng 9 lần.
    const phoneRegex = /^0\d{9}$/;
    const phone = phoneInput.value;
    
    if (phone===''){
        phoneInput.classList.add('input-error');
        phoneError.innerText = 'Vui lòng nhập số điện thoại vào.';
        phoneInput.nextElementSibling.style.color='red';
        return false;
    } else if
    (phoneRegex.test(phone)){
        phoneInput.classList.remove('input-error');
        phoneError.innerText='';
        phoneInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        phoneInput.classList.add('input-error');
        phoneError.innerText='Vui lòng nhập số điện thoại hợp lệ.';
        phoneInput.nextElementSibling.style.color='red';
        return false;
    }
}


// Kiểm tra độ mạnh của mật khẩu theo nhiều điều kiện kết hợp.
const validationPassword = () => {
    const password = passwordInput.value;
    // && yêu cầu TẤT CẢ điều kiện đều đúng: độ dài, chữ thường, chữ hoa, chữ số và ký tự đặc biệt.
    // Kiểm tra từng điều kiện: ít nhất 8 ký tự, có chữ thường, chữ hoa, số và ký tự đặc biệt
    const hopLe = password.length >= 8 &&
                  // /[a-z]/ là có chữ thường; /[A-Z]/ là có chữ hoa.
                  /[a-z]/.test(password) &&
                  /[A-Z]/.test(password) &&
                  // /[0-9]/ là có chữ số; /[^a-zA-Z0-9]/ là có ký tự khác chữ và số.
                  /[0-9]/.test(password) &&
                  /[^a-zA-Z0-9]/.test(password);
    if (hopLe){
        passwordInput.classList.remove('input-error');
        passwordError.innerText = '';
        passwordInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        passwordInput.classList.add('input-error');
        passwordError.innerText = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
        passwordInput.nextElementSibling.style.color='red';
        return false;
    }  
}

// Kiểm tra xác nhận mật khẩu có khớp với ô mật khẩu chính hay không.
const validationConfirmPassword = () => {
    const confirmPassword=confirmPasswordInput.value;

    // Gọi validationPassword() trước; nếu mật khẩu chính không hợp lệ thì không kiểm tra so khớp tiếp.
    if (validationPassword()){
        // Toán tử === so sánh bằng cả giá trị lẫn kiểu dữ liệu.
        if (passwordInput.value===confirmPassword){
            confirmPasswordInput.classList.remove('input-error');
            confirmPasswordError.innerText='';
            confirmPasswordInput.nextElementSibling.style.color='#4c4b4b';
            return true;
        } else {
            confirmPasswordInput.classList.add('input-error');
            confirmPasswordError.innerText='Mật khẩu xác nhận không khớp với mật khẩu đã nhâp.';
            confirmPasswordInput.nextElementSibling.style.color='red';
            return false;
        }
    }
}

// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 141 đến dòng 155: Kiểm tra ô đồng ý điều khoản
// Ô đồng ý điều khoản: checkbox nằm trong <label>, thẻ span báo lỗi nằm ngay sau <label> đó.
const dieuKhoanInput = document.querySelector('#registerForm input[type="checkbox"]');
const dieuKhoanError = dieuKhoanInput.parentElement.nextElementSibling;

// Kiểm tra đã tick đồng ý điều khoản chưa.
function validationDieuKhoan() {
    if (dieuKhoanInput.checked) {
        dieuKhoanError.innerText = '';
        return true;
    } else {
        dieuKhoanError.innerText = 'Vui lòng đồng ý với điều khoản và chính sách bảo mật.';
        return false;
    }
}

// Lấy form đăng ký qua id rồi lắng nghe sự kiện submit (gửi biểu mẫu).
const form = document.getElementById('registerForm');
form.addEventListener('submit', (event) => {
    // Ngăn trình duyệt tự gửi form và tải lại trang.
    event.preventDefault();

    // Đổi giao diện nút và con trỏ sang trạng thái chờ.
    btn.style.opacity = '0.7';
    btn.style.cursor='wait';
    document.body.style.cursor = 'wait';

    // setTimeout trì hoãn 1000 ms rồi chạy kiểm tra các ô.
    setTimeout(() => {
        btn.style.opacity = '';
        btn.style.cursor='';      
        document.body.style.cursor = '';
        // Kiểm tra riêng từng ô và gán kết quả true/false vào biến để không bỏ sót ô nào.
        const nameValid=validationFullname();
        const emailValid=validationEmail();
        const phoneValid=validationPhone();
        const passwordValid=validationPassword();
        const confirmValid=validationConfirmPassword();
        // Tác giả: Huỳnh Thiên Bảo - B2405021 - Dòng 179: Gọi hàm kiểm tra ô điều khoản khi bấm Đăng ký
        const dieuKhoanValid=validationDieuKhoan();

        // Chỉ lưu thông tin khi tất cả phép kiểm tra đều hợp lệ.
        // Tác giả: Huỳnh Thiên Bảo - B2405021 - Dòng 183: Thêm kết quả kiểm tra điều khoản vào điều kiện đăng ký
        if (nameValid&&emailValid&&phoneValid&&passwordValid&&confirmValid&&dieuKhoanValid){
            // localStorage.setItem(key, value) lưu dữ liệu theo cặp khóa/giá trị trên trình duyệt.
            localStorage.setItem('name', nameInput.value);
            localStorage.setItem('email', emailInput.value);
            localStorage.setItem('phone', phoneInput.value);
            localStorage.setItem('password', passwordInput.value);
            // Tác giả: Huỳnh Thiên Bảo - B2405021 - Dòng 190: Đăng ký tài khoản mới thì xóa địa chỉ cũ
            localStorage.removeItem('address');   // tài khoản mới chưa có địa chỉ (lưu ở đơn đầu tiên)
            // Thêm class show để mở popup thông báo đăng ký thành công.
            document.getElementById("successPopup").classList.add("show");
        }
    }, 1000);
});

// Các sự kiện input bên dưới chạy mỗi lần người dùng thay đổi nội dung ô nhập; xóa thông báo lỗi cũ.
nameInput.addEventListener('input', () => {
    nameInput.classList.remove('input-error');
    nameError.innerText = '';
    nameInput.nextElementSibling.style.color='#4c4b4b';
});

emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input-error');
    emailError.innerText = '';
    emailInput.nextElementSibling.style.color='#4c4b4b';
});

phoneInput.addEventListener('input', () => {
    phoneInput.classList.remove('input-error');
    phoneError.innerText = '';
    phoneInput.nextElementSibling.style.color='#4c4b4b';
});

// Xóa cảnh báo cũ khi người dùng chỉnh mật khẩu.
passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('input-error');
    passwordError.innerText = '';
    passwordInput.nextElementSibling.style.color='#4c4b4b';
});

// Xóa cảnh báo cũ khi người dùng chỉnh ô xác nhận mật khẩu.
confirmPasswordInput.addEventListener('input', () => {
    confirmPasswordInput.classList.remove('input-error');
    confirmPasswordError.innerText = '';
    confirmPasswordInput.nextElementSibling.style.color='#4c4b4b';
});

// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 231 đến dòng 246: Giữ ?quayLai cho các link Đăng nhập ngay; tick ô điều khoản thì xóa thông báo lỗi
// ===== GIỮ ?quayLai KHI QUAY VỀ TRANG ĐĂNG NHẬP =====
// Đến từ trang Thanh toán (DangKy.html?quayLai=thanhtoan) thì các link "Đăng nhập ngay"
// (cuối trang và trong popup đăng ký thành công) gửi tiếp ?quayLai, đăng nhập xong sẽ quay lại Thanh toán.
if (new URLSearchParams(window.location.search).get('quayLai') === 'thanhtoan') {
    const cacLinkDangNhap = document.querySelectorAll('a[href="DangNhap.html"]');
    cacLinkDangNhap.forEach((link) => {
        link.href = 'DangNhap.html?quayLai=thanhtoan';
    });
}

// Tick vào ô điều khoản thì xóa thông báo lỗi của ô đó.
dieuKhoanInput.addEventListener('change', () => {
    if (dieuKhoanInput.checked) {
        dieuKhoanError.innerText = '';
    }
});
