filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 4
}
let accessToken = `Bearer ${check_cookie_name("accessToken")?check_cookie_name("accessToken"):'--something went wrong---'}`
var url = 'https://localhost:44345/api/Products/pagination';


document.addEventListener("DOMContentLoaded", function(){
    const categoryId = document.getElementById('CategoryId');
    window.onload = function(){
        fetch('https://localhost:44345/api/Categories', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            method: 'GET'
        })
        .then((response)=> {
            return response.json();
        })
        .then((res) => {
            let str = "<option value='' selected>Danh mục</option>";
            res.forEach(item => {
                str += `<option  value="${item.Id}">${item.Name}</option>`;
                
            });

            categoryId.innerHTML=str;
        })
    };
});

function changFuncCategory(){
    let selectBox = document.getElementById('CategoryId');
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    let brand = document.getElementById('BrandId');
    fetch(`https://localhost:44345/${selectedValue}/Brands`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            method: 'GET'
        })
        .then((response)=> {
            return response.json();
        })
        .then((res) => {
            let str = "<option selected>Thương hiệu</option>";
            res.forEach(item => {
                str += `<option value=${item.Id}>${item.Name}</option>`;
                
            });
            brand.innerHTML=str;
        })
}
// Process data
function getDataForm() {
    let dataInput = document.querySelectorAll(`#formProduct input`);
    let dataselect = document.querySelectorAll(`#formProduct select`);
    let fileUploads = document.getElementById('Image').files;
    let arrImage = [];

    let result = Array.from(dataInput).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});

    for (let i = 0; i < fileUploads.length; i++) {
        arrImage.push(fileUploads[i].name);
    }
    result.Image = arrImage.join(';');

    result.CategoryId = dataselect[0].value;
    result.BrandId = dataselect[1].value;
    return result;
}

function loadData() {

    fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
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
                imgg = document.createElement('img');
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < Items.length; i++) {
                    strHtml += `<tr>`;
                    strHtml += `<td>${Items[i].Id}</td>`;
                    strHtml += `<td>${Items[i].Name}</td>`;
                    strHtml += `<td>${Items[i].Category.Name}</td>`;
                    strHtml += `<td>${Items[i].Brand.Name}</td>`;
                    strHtml += `<td>${Items[i].OriginalPrice}</td>`;
                    strHtml += `<td>${Items[i].Price}</td>`;
                    strHtml += `<td>${Items[i].PromotionPrice}</td>`;
                    strHtml += `<td>${Items[i].Quantity}</td>`;
                    strHtml += `<td>
                                    <a href="#" class="btnEdit" onclick="event.preventDefault(); showForm(${Items[i].Id})"><i class="fas fa-edit"></i></i></a>
                                    <a href="#" class="btnDelete" onclick="event.preventDefault(); deleteData(${Items[i].Id})"><i class="fas fa-trash-alt"></i></a>
                                    <a href="#" class="btnImage" onclick="event.preventDefault(); loadImages(${Items[i].Id})"><i class="fas fa-image"></i></a>
                                </td>`;
                    strHtml += `</tr>`;
                }

                // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                var divContainer = document.querySelector("#content tbody");
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

function deleteData(id) {
    fetch(`https://localhost:44345/api/Products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi xóa dữ liệu!");
            else {
                hideModal();
                loadData();
                toast({
                    title: 'Success',
                    message: 'Xóa sản phẩm thành công',
                    type: 'success'
                });
            }
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: error,
                type: 'error'
            });
        });
}

function createData() {
    var inputValues = getDataForm();
    inputValues.Content = editor.getData();
    inputValues.Id = 0;
    try {
        fetch('https://localhost:44345/api/Products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                },
                body: JSON.stringify(inputValues)
            })
            .then(function(res) {
                if (res.ok){
                    let modal = document.getElementById('modal');
                    if(modal.classList.contains('show'))
                      modal.classList.remove('show');
                    loadData();
                    toast({
                        title: 'Success',
                        message: 'Thêm sản phẩm thành công',
                        type: 'success'
                    });
                    return res.json();
                }
            })
            .then(function(data) {
                saveImages(data);
            });


    } catch (error) {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    }

}

function getDataById(id) {
    let formData = document.querySelectorAll('#formProduct input');
    fetch(`https://localhost:44345/api/Products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi khi xảy ra khi tải dữ liệu");
            return res.json();
        })
        .then(function(data) {
            let listKey = Object.keys(data);
            let listKeySpe = Object.keys(data.Specification);

            Array.from(formData).forEach(function(item, index) {
                //data.Name
                listKey.forEach(function(jtem) {
                    if (item.id == jtem)
                        item.value = data[jtem];
                    // if(jtem =='Content')
                    //     editor.data.set(data[jtem] == null ?data[jtem]:'');

                });
                listKeySpe.forEach(jtem => {
                    if (item.id == jtem)
                        item.value = data.Specification[jtem];
                });
            });
            // loadCategories(data.Category.Id);
            // loadBrands(data.Category.Id, data.Brand.Id);
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: error,
                type: 'error'
            });
        });
}

