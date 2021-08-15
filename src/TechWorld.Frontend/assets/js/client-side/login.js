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
                    throw Error("Đăng nhập thất bại!");
                return response.json();
            })
            .then(function(data) {
                createCookie("accessToken", data.token, data.expiration);
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