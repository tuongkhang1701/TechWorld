filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 2
}
let accessToken = `Bearer ${check_cookie_name("accessToken")?check_cookie_name("accessToken"):'--something went wrong---'}`;
var url = 'https://localhost:44345/api/Categories/pagination';

// Process data
function getDataForm() {
    let dataInput = document.querySelectorAll(`#formCategory input`);

    let result = Array.from(dataInput).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
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


function deleteData(id) {
    fetch(`https://localhost:44345/api/Categories/${id}`, {
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
        fetch('https://localhost:44345/api/Categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                },
                body: JSON.stringify(inputValues)
            })
            .then(function(res) {
                console.log(res);
                if (!res.ok)
                    throw Error("Xảy ra lỗi khi thêm sản phẩm");
                else {
                    hideModal();
                    loadData();
                    toast({
                        title: 'Success',
                        message: 'Thêm sản phẩm thành công',
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

    fetch('https://localhost:44345/api/Categories/pagination', {
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
    let formData = document.querySelectorAll('#formCategory input');

    fetch(`https://localhost:44345/api/Categories/${id}`, {
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

            Array.from(formData).forEach(function(item, index) {
                //data.Name
                listKey.forEach(function(jtem) {
                    if (item.id == jtem)
                        item.value = data[jtem];
                });
            });
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
    fetch(`https://localhost:44345/api/Categories/${inputValues.Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify(inputValues)
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi cập nhật dữ liệu!");
            else {
                hideModal();
                loadData();
                toast({
                    title: 'Success',
                    message: 'Cập nhật sản phẩm thành công',
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

function SubmitData() {
    let fieldId = document.querySelector('.field-id input');
    if (fieldId.value != '' && fieldId.value != undefined) {
        updateData();
    } else {
        createData();
    }
}

function resetForm() {
    let formDataInput = document.querySelectorAll(`#formCategory input`);
    formDataInput.forEach(function(item, i) {
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
//Events
document.querySelector('.modal__overlay').addEventListener('click', function() { hideModal() });


function hideModal() {
    document.querySelector('.modal').style.display = null;
    document.querySelector('.modal__overlay').style.display = null;
    document.querySelector('.form__modal--category').style.display = null;
}

function showModal() {
    document.querySelector('.modal').style.display = "flex";
    document.querySelector('.modal__overlay').style.display = "block";
    document.querySelector(`.form__modal--category`).style.display = "block";
}

function showFormCreate() {
    document.getElementById('btnCreate').addEventListener('click', function(e) {
        e.preventDefault();
        showForm();
    });
}


function showForm(id) {
    let formHeader = document.querySelector('.form__header');
    showModal();
    if (id == null && id == undefined) {
        document.querySelector('.field-id').style.display = 'none';
        resetForm();
        formHeader.innerHTML = "Thêm mới sản phẩm"
    } else if (id != null && id != 0) {
        formHeader.innerHTML = "Cập nhật sản phẩm";
        document.querySelector('.field-id').style.display = null;
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
    hideModal();
    showFormCreate();
}

function contructor() {
    loadData();
    pagination(filter);
    registerEvents();
}

this.contructor();