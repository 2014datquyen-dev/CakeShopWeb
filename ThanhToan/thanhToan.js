// Tác giả: Diệp Đạt Quyền - B2408813
// Khi bấm phần tiêu đề đơn hàng, bật/tắt class order-open của khung bên phải (phục vụ thu gọn/mở rộng bằng CSS).
document.getElementById("orderToggle").addEventListener("click", function () {
    const orderBox = document.querySelector(".right");
    orderBox.classList.toggle("order-open");
});

// Lấy nút thanh toán, các ô nhập thông tin và phần tử dùng để hiển thị lỗi.
// Tác giả: Huỳnh Thiên Bảo - B2405021 - Dòng 10: Lấy nút Đặt hàng
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


// Tác giả: Huỳnh Thiên Bảo - B2405021 - Dòng 24-98: Biểu thức kiểm tra email
// Kiểm tra họ tên: không được để trống và phải có ít nhất 5 ký tự.
const validationFullname = () => {
    const name = nameInput.value;
    // Biểu thức chính quy /^.{5,}$/: dấu ^ bắt đầu, . là một ký tự bất kỳ (trừ xuống dòng), {5,} là từ 5 ký tự, $ là kết thúc.
    const nameRegex = /^.{5,}$/;

    // Nếu bỏ trống: đánh dấu lỗi, hiện thông báo và trả về false.
    if (name===''){
        nameInput.classList.add('input-error');
        nameError.innerText = 'Vui lòng nhập tên vào.';
        nameInput.nextElementSibling.style.color='red';
        return false;
    } else if 
    // test(name) trả về true nếu tên khớp với biểu thức chính quy.
    (nameRegex.test(name)){
        nameInput.classList.remove('input-error');
        nameError.innerText = '';
        nameInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    // Có nhập nhưng chưa đủ 5 ký tự thì báo lỗi.
    } else {
        nameInput.classList.add('input-error');
        nameError.innerText = 'Tên phải có ít nhất 5 ký tự.';
        nameInput.nextElementSibling.style.color='red';
        return false;
    } 
};

// Kiểm tra email theo dạng phần trước @, tên miền, dấu chấm và phần đuôi 2 đến 4 ký tự.
const validationEmail = () => {
    // \s là khoảng trắng; [^\s@] nghĩa là một ký tự không phải khoảng trắng hay @.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
    const email = emailInput.value;
    if (email===''){
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email vào.';
        emailInput.nextElementSibling.style.color='red';
        return false;
    } else if 
    (emailRegex.test(email)){
        emailInput.classList.remove('input-error');
        emailError.innerText = '';
        emailInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        emailInput.classList.add('input-error');
        emailError.innerText = 'Vui lòng nhập email hợp lệ.';
        emailInput.nextElementSibling.style.color='red';
        return false;
    }  
}

