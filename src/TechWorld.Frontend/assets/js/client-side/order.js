function loadData(status = 5){
    fetch("https://localhost:44345/api/Orders", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${check_cookie_name("accessToken")}`
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
            'Authorization': `Bearer ${check_cookie_name("accessToken")}`
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

function constructor(){
    loadData();
}
this.constructor();