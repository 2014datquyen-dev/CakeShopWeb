function isExistedInCart(item, cartItemArr) {
  let myIndex = -1;
  for (let i = 0; i < cartItemArr.length; i++) {
    if (cartItemArr[i].id == item.id) {
      myIndex = i;
      break;
    }
  }
  return myIndex;
}

const orderSelectedProduct = (evt) => {
  const nut = evt.target;
  const sanPham = nut.parentElement;

  if (typeof Storage !== undefined) {
    const ten = sanPham.querySelector('.ten_banh').textContent.trim();
    let newItem = {
      id: ten,
      name: ten,
      price: sanPham.querySelector('.bang_gia').textContent,
      image: sanPham.querySelector('img').getAttribute('src'),
      quantity: 1
    };

    let updatedCartItems = [];
    if (localStorage.getItem('cartItems') !== null) {
      updatedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    }

    let index = isExistedInCart(newItem, updatedCartItems);
    if (index >= 0) {
      updatedCartItems[index].quantity++;
    } else {
      updatedCartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    alert('Đã thêm "' + newItem.name + '" vào giỏ hàng.');
  } else {
    alert('Local storage is not working on your browser.');
  }
}

function addEventToAllCartButtons() {
  const add2CartList = document.getElementsByClassName('add-cart');
  for (let item = 0; item < add2CartList.length; item++) {
    add2CartList[item].addEventListener('click', orderSelectedProduct, false);
  }
}

window.addEventListener('load', addEventToAllCartButtons, false);