// Kiểm tra số điện thoại: bắt đầu bằng số 0 và theo sau là đúng 9 chữ số (tổng 10 chữ số).
const validationPhone = () => {
    // \d là một chữ số; {9} yêu cầu xuất hiện đúng 9 lần.
    const phoneRegex = /^0\d{9}$/;
    const phone = phoneInput.value;
    
    if (phone===''){
        phoneInput.classList.add('input-error');
        phoneError.innerText = 'Vui lòng nhập số điện thoại vào.';
        phoneInput.nextElementSibling.style.color='red';
        return false;
    } else if
    (phoneRegex.test(phone)){
        phoneInput.classList.remove('input-error');
        phoneError.innerText='';
        phoneInput.nextElementSibling.style.color='#4c4b4b';
        return true;
    } else {
        phoneInput.classList.add('input-error');
        phoneError.innerText='Vui lòng nhập số điện thoại hợp lệ.';
        phoneInput.nextElementSibling.style.color='red';
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
        // Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 112 đến dòng 115: Khi bấm Đặt hàng: giỏ hàng trống thì báo và dừng lại
        if (products.length === 0) {
            alert('Giỏ hàng đang trống, không thể đặt hàng.');
            return;
        }

        // Chỉ khi tất cả trường hợp lệ mới tạo đơn, lưu đơn, hiển thị chi tiết và mở popup.
        if (validationFullname()&&validationEmail()&&validationPhone()&&validationAddress()){
            // taoDonHang() trả về một object chứa dữ liệu đơn hàng.
            // Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 121 đến dòng 123: Thông tin hợp lệ thì tạo đơn, lưu đơn và hiển thị đơn hàng
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
// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 154 đến dòng 177: Định dạng tiền (formatCurrency), lấy giá dạng số (layGiaSo), lấy số lượng hợp lệ (laySoLuong)
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
// Tác giả: Huỳnh Thiên Bảo - B2405021 - Dòng 188: Biến tổng tiền
let tongTien = 0;

// Không có sản phẩm thì tạo một thẻ p thông báo giỏ hàng trống.
if (products.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Giỏ hàng đang trống.';
    // Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 195 đến dòng 196: Giỏ trống thì xóa danh sách cũ và hiện thông báo
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
        // Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 226 đến dòng 227: Gắn tên và số lượng vào thẻ sản phẩm
        divInfo.appendChild(pName);
        divInfo.appendChild(small);

        // Hiển thị đơn giá của một sản phẩm, không phải tổng giá cho cả số lượng.
        const spanPrice = document.createElement('span');
        spanPrice.className = 'price';
        spanPrice.textContent = formatCurrency(donGia);   // giá gốc 1 sản phẩm

        // Ghép ảnh, thông tin và giá vào thẻ sản phẩm; sau đó đưa thẻ sản phẩm vào danh sách.
        // Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 236 đến dòng 238: Gắn ảnh, thông tin, giá vào thẻ sản phẩm và đưa vào danh sách
        divProduct.appendChild(img);
        divProduct.appendChild(divInfo);
        divProduct.appendChild(spanPrice);
        productList.appendChild(divProduct);
    });
}


// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 245 đến dòng 246: Hiển thị tạm tính
// .summary: [0]Tạm tính [1]Phí vận chuyển [2]Giảm giá (chỉ có khi đã dùng mã)
document.querySelectorAll('.summary')[0].firstElementChild.lastElementChild.textContent = formatCurrency(tongTien);


// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 250 đến dòng 362: Mã giảm giá: danh sách mã, tìm mã, tính tiền giảm, áp dụng hoặc bỏ mã, cập nhật dòng Giảm giá và tổng tiền
// ===== MÃ GIẢM GIÁ =====
// Danh sách mã cố định trong code (không dùng back-end)
//  loai 'phan-tram': giảm giaTri % (tối đa toiDa đồng, 0 = không giới hạn)
//  loai 'tien'     : giảm thẳng giaTri đồng
//  donToiThieu     : tạm tính phải từ mức này mới dùng được mã
const dsMaGiamGia = [
    { ma: 'FRESH10', moTa: 'Giảm 10%', loai: 'phan-tram', giaTri: 10, toiDa: 0, donToiThieu: 0 },
    { ma: 'GIAM50K', moTa: 'Giảm 50.000₫', loai: 'tien', giaTri: 50000, toiDa: 0, donToiThieu: 300000 },
    { ma: 'BANMOI', moTa: 'Giảm 20%, tối đa 100.000₫', loai: 'phan-tram', giaTri: 20, toiDa: 100000, donToiThieu: 200000 }
];

let maDangDung = null;   // mã đang áp dụng (null = chưa dùng mã)
let tienGiam = 0;

// div.discount-container: [0]input [1]label [2]span thông báo [3]nút "Sử dụng"
const nutSuDung = document.querySelectorAll('.discount-container')[0].lastElementChild;
const oMaGiamGia = nutSuDung.parentElement.firstElementChild;   // truy vấn gián tiếp
const thongBaoMa = nutSuDung.previousElementSibling;
// div.ds-ma-giam-gia nằm ngay sau div.discount-container
const khungDsMa = nutSuDung.parentElement.nextElementSibling;

function timMaGiamGia(ma) {
    for (let i = 0; i < dsMaGiamGia.length; i++) {
        if (dsMaGiamGia[i].ma === ma) {
            return dsMaGiamGia[i];
        }
    }
    return null;
}

function tinhTienGiam(maGG, tamTinh) {
    let tien = 0;
    if (maGG.loai === 'phan-tram') {
        tien = Math.round(tamTinh * maGG.giaTri / 100);
        if (maGG.toiDa > 0 && tien > maGG.toiDa) {
            tien = maGG.toiDa;
        }
    } else {
        tien = maGG.giaTri;
    }
    return Math.min(tien, tamTinh);   // không giảm quá số tiền của đơn
}

function hienThongBaoMa(noiDung, hopLe) {
    thongBaoMa.textContent = noiDung;
    if (hopLe) {
        thongBaoMa.classList.add('ma-hop-le');
        oMaGiamGia.classList.remove('input-error');
    } else {
        thongBaoMa.classList.remove('ma-hop-le');
        oMaGiamGia.classList.add('input-error');
    }
}

function apDungMaGiamGia() {
    const ma = oMaGiamGia.value.trim().toUpperCase();
    oMaGiamGia.value = ma;

    // Xóa trống ô rồi bấm "Sử dụng" -> bỏ mã đang dùng
    if (ma === '') {
        maDangDung = null;
        tienGiam = 0;
        thongBaoMa.textContent = '';
        oMaGiamGia.classList.remove('input-error');
        capNhatTienThanhToan();
        return;
    }

    const maGG = timMaGiamGia(ma);
    if (products.length === 0) {
        hienThongBaoMa('Giỏ hàng đang trống.', false);
    } else if (maGG === null) {
        hienThongBaoMa('Mã giảm giá không tồn tại.', false);
    } else if (tongTien < maGG.donToiThieu) {
        hienThongBaoMa('Mã ' + ma + ' chỉ dùng cho đơn từ ' + formatCurrency(maGG.donToiThieu) + '.', false);
    } else {
        maDangDung = maGG;
        tienGiam = tinhTienGiam(maGG, tongTien);
        hienThongBaoMa('Đã áp dụng mã ' + ma + ': ' + maGG.moTa + '.', true);
        capNhatTienThanhToan();
        return;
    }

    // Mã không hợp lệ -> bỏ mã đang dùng trước đó (nếu có)
    maDangDung = null;
    tienGiam = 0;
    capNhatTienThanhToan();
}

// Cập nhật dòng "Giảm giá" và tổng tiền phải trả
function capNhatTienThanhToan() {
    const canTra = tongTien - tienGiam;
    document.querySelectorAll('.order-toggle')[0].lastElementChild.textContent = formatCurrency(canTra);
    document.querySelectorAll('.total-price')[0].lastElementChild.textContent = formatCurrency(canTra);

    const khungTien = document.querySelectorAll('.summary')[0];
    let dongGiam = khungTien.children[2];
    if (tienGiam > 0) {
        if (!dongGiam) {
            dongGiam = document.createElement('div');
            dongGiam.className = 'summary-row dong-giam-gia';
            dongGiam.appendChild(document.createElement('span'));
            dongGiam.appendChild(document.createElement('span'));
            khungTien.appendChild(dongGiam);
        }
        dongGiam.firstElementChild.textContent = 'Giảm giá (' + maDangDung.ma + ')';
        dongGiam.lastElementChild.textContent = '- ' + formatCurrency(tienGiam);
    } else if (dongGiam) {
        khungTien.removeChild(dongGiam);
    }

    hienThiDanhSachMa();   // vẽ lại danh sách để cập nhật trạng thái từng mã
}

// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 365 đến dòng 446: Danh sách mã giảm giá cho khách chọn và các sự kiện của ô nhập mã
// ===== DANH SÁCH MÃ GIẢM GIÁ CHO KHÁCH CHỌN =====
// Mỗi mã: [0]div thông tin (mã, mô tả, điều kiện)  [1]nút Dùng / Bỏ mã
function taoTheMa(maGG) {
    const the = document.createElement('div');
    the.className = 'the-ma';

    const thongTin = document.createElement('div');
    const tenMa = document.createElement('strong');
    tenMa.textContent = maGG.ma;
    const moTa = document.createElement('p');
    moTa.textContent = maGG.moTa;
    const dieuKien = document.createElement('small');
    if (maGG.donToiThieu > 0) {
        dieuKien.textContent = 'Cho đơn từ ' + formatCurrency(maGG.donToiThieu);
    } else {
        dieuKien.textContent = 'Áp dụng cho mọi đơn hàng';
    }
    thongTin.appendChild(tenMa);
    thongTin.appendChild(moTa);
    thongTin.appendChild(dieuKien);

    const nut = document.createElement('button');
    nut.type = 'button';

    if (maDangDung !== null && maDangDung.ma === maGG.ma) {
        // Mã đang dùng -> cho phép bỏ
        the.classList.add('dang-dung');
        nut.textContent = 'Bỏ mã';
        nut.addEventListener('click', () => {
            oMaGiamGia.value = '';
            apDungMaGiamGia();   // ô trống -> bỏ mã
        });
    } else if (tongTien < maGG.donToiThieu) {
        // Chưa đủ điều kiện -> làm mờ, báo còn thiếu bao nhiêu
        the.classList.add('chua-du');
        nut.textContent = 'Dùng';
        nut.disabled = true;
        dieuKien.textContent += ' (mua thêm ' + formatCurrency(maGG.donToiThieu - tongTien) + ')';
    } else {
        nut.textContent = 'Dùng';
        nut.addEventListener('click', () => {
            oMaGiamGia.value = maGG.ma;
            apDungMaGiamGia();
        });
    }

    the.appendChild(thongTin);
    the.appendChild(nut);
    return the;
}

function hienThiDanhSachMa() {
    khungDsMa.textContent = '';
    if (products.length === 0) {
        return;   // giỏ trống thì không hiện danh sách
    }

    const tieuDe = document.createElement('h4');
    tieuDe.textContent = 'Mã giảm giá dành cho bạn';
    khungDsMa.appendChild(tieuDe);

    dsMaGiamGia.forEach(maGG => {
        khungDsMa.appendChild(taoTheMa(maGG));
    });
}

nutSuDung.addEventListener('click', apDungMaGiamGia);
// Nhấn Enter trong ô mã cũng áp dụng
oMaGiamGia.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        apDungMaGiamGia();
    }
});
// Đang gõ lại thì bỏ báo lỗi
oMaGiamGia.addEventListener('input', () => {
    oMaGiamGia.classList.remove('input-error');
    if (!thongBaoMa.classList.contains('ma-hop-le')) {
        thongBaoMa.textContent = '';
    }
});

