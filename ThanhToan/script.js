document.getElementById("orderToggle").addEventListener("click", function () {
    const orderBox = document.querySelector(".right");
    orderBox.classList.toggle("order-open");
});

btn=document.getElementById('liquidate');
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
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
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

        if (validationFullname()&&validationEmail()&&validationPhone()&&validationAddress()){
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


const data = localStorage.getItem('cartItems');
const products = JSON.parse(data) || [];
const productList = document.querySelector('.product-list');

products.forEach((product) => {
    productList.innerHTML += `
        <div class="product">
            <img src="${product.image}">
            <div class="product-info">
                <p>${product.name}</p>
                <small>Số lượng: ${product.quantity}</small>
            </div>
            <span class="price">${product.price}</span>
        </div>
    `;
});
