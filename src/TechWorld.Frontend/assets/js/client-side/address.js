document.addEventListener("DOMContentLoaded", function(){
    const province = document.getElementById('Province');
    window.onload = function(){
        fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: {
                'token': 'f08ef811-05bd-11ec-b5ad-92f02d942f87',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then((response)=> {
            return response.json();
        })
        .then((res) => {
            let str = "<option selected>Tỉnh thành</option>";
            for (let i = 0; i < res.data.length; i++) {
                str += `<option class='provinceId' data-province=${res.data[i].ProvinceID}>${res.data[i].ProvinceName}</option>`;
            }
            province.innerHTML=str;
        })
    };
});

function changFuncProvince(){
    let selectBox = document.getElementById('Province');
    let selectedValue = selectBox.options[selectBox.selectedIndex].getAttribute('data-province');
    let district = document.getElementById('District');
    fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district', {
            headers: {
                'token': 'f08ef811-05bd-11ec-b5ad-92f02d942f87',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then((response)=> {
            return response.json();
        })
        .then((res) => {
            let str = "<option selected>Quận/Huyện</option>";
            for (let i = 0; i < res.data.length; i++) {
                if(res.data[i].ProvinceID == selectedValue)
                    str += `<option class='districtId' data-district=${res.data[i].DistrictID}>${res.data[i].DistrictName}</option>`;
                
            }
            district.innerHTML=str;
        })
}

function changFuncDistrict(){
    let selectBox = document.getElementById('District');
    let selectedValue = selectBox.options[selectBox.selectedIndex].getAttribute('data-district');
    let ward = document.getElementById('Ward');
    fetch(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedValue}`, {
            headers: {
                'token': 'f08ef811-05bd-11ec-b5ad-92f02d942f87',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then((response)=> {
            return response.json();
        })
        .then((res) => {
            console.log(res);

            let str = "<option selected>Phường/Xã</option>";
            for (let i = 0; i < res.data.length; i++) {
                    str += `<option class='wardId' data-ward=${res.data[i].WardCode}>${res.data[i].WardName}</option>`;
                
            }
            ward.innerHTML=str;
        })
}

function loadData(){
    let a = check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`;
        fetch('https://localhost:44345/api/Addresses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`
            }
        })
        .then((response)=> {
            if(response.ok){

                return response.json();
            }
        })
        .then((res) => {
            const container = document.getElementById('address-body__container');
            let html = '';
            let disabled = '';
            res.forEach(item => {
                
                item.IsDefault?disabled = 'btn--disabled':disabled='';
                html += `
                <div class="address-item">
                    <div class="address-body__list">
                        <div class="profile-body__item">
                            <label for="FullName">Họ và tên</label>
                            <span>
                                <b>${item.FullName}</b>
                            </span>
                        </div>
                        <div class="profile-body__item">
                            <label for="Phone">Số điện thoại</label>
                            <span>${item.Phone}</span>
                        </div>
                        <div class="profile-body__item">
                            <label for="StreetAddress">Địa chỉ</label>
                            <span>${item.FullStreetAddress}</span>
                        </div>
                    </div>
                    <div class="address-body__option">
                        <a href="" class="btn address-body__option--edit" id="address-body__option--edit" onclick="event.preventDefault();getById(${item.Id})">Sửa</a>
                        <a href="" class="btn address-body__option--delete" onclick="event.preventDefault();deleteData(${item.Id})">Xóa</a>
                        <a href="" class="btn ${disabled} address-body__option--default" id="address-body__option--default__${item.Id}" onclick="event.preventDefault();setDefault(${item.Id})">Thiết lập mặc định</a>
                    </div>
                </div>
                `;
            });
            container.innerHTML = html;
            
        })
    };

    