capNhatTienThanhToan();


// Các hàm bên dưới đảm nhiệm tạo dữ liệu đơn, lưu xuống trình duyệt và render popup.
// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 451 đến dòng 534: Tạo đơn hàng (taoDonHang), lưu đơn và lưu địa chỉ tài khoản ở đơn đầu tiên (luuDonHang), đổi định dạng ngày (doiNgay), tạo dòng thông tin (taoDongThongTin)
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
        tamTinh: tongTien,
        maGiamGia: maDangDung ? maDangDung.ma : '',
        tienGiam: tienGiam,
        tongTien: tongTien - tienGiam,   // số tiền phải trả sau khi giảm
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

    // Đơn đầu tiên của tài khoản: lưu địa chỉ vừa nhập làm địa chỉ của tài khoản.
    // Các đơn sau (có thể giao cho người khác) không làm đổi địa chỉ này.
    if (donHang.taiKhoan !== '' && !localStorage.getItem('address')) {
        localStorage.setItem('address', donHang.diaChi);
    }
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

// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 537 đến dòng 591: Hiển thị thông tin đơn hàng trong popup đặt hàng thành công (hienThiDonHang)
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

    if (donHang.tienGiam > 0) {
        khung.appendChild(taoDongThongTin('Tạm tính', formatCurrency(donHang.tamTinh)));
        khung.appendChild(taoDongThongTin('Giảm giá (' + donHang.maGiamGia + ')', '- ' + formatCurrency(donHang.tienGiam)));
    }

    // Tạo dòng tổng cộng, thêm class order-total để CSS tạo kiểu riêng.
    const tong = taoDongThongTin('Tổng cộng', formatCurrency(donHang.tongTien));
    tong.classList.add('order-total');
    khung.appendChild(tong);
}

