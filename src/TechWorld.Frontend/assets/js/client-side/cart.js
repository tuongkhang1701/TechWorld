
function loadData() {
    fetch("https://localhost:44345/api/Carts", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

            }
        })
        .then(function(res) {
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
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

            }
        })
        .then(function(res) {
            if(res.ok)
            loadCart();
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "C?? l???i x???y ra khi t???i h??nh ???nh!",
                type: 'error'
            });
        });
}
function deleteAllCart(){
    fetch(`https://localhost:44345/api/Carts`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

            }
        })
        .then(function(res) {
            if (res.ok)
                loadCart();
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "C?? l???i x???y ra khi t???i h??nh ???nh!",
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
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

                    },
                    body: JSON.stringify({
                        ProductId: productId,
                        Quantity: quantityField - 1
                    })
                })
                .then(function(res) {
                    if (!res.ok)
                        throw Error("C?? l???i x???y ra khi t???i trang!");
                    loadData();
                })
        } else if (flg == 'add') {
            fetch("https://localhost:44345/api/Carts/update-cart", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

                    },
                    body: JSON.stringify({
                        ProductId: productId,
                        Quantity: quantityField + 1
                    })
                })
                .then(function(res) {
                    if (!res.ok)
                        throw Error("C?? l???i x???y ra khi t???i trang!");
                    loadData();

                })

        } else {
            fetch("https://localhost:44345/api/Carts/update-cart", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

                    },
                    body: JSON.stringify({
                        ProductId: productId,
                        Quantity: quantityField
                    })
                })
                .then(function(res) {
                    if (!res.ok)
                        throw Error("C?? l???i x???y ra khi t???i trang!");
                    loadData();

                })
        }
    } catch (error) {
        toast({
            title: 'Error',
            message: "C?? l???i x???y ra khi c???p nh???t s??? l?????ng!",
            type: 'error'
        });
    }

}

