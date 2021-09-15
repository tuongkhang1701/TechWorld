function loadData(status = 5){
    fetch("https://localhost:44345/api/Orders", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        }
    })
    .then(function(res) {
        if(!res.ok)
        console.log("ok "+res);
        return res.json();
    })
    .then((data) => {
        let html = '';
        let jhtml = '';
        let totalBill= 0;
        let dataMapping;
        if(status != 5){
            dataMapping = Array.from(data).filter(function(item){
                return item.Status == status;
            });
        }
        else{
            dataMapping = Array.from(data).filter(function(item){
                return item;
            });
        }
        
        dataMapping.forEach(item => {
            item.OrderDetails.forEach(jtem => {
            totalBill += +jtem.PromotionPrice;
                jhtml += `
                <div class="order-item-detail">
                    <img src="${jtem.Image}" alt="" class="order-item__img">

                    <div class="order-item__info">
                        <p class="order-item__name">${jtem.ProductName}</p>
                        <span class="order-item__quantity">x${jtem.Quantity}</span>
                    </div>

                    <div class="order-item__price">
                        <span class="order-item__price--original">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(jtem.Price)}</span>
                        <span class="order-item__price--promotion">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(jtem.PromotionPrice)}</span>
                    </div>
                </div>
                `;
            });
            html += `
            <div class="order-item">
            <p class="order-item-info__status">ĐÃ GIAO</p>
            
            
            ${jhtml}

                <div class="order-item__payment-total">
                    <div class="order-item__payment-method">
                        <p>Phương thức thanh toán:</p>
                        <b class="ml-6">${item.PaymentMethodName}</b>
                    </div>
                    <div class="order-item__total">
                        <p class="order-item__total-label">Tổng số tiền:</p>
                        <span class="order-item__total-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalBill)}</span>
                    </div>
                </div>
                <div class="order-item__btn-cancel">
                    <button class="btn btn--default" id="order-item__btn-cancel" onclick="updateStatus('${item.Id}', 3)">Hủy đơn hàng</button>
                </div>


            </div>
            `;

            jhtml = '';
            totalBill = 0;
        });
        document.getElementById('order-body__list').innerHTML = html != ''?html: 
        `
            <div class="order-no-item">
            <div class="order-no-item-img"></div>
            <p class="order-no-item-content">Chưa có đơn hàng</p>
            </div>
        `;
    })
    .catch((error) => {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    })
}


function updateStatus(id, type){
    fetch(`https://localhost:44345/api/Orders/${id}/update-status/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        }
    })
    .then(function(res) {
        if(res.ok){
            toast({
                title: 'Thành công',
                message: "Đơn hàng đã được hủy",
                type: 'success'
            });
        }
            loadData();
    })
    .catch((error) => {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    })
}

let headerList = document.querySelectorAll('.profile-body__header-item');
headerList.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        if(!item.classList.contains('active')){
            item.classList.add('active');
            for (let i = 0; i < headerList.length; i++) {
                if(item != headerList[i] && headerList[i].classList.contains('active')){
                    headerList[i].classList.remove('active');
                    break;
                }
            }
        }
    })
});

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
                <li class="header__navbar-item header__navbar-item--strong header__navbar-item--separate">Đăng
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
                                <li class="header__navbar-user-item header__navbar-user-item-separate">
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
function constructor(){
    loadData();
    loadAccount();
}
this.constructor();