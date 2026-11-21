// Tác giả: Diệp Đạt Quyền - B2408813
// ===== 1. MENU ĐIỀU HƯỚNG (HEADER) =====
// getElementById tìm đúng một phần tử HTML theo id.
// menuBtn là nút mở/đóng; navMenu là khung chứa các liên kết điều hướng.
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

// addEventListener("click", callback): chạy hàm callback mỗi khi người dùng nhấn nút.
menuBtn.addEventListener("click", () => {
    // toggle: nếu class "open" đang có thì xóa, chưa có thì thêm. CSS quyết định cách menu hiện/ẩn.
    navMenu.classList.toggle("open");

    // contains trả về true/false để biết menu hiện đang mở hay đóng.
    const isOpen = navMenu.classList.contains("open");

    // Toán tử 3 ngôi: điều kiện ? giá trị khi đúng : giá trị khi sai.
    // Menu mở thì hiện dấu ✕, đóng thì hiện biểu tượng ☰.
    menuBtn.textContent = isOpen ? "✕" : "☰";
});


// ===== 2. ĐÓNG/MỞ CỘT FOOTER =====
// querySelectorAll lấy TẤT CẢ phần tử có class footer-heading (NodeList).
const headings = document.querySelectorAll(".footer-heading");

// forEach duyệt từng heading; mỗi heading được gắn sự kiện click riêng.
headings.forEach((heading) => {
    heading.addEventListener("click", () => {

        // closest tìm phần tử gần nhất từ heading đi ngược lên cây DOM
        // (kể cả chính nó) khớp .footer-column: cột chứa tiêu đề vừa bấm.
        const column = heading.closest(".footer-column");

        // Thêm/xóa class active để CSS mở/thu nội dung của cột footer.
        column.classList.toggle("active");
    });
});


// ===== Ô TÌM KIẾM: bấm kính lúp cũng tìm (nhấn Enter trong ô vẫn tìm như cũ) =====
// Nút để type="button" (không phải submit) để không trùng với nút submit của form Đăng nhập / Đăng ký
// [0] lấy phần tử đầu tiên trong danh sách các nút .search-btn.
const nutTimKiem = document.querySelectorAll('.search-btn')[0];
nutTimKiem.addEventListener('click', () => {
    // parentElement là phần tử cha của kính lúp, ở đây dự kiến là thẻ <form>.
    // submit() gửi form theo action/method được cấu hình trong HTML.
    nutTimKiem.parentElement.submit();   // nút kính lúp -> form.search-box (truy vấn gián tiếp)
});

// ===== TÀI KHOẢN: NÚT NGƯỜI DÙNG + POPUP THÔNG TIN TÀI KHOẢN =====
// Chưa đăng nhập: bấm nút -> sang trang Đăng nhập
// Đã đăng nhập : bấm nút -> mở popup (tên, email, địa chỉ, SĐT, lịch sử mua hàng, Đăng xuất)
const userBtn = document.getElementById('userBtn');
// localStorage lưu dữ liệu dạng chuỗi trong trình duyệt, tồn tại sau khi tải lại trang.
// getItem trả về chuỗi đã lưu hoặc null nếu khóa chưa tồn tại.
const daDangNhap = localStorage.getItem('isLogin');

// Nếu có giá trị isLogin thì coi như đã đăng nhập (theo logic hiện tại).
if (daDangNhap) {
    // Thêm class để CSS thay đổi giao diện nút tài khoản.
    userBtn.classList.add('da-dang-nhap');
    // title là dòng gợi ý khi rê chuột lên nút.
    userBtn.title = localStorage.getItem('name');
} else {
    userBtn.title = 'Đăng nhập';
}

// Mỗi lần bấm nút, kiểm tra trạng thái đăng nhập mới nhất.
userBtn.addEventListener('click', () => {
    if (localStorage.getItem('isLogin')) {
        // Có đăng nhập: tạo và hiển thị popup tài khoản bằng JS.
        moPopupTaiKhoan();
    } else {
        // Chưa đăng nhập: đổi URL của trang hiện tại để đến trang đăng nhập.
        window.location.href = '../DangKiDangNhap/DangNhap.html';
    }
});

// Tạo 1 dòng "Nhãn: <strong>giá trị</strong>"
// Hàm nhận nhan (vd: Email) và giaTri (vd: abc@gmail.com),
// trả về một thẻ <p> chứa văn bản nhãn và <strong> in đậm giá trị.
function taoDongTaiKhoan(nhan, giaTri) {
    // createElement tạo phần tử DOM trong bộ nhớ; chưa xuất hiện trên trang.
    const dong = document.createElement('p');
    dong.className = 'tk-dong-tt';
    // textContent đặt văn bản thuần, không diễn giải chuỗi thành HTML.
    dong.textContent = nhan + ': ';
    const dam = document.createElement('strong');
    dam.textContent = giaTri;
    // Đưa <strong> vào bên trong <p>, sau phần nhãn.
    dong.appendChild(dam);
    // Trả lại phần tử hoàn chỉnh để nơi gọi có thể appendChild vào popup.
    return dong;
}

