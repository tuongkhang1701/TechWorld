filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 100
}
let id = null;
function loadAccount(){
    let id = check_cookie_name("Id");
    fetch(`https://localhost:44345/api/Users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`


            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi tải trang!");
            return res.json();
        })
        .then(function(data) {
            let container = document.getElementById('header__navbar-list');
                let html = `
                <li class="header__navbar-item header__navbar-item--has-notify">
                <a class="header__navbar-item-link" href="#">
                    <i class="header__navbar-icon far fa-bell"></i> Thông báo
                </a>
                <div class="header__notify">
                    <header class="header__notify-header">
                        <h3>Thông báo mới nhận</h3>
                    </header>
                    <ul class="header__notify-list">
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                        Paris - Kinh đô của thời trang</span>
                                    <span class="header__notify-description">Mô tả nước hoa Discover chính
                                        hãng</span>
                                </div>
                            </a>
                        </li>
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                        Paris - Kinh đô của thời trang</span>
                                    <span class="header__notify-description">Mô tả nước hoa Discover chính
                                        hãng</span>
                                </div>
                            </a>
                        </li>
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                        Paris - Kinh đô của thời trang</span>
                                    <span class="header__notify-description">Mô tả nước hoa Discover chính
                                        hãng</span>
                                </div>
                            </a>
                        </li>
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                        Paris - Kinh đô của thời trang</span>
                                    <span class="header__notify-description">Mô tả nước hoa Discover chính
                                        hãng</span>
                                </div>
                            </a>
                        </li>

                    </ul>
                    <footer class="header__notify-footer">
                        <a href="" class="header__notify-footer-btn">Xem tất cả</a>
                    </footer>
                </div>
                </li>
                <li class="header__navbar-item">
                    <a class="header__navbar-item-link" href="#">
                        <i class="header__navbar-icon far fa-question-circle"></i> Trợ giúp
                    </a>
                </li>
                <li class="header__navbar-item header__navbar-item--strong header__navbar-item--separate" id="btnRegister">Đăng
                    ký</li>
                <li class="header__navbar-item header__navbar-item--strong" id="btnLog">Đăng nhập</li>
                `;
                if(data.FullName){
                    html = `
                    <li class="header__navbar-item header__navbar-item--has-notify">
                    <a class="header__navbar-item-link" href="#">
                        <i class="header__navbar-icon far fa-bell"></i> Thông báo
                    </a>
                    <div class="header__notify">
                        <header class="header__notify-header">
                            <h3>Thông báo mới nhận</h3>
                        </header>
                        <ul class="header__notify-list">
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                            Paris - Kinh đô của thời trang</span>
                                        <span class="header__notify-description">Mô tả nước hoa Discover chính
                                            hãng</span>
                                    </div>
                                </a>
                            </li>
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                            Paris - Kinh đô của thời trang</span>
                                        <span class="header__notify-description">Mô tả nước hoa Discover chính
                                            hãng</span>
                                    </div>
                                </a>
                            </li>
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                            Paris - Kinh đô của thời trang</span>
                                        <span class="header__notify-description">Mô tả nước hoa Discover chính
                                            hãng</span>
                                    </div>
                                </a>
                            </li>
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">Nước hoa Discover được xuất sứ từ
                                            Paris - Kinh đô của thời trang</span>
                                        <span class="header__notify-description">Mô tả nước hoa Discover chính
                                            hãng</span>
                                    </div>
                                </a>
                            </li>

                        </ul>
                        <footer class="header__notify-footer">
                            <a href="" class="header__notify-footer-btn">Xem tất cả</a>
                        </footer>
                    </div>
                </li>
                <li class="header__navbar-item">
                    <a class="header__navbar-item-link" href="#">
                        <i class="header__navbar-icon far fa-question-circle"></i> Trợ giúp
                    </a>
                </li>
                <li class="header__navbar-item header__navbar-user">
                            <span class="header__navbar-user-name">Xin chào ${data.FullName}</span>
                            <ul class="header__navbar-user-menu">
                                <li class="header__navbar-user-item">
                                    <a href="./account/profile.html">Tài khoản của tôi</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="./account/address.html">Địa chỉ của tôi</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="">Đơn mua</a>
                                </li>
                                <li class="header__navbar-user-item header__navbar-user-item-separate dangxuat">
                                    <a href="">Đăng xuất</a>
                                </li>
                            </ul>
                        </li>
                    `;
                }
                container.innerHTML = html;
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải hình ảnh!",
                type: 'error'
            });
        });
}
function loadData() {
    fetch("https://localhost:44345/api/Products/get-images", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.filter)
        })
        .then(function(res) {
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
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

            }
        })
        .then(function(res) {
            if (res.status == 204)
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
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

            },
            body: JSON.stringify({
                ProductId: productId,
                Quantity: 1
            })
        })
        .then(function(res) {
            if(res.ok){
                toast({
                    title: 'Thành công',
                    message: "Thêm vào giỏ hàng thành công!",
                    type: 'success'
                });
                loadCart();
            }
        })
        .catch(error => {
            toast({
                title: 'Cảnh báo',
                message: "Có lỗi xảy ra thêm vào giỏ hàng!",
                type: 'error'
            });
        });
};
// function pagination(filter) {

