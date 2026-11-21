// Tác giả: Diệp Đạt Quyền - B2408813
// Khi bấm phần tiêu đề đơn hàng, bật/tắt class order-open của khung bên phải (phục vụ thu gọn/mở rộng bằng CSS).
document.getElementById("orderToggle").addEventListener("click", function () {
    const orderBox = document.querySelector(".right");
    orderBox.classList.toggle("order-open");
});

// Lấy nút thanh toán, các ô nhập thông tin và phần tử dùng để hiển thị lỗi.
const btn = document.getElementById('liquidate');
const nameInput = document.getElementById('fullname');
// nextElementSibling.nextElementSibling lấy phần tử đứng sau input hai vị trí; cách này phụ thuộc cấu trúc HTML.
const nameError = nameInput.nextElementSibling.nextElementSibling;
const emailInput = document.getElementById('email');
const emailError = emailInput.nextElementSibling.nextElementSibling;
const phoneInput = document.getElementById('phone');
const phoneError = phoneInput.nextElementSibling.nextElementSibling;
const addressInput = document.getElementById('address');
const addressError = addressInput.nextElementSibling.nextElementSibling;



// Kiểm tra họ tên. Trả về true nếu có nhập, false nếu bỏ trống; đồng thời cập nhật giao diện lỗi.
const validationFullname = () => {
    const name = nameInput.value;

    // !== nghĩa là khác cả giá trị và kiểu dữ liệu. Chuỗi rỗng biểu thị chưa có nội dung.
    if (name!==""){
        nameInput.classList.remove('input-error');
        nameError.innerText = '';
        return true;
    } else {
        nameInput.classList.add('input-error');
        nameError.innerText = 'Vui lòng nhập họ tên vào';
        return false;
    }
};

// Kiểm tra định dạng email bằng biểu thức chính quy (regular expression).
const validationEmail = () => {
    // ^[^\s@]+ yêu cầu phần đầu không chứa khoảng trắng/@; \. là dấu chấm thật; $ đánh dấu kết thúc.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailInput.value;

    // regex.test(email) trả về true khi chuỗi khớp định dạng yêu cầu.
    if (emailRegex.test(email)){
        emailInput.classList.remove('input-error');
        emailError.innerText = '';
        return true;
    } else {
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email hợp lệ';
        return false;
    }  
}

// Kiểm tra số điện thoại: ký tự đầu là 0, tiếp theo đúng 9 chữ số.
const validationPhone = () => {
    const phoneRegex = /^0\d{9}$/;    
    const phone = phoneInput.value;
    
    if (phoneRegex.test(phone)){
        phoneInput.classList.remove('input-error');
        phoneError.innerText='';
        return true;
    } else {
        phoneInput.classList.add('input-error');
        phoneError.innerText='Vui lòng nhập số điện thoại hợp lệ';
        return false;
    }
}

// Kiểm tra địa chỉ có được nhập hay không.
function validationAddress(){
    const address=addressInput.value;
    
    if (address!==''){
        addressInput.classList.remove('input-error');
        addressError.innerText='';
        return true;
    } else {
        addressInput.classList.add('input-error');
        addressError.innerText='Vui lòng nhập vào địa chỉ';
        return false;
    }
}

// Lắng nghe sự kiện click nút thanh toán; event là đối tượng mô tả lần nhấn.
btn.addEventListener('click', (event) => {
    // Ngăn hành vi mặc định (chẳng hạn gửi form và tải lại trang).
    event.preventDefault();

    // Cho nút và chuột vào trạng thái chờ nhằm tạo hiệu ứng đang xử lý.
    btn.style.opacity = '0.7';
    btn.style.cursor='wait';
    document.body.style.cursor = 'wait';
    // Chờ 750 mili giây rồi khôi phục con trỏ và thực hiện các bước kiểm tra.
    setTimeout( () => {
        btn.style.opacity = '';
        btn.style.cursor='';      
        document.body.style.cursor = '';

        // Gọi tất cả hàm xác thực để từng ô đều có thể hiện lỗi khi thiếu/sai dữ liệu.
        validationFullname();
        validationEmail();
        validationPhone();
        validationAddress();

        // Nếu giỏ hàng không có sản phẩm thì dừng xử lý bằng return.
        if (products.length === 0) {
            alert('Giỏ hàng đang trống, không thể đặt hàng.');
            return;
        }

        // Chỉ khi tất cả trường hợp lệ mới tạo đơn, lưu đơn, hiển thị chi tiết và mở popup.
        if (validationFullname()&&validationEmail()&&validationPhone()&&validationAddress()){
            // taoDonHang() trả về một object chứa dữ liệu đơn hàng.
            const donHang = taoDonHang();
            luuDonHang(donHang);
            hienThiDonHang(donHang);
            document.getElementById("successPopup").classList.add("show");
        }
    }, 750);

});