function updateData() {
    var inputValues = getDataForm();
    inputValues.Content = editor.getData();
    fetch(`https://localhost:44345/api/Products/${inputValues.Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify(inputValues)
        })
        .then(function(res) {
            if (res.ok){
            let modal = document.getElementById('modal');
                    if(modal.classList.contains('show'))
                      modal.classList.remove('show');
                      loadData();
                toast({
                    title: 'Success',
                    message: 'Cập nhật sản phẩm thành công',
                    type: 'success'
                });
                return res.json();
            }
        })
        .then(function(data) {
            saveImages(data);
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: error,
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

// function loadCategories(categoryId) {
//     let selectCategory = document.getElementById('CategoryId');
//     fetch('https://localhost:44345/api/Categories', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': accessToken
//             }
//         })
//         .then(function(res) {
//             if (!res.ok)
//                 throw Error("Có lỗi xảy ra khi tải danh mục!");
//             return res.json();
//         })
//         .then(function(data) {
//             // let html = '';
//             // selectCategory.options.length = 1;
//             // Array.from(data).forEach(function(item, i) {
//             //     if (item.Id == categoryId) {
//             //         html += `<option value='${item.Id}' selected> ${item.Name} </option>`;
//             //     } else {
//             //         html += `<option value='${item.Id}'> ${item.Name} </option>`;
//             //     }
//             // });
//             // document.getElementById('CategoryId').insertAdjacentHTML("beforeend", html);
//         })
//         .catch(error => {
//             toast({
//                 title: 'Error',
//                 message: error,
//                 type: 'error'
//             });
//         });
// }

// function loadBrands(categoryId, brandId) {
//     let selectBrand = document.getElementById('BrandId');
//     if (categoryId != '') {
//         selectBrand.options.length = 1
//         fetch(`https://localhost:44345/${categoryId}/Brands`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': accessToken
//                 }
//             })
//             .then(function(res) {
//                 if (!res.ok)
//                     throw Error("Có lỗi xảy ra khi tải thương hiệu!");
//                 return res.json();
//             })
//             .then(function(data) {
//                 let html = '';
//                 Array.from(data).forEach(function(item, i) {
//                     if (item.Id == brandId)
//                         html += `<option value='${item.Id}' selected> ${item.Name} </option>`;
//                     else
//                         html += `<option value='${item.Id}'> ${item.Name} </option>`;
//                 });
//                 selectBrand.insertAdjacentHTML("beforeend", html);
//             })
//             .catch(error => {
//                 console.log(error);
//                 toast({
//                     title: 'Error',
//                     message: "Có lỗi xảy ra khi tải thương hiệu!",
//                     type: 'error'
//                 });
//             });
//     } else {
//         selectBrand.options.length = 1
//     }
// }

function getImages() {
    fetch(`https://localhost:44345/api/Products/get-images`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken,
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra tải ảnh!");
            return res.json();
        })
        .then(function(data) {
            return data;
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải thương hiệu!",
                type: 'error'
            });
        });
}

