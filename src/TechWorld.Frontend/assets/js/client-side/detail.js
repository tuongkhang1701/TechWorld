var id = Number.parseInt(parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length).substring(4), 10);

function loadData() {
    fetch(`https://localhost:44345/api/Products/${id}`, {
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
            console.log(data);
            let html = '';

            html = `
                <div class="grid__row app__content">
                <div class="top-name grid__full-width">
                    ${data.Name}
                </div>
                </div>
                <div class="grid__row app__content">

                    <div class="grid__column-6">
                        <div class="detail__image">
                            <div class="detail__display-image">
                                <img src="${data.DefaultImage}" alt="637387847968338274_asus-zenbook-ux425-xam-1">
                            </div>
                            <div class="detail__review-image">
                                <ul class="detail__review-image--list">
                                    <li class="detail__review-image--item"><img src="../assets/images/637387847968338274_637335980720863180_asus-zenbook-ux425ja-xam-1.png" alt=""></li>
                                    <li class="detail__review-image--item detail__review-image--item-active"><img src="../assets/images/637387847968494606_637335980720467274_asus-zenbook-ux425ja-xam-2.png" alt=""></li>
                                    <li class="detail__review-image--item"><img src="../assets/images/637387847968494606_637335980720078468_asus-zenbook-ux425ja-xam-4.png" alt=""></li>
                                    <li class="detail__review-image--item"><img src="../assets/images/637387847968494606_637335980720682971_asus-zenbook-ux425ja-xam-3.png" alt=""></li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div class="grid__column-6">
                        <div class="detail__info">
                            <div class="detail__price">
                                <span class="detail__price-promotion">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.Price)}</span>
                                <span class="detail__price-original">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.PromotionPrice)}</span>
                            </div>
                            <div class="detail__price--policy">
                                <img src="" alt="">
                            </div>
                            <div class="detail__offer">
                                <p class="offer__header">Ưu đãi thêm</p>
                                <ul class="offer__list">
                                    <li class="offer__item"><i class="fas fa-check-circle offer__icon"></i>Tặng PMH 100.000đ mua Microsoft 365 Personal/Family/Home & Student khi mua Online đến 30/09</li>
                                    <li class="offer__item"><i class="fas fa-check-circle offer__icon"></i>Thu cũ đổi mới - Trợ giá ngay 15% Xem chi tiết</li>
                                    <li class="offer__item"><i class="fas fa-check-circle offer__icon"></i>Tặng Balo Laptop</li>
                                    <li class="offer__item"><i class="fas fa-check-circle offer__icon"></i>Tặng PMH 200.000đ mua máy in Brother</li>
                                    <li class="offer__item"><i class="fas fa-check-circle offer__icon"></i>Giảm đến 300.000đ khi mua bảo hành (rơi vỡ + vào nước) kèm máy Xem chi tiết</li>
                                </ul>
                            </div>

                            <div class="detail__choose">
                                <a href="#" class="btn btn--normal btn--size-l detail__choose--add-to-cart" onclick="event.preventDefault();addToCart()">Thêm vào giỏ hàng</a>
                                <a href="#" class="btn btn--primary btn--size-l detail__choose--buy-now">Mua ngay</a>
                            </div>

                            <div class="detail__customer-benefit">
                                <p class="detail__customer-benefit--header">Quyền lợi khách hàng</p>
                                <ul class="detail__customer-benefit--list">
                                    <li class="detail__customer-benefit--item">
                                        <i class="fas fa-shipping-fast detail__customer-benefit--icon"></i> Miễn phí vận chuyển
                                    </li>

                                    <li class="detail__customer-benefit--item">
                                        <i class="fas fa-sync-alt detail__customer-benefit--icon"></i> Miễn phí hoàn trả
                                    </li>

                                    <li class="detail__customer-benefit--item">
                                        <i class="fas fa-hand-sparkles detail__customer-benefit--icon"></i> Dùng thử 7 ngày
                                    </li>

                                    <li class="detail__customer-benefit--item">
                                        <i class="fas fa-money-bill-alt detail__customer-benefit--icon"></i> Mua trước trả sau
                                    </li>

                                    <li class="detail__customer-benefit--item">
                                        <i class="fas fa-clock detail__customer-benefit--icon"></i> 48 giờ hoàn trả
                                    </li>

                                    <li class="detail__customer-benefit--item">
                                        <i class="fas fa-hand-holding-usd detail__customer-benefit--icon"></i> Trả góp 0%
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid__row app__content">
                    <div class="grid__column-7">
                        <div id="content" style="height:444px;overflow:hidden">
                            <div class="content__title"></div>
                            <div class="content__body">
                                <h3>Đặc điểm nổi bật của Asus Zenbook UX425EA-KI429T/i5-1135G7</h3>
                                <img src="../assets/images/637595413254775559_asus-zenbook-ux425ea-ki429t-i5-1135g7-thiet-ke.jfif" alt="">
                                <h2>Đánh giá chi tiết Asus Zenbook UX425EA-KI429T/i5-1135G7</h2>
                                <p>Asus ZenBook UX425EA KI429T thuộc dòng ZenBook cao cấp của Asus, là chiếc laptop mang đến cho bạn trải nghiệm hoàn toàn khác biệt, từ thiết kế đỉnh cao cho đến hiệu năng xuất sắc và những giá trị hàng đầu của một siêu phẩm
                                    công nghệ.</p>
                                <img src="../assets/images/asus-zenbook-ux425-fpt-7.jpg" alt="">
                                <h4>Kiệt tác của công nghệ</h4>
                                <p>Phiên bản ZenBook 14 UX425EA trong bài viết có màu xám thông, thể hiện sự thâm trầm, hiện đại. Kiểu dáng cao cấp và hoàn thiện từ kim loại nguyên khối, cùng màn hình viền siêu mỏng tạo nên một chiếc laptop đẹp hoàn mỹ.
                                    Asus ZenBook 14 UX425EA mang tới đẳng cấp riêng biệt cho người dùng, khẳng định giá trị của sự trí tuệ qua một thiết bị công nghệ đỉnh cao.</p>
                                <img src="../assets/images/asus-zenbook-ux425-fpt-1.jpg" alt="">
                                <h4>Độ bền chuẩn quân đội</h4>
                                <p>Không chỉ đẹp mà độ bền của Asus ZenBook 14 UX425EA cũng rất đáng kinh ngạc. ZenBook 14 thậm chí còn đạt chuẩn quân đội Mỹ MIL-STD-810G. Máy đã trải qua rất nhiều thử nghiệm trong môi trường khắc nghiệt, bao gồm cả độ cao;
                                    thả rơi; rung lắc; nhiệt độ cao thấp, … để có được độ bền cứng cáp, hoạt động ổn định trong thời gian dài.</p>
                                <img src="../assets/images/asus-zenbook-ux425-fpt-5.jpg" alt="">
                                <h4>Hiển thị hình ảnh tuyệt mỹ</h4>
                                <p>Vẻ đẹp của màn hình ZenBook 14 UX425EA khó có thể diễn tả hết bằng lời mà bạn cần phải tự cảm nhận mới thấy được đầy đủ sự hấp dẫn. Một màn hình 14 inch độ phân giải Full HD sắc nét, độ sáng tới 400 nits được bao phủ bởi
                                    4 cạnh viền siêu mỏng tạo hiệu ứng tràn viền tuyệt đẹp. Tỷ lệ màn hình chiếm tới 90% thân máy, đồng nghĩa với việc hình ảnh như nổi lên trước mắt bạn. Những trải nghiệm như xem ảnh, xem phim trên Asus ZenBook 14 UX425EA
                                    sẽ tuyệt vời hơn bao giờ hết.</p>
                                <img src="../assets/images/asus-zenbook-ux425-fpt-3.jpg" alt="">
                                <h4>Tăng cường hiệu suất, hiệu quả tối đa</h4>
                                <p>Bạn sẽ còn phải bất ngờ hơn nữa khi bên trong chiếc laptop siêu nhỏ gọn này là bộ vi xử lý Intel thế hệ thứ 11 mới nhất hiện nay. Asus ZenBook UX425EA trang bị bộ vi xử lý Intel Core i5 1135G7 sản xuất trên tiến trình 10nm
                                    với 4 lõi 8 luồng, tốc độ tối đa 4.20GHz cực mạnh. Ngoài ra GPU đồ họa cũng được nâng cấp lên Intel Iris Xe Graphics, cho hiệu năng đồ họa vượt trội. Bên cạnh đó ZenBook 14 còn có sẵn 8GB RAM LPDDR4X 4266 MHz và ổ cứng
                                    SSD 512GB PCIe 3.0 siêu tốc. Khả năng xử lý cực nhanh mọi tác vụ giúp công việc của bạn diễn ra một cách hoàn hảo.</p>
                                <img src="../assets/images/asus-zenbook-ux425-fpt-11.jpg" alt="">
                                <h4>Thời lượng pin đáng kinh ngạc</h4>
                                <p>Tính cơ động tuyệt vời của ZenBook 14 UX425EA được thể hiện ở thời lượng pin tối đa lên tới 22 tiếng sau một lần sạc đầy. Bạn có thể làm việc mọi lúc mọi nơi mà không cần quan tâm đến nguồn sạc. Ngoài ra máy còn hỗ trợ
                                    tính năng sạc nhanh, cho phép sạc đầy 60% pin chỉ trong vòng 49 phút, đảm bảo nguồn năng lượng dồi dào.</p>
                                <img src="../assets/images/637413930224403423_HASP-Asus-Vivobook-UX425.jpg" alt="">
                                <h4>Laptop 14 inch mỏng nhất thế giới đầy đủ kết nối</h4>
                                <p>Asus ZenBook 14 UX425EA gây ấn tượng mạnh nhờ kiểu dáng thanh mảnh đầy thời trang. Trọng lượng chỉ 1,13kg và độ mỏng 14,3mm giúp máy có khả năng cơ động tuyệt vời, luôn đồng hành cùng bạn đi bất cứ đâu. ZenBook 14 UX425EA
                                    cũng là chiếc laptop 14 inch mỏng nhất thế giới sở hữu đầy đủ cổng kết nối, kể cả cổng HDMI kích thước tiêu chuẩn và USB Type-A, mang đến những kết nối linh hoạt đầy tiện lợi.</p>
                                <img src="../assets/images/asus-zenbook-ux425-fpt-2.jpg" alt="">
                            </div>
                            <a href="#" class="btn" id="content__btn-read-more" onclick="event.preventDefault();btnReadMore()">Xem thêm</a>
                        </div>
                    </div>

                    <div class="grid__column-5">
                        <div class="detail__specification">
                            <p class="detail__specification--header">Thông số kĩ thuật</p>
                            <table class="detail__specification--table">
                                <tbody class="detail__specification--list">
                                    <tr class="detail__specification--item">
                                        <td>CPU</td>
                                        <td><span>${data.Specification.Cpu}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>RAM</td>
                                        <td><span>${data.Specification.Ram}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Màn hình</td>
                                        <td><span>${data.Specification.Screen}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Đồ họa</td>
                                        <td><span>${data.Specification.Graphic}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Ổ cứng</td>
                                        <td><span>${data.Specification.HardWare}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Hệ điều hành</td>
                                        <td><span>${data.Specification.Os}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Trọng lượng (kg)</td>
                                        <td><span>${data.Specification.Weight}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Kích thước (mm)</td>
                                        <td><span>${data.Specification.Size}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Xuất xứ</td>
                                        <td><span>${data.Specification.Origin}</span></td>
                                    </tr>
                                    <tr class="detail__specification--item">
                                        <td>Năm ra mắt</td>
                                        <td><span>${data.Specification.ReleasedYear}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            document.querySelector('.app__containner .grid').innerHTML = html;
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải hình ảnh!",
                type: 'error'
            });
        });
}

function addToCart() {
    console.log(id);
    // productId = this.getAttribute("data-id");
    fetch("https://localhost:44345/api/Carts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            },
            body: JSON.stringify({
                ProductId: id,
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
                                <span class="header__cart-item-price">${item.Product.PromotionPrice}</span>
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
document.querySelector('.header__cart-wrap').addEventListener('click', function(){
    window.location.href = "/cart.html";
});
function btnReadMore(){
    let elementContent = document.getElementById('content')
        if (elementContent.style.height === '444px') {
            elementContent.style.height = '';
            elementContent.style.overflow = '';
            btnReadMore.innerText = "Thu gọn";
        } else {
            elementContent.style.height = '444px';
            elementContent.style.overflow = 'hidden';
            btnReadMore.innerText = "Xem thêm";
        }
    }


(function constructor(){
    this.loadData();
    loadCart();
})()