// Sự kiện input chạy mỗi khi người dùng gõ/sửa nội dung; xóa viền và thông báo lỗi cũ.
nameInput.addEventListener('input', () => {
    nameInput.classList.remove('input-error');
    nameError.innerText = '';
});

emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input-error');
    emailError.innerText = '';
});

phoneInput.addEventListener('input', () => {
    phoneInput.classList.remove('input-error');
    phoneError.innerText = '';
});

addressInput.addEventListener('input', () => {
    addressInput.classList.remove('input-error');
    addressError.innerText = '';
});


// Hàm định dạng số tiền sang kiểu hiển thị tiền Việt Nam, ví dụ 450000 thành 450.000 ₫.
// ===== ĐỊNH DẠNG TIỀN (giống formatCurrency trong show-cart.js) =====
// locale = "vi-VN" là tham số mặc định nếu lúc gọi hàm không truyền locale.
const formatCurrency = (amount, locale = "vi-VN") => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

// Chuyển giá dạng chuỗi có dấu phân cách và ký hiệu tiền tệ thành số để tính toán.
// "450.000đ" -> 450000
function layGiaSo(price) {
    // replace(/[^0-9]/g, "") loại bỏ mọi ký tự không phải chữ số; Number đổi chuỗi kết quả thành số.
    return Number(String(price).replace(/[^0-9]/g, ""));
}

// Chuẩn hóa số lượng: làm tròn xuống bằng Math.floor; nếu không hợp lệ/nhỏ hơn 1 thì dùng 1.
function laySoLuong(product) {
    const soLuong = Math.floor(Number(product.quantity));
    // Toán tử ba ngôi: điều_kiện ? giá_trị_nếu_đúng : giá_trị_nếu_sai.
    return (isNaN(soLuong) || soLuong < 1) ? 1 : soLuong;
}


// Đọc giỏ hàng từ localStorage, dựng giao diện danh sách sản phẩm và cộng tổng tiền.
// ===== HIỂN THỊ SẢN PHẨM VÀ TÍNH TIỀN =====
// getItem đọc chuỗi theo khóa cartItems; JSON.parse chuyển chuỗi JSON thành mảng/object.
const data = localStorage.getItem('cartItems');
// Nếu JSON.parse cho ra null (chưa có giỏ), dùng [] là mảng trống.
const products = JSON.parse(data) || [];
const productList = document.querySelector('.product-list');
let tongTien = 0;

// Không có sản phẩm thì tạo một thẻ p thông báo giỏ hàng trống.
if (products.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Giỏ hàng đang trống.';
    productList.textContent = '';
    productList.appendChild(empty);
} else {
    // forEach lần lượt xử lý từng sản phẩm trong giỏ.
    products.forEach((product) => {
        const soLuong = laySoLuong(product);
        const donGia = layGiaSo(product.price);
        // Cộng giá nhân số lượng vào biến tongTien đang được cập nhật qua từng vòng lặp.
        tongTien += donGia * soLuong;   // tổng tiền vẫn tính theo số lượng

        // Tạo các thẻ HTML bằng document.createElement thay vì nối chuỗi HTML.
        const divProduct = document.createElement('div');
        divProduct.className = 'product';

        // Gán đường dẫn hình và tên thay thế (alt) cho ảnh sản phẩm.
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        const divInfo = document.createElement('div');
        divInfo.className = 'product-info';

        // textContent gán nội dung văn bản, không diễn giải thành thẻ HTML.
        const pName = document.createElement('p');
        pName.textContent = product.name;

        const small = document.createElement('small');
        small.textContent = `Số lượng: ${soLuong}`;

        // appendChild đưa phần tử con vào phần tử cha.
        divInfo.appendChild(pName);
        divInfo.appendChild(small);

        // Hiển thị đơn giá của một sản phẩm, không phải tổng giá cho cả số lượng.
        const spanPrice = document.createElement('span');
        spanPrice.className = 'price';
        spanPrice.textContent = formatCurrency(donGia);   // giá gốc 1 sản phẩm

        // Ghép ảnh, thông tin và giá vào thẻ sản phẩm; sau đó đưa thẻ sản phẩm vào danh sách.
        divProduct.appendChild(img);
        divProduct.appendChild(divInfo);
        divProduct.appendChild(spanPrice);
        productList.appendChild(divProduct);
    });
}


