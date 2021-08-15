filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 8
}
let accessToken = `Bearer ${check_cookie_name("accessToken")?check_cookie_name("accessToken"):'--something went wrong---'}`

function loadData() {
    let srcImage = '';
    fetch("https://localhost:44345/api/Products/get-images", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
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
                'Authorization': accessToken
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
                    strHtml += `<a class="home-product-item" href="#">`;
                    strHtml += `<div class="home-product-item__img" style="background-image: url(${Items[i].DefaultImage})"></div>`;
                    strHtml += `<h4 class="home-product-item__name">${Items[i].Name}</h4>`;
                    strHtml += `<div class="home-product-item__price">`;
                    strHtml += `<span class="home-product-item__price-old">${Items[i].Price}</span>`;
                    strHtml += `<span class="home-product-item__price-current">${Items[i].PromotionPrice}</span>`;
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
                    strHtml += `</div></a></div>`;
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

function pagination(filter) {

    fetch('https://localhost:44345/api/Products/pagination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
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
}

(function contructor() {
    loadData();
    pagination(filter);
})()