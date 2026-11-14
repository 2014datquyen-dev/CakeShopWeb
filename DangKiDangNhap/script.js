const toggleBtns = document.querySelectorAll('.toggle-password');

toggleBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', function () {
        const password = toggleBtn.parentElement.querySelector('.password-input');
        if (password.type === 'password') {
            password.type = 'text';
            toggleBtn.innerHTML = '<i data-lucide="eye"></i>';
        } else {
            password.type = 'password';
            toggleBtn.innerHTML = '<i data-lucide="eye-off"></i>';
        }   

        lucide.createIcons();
    });
});


const nameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');


const validationFullname = () => {
    
    const name = nameInput.value;
    const nameError = document.getElementById('nameError');

    if (name!==""){
        nameInput.classList.remove('input-error');
        nameError.innerText = '';
        nameInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        nameInput.classList.add('input-error');
        nameError.innerText = 'Vui lòng nhập họ tên vào';
        nameInput.nextElementSibling.style.color='red';
        return false;
    }
};

const validationEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;

    const email = emailInput.value;
    const emailError = emailInput.nextElementSibling.nextElementSibling;
    if (emailRegex.test(email)){
        emailInput.classList.remove('input-error');
        emailError.innerText = '';
        emailInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email hợp lệ';
        emailInput.nextElementSibling.style.color='red';
        return false;
    }  
}

const validationPhone = () => {
    const phoneRegex = /^0\d{9}$/;
    
    const phone = phoneInput.value;
    const phoneError = phoneInput.nextElementSibling.nextElementSibling;
    
    if (phoneRegex.test(phone)){
        phoneInput.classList.remove('input-error');
        phoneError.innerText='';
        phoneInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        phoneInput.classList.add('input-error');
        phoneError.innerText='Vui lòng nhập số điện thoại hợp lệ';
        phoneInput.nextElementSibling.style.color='red';
        return false;
    }
}


const validationPassword = () => {
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;

    const passwordError = passwordInput.nextElementSibling.nextElementSibling;
    // const passwordError = document.getElementById('passwordError');
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
    const confirmPasswordError=confirmPasswordInput.nextElementSibling.nextElementSibling;

    if (validationPassword()){
        if (passwordInput.value===confirmPassword){
            confirmPasswordInput.classList.remove('input-error');
            confirmPasswordError.innerHTML='';
            confirmPasswordInput.nextElementSibling.style.color='#4c4b4b';
            return true;
        } else {
            confirmPasswordInput.classList.add('input-error');
            confirmPasswordError.innerHTML='Mật khẩu xác nhận không khớp với mật khẩu đã nhâp';
            confirmPasswordInput.nextElementSibling.style.color='red';
            return false;
        }
    }
}

document.querySelector('button[type="submit"]').addEventListener('click', (event) => {
    event.preventDefault();

    const nameValid=validationFullname();
    const emailValid=validationEmail();
    const phoneValid=validationPhone();
    const passwordValid=validationPassword();
    const confirmValid=validationConfirmPassword();

    if (nameValid()&&emailValid()&&phoneValid()&&passwordValid()&&confirmValid()){
        document.getElementById("successPopup").classList.add("show");
    }

});

nameInput.addEventListener('blur', () => {
    if (nameInput.classList.contains('input-error')){
        validationFullname();
    }
});

emailInput.addEventListener('blur', () => {
    if (emailInput.classList.contains('input-error')){
        validationEmail();
    }
});

phoneInput.addEventListener('blur', () => {
    if (phoneInput.classList.contains('input-error')){
        validationPhone();
    }
});

passwordInput.addEventListener('blur', () => {
    if (passwordInput.classList.contains('input-error')){
        validationPassword();
    }
});

confirmPasswordInput.addEventListener('blur', () => {
    if (confirmPasswordInput.classList.contains('input-error')){
        validationConfirmPassword();
    }
});