// Cập nhật tổng tiền tại ba vị trí trong trang: phần thu gọn, tóm tắt và tổng cộng.
document.querySelectorAll('.order-toggle')[0].lastElementChild.textContent = formatCurrency(tongTien);
document.querySelectorAll('.summary')[0].firstElementChild.lastElementChild.textContent = formatCurrency(tongTien);
document.querySelectorAll('.total-price')[0].lastElementChild.textContent = formatCurrency(tongTien);


// Các hàm bên dưới đảm nhiệm tạo dữ liệu đơn, lưu xuống trình duyệt và render popup.
// ===== TẠO, LƯU VÀ HIỂN THỊ ĐƠN HÀNG =====
// Tạo object đơn hàng từ dữ liệu người nhập, giỏ hàng và tùy chọn nhận hàng đã lưu.
function taoDonHang() {
    // Đọc tùy chọn nhận hàng; dùng object rỗng {} nếu chưa có dữ liệu.
    const nhanHang = JSON.parse(localStorage.getItem('thongTinNhanHang')) || {};
    // radio đang chọn -> phần tử ngay sau nó là tên phương thức
    // Selector :checked tìm radio thanh toán đang được chọn; nextElementSibling lấy nhãn ngay sau radio.
    const phuongThuc = document.querySelector('input[name="payment-method"]:checked').nextElementSibling.textContent;

    // return {...} tạo và trả về object gồm các trường dữ liệu của đơn hàng.
    return {
        // Date.now() là thời gian tính bằng mili giây; slice(-6) lấy 6 ký tự cuối để tạo mã đơn ngắn.
        maDon: 'FC' + Date.now().toString().slice(-6),
        ngayDat: new Date().toLocaleString('vi-VN'),
        // trim() xóa khoảng trắng ở đầu và cuối nội dung nhập.
        hoTen: nameInput.value.trim(),
        email: emailInput.value.trim(),
        soDienThoai: phoneInput.value.trim(),
        diaChi: addressInput.value.trim(),
        thanhToan: phuongThuc,
        // Toán tử || chọn giá trị bên trái nếu truthy, nếu không thì lấy giá trị mặc định bên phải.
        ngayNhan: nhanHang.ngayNhan || '',
        thoiGian: nhanHang.thoiGian || '',
        xuatHoaDon: nhanHang.xuatHoaDon || false,
        ghiChu: nhanHang.ghiChu || '',
        // map tạo mảng mới gồm thông tin sản phẩm cần lưu; không sửa mảng products gốc.
        sanPham: products.map(product => ({
            name: product.name,
            price: layGiaSo(product.price),
            quantity: laySoLuong(product)
        })),
        tongTien: tongTien,
        // email tài khoản đang đăng nhập -> để popup Thông tin tài khoản lọc lịch sử mua hàng
        // Gắn email tài khoản nếu có trạng thái đăng nhập để phục vụ lọc lịch sử mua hàng.
        taiKhoan: localStorage.getItem('isLogin') ? localStorage.getItem('email') : ''
    };
}

// Lưu đơn hàng vào danh sách hiện có rồi dọn dữ liệu giỏ hàng và thông tin nhận hàng.
// Lưu đơn vào 'danhSachDonHang' rồi xóa giỏ hàng
function luuDonHang(donHang) {
    // Đọc mảng đơn đã lưu; nếu chưa có thì khởi tạo mảng rỗng.
    const danhSach = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
    // push thêm đơn mới vào cuối mảng.
    danhSach.push(donHang);
    // JSON.stringify đổi mảng thành chuỗi JSON vì localStorage chỉ lưu chuỗi.
    localStorage.setItem('danhSachDonHang', JSON.stringify(danhSach));
    // removeItem xóa khóa dữ liệu sau khi tạo đơn thành công.
    localStorage.removeItem('cartItems');
    localStorage.removeItem('thongTinNhanHang');
}

