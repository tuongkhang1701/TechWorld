function changePassword(){
    let currentPass = document.getElementById('CurrentPassword').value;
    let newPass = document.getElementById('NewPassword').value;
let a = check_cookie_name("accessToken");
    fetch("https://localhost:44345/api/Users/change-password", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${check_cookie_name("accessToken")}`
                    },
                    body: JSON.stringify({
                        CurrentPassword: currentPass,
                        NewPassword: newPass
                    })
                })
                .then(function(res) {
                    if(res.ok)
                        toast({
                            title: 'Thành công',
                            message: "Đổi mật khẩu thành công",
                            type: 'success'
                        });
                })
                .catch((error) => {
                    toast({
                        title: 'Error',
                        message: error,
                        type: 'error'
                    });
                })
            }