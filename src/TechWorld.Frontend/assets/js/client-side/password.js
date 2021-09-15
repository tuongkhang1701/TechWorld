function changePassword(){
    let currentPass = document.getElementById('CurrentPassword').value;
    let newPass = document.getElementById('NewPassword').value;
let a = check_cookie_name("accessToken");
    fetch("https://localhost:44345/api/Users/change-password", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

                    },
                    body: JSON.stringify({
                        CurrentPassword: currentPass,
                        NewPassword: newPass
                    })
                })
                .then(function(res) {
                    if(res.ok)
                        toast({
                            title: 'Thành công',
                            message: "Đổi mật khẩu thành công",
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