function createData(){
    let inputs = document.querySelectorAll('#FormAddress input');
    
    let selects = document.querySelectorAll('#FormAddress select');
    
    fetch('https://localhost:44345/api/Addresses', {
                headers: {
                    
                    'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

                },
                method: 'POST',
                body: JSON.stringify({
                    FullName: inputs[1].value,
                    Phone: inputs[2].value,
                    StreetAddress: inputs[3].value,
                    // ProvinceId: selects[0].options[selects[0].selectedIndex].getAttribute('data-province'),
                    ProvinceName: selects[0].value,
                    // DistrictId: selects[1].options[selects[1].selectedIndex].getAttribute('data-district'),
                    DistrictName: selects[1].value,
                    // WardCode: selects[2].options[selects[2].selectedIndex].getAttribute('data-ward'),
                    WardName: selects[2].value,
                    IsDefault: inputs[4].checked
                })
                })
                .then((response)=> {
                    if(response.ok){
                        toast({
                            title: 'Thành công',
                            message: "Thêm địa chỉ thành công",
                            type: 'success'
                        });
                        inputs.forEach((input) => {
                            input.value = '';
                        });
                        selects.forEach((select) => {
                            select.value = '';
                        });
                        document.getElementById('modal').classList.remove('show');
                        loadData();
                    }
                        
                })
                .catch((error) => {
                    console.log(error);
                })
}

function deleteData(id){
    fetch(`https://localhost:44345/api/Addresses/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        },
        method: 'DELETE'
        })
        .then((response)=> {
            if(response.ok){
                toast({
                    title: 'Thành công',
                    message: "Xóa địa chỉ thành công",
                    type: 'success'
                });
                loadData();
            }
           
        })
        .catch((error) => {
            console.log(error);
        })
}

function updateData(id){
    let inputs = document.querySelectorAll('#FormAddress input');
    let selects = document.querySelectorAll('#FormAddress select');
    fetch(`https://localhost:44345/api/Addresses/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

        },
        method: 'PUT',
        body: JSON.stringify({
            FullName: inputs[1].value,
            Phone: inputs[2].value,
            StreetAddress: inputs[3].value,
            // ProvinceId: selects[0].options[selects[0].selectedIndex].getAttribute('data-province'),
            ProvinceName: selects[0].value,
            // DistrictId: selects[1].options[selects[1].selectedIndex].getAttribute('data-district'),
            DistrictName: selects[1].value,
            // WardCode: selects[2].options[selects[2].selectedIndex].getAttribute('data-ward'),
            WardName: selects[2].value,
            IsDefault: inputs[4].checked
        })
        })
        .then((response)=> {
            if(response.ok){
                toast({
                    title: 'Thành công',
                    message: "Cập nhật địa chỉ thành công",
                    type: 'success'
                });
                document.getElementById('modal').classList.remove('show');
                loadData();
            }
                
        })
        .catch((error) => {
            console.log(error);
        })
}

function getById(id){
    fetch(`https://localhost:44345/api/Addresses/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`

                },
                method: 'GET'
                })
                .then((response)=> {
                    return response.json();
                })
                .then((res) => {
                    let inputs = document.querySelectorAll('#FormAddress input');
                    let selects = document.querySelectorAll('#FormAddress select');
                    document.getElementById('modal').classList.add('show');
                    inputs[0].value = res.Id;
                    inputs[1].value = res.FullName;
                    inputs[2].value = res.Phone;
                    inputs[3].value = res.StreetAddress;
                    inputs[4].checked = res.IsDefault;
                    selects[0].value = res.ProvinceName;
                    selects[1].value = res.DistrictName;    
                    selects[2].value = res.WardName;

                })
                .catch((error) => {
                    console.log(error);
                })
}

function setDefault(id){
    fetch(`https://localhost:44345/api/Addresses/${id}/set-default`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': check_cookie_name("accessTokenUser")?`Bearer ${check_cookie_name("accessTokenUser")}`:`Bearer ${check_cookie_name("accessToken")}`
            
        },
        method: 'PUT'
        })
        .then((response)=> {
            if(response.ok){
                let groupElm = document.querySelectorAll('.address-body__option--default');
                for (let i = 0; i < groupElm.length; i++) {
                    if(groupElm[i].classList.contains('btn--disabled')){
                        groupElm[i].classList.remove('btn--disabled');
                        break;
                    }

                }
                document.getElementById(`address-body__option--default__${id}`).classList.add('btn--disabled');
                toast({
                    title: 'Thành công',
                    message: "Đặt làm mặc định thành công",
                    type: 'success'
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
}
function showForm(){
    const id = document.querySelector('#FormAddress input[name="Id"]').value;
    if(id){
        updateData(id);
    }
    else{
        createData();
    }
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
function constructor(){
    loadData();
}

this.constructor();