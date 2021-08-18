let accessToken = `Bearer ${check_cookie_name("accessToken")?check_cookie_name("accessToken"):'--something went wrong---'}`


function loadData() {
    fetch("https://localhost:44345/api/Carts", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
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
            let totalBill = document.querySelector('.checkout__option-total-price');
            let sumPrice = 0;
            let total = 0;
            let html = '';
            data.forEach(item => {
                sumPrice = item.Quantity * item.Product.Price;
                total += sumPrice;
                html += `
                <div class="list-item">
                <div class="list-item__option-name">
                    <input type="checkbox" class="list-item__input">
                    <a class="list-item__link"><img src="${item.Product.DefaultImage}"></a>
                    <a class="list-item__name">${item.Product.Name}</a>
                </div>
                <p class="list-item__price">
                    <span class="list-item__price--original">${(item.Product.Price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span>
                    <span class="list-item__price--promotion">${(item.Product.PromotionPrice).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span>
                </p>
                <p class="list-item__quantity">
                    <button class="btn btn-subtract" onclick="updateCart(${item.Product.Id}, 'sub')"><i class="fas fa-minus btn-subtract-icon"></i></button>
                    <input type="text" class="list-item__quantity-input" id="quantity-input__${item.Product.Id}" onchange="updateCart(${item.Product.Id})" value="${item.Quantity}">
                    <button class="btn btn-plus" onclick="updateCart(${item.Product.Id}, 'add')"><i class="fas fa-plus btn-plus-icon"></i></button>
                </p>
                <p class="list-item__money">
                    ${(sumPrice).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                </p>
                </div>
                `;
            });
            document.querySelector('.list-item-container').innerHTML = html;
            totalBill.innerHTML = Number.parseInt(total).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        })
}

function addToCart(productId) {
    // productId = this.getAttribute("data-id");
    fetch("https://localhost:44345/api/Carts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify({
                ProductId: productId,
                Quantity: 1
            })
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
};

function deleteFromCart(productId) {
    // productId = this.getAttribute("data-id");
    fetch(`https://localhost:44345/api/Carts/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
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
                        'Authorization': accessToken
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
                        'Authorization': accessToken
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
                        'Authorization': accessToken
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

function constructor() {
    loadData();
}
this.constructor();