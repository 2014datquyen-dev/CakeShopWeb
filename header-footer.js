const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");

    const isOpen = navMenu.classList.contains("open");

    menuBtn.textContent = isOpen ? "✕" : "☰";
});


const headings = document.querySelectorAll(".footer-heading");

headings.forEach((heading) => {
    heading.addEventListener("click", () => {

        const column = heading.closest(".footer-column");

        column.classList.toggle("active");
    });
});


const authLink = document.querySelector('.auth-link');
const login = localStorage.getItem('isLogin');
const name = localStorage.getItem('name');

if (login){
    authLink.textContent='';
    const sp_name=document.createElement('span');
    sp_name.textContent=`${name} | `;
    const a_logOut=document.createElement('a');
    a_logOut.setAttribute('id', 'logOut');
    a_logOut.textContent='Đăng xuất';

    authLink.appendChild(sp_name);
    authLink.appendChild(a_logOut);
    document.getElementById('logOut').addEventListener('click', () => {
        const cart = localStorage.getItem('cartItems');
        if (cart) localStorage.setItem('cartBackup', cart);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('cartItems');
        window.location.reload();
    });
}




// ===== SỐ LƯỢNG SẢN PHẨM TRÊN ICON GIỎ HÀNG (mọi trang) =====
// a.cartBtn: [0]img.cart  -> thêm [1]span.so-luong-gio bằng createElement
const cartBtn = document.querySelectorAll('.cartBtn')[0];
const soLuongGio = document.createElement('span');
soLuongGio.className = 'so-luong-gio';
cartBtn.appendChild(soLuongGio);

// Cộng dồn quantity trong localStorage 'cartItems' (giống redirect2ShowCartPage - Dự án 3)
function capNhatIconGioHang() {
    let numberOfItems = 0;
    if (localStorage.getItem('cartItems') !== null) {
        JSON.parse(localStorage.getItem('cartItems')).forEach(item => {
            const soLuong = Math.floor(Number(item.quantity));
            numberOfItems += (soLuong > 0) ? soLuong : 1;   // số lượng lỗi tính là 1, giống trang giỏ
        });
    }
    const badge = cartBtn.lastElementChild;
    badge.textContent = numberOfItems > 99 ? '99+' : numberOfItems;
    badge.hidden = (numberOfItems === 0);
}

capNhatIconGioHang();

