document.addEventListener("click", (e) => {
  const giohang = e.target.closest(`.giohang`);

  if (giohang) {
    e.preventDefault();
    const muado = e.target.closest(`.product-card`);
    // 2. Thêm .innerText để lấy chuỗi văn bản thay vì lấy thẻ HTML
    const tenbanh = muado.querySelector(".product-name").innerText.trim();
    const giabanh = muado.querySelector(".product-price").innerText.trim();

    const data = {
      ten: tenbanh,
      gia: giabanh,
    };

    let currentCart = JSON.parse(localStorage.getItem("myCart")) || [];
    currentCart.push(data);
    localStorage.setItem("myCart", JSON.stringify(currentCart));

    console.log("Đã thêm vào giỏ hàng:", currentCart);
    alert("Đã thêm " + tenbanh + " vào giỏ hàng!"); // Thông báo cho người dùng biết
  }
});
