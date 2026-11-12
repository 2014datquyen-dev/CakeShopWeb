const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

// const searchForm = document.getElementById("searchForm");
// const searchInput = document.getElementById("searchInput");
// const searchResult = document.getElementById("searchResult");

// Đóng / mở menu
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