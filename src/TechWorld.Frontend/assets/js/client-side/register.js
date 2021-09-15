let registerData = {
    Username: null,
    Password: null,
    Email: null,
    FullName: null,
    Phone: null
}

function register(username, password, email, fullName, phone) {
    registerData.Username = username;
    registerData.Password = password;
    registerData.Email = email
    registerData.FullName = fullName;
    registerData.Phone = phone;

    try {
        fetch('https://localhost:44345/api/Auth/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            })
            .then(function(response) {
                if (response.ok){
                    toast({
                        title: 'Thành công',
                        message: "Đăng ký thành công",
                        type: 'success'
                    });
                    return response.json();
                }
                else if(response.status == 400){
                    toast({
                        title: 'Thất bại',
                        message: "Tên đăng nhập không đúng",
                        type: 'error'
                    });
                }
            })
            .then(function(data) {
                
                // createCookie("accessToken", data.token, new Date(data.expiration).getDate() - new Date().getDate());
                window.location.href = "/login.html";
            })
    } catch (error) {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    }

}

document.getElementById('btnRegister').addEventListener('click', function(e) {
    e.preventDefault();
    let username = document.getElementById('Username').value;
    let password = document.getElementById('Password').value;
    let email = document.getElementById('Email').value;
    let fullName = document.getElementById('FullName').value;
    let phone = document.getElementById('Phone').value;
    register(username, password, email, fullName, phone);
});

(function contructor() {
    // if (check_cookie_name("accessToken") != null)
    //     window.location.href = "/";
})()