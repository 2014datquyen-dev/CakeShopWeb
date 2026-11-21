// Tác giả: Diệp Đạt Quyền - B2408813
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


// ===== Ô TÌM KIẾM: bấm kính lúp cũng tìm (nhấn Enter trong ô vẫn tìm như cũ) =====
// Nút để type="button" (không phải submit) để không trùng với nút submit của form Đăng nhập / Đăng ký
const nutTimKiem = document.querySelectorAll('.search-btn')[0];
nutTimKiem.addEventListener('click', () => {
    nutTimKiem.parentElement.submit();   // nút kính lúp -> form.search-box (truy vấn gián tiếp)
});

// ===== TÀI KHOẢN: NÚT NGƯỜI DÙNG + POPUP THÔNG TIN TÀI KHOẢN =====
// Chưa đăng nhập: bấm nút -> sang trang Đăng nhập
// Đã đăng nhập : bấm nút -> mở popup (tên, email, địa chỉ, SĐT, lịch sử mua hàng, Đăng xuất)
const userBtn = document.getElementById('userBtn');
const daDangNhap = localStorage.getItem('isLogin');

if (daDangNhap) {
    userBtn.classList.add('da-dang-nhap');
    userBtn.title = localStorage.getItem('name');
} else {
    userBtn.title = 'Đăng nhập';
}

userBtn.addEventListener('click', () => {
    if (localStorage.getItem('isLogin')) {
        moPopupTaiKhoan();
    } else {
        window.location.href = '../DangKiDangNhap/DangNhap.html';
    }
});

// Tạo 1 dòng "Nhãn: <strong>giá trị</strong>"
function taoDongTaiKhoan(nhan, giaTri) {
    const dong = document.createElement('p');
    dong.className = 'tk-dong-tt';
    dong.textContent = nhan + ': ';
    const dam = document.createElement('strong');
    dam.textContent = giaTri;
    dong.appendChild(dam);
    return dong;
}

// Lấy các đơn hàng của tài khoản đang đăng nhập (lưu ở 'danhSachDonHang' bên trang Thanh toán)
function layDonHangCuaToi(email) {
    const tatCa = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
    const ketQua = [];
    tatCa.forEach(don => {
        // đơn mới có taiKhoan; đơn cũ chưa có thì so theo email nhập lúc thanh toán
        if (don.taiKhoan === email || (!don.taiKhoan && don.email === email)) {
            ketQua.push(don);
        }
    });
    return ketQua;
}

function moPopupTaiKhoan() {
    const email = localStorage.getItem('email');
    const donHang = layDonHangCuaToi(email);
    // Địa chỉ tài khoản: lưu ở đơn hàng đầu tiên (key 'address', xem ThanhToan/script.js).
    // Tài khoản đặt hàng trước khi có key này thì lấy từ đơn gần nhất.
    let diaChi = localStorage.getItem('address');
    if (!diaChi) {
        diaChi = donHang.length > 0 ? donHang[donHang.length - 1].diaChi : 'Chưa cập nhật';
    }

    const nen = document.createElement('div');
    nen.className = 'tk-overlay';
    const hop = document.createElement('div');
    hop.className = 'tk-popup';

    const nutDong = document.createElement('button');
    nutDong.type = 'button';
    nutDong.className = 'tk-close';
    nutDong.textContent = '×';
    nutDong.setAttribute('aria-label', 'Đóng');

    const tieuDe = document.createElement('h2');
    tieuDe.textContent = 'Thông tin tài khoản';

    hop.appendChild(nutDong);
    hop.appendChild(tieuDe);
    hop.appendChild(taoDongTaiKhoan('Tên tài khoản', localStorage.getItem('name')));
    hop.appendChild(taoDongTaiKhoan('Email', email));
    hop.appendChild(taoDongTaiKhoan('Địa chỉ', diaChi));
    hop.appendChild(taoDongTaiKhoan('Số điện thoại', localStorage.getItem('phone')));

    const tieuDeLichSu = document.createElement('p');
    tieuDeLichSu.className = 'tk-dong-tt';
    tieuDeLichSu.textContent = 'Lịch sử mua hàng';
    hop.appendChild(tieuDeLichSu);

    const lichSu = document.createElement('ul');
    lichSu.className = 'tk-lich-su';
    if (donHang.length === 0) {
        const trong = document.createElement('li');
        trong.className = 'tk-trong';
        trong.textContent = 'Chưa có đơn hàng nào.';
        lichSu.appendChild(trong);
    } else {
        // hiện tối đa 5 đơn gần nhất, mới nhất ở trên
        for (let i = donHang.length - 1; i >= 0 && i >= donHang.length - 5; i--) {
            const muc = document.createElement('li');
            const ngay = document.createElement('p');
            ngay.textContent = 'Mua ngày: ' + donHang[i].ngayDat;
            const tien = document.createElement('p');
            tien.textContent = 'Tổng tiền: ' + Number(donHang[i].tongTien).toLocaleString('vi-VN') + 'đ';
            muc.appendChild(ngay);
            muc.appendChild(tien);
            lichSu.appendChild(muc);
        }
    }
    hop.appendChild(lichSu);

    const nutDangXuat = document.createElement('button');
    nutDangXuat.type = 'button';
    nutDangXuat.className = 'tk-dang-xuat';
    nutDangXuat.textContent = 'Đăng xuất';
    hop.appendChild(nutDangXuat);

    nen.appendChild(hop);
    document.body.appendChild(nen);

    // Gắn 1 sự kiện cho lớp nền: bấm nút × (sự kiện nổi bọt lên nền) hoặc bấm ra ngoài hộp đều đóng
    nen.addEventListener('click', dongPopupTaiKhoan);
    nutDangXuat.addEventListener('click', dangXuat);
}

function dongPopupTaiKhoan(evt) {
    const nguon = evt.target;
    if (nguon.className === 'tk-close') {
        // nút × -> .tk-popup -> .tk-overlay (truy vấn gián tiếp)
        document.body.removeChild(nguon.parentElement.parentElement);
    } else if (nguon.className === 'tk-overlay') {
        // bấm đúng vùng nền tối bên ngoài hộp
        document.body.removeChild(nguon);
    }
    // bấm vào bên trong hộp thì không làm gì
}

// Đăng xuất: giữ lại giỏ hàng để lần sau đăng nhập lấy lại (giữ nguyên cách làm cũ)
function dangXuat() {
    const cart = localStorage.getItem('cartItems');
    if (cart) localStorage.setItem('cartBackup', cart);
    localStorage.removeItem('isLogin');
    localStorage.removeItem('cartItems');
    window.location.reload();
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

// ===== NÚT QUAY LÊN ĐẦU TRANG (dùng chung mọi trang, chuyển từ TrangChu/trangChu.js - Lê Thị Khánh Ly) =====
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
