// Tác giả: Diệp Đạt Quyền - B2408813 
const btn = document.querySelector('button[type="submit"]');
const nameInput = document.getElementById('fullname');
const nameError = nameInput.nextElementSibling.nextElementSibling;
const emailInput = document.getElementById('email');
const emailError = emailInput.nextElementSibling.nextElementSibling;
const phoneInput = document.getElementById('phone');
const phoneError = phoneInput.nextElementSibling.nextElementSibling;
const passwordInput = document.getElementById('password');
const passwordError = passwordInput.nextElementSibling.nextElementSibling;
const confirmPasswordInput = document.getElementById('confirmPassword');
const confirmPasswordError = confirmPasswordInput.nextElementSibling.nextElementSibling;

const validationFullname = () => {
    const name = nameInput.value;
    const nameRegex = /^.{5,}$/;

    if (name===''){
        nameInput.classList.add('input-error');
        nameError.innerText = 'Vui lòng nhập tên vào.';
        nameInput.nextElementSibling.style.color='red';
        return false;
    } else if 
    (nameRegex.test(name)){
        nameInput.classList.remove('input-error');
        nameError.innerText = '';
        nameInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        nameInput.classList.add('input-error');
        nameError.innerText = 'Tên phải có ít nhất 5 ký tự.';
        nameInput.nextElementSibling.style.color='red';
        return false;
    } 
};

const validationEmail = () => {
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

const validationPhone = () => {
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


const validationPassword = () => {
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (passwordRegex.test(password)){
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

const validationConfirmPassword = () => {
    const confirmPassword=confirmPasswordInput.value;

    if (validationPassword()){
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

const form = document.getElementById('registerForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    btn.style.opacity = '0.7';
    btn.style.cursor='wait';
    document.body.style.cursor = 'wait';

    setTimeout(() => {
        btn.style.opacity = '';
        btn.style.cursor='';      
        document.body.style.cursor = '';
        const nameValid=validationFullname();
        const emailValid=validationEmail();
        const phoneValid=validationPhone();
        const passwordValid=validationPassword();
        const confirmValid=validationConfirmPassword();

        if (nameValid&&emailValid&&phoneValid&&passwordValid&&confirmValid){
            localStorage.setItem('name', nameInput.value);
            localStorage.setItem('email', emailInput.value);
            localStorage.setItem('phone', phoneInput.value);
            localStorage.setItem('password', passwordInput.value);
            document.getElementById("successPopup").classList.add("show");
        }
    }, 1000);
});

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

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('input-error');
    passwordError.innerText = '';
    passwordInput.nextElementSibling.style.color='#4c4b4b';
});

confirmPasswordInput.addEventListener('input', () => {
    confirmPasswordInput.classList.remove('input-error');
    confirmPasswordError.innerText = '';
    confirmPasswordInput.nextElementSibling.style.color='#4c4b4b';
});