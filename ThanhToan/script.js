//  const orderToggle = document.getElementById("orderToggle");
//         const orderBox = document.querySelector(".right");
//         const toggleText = document.getElementById("toggleText");
//         const toggleArrow = document.getElementById("toggleArrow");

//         orderToggle.addEventListener("click", function () {
//             const isOpen = orderBox.classList.toggle("order-open");
//             // orderToggle.setAttribute("aria-expanded", String(isOpen));
//             // toggleText.textContent = isOpen
//             //     ? "Ẩn thông tin đơn hàng"
//             //     : "Hiển thị thông tin đơn hàng";
//             // toggleArrow.textContent = isOpen ? "⌃" : "⌄";
//         });


document.getElementById("orderToggle").addEventListener("click", function () {
    const orderBox = document.querySelector(".right");
    orderBox.classList.toggle("order-open");
});



const nameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');


const validationFullname = () => {
    
    const name = nameInput.value;
    const nameError = document.getElementById('nameError');

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
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

    const email = emailInput.value;
    const emailError = emailInput.nextElementSibling;
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
    const phoneError = phoneInput.nextElementSibling;
    
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
    const addressError=addressInput.nextElementSibling;
    
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

document.getElementById('liquidate').addEventListener('click', (event) => {
    event.preventDefault();

    validationFullname();
    validationEmail();
    validationPhone();
    validationAddress();

    if (validationFullname()&&validationEmail()&&validationPhone()&&validationAddress()){
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

addressInput.addEventListener('blur', () => {
    if (addressInput.classList.contains('input-error')){
        validationAddress();
    }
});

