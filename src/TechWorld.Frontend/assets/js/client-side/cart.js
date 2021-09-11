
function loadData() {
    fetch("https://localhost:44345/api/Carts", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi tải trang!");
            // else if (res.status == 204)
            //     cartList.classList.add('header__cart-list--no-cart');
            // else {
            //     if (cartList.classList.contains('header__cart-list--no-cart'))
            //         cartList.classList.remove('header__cart-list--no-cart');
            return res.json();
            // }
        })
        .then(function(data) {
            let totalBill = document.querySelector('.cart__option-total-price');
            let sumPrice = 0;
            let total = 0;
            let html = '';
            data.forEach(item => {
                sumPrice = item.Quantity * item.Product.Price;
                total += sumPrice;
                html += `
                <div class="list-item">
                <div class="list-item__option-name">
                    <a class="list-item__link"><img src="${item.Product.DefaultImage}"></a>
                    <a class="list-item__name">${item.Product.Name}</a>
                </div>
                <p class="list-item__price">
                    <span class="list-item__price--original">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Product.Price)}</span>
                    <span class="list-item__price--promotion">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Product.PromotionPrice)}</span>
                </p>
                <p class="list-item__quantity">
                    <button class="btn btn-subtract" onclick="updateCart(${item.Product.Id}, 'sub')"><i class="fas fa-minus btn-subtract-icon"></i></button>
                    <input type="text" class="list-item__quantity-input" id="quantity-input__${item.Product.Id}" onchange="updateCart(${item.Product.Id})" value="${item.Quantity}">
                    <button class="btn btn-plus" onclick="updateCart(${item.Product.Id}, 'add')"><i class="fas fa-plus btn-plus-icon"></i></button>
                </p>
                <p class="list-item__money">
                    ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumPrice)}
                </p>
                </div>
                `;
            });
            document.querySelector('.list-item-container').innerHTML = html;
            totalBill.innerHTML = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
        })
}


function deleteFromCart(productId) {
    // productId = this.getAttribute("data-id");
    fetch(`https://localhost:44345/api/Carts/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi tải trang!");
            loadCart();
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải hình ảnh!",
                type: 'error'
            });
        });
}

function updateCart(productId, flg) {
    let quantityField = Number.parseInt(document.getElementById(`quantity-input__${productId}`).value);
    try {
        if (flg == 'sub') {
            fetch("https://localhost:44345/api/Carts/update-cart", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${check_cookie_name("accessToken")}`
                    },
                    body: JSON.stringify({
                        ProductId: productId,
                        Quantity: quantityField - 1
                    })
                })
                .then(function(res) {
                    if (!res.ok)
                        throw Error("Có lỗi xảy ra khi tải trang!");
                    loadData();
                })
        } else if (flg == 'add') {
            fetch("https://localhost:44345/api/Carts/update-cart", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${check_cookie_name("accessToken")}`
                    },
                    body: JSON.stringify({
                        ProductId: productId,
                        Quantity: quantityField + 1
                    })
                })
                .then(function(res) {
                    if (!res.ok)
                        throw Error("Có lỗi xảy ra khi tải trang!");
                    loadData();

                })

        } else {
            fetch("https://localhost:44345/api/Carts/update-cart", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${check_cookie_name("accessToken")}`
                    },
                    body: JSON.stringify({
                        ProductId: productId,
                        Quantity: quantityField
                    })
                })
                .then(function(res) {
                    if (!res.ok)
                        throw Error("Có lỗi xảy ra khi tải trang!");
                    loadData();

                })
        }
    } catch (error) {
        toast({
            title: 'Error',
            message: "Có lỗi xảy ra khi cập nhật số lượng!",
            type: 'error'
        });
    }

}

function loadAddress() {
            fetch("https://localhost:44345/api/Addresses", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${check_cookie_name("accessToken")}`
                    }
                })
                .then(function(res) {
                    return res.json();
                })
                .then((data) => {
                    let html = '';
                    const checked = 
                    data.forEach(item => {
                        if(item.IsDefault){
                            html += `
                            <div class="checkout-form__item">
                                <input type="radio" class="checkout-form__item--checkbox" name="IsDefault" checked value="${item.Id}">
                                <span class="checkout-form__name">${item.FullName}</span>
                                <span class="checkout-form__phone">${item.Phone}</span>
                                <span class="checkout-form__address">${item.FullStreetAddress}</span>
                            </div>
                            `;
                        }
                        else{
                            html += `
                            <div class="checkout-form__item">
                                <input type="radio" class="checkout-form__item--checkbox" name="IsDefault" value="${item.Id}">
                                <span class="checkout-form__name">${item.FullName}</span>
                                <span class="checkout-form__phone">${item.Phone}</span>
                                <span class="checkout-form__address">${item.FullStreetAddress}</span>
                            </div>
                            `;
                        }
                        
                    });

                    document.getElementById('checkout-form__list').innerHTML = html;
                })
                .catch((error) => {
                    toast({
                        title: 'Error',
                        message: error,
                        type: 'error'
                    });
                })
}

function createOrder(){
    const addressId = document.querySelector('.checkout-form__item--checkbox[type="radio"][name="IsDefault"]:checked').value;
    const paymentId = document.querySelector('.checkout__payment-method-item.active').value;

    fetch("https://localhost:44345/api/Orders", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${check_cookie_name("accessToken")}`
        },
        body: JSON.stringify({
            AddressId: addressId,
            PaymentMethodId: paymentId
        })
    })
    .then(function(res) {
        if(res.ok)
            window.location.href = "/order.html";
    })
    .catch((error) => {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    })
}

let listButton = document.querySelectorAll('.checkout__payment-method-item');
listButton.forEach(function(item){
    item.addEventListener('click', function(){
        if(!item.classList.contains('active')){
            item.classList.add('active');
            for (let i = 0; i < listButton.length; i++) {
                if(item != listButton[i] && listButton[i].classList.contains('active'))
                {
                    listButton[i].classList.remove('active');
                    break;
                }
            }
        }
    });
});



function constructor() {
    loadData();
    loadAddress();
}
this.constructor();