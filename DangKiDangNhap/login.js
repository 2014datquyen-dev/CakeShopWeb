const btn = document.querySelector('button[type="submit"]');
const emailPhoneInput = document.getElementById('emailPhone');
const emailPhoneError = emailPhoneInput.nextElementSibling.nextElementSibling;
const passwordInput = document.getElementById('password');
const passwordError = passwordInput.nextElementSibling.nextElementSibling;

const validationEmailPhone = () => {
    const emailPhone = emailPhoneInput.value;

    switch (emailPhone){
        case (''):
            emailPhoneInput.classList.add('input-error');
            emailPhoneError.innerText = 'Vui lòng nhập email hoặc số điện thoại vào.';
            emailPhoneInput.nextElementSibling.style.color='red';
            return false;
        case localStorage.getItem('email'):
        case localStorage.getItem('phone'):
            emailPhoneInput.classList.remove('input-error');
            emailPhoneError.innerText = '';
            emailPhoneInput.nextElementSibling.style.color='#4c4b4b';
            return true;
        default:
            emailPhoneInput.classList.add('input-error');
            emailPhoneError.innerText = 'Email hoặc số điện thoại không chính xác';
            emailPhoneInput.nextElementSibling.style.color='red';
            return false;
    }
};

const validationPassword = () => {
    const password = passwordInput.value;

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

const handleLogin = () => {
    btn.style.opacity = '0.7';
    btn.style.cursor='wait';
    document.body.style.cursor = 'wait';

    setTimeout(() => {
        btn.style.opacity = '';
        btn.style.cursor='';      
        document.body.style.cursor = '';   
        
        const emailPhoneValid = validationEmailPhone();
        const passwordValid = validationPassword();    

        if (emailPhoneValid&&passwordValid){
            localStorage.setItem('islogin', 'true');
            window.location.href='../TrangChu/trangChu.html';
        }
    }, 750);
}

document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();
    handleLogin();
});

emailPhoneInput.addEventListener('input', () => {
    emailPhoneInput.classList.remove('input-error');
    emailPhoneError.innerText = '';
    emailPhoneInput.nextElementSibling.style.color='#4c4b4b';
});

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('input-error');
    passwordError.innerText = '';
    passwordInput.nextElementSibling.style.color='#4c4b4b';
});