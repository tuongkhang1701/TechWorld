function loadData(){
    let a = check_cookie_name("accessToken");
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
                    console.log(data);
                    let html = '';
                    let jhtml = '';
                    data.forEach(item => {
                        JSON.parse(item).OrderDetails.forEach(jtem => {
                            jhtml += `
                            <div class="order-item-detail">
                                <img src="https://cf.shopee.vn/file/38bde90e64eda8ec6f443baf2b71f8f3_tn" alt="" class="order-item__img">

                                <div class="order-item__info">
                                    <p class="order-item__name">${jtem.ProductName}</p>
                                    <span class="order-item__quantity">x${jtem.Quantity}</span>
                                </div>

                                <div class="order-item__price">
                                    <span class="order-item__price--original">${jtem.Price}</span>
                                    <span class="order-item__price--promotion">${jtem.PromotionPrice}</span>
                                </div>
                            </div>
                            `;
                        });
                        html += `
                        <div class="order-item">
                        <p class="order-item__status">ĐÃ GIAO</p>
                        
                        
                        ${jhtml}

                        <div class="order-item__total">
                            <p class="order-item__total-label">Tổng số tiền:</p>
                            <span class="order-item__total-price">366.300đ</span>
                        </div>
                        </div>
                        `;
                    });
                    document.getElementById('order-body__list').innerHTML = html;
                })
                .catch((error) => {
                    toast({
                        title: 'Error',
                        message: error,
                        type: 'error'
                    });
                })
            }

function constructor(){
    loadData();
}
this.constructor();