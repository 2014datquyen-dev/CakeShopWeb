// Tác giả: Diệp Đạt Quyền - B2408813
const toggleBtns = document.querySelectorAll('.toggle-password');

toggleBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', function () {
        const password = toggleBtn.parentElement.querySelector('.password-input');
        if (password.type === 'password') {
            password.type = 'text';
            toggleBtn.textContent='';
            const eye = document.createElement('img');
            eye.setAttribute('src', '../images/icons/eye-off.png');
            eye.setAttribute('alt', 'Ẩn mật khẩu');
            toggleBtn.appendChild(eye);
        } else {
            password.type = 'password';
            toggleBtn.textContent='';
            const eyeOff = document.createElement('img');
            eyeOff.setAttribute('src', '../images/icons/eye.png');
            eyeOff.setAttribute('alt', 'Hiện mật khẩu');
            toggleBtn.appendChild(eyeOff);
        };
    });
});