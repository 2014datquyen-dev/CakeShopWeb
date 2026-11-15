var anh = [
    "../images/banner_img/no3.png",
    "../images/banner_img/no1.png",
    "../images/banner_img/no2.png"
];

var link = [
    "../TrangChu/trangChu.html",
    "../TrangChu/trangChu.html",
    "../ChiTietSanPham/chiTietSanPham.html"
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

