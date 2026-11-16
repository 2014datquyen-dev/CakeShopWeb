var anh = [
    "../images/Anh3.jpg",
    "../images/Anh2.jpg",
    "../images/Anh1.jpg"
];

var link = [
    "../TrangChu/trangChu.html",
    "../TrangChu/trangChu.html",
    "../SanPham/sanPham.html"
];

var i=0;
function doiAnh() {
    i=i+1;
    //het anh thi quanh ve
    if (i==anh.length){
        i=0;
    }
    document.getElementById("bannerImg").src=anh[i];
    document.getElementById("bannerLink").href = link[i];
}

setInterval(doiAnh,3000);

// ===== HỎI ĐÁP: BẤM CÂU HỎI THÌ MỞ / ĐÓNG =====
var cacCauHoi = document.querySelectorAll(".cau-hoi");

for (var n = 0; n < cacCauHoi.length; n++) {
    cacCauHoi[n].onclick = function () {
        // this là nút vừa bấm, parentElement là khối .hd-item chứa nó
        var khoi = this.parentElement;

        // có class "mo" thì bỏ đi, chưa có thì thêm vào
        khoi.classList.toggle("mo");
    };
}

// ===== NÚT QUAY LÊN ĐẦU TRANG =====
var nutLenDau = document.getElementById("nutLenDau");

// mỗi lần cuộn trang thì kiểm tra
window.onscroll = function () {
    // cuộn xuống quá 300px thì hiện nút, ngược lại thì ẩn
    if (window.scrollY > 300) {
        nutLenDau.classList.add("hien");
    } else {
        nutLenDau.classList.remove("hien");
    }
};

// bấm nút thì cuộn mượt về đầu trang
nutLenDau.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
