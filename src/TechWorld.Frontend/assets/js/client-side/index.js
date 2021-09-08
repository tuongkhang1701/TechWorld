filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 8
}

function loadData() {
    fetch("https://localhost:44345/api/Products/get-images", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi tải trang!");
            return res.json();
        })
        .then(function(data) {
            srcImage = data[0];
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải hình ảnh!",
                type: 'error'
            });
        });


    fetch("https://localhost:44345/api/Products/pagination", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            },
            body: JSON.stringify(this.filter)
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi tải trang!");
            return res.json();
        })
        .then(function(data) {
            let strHtml = '';
            let Items = data.Items;
            if (Items != null) {
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < Items.length; i++) {
                    let saleOff = ((Math.ceil(Items[i].PromotionPrice / Items[i].Price))) * 10;
                    strHtml += `<div class="grid__column-2-4">`;
                    strHtml += `<a class="home-product-item" href="/detail.html?id=${Items[i].Id}">`;
                    strHtml += `<div class="home-product-item__img" style="background-image: url(${Items[i].DefaultImage})"></div>`;
                    strHtml += `<h4 class="home-product-item__name">${Items[i].Name}</h4>`;
                    strHtml += `<div class="home-product-item__price">`;
                    strHtml += `<span class="home-product-item__price-old">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Items[i].Price)}</span>`;
                    strHtml += `<span class="home-product-item__price-current">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Items[i].PromotionPrice)}</span>`;
                    strHtml += `</div>`;
                    strHtml += `<div class="home-product-item__action">`;
                    strHtml += `<span class="home-product-item__like home-product-item__like--liked">`;
                    strHtml += `<i class="home-product-item__like-icon-empty far fa-heart"></i>`;
                    strHtml += `<i class="home-product-item__like-icon-fill fas fa-heart"></i>`;
                    strHtml += `</span>`;
                    strHtml += `<div class="home-product-item__rating">`;
                    strHtml += `<i class="home-product-item__star--gold fas fa-star"></i>`;
                    strHtml += `<i class="home-product-item__star--gold fas fa-star"></i>`;
                    strHtml += `<i class="home-product-item__star--gold fas fa-star"></i>`;
                    strHtml += `<i class="home-product-item__star--gold fas fa-star"></i>`;
                    strHtml += `<i class="fas fa-star"></i>`;
                    strHtml += `</div>`;
                    strHtml += `<span class="home-product-item__sold">88 đã bán</span>`;
                    strHtml += ` </div>`;
                    strHtml += `<div class="home-product-item__origin">`;
                    strHtml += `<span class="home-product-item__brand">Xiaomi</span>`;
                    strHtml += `<span class="home-product-item__origin-name">Trung Quốc</span>`;
                    strHtml += `</div>`;
                    strHtml += `<div class="home-product-item__favourit">`;
                    strHtml += `<i class="fas fa-check"></i>`;
                    strHtml += `<span>Yêu thích</span>`;
                    strHtml += `</div>`;
                    strHtml += `<div class="home-product-item__sale-off">`;
                    strHtml += `<span class="home-product-item__sale-off-percent">${saleOff}%</span>`;
                    strHtml += `<span class="home-product-item__sale-off-label">GIẢM</span>`;
                    strHtml += `</div>
                                <div class="home-product-item__btn-order">
                                    <button class="btn home-product-item__btn-payment btn-add-to-cart" onclick="event.preventDefault();addToCart(${Items[i].Id})">Thêm vào giỏ hàng</button>
                                    <button class="btn home-product-item__btn-payment btn-buy-now">Mua ngay</button>
                                </div>
                                </a></div>`;
                }

                // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                var divContainer = document.getElementById('home-product__body');
                divContainer.innerHTML = strHtml;

            }
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải trang!",
                type: 'error'
            });
        });
}

function loadCart() {
    let cartList = document.querySelector('.header__cart-list');
    let cartNotice = document.querySelector('.header__cart-notice');
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
            else if (res.status == 204)
                cartList.classList.add('header__cart-list--no-cart');
            else {
                if (cartList.classList.contains('header__cart-list--no-cart'))
                    cartList.classList.remove('header__cart-list--no-cart');
                return res.json();
            }
        })
        .then(function(data) {
            cartNotice.innerHTML = Array.from(data).length;
            cartList.innerHTML = '';
            let html = '<h4 class="header__cart-heading">Sản phẩm đã thêm</h4><ul class="header__cart-list-item">';
            data.forEach(item => {
                html += `
                <li class="header__cart-item">
                    <img src="${item.Product.DefaultImage}" alt="" class="header__cart-img">
                    <div class="header__cart-item-info">
                        <div class="header__cart-item-head">
                            <h5 class="header__cart-item-name">${item.Product.Name}</h5>
                            <div class="header__cart-item-price-wrap">
                                <span class="header__cart-item-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Product.PromotionPrice)}</span>
                                <span class="header__cart-item-multiply">x</span>
                                <span class="header__carti-item-quantity">${item.Quantity}</span>
                            </div>
                        </div>
                        <div class="header__cart-item-body">
                            <span class="header__cart-item-description">PowerCore II 20000mAh - A1260</span>
                            <span class="header__cart-item-remove" onclick="event.preventDefault();deleteFromCart(${item.Product.Id})">Xóa</span>
                        </div>
                    </div>
                </li>
                `;
            });
            html += '</ul><a class="header__cart-view-cart btn btn--primary" href="/cart.html">Xem giỏ hàng</a>';
            cartList.innerHTML += cartList.innerHTML + html;
        })
}
function addToCart(productId) {
    // productId = this.getAttribute("data-id");
    fetch("https://localhost:44345/api/Carts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
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
function pagination(filter) {

    fetch('https://localhost:44345/api/Products/pagination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            },
            body: JSON.stringify(filter)
        })
        .then(function(res) {
            console.log(res);
            return res.json();
        })
        .then(function(data) {
            loadPagination(data.TotalPage, data.PageIndex);
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: error.Message,
                type: 'error'
            });
        });

}

//Events
function onClickPageIndex(currentPage) {
    filter.PageIndex = currentPage;
    pagination(filter);
    loadData();
    loadCart();
}
document.querySelector('.header__cart-wrap').addEventListener('click', function(){
    window.location.href = "/cart.html";
});
(function contructor() {
    loadData();
    loadCart();
    pagination(filter);
})()