// Lấy các đơn hàng của tài khoản đang đăng nhập (lưu ở 'danhSachDonHang' bên trang Thanh toán)
// Đầu vào: email của tài khoản. Đầu ra: mảng các đơn hàng khớp email.
function layDonHangCuaToi(email) {
    // localStorage trả về chuỗi JSON; JSON.parse chuyển thành mảng/object JS.
    // Nếu chưa có dữ liệu (null), dùng mảng rỗng [] để có thể forEach.
    const tatCa = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
    // Mảng sẽ chứa các đơn hàng thỏa điều kiện lọc.
    const ketQua = [];
    // forEach lần lượt xét từng đơn hàng trong danh sách.
    tatCa.forEach(don => {
        // đơn mới có taiKhoan; đơn cũ chưa có thì so theo email nhập lúc thanh toán
        if (don.taiKhoan === email || (!don.taiKhoan && don.email === email)) {
            // push bổ sung đơn phù hợp vào cuối mảng kết quả.
            ketQua.push(don);
        }
    });
    return ketQua;
}

// ===== 3. TẠO POPUP TÀI KHOẢN BẰNG DOM =====
// Hàm chạy khi người dùng nhấn nút tài khoản trong trạng thái đăng nhập.
function moPopupTaiKhoan() {
    const email = localStorage.getItem('email');
    // Lấy các đơn thuộc email hiện tại để hiển thị lịch sử mua hàng.
    const donHang = layDonHangCuaToi(email);
    // Địa chỉ tài khoản: lưu ở đơn hàng đầu tiên (key 'address', xem ThanhToan/script.js).
    // Tài khoản đặt hàng trước khi có key này thì lấy từ đơn gần nhất.
    let diaChi = localStorage.getItem('address');
    if (!diaChi) {
        diaChi = donHang.length > 0 ? donHang[donHang.length - 1].diaChi : 'Chưa cập nhật';
    }

    // Lớp nền phủ (overlay) và hộp thông tin (popup) đều được tạo bằng JS.
    const nen = document.createElement('div');
    nen.className = 'tk-overlay';
    const hop = document.createElement('div');
    hop.className = 'tk-popup';

    const nutDong = document.createElement('button');
    nutDong.type = 'button';
    nutDong.className = 'tk-close';
    nutDong.textContent = '×';
    // aria-label mô tả nút dấu × cho công cụ hỗ trợ tiếp cận.
    nutDong.setAttribute('aria-label', 'Đóng');

    const tieuDe = document.createElement('h2');
    tieuDe.textContent = 'Thông tin tài khoản';

    // Xếp các phần tử con vào hộp theo đúng thứ tự hiển thị.
    // appendChild di chuyển/gắn phần tử vào cuối danh sách con của phần tử cha.
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

    // Tạo danh sách <ul> để chứa các mục <li> đơn hàng.
    const lichSu = document.createElement('ul');
    lichSu.className = 'tk-lich-su';
    // Khi tài khoản chưa từng mua hàng, hiển thị một dòng thông báo.
    if (donHang.length === 0) {
        const trong = document.createElement('li');
        trong.className = 'tk-trong';
        trong.textContent = 'Chưa có đơn hàng nào.';
        lichSu.appendChild(trong);
    } else {
        // hiện tối đa 5 đơn gần nhất, mới nhất ở trên
        // Bắt đầu từ chỉ số cuối (đơn mới nhất), giảm i mỗi vòng.
        // i >= 0 tránh vượt đầu mảng; i >= length-5 giới hạn tối đa 5 đơn.
        for (let i = donHang.length - 1; i >= 0 && i >= donHang.length - 5; i--) {
            const muc = document.createElement('li');
            const ngay = document.createElement('p');
            ngay.textContent = 'Mua ngày: ' + donHang[i].ngayDat;
            const tien = document.createElement('p');
            // Number chuyển tổng tiền thành số; toLocaleString('vi-VN') thêm dấu phân cách hàng nghìn.
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

    // Đưa hộp vào nền, sau đó gắn nền vào body: popup mới xuất hiện trên trang.
    nen.appendChild(hop);
    document.body.appendChild(nen);

    // Gắn 1 sự kiện cho lớp nền: bấm nút × (sự kiện nổi bọt lên nền) hoặc bấm ra ngoài hộp đều đóng
    // Truyền tên hàm làm callback (KHÔNG có ()), trình duyệt tự gọi khi click.
    nen.addEventListener('click', dongPopupTaiKhoan);
    // Gắn hành động đăng xuất cho nút vừa tạo.
    nutDangXuat.addEventListener('click', dangXuat);
}

// ===== 4. ĐÓNG POPUP VÀ ĐĂNG XUẤT =====
// evt là đối tượng sự kiện click do trình duyệt tự truyền vào callback.
function dongPopupTaiKhoan(evt) {
    // evt.target là phần tử mà người dùng thực sự nhấn vào.
    // Sự kiện click từ các phần tử con có thể nổi bọt lên nen (.tk-overlay).
    const nguon = evt.target;
    if (nguon.className === 'tk-close') {
        // nút × -> .tk-popup -> .tk-overlay (truy vấn gián tiếp)
        // Lần 1 parentElement: từ nút × lên hộp; lần 2: từ hộp lên nền.
        // removeChild xóa lớp nền khỏi body => toàn bộ popup biến mất.
        document.body.removeChild(nguon.parentElement.parentElement);
    } else if (nguon.className === 'tk-overlay') {
        // bấm đúng vùng nền tối bên ngoài hộp
        // Nếu bấm trực tiếp vào nền, xóa chính phần tử nền khỏi body.
        document.body.removeChild(nguon);
    }
    // bấm vào bên trong hộp thì không làm gì
}

// Đăng xuất: giữ lại giỏ hàng để lần sau đăng nhập lấy lại (giữ nguyên cách làm cũ)
// Hàm chỉ xóa cờ đăng nhập và giỏ hiện hành, không xóa thông tin tài khoản.
function dangXuat() {
    const cart = localStorage.getItem('cartItems');
    // Nếu giỏ có dữ liệu, tạo bản sao để lần đăng nhập sau phục hồi.
    if (cart) localStorage.setItem('cartBackup', cart);
    // removeItem xóa khóa khỏi localStorage; các trang sẽ hiểu là chưa đăng nhập.
    localStorage.removeItem('isLogin');
    localStorage.removeItem('cartItems');
    // Tải lại trang để header và giao diện cập nhật trạng thái.
    window.location.reload();
}


// ===== SỐ LƯỢNG SẢN PHẨM TRÊN ICON GIỎ HÀNG (mọi trang) =====
// a.cartBtn: [0]img.cart  -> thêm [1]span.so-luong-gio bằng createElement
// Chọn nút giỏ hàng, tạo <span> dùng làm huy hiệu hiển thị số lượng.
const cartBtn = document.querySelectorAll('.cartBtn')[0];
const soLuongGio = document.createElement('span');
soLuongGio.className = 'so-luong-gio';
cartBtn.appendChild(soLuongGio);

// Cộng dồn quantity trong localStorage 'cartItems' (giống redirect2ShowCartPage - Dự án 3)
// ===== 5. ĐẾM SỐ LƯỢNG TRONG GIỎ HÀNG =====
// Đếm tổng quantity của tất cả sản phẩm, không phải số loại sản phẩm.
function capNhatIconGioHang() {
    // let dùng vì biến này được cộng dồn qua nhiều lần lặp.
    let numberOfItems = 0;
    // Chỉ phân tích dữ liệu khi khóa giỏ hàng tồn tại.
    if (localStorage.getItem('cartItems') !== null) {
        JSON.parse(localStorage.getItem('cartItems')).forEach(item => {
            // Number đổi giá trị sang số; Math.floor làm tròn xuống số nguyên.
            const soLuong = Math.floor(Number(item.quantity));
            numberOfItems += (soLuong > 0) ? soLuong : 1;   // số lượng lỗi tính là 1, giống trang giỏ
        });
    }
    // lastElementChild chính là <span> vừa được appendChild vào cartBtn.
    const badge = cartBtn.lastElementChild;
    // Nếu tổng vượt 99 thì chỉ ghi 99+, ngược lại ghi số lượng thực tế.
    badge.textContent = numberOfItems > 99 ? '99+' : numberOfItems;
    // Thuộc tính hidden = true khi giỏ trống => ẩn huy hiệu.
    badge.hidden = (numberOfItems === 0);
}

// Gọi ngay khi file được chạy để cập nhật huy hiệu lúc tải trang.
capNhatIconGioHang();

// ===== NÚT QUAY LÊN ĐẦU TRANG (dùng chung mọi trang, chuyển từ TrangChu/trangChu.js - Lê Thị Khánh Ly) =====
// ===== 6. NÚT CUỘN VỀ ĐẦU TRANG =====
// Lấy nút cuộn lên từ HTML bằng id.
var nutLenDau = document.getElementById("nutLenDau");

// mỗi lần cuộn trang thì kiểm tra
// onscroll được chạy mỗi khi trang cuộn; gán = sẽ thay thế handler onscroll trước đó.
window.onscroll = function () {
    // cuộn xuống quá 300px thì hiện nút, ngược lại thì ẩn
    // scrollY là khoảng cách (px) đã cuộn từ đầu tài liệu xuống dưới.
    if (window.scrollY > 300) {
        nutLenDau.classList.add("hien");
    } else {
        nutLenDau.classList.remove("hien");
    }
};

// bấm nút thì cuộn mượt về đầu trang
// onclick xử lý thao tác nhấn vào nút quay lên đầu trang.
nutLenDau.onclick = function () {
    // top: 0 là vị trí đầu trang; smooth tạo hiệu ứng cuộn mượt.
    window.scrollTo({ top: 0, behavior: "smooth" });
};
