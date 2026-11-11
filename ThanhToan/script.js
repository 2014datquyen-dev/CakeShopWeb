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

const orderToggle = document.getElementById("orderToggle");
const orderBox = document.querySelector(".right");
    
orderToggle.addEventListener("click", function () {
    orderBox.classList.toggle("order-open");
});