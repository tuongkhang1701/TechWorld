let loginData = {
    Username: null,
    Password: null
}

function login(username, password) {
    loginData.Username = username;
    loginData.Password = password
    try {
        fetch('https://localhost:44345/api/Auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(function(response) {
                if (!response.ok)
                    toast({
                        title: 'Thất bại',
                        message: "Tên đăng nhập hoặc mật khẩu không đúng",
                        type: 'error'
                    });
                else{
                    return response.json();
                }
            })
            .then(function(data) {
                
                createCookie("accessToken", data.token, new Date(data.expiration).getDate() - new Date().getDate());
                window.location.href = "admin-side/product.html";
            })
    } catch (error) {
        toast({
            title: 'Error',
            message: error,
            type: 'error'
        });
    }

}

document.getElementById('btnLogin').addEventListener('click', function(e) {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    login(username, password);
});

(function contructor() {
    if (check_cookie_name("accessToken") != null)
        window.location.href = "/admin-side/product.html";
})()