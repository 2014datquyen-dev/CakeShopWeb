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