function loadAddress() {
            fetch("https://localhost:44345/api/Addresses", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

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
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        },
        body: JSON.stringify({
            AddressId: addressId,
            PaymentMethodId: paymentId
        })
    })
    .then(function(res) {
        if(res.ok){
            deleteAllCart()
            window.location.href = "/account/order.html";
        }
    })
    .catch((error) => {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    })
}
function loadProfile(){
    let id = check_cookie_name("Id");
    fetch(`https://localhost:44345/api/Users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        }
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(data){
        console.log(data);
        let html = '';
        html += `
            <div class="profile-body__item">
            <label for="Username">T??n ????ng nh???p</label>
            <span>${data.UserName}</span>
            </div>
            <div class="profile-body__item">
                <label for="FullName" >H??? v?? t??n</label>
                <span>

                    <input type="text" id="FullName" value="${data.FullName}">
                </span>
            </div>
            <div class="profile-body__item">
                <label for="Username">S??? ??i???n tho???i</label>
                <span>
                <input type="text" id="PhoneNumber" value="${data.PhoneNumber}">
                </span>

            </div>
            <div class="profile-body__item">
                <label for="Username">Ng??y sinh</label>
                <span>
                <input placeholder="${data.Dob}" id="Dob" rules="required" type="text" id="Dob" name="Dob" class="form-control"  onfocus="(this.type='date')" onblur="(this.type='text')">
                </span>
            </div>
            <div class="profile-body__item">
                <button class="btn profile-body__btn-save" onclick="changeProfile()">L??u</button>

            </div>
        `;
        document.getElementById('profile-body__container').innerHTML = html;
    })
    .catch((error) => {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    })
}

function changeProfile(){
    let full = document.getElementById('FullName').value;
    let phone = document.getElementById('PhoneNumber').value;
    let dob = document.getElementById('Dob').value;
    let id = check_cookie_name("Id");
    fetch(`https://localhost:44345/api/Users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        },
        body: JSON.stringify({
            Id: id,
            PhoneNumber: phone,
            FullName: full,
            Dob: dob
        })
    })
    .then(function(res) {
        if(res.ok)
            toast({
                title: 'Th??nh c??ng',
                message: "C???p nh???t th??nh c??ng",
                type: 'success'
            });
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

function loadAccount(){
    let id = check_cookie_name("Id");
    fetch(`https://localhost:44345/api/Users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessTokenUser")}`

            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("C?? l???i x???y ra khi t???i trang!");
            return res.json();
        })
        .then(function(data) {
            let container = document.getElementById('header__navbar-list');
                let html = `
                <li class="header__navbar-item header__navbar-item--has-notify">
                <a class="header__navbar-item-link" href="#">
                    <i class="header__navbar-icon far fa-bell"></i> Th??ng b??o
                </a>
                <div class="header__notify">
                    <header class="header__notify-header">
                        <h3>Th??ng b??o m???i nh???n</h3>
                    </header>
                    <ul class="header__notify-list">
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                        Paris - Kinh ???? c???a th???i trang</span>
                                    <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                        h??ng</span>
                                </div>
                            </a>
                        </li>
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                        Paris - Kinh ???? c???a th???i trang</span>
                                    <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                        h??ng</span>
                                </div>
                            </a>
                        </li>
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                        Paris - Kinh ???? c???a th???i trang</span>
                                    <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                        h??ng</span>
                                </div>
                            </a>
                        </li>
                        <li class="header__notify-item header__notify-item--viewed">
                            <a href="" class="header__notify-link">
                                <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                <div class="header__notify-info">
                                    <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                        Paris - Kinh ???? c???a th???i trang</span>
                                    <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                        h??ng</span>
                                </div>
                            </a>
                        </li>

                    </ul>
                    <footer class="header__notify-footer">
                        <a href="" class="header__notify-footer-btn">Xem t???t c???</a>
                    </footer>
                </div>
                </li>
                <li class="header__navbar-item">
                    <a class="header__navbar-item-link" href="#">
                        <i class="header__navbar-icon far fa-question-circle"></i> Tr??? gi??p
                    </a>
                </li>
                <li class="header__navbar-item header__navbar-item--strong header__navbar-item--separate">????ng
                    k??</li>
                <li class="header__navbar-item header__navbar-item--strong" id="btnLog">????ng nh???p</li>
                `;
                if(data.FullName){
                    html = `
                    <li class="header__navbar-item header__navbar-item--has-notify">
                    <a class="header__navbar-item-link" href="#">
                        <i class="header__navbar-icon far fa-bell"></i> Th??ng b??o
                    </a>
                    <div class="header__notify">
                        <header class="header__notify-header">
                            <h3>Th??ng b??o m???i nh???n</h3>
                        </header>
                        <ul class="header__notify-list">
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                            Paris - Kinh ???? c???a th???i trang</span>
                                        <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                            h??ng</span>
                                    </div>
                                </a>
                            </li>
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                            Paris - Kinh ???? c???a th???i trang</span>
                                        <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                            h??ng</span>
                                    </div>
                                </a>
                            </li>
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                            Paris - Kinh ???? c???a th???i trang</span>
                                        <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                            h??ng</span>
                                    </div>
                                </a>
                            </li>
                            <li class="header__notify-item header__notify-item--viewed">
                                <a href="" class="header__notify-link">
                                    <img src="https://cf.shopee.vn/file/7c62cc9332a5dc631902b44ed9c06f1c_tn" alt="" class="header__notify-img">
                                    <div class="header__notify-info">
                                        <span class="header__notify-name">N?????c hoa Discover ???????c xu???t s??? t???
                                            Paris - Kinh ???? c???a th???i trang</span>
                                        <span class="header__notify-description">M?? t??? n?????c hoa Discover ch??nh
                                            h??ng</span>
                                    </div>
                                </a>
                            </li>

                        </ul>
                        <footer class="header__notify-footer">
                            <a href="" class="header__notify-footer-btn">Xem t???t c???</a>
                        </footer>
                    </div>
                </li>
                <li class="header__navbar-item">
                    <a class="header__navbar-item-link" href="#">
                        <i class="header__navbar-icon far fa-question-circle"></i> Tr??? gi??p
                    </a>
                </li>
                <li class="header__navbar-item header__navbar-user">
                            <span class="header__navbar-user-name">Xin ch??o ${data.FullName}</span>
                            <ul class="header__navbar-user-menu">
                                <li class="header__navbar-user-item">
                                    <a href="./account/profile.html">T??i kho???n c???a t??i</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="./account/address.html">?????a ch??? c???a t??i</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="">????n mua</a>
                                </li>
                                <li class="header__navbar-user-item header__navbar-user-item-separate">
                                    <a href="">????ng xu???t</a>
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
                message: "C?? l???i x???y ra khi t???i h??nh ???nh!",
                type: 'error'
            });
        });
}


function constructor() {
    loadData();
    loadAddress();
    loadProfile();
    loadAccount();
}
this.constructor();