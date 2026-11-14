const password = document.getElementById("password");
const toggleBtn = document.querySelector(".toggle-password");

toggleBtn.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        toggleBtn.innerHTML = '<i data-lucide="eye-off"></i>';
        toggleBtn.setAttribute("aria-label", "Ẩn mật khẩu");
    } else {
        password.type = "password";
        toggleBtn.innerHTML = '<i data-lucide="eye"></i>';
        toggleBtn.setAttribute("aria-label", "Hiện mật khẩu");
    }

    lucide.createIcons();
});