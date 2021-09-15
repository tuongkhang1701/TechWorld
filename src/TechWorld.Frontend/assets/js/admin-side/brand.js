filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 4
}
let accessToken = `Bearer ${check_cookie_name("accessToken")?check_cookie_name("accessToken"):'--something went wrong---'}`;
var url = 'https://localhost:44345/api/Brands/pagination';


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
// Process data
function getDataForm() {
    let dataInput = document.querySelectorAll(`#formBrand input`);
    let dataselect = document.querySelectorAll(`#formBrand select`);

    let result = Array.from(dataInput).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    result.CategoryId = dataselect[0].value;
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
                    strHtml += `<tr>`;
                    strHtml += `<td>${Items[i].Id}</td>`;
                    strHtml += `<td>${Items[i].Name}</td>`;
                    strHtml += `<td>${Items[i].Category.Name}</td>`;
                    strHtml += `<td>
                                    <a href="#" class="btnEdit" onclick="event.preventDefault(); showForm(${Items[i].Id})"><i class="fas fa-edit"></i></i></a>
                                    <a href="#" class="btnDelete" onclick="event.preventDefault(); deleteData(${Items[i].Id})"><i class="fas fa-trash-alt"></i></a>
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

// function loadCategories(categoryId) {
//     let selectCategory = document.getElementById('CategoryId');
//     fetch('https://localhost:44345/api/Categories', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': accessToken
//             },
//             body: JSON.stringify(this.filter)
//         })
//         .then(function(res) {
//             if (!res.ok)
//                 throw Error("Có lỗi xảy ra khi tải danh mục!");
//             return res.json();
//         })
//         .then(function(data) {
//             let html = '';
//             selectCategory.options.length = 1;
//             Array.from(data).forEach(function(item, i) {
//                 if (item.Id == categoryId) {
//                     html += `<option value='${item.Id}' selected> ${item.Name} </option>`;
//                 } else {
//                     html += `<option value='${item.Id}'> ${item.Name} </option>`;
//                 }
//             });
//             document.getElementById('CategoryId').insertAdjacentHTML("beforeend", html);
//         })
//         .catch(error => {
//             toast({
//                 title: 'Error',
//                 message: error,
//                 type: 'error'
//             });
//         });
// }


function deleteData(id) {
    fetch(`https://localhost:44345/api/Brands/${id}`, {
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
    inputValues.Id = 0;
    try {
        fetch('https://localhost:44345/api/Brands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                },
                body: JSON.stringify(inputValues)
            })
            .then(function(res) {
                if(res.ok){
                    let modal = document.getElementById('modal');
                    if(modal.classList.contains('show'))
                      modal.classList.remove('show');
                    loadData();
                    toast({
                        title: 'Thành công',
                        message: 'Thêm thương hiệu thành công',
                        type: 'success'
                    });
                }
                
            })

    } catch (error) {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    }

}


function pagination(filter) {

    fetch('https://localhost:44345/api/Brands/pagination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify(filter)
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi phân trang!");
            return res.json();
        })
        .then(function(data) {
            loadPagination(data.TotalPage, data.PageIndex);
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: error,
                type: 'error'
            });
        });

}

function getDataById(id) {
    let formData = document.querySelectorAll('#formBrand input');

    fetch(`https://localhost:44345/api/Brands/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            let listKey = Object.keys(data);

            Array.from(formData).forEach(function(item, index) {
                //data.Name
                listKey.forEach(function(jtem) {
                    if (item.id == jtem)
                        item.value = data[jtem];
                });
            });
            document.getElementById('CategoryId').value = data.Category.Id;
            // loadCategories(data.Category.Id);
        })
        .catch(error => {
            toast({
                title: 'Thất bại',
                message: 'Có lỗi khi xảy ra khi tải dữ liệu',
                type: 'error'
            });
        });
}

function updateData() {
    var inputValues = getDataForm();
    fetch(`https://localhost:44345/api/Brands/${inputValues.Id}`, {
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
                    title: 'Thành công',
                    message: 'Cập nhật sản phẩm thành công',
                    type: 'success'
                });
            }
        })
        .catch(error => {
            toast({
                title: 'Error',
                message: "Có lỗi xảy ra khi cập nhật dữ liệu!",
                type: 'error'
            });
        });
}

function SubmitData() {
    let id = document.getElementById('Id');
    if (id.value != '' && id.value != undefined) {
        updateData();
    } else {
        createData();
    }
}

function resetForm() {
    let formDataInput = document.querySelectorAll(`#formBrand input`);
    let formDataSelect = document.querySelectorAll(`#formBrand select`);
    formDataInput.forEach(function(item, i) {
        item.value = '';
    });

    formDataSelect.forEach(function(item) {
        item.value = '';
    });
}

function checkLogin() {
    if (!accessToken)
        window.location.href = "login.html";
}

function logOut() {
    delete_cookie("accessToken");
    checkLogin();
}

function showFormCreate() {
    document.getElementById('btnCreate').addEventListener('click', function(e) {
        e.preventDefault();
        showForm();
    });
}


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
    showFormCreate();
}

function contructor() {
    loadData();
    pagination(filter);
    registerEvents();
}

this.contructor();