function saveImages(id) {
    let productId = id;
    let fileUploads = document.getElementById('Image').files;
    let imageList = [];
    let data = new FormData();
    for (let i = 0; i < fileUploads.length; i++) {
        data.append(fileUploads[i].name, fileUploads[i]);
    }

    fetch(`https://localhost:44345/api/Uploads/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': accessToken,
            },
            body: data
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi lưu hình ảnh!");
        })
        .catch(error => {
            console.log(error);
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra upload ảnh!",
                type: 'error'
            });
        });


    for (let i = 0; i < fileUploads.length; i++) {
        imageList.push(fileUploads[i].name);
    }
    fetch(`https://localhost:44345/api/Products/${productId}/save-images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
            body: JSON.stringify(imageList)
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi lưu hình ảnh!");
            return res.json();
        })
        .then(function(data) {
            toast({
                title: 'Error',
                message: "Cập nhật thành công!",
                type: 'error'
            });
        })
        .catch(error => {
            console.log(error);
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi tải thương hiệu!",
                type: 'error'
            });
        });
}

function preview() {
    let fileInput = document.getElementById('Image');
    let imageContainer = document.getElementById("imageList");

    imageContainer.innerHTML = '';

    for (i of fileInput.files) {
        let reader = new FileReader();
        let figure = document.createElement("figure");
        let figCap = document.createElement("figcaption");

        // figCap.innerText = i.name;
        figure.appendChild(figCap);
        reader.onload = () => {
            let img = document.createElement('img');
            img.setAttribute("src", reader.result);
            figure.insertBefore(img, figCap);
        };

        imageContainer.appendChild(figure);
        reader.readAsDataURL(i);
    }
}

function loadImages(productId) {
    document.getElementById('preview-image').innerHTML = '';
    document.querySelector('.modalz').style.display = "flex";
    document.querySelector('.modal__overlay').style.display = "block";
    document.querySelector(`.form__modal--images`).style.display = "block";

    document.getElementById('hideId').value = productId;
    let containImage = document.getElementById('preview-image');

    fetch(`https://localhost:44345/api/Products/${productId}/get-image`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken,
            }
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi lưu hình ảnh!");
            return res.json();
        })
        .then(function(data) {
            let html = '';

            data.forEach(item => {
                html += `
                <figure>
                    <img src="${item.Path}" alt="${item.Caption}">
                    <figcaption>${item.Caption}</figcaption>
                </figure>`;

            });
            containImage.innerHTML = html;
        })
        .catch(error => {
            console.log(error);
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra upload ảnh!",
                type: 'error'
            });
        });
}

function SubmitData() {
    // let fieldId = document.querySelector('.field-id input');
    let id = document.getElementById('Id');
    if (id.value != '' && id.value != undefined) {
        updateData();
    } else {
        createData();
    }
}

function resetForm() {
    let formDataInput = document.querySelectorAll(`#formProduct input`);
    let formDataSelect = document.querySelectorAll(`#formProduct select`);
    document.querySelector('textarea').value = '';
    formDataInput.forEach(function(item, i) {
        item.value = '';
    });

    formDataSelect.forEach(function(item) {
        item.value = '';
    });
}

function checkLogin() {
    console.log(check_cookie_name("accessToken"));
    if (check_cookie_name("accessToken") == null) {

        window.location.href = "/login.html";
    }
}

function logOut() {
    delete_cookie("accessToken");
    accessToken = null;
    checkLogin();
}





document.getElementById('btnCreate').addEventListener('click', function(e) {
    e.preventDefault();
    showForm();
});


// function loadBrandByCategory() {
//     document.getElementById('CategoryId').addEventListener('change', function() {
//         loadBrands(this.value);
//     });
// }

function showForm(id) {
    let formHeader = document.querySelector('.header-modal');
    // loadCategories();
    // showModal();
    let modal = document.getElementById('modal');
    if(!modal.classList.contains('show'))
            modal.classList.add('show');
    if (id == null && id == undefined) {
        // document.querySelector('.field-id').style.display = 'none';
        resetForm();
        formHeader.innerHTML = "Thêm mới sản phẩm"
    } else if (id != null && id != 0) {
        formHeader.innerHTML = "Cập nhật sản phẩm";
        // document.querySelector('.field-id').style.display = null;
        getDataById(id);
    }   
}


function onLoadPageSize() {
    let selectedValue = document.getElementById('pageIndex').value;
    filter.PageSize = selectedValue;
    filter.PageIndex = 1;
    pagination(filter);
    loadData();
}

function onClickPageIndex(currentPage) {
    filter.PageIndex = currentPage;
    pagination(filter);
    loadData();
}

function registerEvents() {
    // loadBrandByCategory();
}

(function contructor() {
    loadData();
    pagination(filter);
    registerEvents();
    checkLogin();
})()