// Tác giả: Huỳnh Thiên Bảo - B2405021 - Từ dòng 594 đến dòng 631: Tự điền thông tin giao hàng khi đã đăng nhập (dienThongTinTaiKhoan)
// ===== ĐÃ ĐĂNG NHẬP: TỰ ĐIỀN THÔNG TIN GIAO HÀNG =====
// Tên, email, số điện thoại lấy từ tài khoản (lưu lúc đăng ký).
// Địa chỉ lấy từ key 'address' (lưu ở đơn đầu tiên, vì lúc đăng ký chưa nhập địa chỉ).
// Các ô vẫn sửa được, phòng khi người dùng muốn giao cho người khác.
function dienThongTinTaiKhoan() {
    if (!localStorage.getItem('isLogin')) {
        return;   // chưa đăng nhập -> khách tự nhập như cũ
    }

    const email = localStorage.getItem('email');
    nameInput.value = localStorage.getItem('name') || '';
    emailInput.value = email || '';
    phoneInput.value = localStorage.getItem('phone') || '';

    const diaChi = localStorage.getItem('address');
    if (diaChi) {
        addressInput.value = diaChi;
    } else {
        // Tài khoản đặt hàng trước khi có key 'address':
        // duyệt từ đơn mới nhất về đơn cũ nhất, gặp đơn của tài khoản này thì lấy địa chỉ
        const tatCa = JSON.parse(localStorage.getItem('danhSachDonHang')) || [];
        for (let i = tatCa.length - 1; i >= 0; i--) {
            const don = tatCa[i];
            if (don.taiKhoan === email || (!don.taiKhoan && don.email === email)) {
                addressInput.value = don.diaChi;
                break;
            }
        }
    }

    // Đã đăng nhập thì thay dòng "Bạn đã có tài khoản? Đăng nhập" bằng lời chào
    // div.form-group chứa ô họ tên -> phần tử ngay trước nó là thẻ <p> đó (truy vấn gián tiếp)
    const dongDangNhap = nameInput.parentElement.previousElementSibling;
    dongDangNhap.textContent = 'Xin chào ' + localStorage.getItem('name')
        + '! Thông tin đã được điền sẵn, bạn có thể sửa nếu muốn giao cho người khác.';
}

dienThongTinTaiKhoan();