// Đổi ngày từ dạng YYYY-MM-DD sang DD/MM/YYYY để hiển thị.
// "2026-11-20" -> "20/11/2026"
function doiNgay(ngay) {
    if (ngay === '') return '';
    // split("-") tách chuỗi thành mảng [năm, tháng, ngày].
    const phan = ngay.split('-');
    return phan[2] + '/' + phan[1] + '/' + phan[0];
}

// Hàm phụ tạo một dòng thông tin gồm nhãn span và giá trị strong, rồi trả về phần tử p.
function taoDongThongTin(nhan, giaTri) {
    // Tạo thẻ p, gắn class CSS và tạo hai thẻ con để chứa tên trường/giá trị.
    const dong = document.createElement('p');
    dong.className = 'info-row';
    const oNhan = document.createElement('span');
    oNhan.textContent = nhan;
    const oGiaTri = document.createElement('strong');
    oGiaTri.textContent = giaTri;
    // appendChild gắn các phần tử con vào dòng thông tin.
    dong.appendChild(oNhan);
    dong.appendChild(oGiaTri);
    return dong;
}

// Hiển thị thông tin đơn hàng trong popup sau khi đặt hàng thành công.
// .success-popup: [0]icon [1]h2 [2]p [3]div.order-info [4]a
function hienThiDonHang(donHang) {
    // children[3] lấy phần tử con thứ tư (chỉ số bắt đầu từ 0) của .success-popup.
    const khung = document.querySelectorAll('.success-popup')[0].children[3];
    // Xóa nội dung cũ để không lặp thông tin khi hiển thị một đơn mới.
    khung.textContent = '';

    // Gọi taoDongThongTin cho từng trường và thêm vào khung bằng appendChild.
    khung.appendChild(taoDongThongTin('Mã đơn hàng', donHang.maDon));
    khung.appendChild(taoDongThongTin('Ngày đặt', donHang.ngayDat));
    khung.appendChild(taoDongThongTin('Người nhận', donHang.hoTen));
    khung.appendChild(taoDongThongTin('Số điện thoại', donHang.soDienThoai));
    khung.appendChild(taoDongThongTin('Email', donHang.email));
    khung.appendChild(taoDongThongTin('Địa chỉ', donHang.diaChi));
    // Chỉ hiện ngày nhận khi đơn có thông tin ngày nhận.
    if (donHang.ngayNhan !== '') {
        khung.appendChild(taoDongThongTin('Nhận hàng', doiNgay(donHang.ngayNhan) + ' - ' + donHang.thoiGian));
    }
    khung.appendChild(taoDongThongTin('Thanh toán', donHang.thanhToan));
    // Chỉ hiện dòng hóa đơn công ty nếu người dùng chọn xuất hóa đơn.
    if (donHang.xuatHoaDon) {
        khung.appendChild(taoDongThongTin('Hóa đơn công ty', 'Có'));
    }
    // Chỉ hiện ghi chú khi người dùng có nhập.
    if (donHang.ghiChu !== '') {
        khung.appendChild(taoDongThongTin('Ghi chú', donHang.ghiChu));
    }

    // Tạo danh sách ul chứa sản phẩm thuộc đơn hàng.
    const dsSanPham = document.createElement('ul');
    dsSanPham.className = 'order-items';
    // Duyệt sản phẩm, thêm tên/số lượng và thành tiền vào từng thẻ li.
    donHang.sanPham.forEach(item => {
        const sp = document.createElement('li');
        const ten = document.createElement('span');
        ten.textContent = item.name + ' x ' + item.quantity;
        const tien = document.createElement('span');
        tien.textContent = formatCurrency(item.price * item.quantity);
        sp.appendChild(ten);
        sp.appendChild(tien);
        dsSanPham.appendChild(sp);
    });
    khung.appendChild(dsSanPham);

    // Tạo dòng tổng cộng, thêm class order-total để CSS tạo kiểu riêng.
    const tong = taoDongThongTin('Tổng cộng', formatCurrency(donHang.tongTien));
    tong.classList.add('order-total');
    khung.appendChild(tong);
}
