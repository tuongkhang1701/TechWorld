filter = {
    Keyword: null,
    PageIndex: 1,
    PageSize: 4
}

// Process data
function getDataForm() {
    let dataInput = document.querySelectorAll(`#formUser input`);
    let selectElm = document.getElementById('RoleId').value;
    let result = Array.from(dataInput).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    roleId = {RoleId: selectElm};
    result = Object.assign(result, roleId);
    return result;
}

function loadData() {

    fetch(`https://localhost:44345/api/Users/pagination`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
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
                imgg = document.createElement('img');
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < Items.length; i++) {
                    strHtml += `<tr>`;
                    strHtml += `<td>${i+1}</td>`;
                    strHtml += `<td>${Items[i].UserName}</td>`;
                    strHtml += `<td>${Items[i].FullName}</td>`;
                    strHtml += `<td>${Items[i].Dob}</td>`;
                    strHtml += `<td>${Items[i].Email}</td>`;
                    strHtml += `<td>${Items[i].PhoneNumber}</td>`;
                    strHtml += `<td>${Items[i].DateCreated}</td>`;
                    strHtml += `<td>${Items[i].Role.Name}</td>`;
                    strHtml += `<td>
                                    <a href="#" class="btnEdit" onclick="event.preventDefault(); showForm('${Items[i].Id}')"><i class="fas fa-edit"></i></i></a>
                                    <a href="#" class="btnDelete" onclick="event.preventDefault(); deleteData('${Items[i].Id}')"><i class="fas fa-trash-alt"></i></a>
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
    fetch(`https://localhost:44345/api/Users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            }
        })
        .then(function(res) {
                loadData();
                toast({
                    title: 'Success',
                    message: 'Xóa sản phẩm thành công',
                    type: 'success'
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

function createData() {
    var inputValues = getDataForm();
    inputValues.Id = 0;
    try {
        fetch('https://localhost:44345/api/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${check_cookie_name("accessToken")}`
                },
                body: JSON.stringify(inputValues)
            })
            .then(function(res) {
                console.log(res);
                if (!res.ok)
                    throw Error("Xảy ra lỗi khi thêm sản phẩm");
                else {
                    let modal = document.getElementById('modal');
                    if(modal.classList.contains('show'))
                      modal.classList.remove('show');
                    loadData();
                    toast({
                        title: 'Success',
                        message: 'Thêm sản phẩm thành công',
                        type: 'success'
                    });
                }
            }).
        then(function(data) {
            console.log(data);
            saveImages(data);
        })

    } catch (error) {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    }

}

function getDataById(id) {
    let formData = document.querySelectorAll('#formUser input');

    fetch(`https://localhost:44345/api/Users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
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
            document.getElementById('RoleId').value = data.Role.Name;
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
    fetch(`https://localhost:44345/api/Users/${inputValues.Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
            },
            body: JSON.stringify(inputValues)
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi cập nhật dữ liệu!");
            else {
                let modal = document.getElementById('modal');
                if(modal.classList.contains('show'))
                    modal.classList.remove('show');
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

function getImages() {
    fetch(`https://localhost:44345/api/Users/get-images`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`,
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
    let userId = id;
    let fileUploads = document.getElementById('Image').files;
    let imageList = [];
    let data = new FormData();
    for (let i = 0; i < fileUploads.length; i++) {
        data.append(fileUploads[i].name, fileUploads[i]);
    }

    fetch(`https://localhost:44345/api/Uploads/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`,
            },
            body: data
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Có lỗi xảy ra khi lưu hình ảnh!");
            return res.json();
        })
        .then(function(data) {
            alert("upload success " + data);
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
    fetch(`https://localhost:44345/api/Users/${userId}/save-images`, {
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
            alert("save success " + data);
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

function pagination(filter) {

    fetch('https://localhost:44345/api/Users/pagination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${check_cookie_name("accessToken")}`
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

function SubmitData() {
    let id = document.getElementById('Id');
    if (id.value != '' && id.value != undefined) {
        updateData();
    } else {
        createData();
    }
}

function resetForm() {
    let formDataInput = document.querySelectorAll(`#formUser input`);
    let formDataSelect = document.querySelectorAll(`#formUser select`);
    formDataInput.forEach(function(item, i) {
        item.value = '';
    });

    formDataSelect.forEach(function(item) {
        // item.options.length = 1;
        item.selectedIndex = 0;
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

function showFormCreate() {
    document.getElementById('btnCreate').addEventListener('click', function(e) {
        e.preventDefault();
        showForm();
    });
}

function loadBrandByCategory() {
    document.getElementById('CategoryId').addEventListener('change', function() {
        loadBrands(this.value);
    });
}

function showForm(id) {
    let formHeader = document.querySelector('.header-modal');
    let userName = document.getElementById('UserName');
    // showModal();
    let modal = document.getElementById('modal');
    if(!modal.classList.contains('show'))
            modal.classList.add('show');
    if (id == null && id == undefined) {
        // document.querySelector('.field-id').style.display = 'none';
        resetForm();
        userName.readOnly = false;
        document.querySelectorAll('.password').forEach(item => {
            item.style.display = null;
        });
        // formHeader.innerHTML = "Thêm mới sản phẩm"
    } else if (id != null && id != 0) {
        formHeader.innerHTML = "Cập nhật thành viên";
        // document.querySelector('.field-id').style.display = null;
        userName.readOnly = true;
        document.querySelectorAll('.password').forEach(item => {
            item.style.display = 'none';
        });
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
    // hideModal();
    showFormCreate();
}

(function contructor() {
    loadData();
    pagination(filter);
    registerEvents();
    checkLogin();
})()