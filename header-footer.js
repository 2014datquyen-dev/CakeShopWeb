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
const name = localStorage.getItem('name');

if (name){
    authLink.innerHTML = 
        `<a>${name}</a>
        &nbsp;<span class="separator">|</span>&nbsp;
        <a >Đăng xuất</a>`
} else {
    authLink.innerHTML =
        `<a href="../DangKiDangNhap/dangNhap.html">Đăng nhập</a>
        &nbsp;<span class="separator">|</span>&nbsp;
        <a href="../DangKiDangNhap/dangKy.html">Đăng ký</a>`
}