//     fetch('https://localhost:44345/api/Products/pagination', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

//             },
//             body: JSON.stringify(filter)
//         })
//         .then(function(res) {
//             console.log(res);
//             return res.json();
//         })
//         .then(function(data) {
//             loadPagination(data.TotalPage, data.PageIndex);
//         })
//         .catch(error => {
//             toast({
//                 title: 'Error',
//                 message: error.Message,
//                 type: 'error'
//             });
//         });

// }

//Events
function onClickPageIndex(currentPage) {
    filter.PageIndex = currentPage;
    pagination(filter);
    loadData();
    loadCart();
}
document.getElementById('header__cart-icon').addEventListener('click', function(e){
    console.log(e.target)
    window.location.href = "/cart.html";
});

// Login
let loginData = {
    Username: null,
    Password: null
}

function login(username, password) {
    loginData.Username = username;
    loginData.Password = password
    try {
        fetch('https://localhost:44345/api/Auth/authenticate-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(function(response) {
                if (!response.ok)
                    toast({
                        title: 'Thất bại',
                        message: "Tên đăng nhập hoặc mật khẩu không đúng",
                        type: 'error'
                    });
                else{
                    return response.json();
                }
            })
            .then(function(data) {
                
                createCookie("Id", data.user.Id, new Date(data.expiration).getDate() - new Date().getDate());
                createCookie("accessTokenUser", data.token, new Date(data.expiration).getDate() - new Date().getDate());
                let modal = document.getElementById('modal');
                if(modal.classList.contains('show'))
                  modal.classList.remove('show');
            })
    } catch (error) {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    }

}
function search(name = null){
    var value = name == null?document.querySelector('.header__search-input').value:name;
    fetch('https://localhost:44345/api/Products/pagination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

            },
            body: JSON.stringify({
                Keyword: value,
                PageIndex: 1,
                PageSize: 9
            })
        })
        .then(function(res) {
            console.log(res);
            return res.json();
        })
        .then(function(data) {
            let strHtml = ``;
// ADD JSON DATA TO THE TABLE AS ROWS.
for (var i = 0; i < data.Items.length; i++) {
    let saleOff = ((Math.ceil(data.Items[i].PromotionPrice / data.Items[i].Price))) * 10;
    strHtml += `<div class="grid__column-2-4">`;
    strHtml += `<a class="home-product-item" href="/detail.html?id=${data.Items[i].Id}">`;
    strHtml += `<div class="home-product-item__img" style="background-image: url(${data.Items[i].DefaultImage})"></div>`;
    strHtml += `<h4 class="home-product-item__name">${data.Items[i].Name}</h4>`;
    strHtml += `<div class="home-product-item__price">`;
    strHtml += `<span class="home-product-item__price-old">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.Items[i].Price)}</span>`;
    strHtml += `<span class="home-product-item__price-current">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.Items[i].PromotionPrice)}</span>`;
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
                    <button class="btn home-product-item__btn-payment btn-add-to-cart" onclick="event.preventDefault();addToCart(${data.Items[i].Id})">Thêm vào giỏ hàng</button>
                    <button class="btn home-product-item__btn-payment btn-buy-now">Mua ngay</button>
                </div>
                </a></div>`;
}


// FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
var divContainer = document.getElementById('home-product__body');
divContainer.innerHTML = strHtml;


            
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: error.Message,
                type: 'error'
            });
        });
}


document.getElementById('btnLogin').addEventListener('click', function(e) {
    e.preventDefault();
    let username = document.getElementById('UserName').value;
    let password = document.getElementById('Password').value;
    login(username, password);
});
(function contructor() {
    loadData();
    loadCart();
    loadAccount();
    // pagination(filter);
})()

document.getElementById('btnRegis').addEventListener('click', function(){
    window.location.href = '/register.html';

});

function checkLogin() {
    console.log(check_cookie_name("accessTokenUser"));
    if (check_cookie_name("accessTokenUser") == null) {

        window.location.href = "/login.html";
    }
}

function logOut() {
    delete_cookie("Id");
    delete_cookie("accessTokenUser");
    accessToken = null;
    checkLogin();
}