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