$(document).ready(function() {
    $('#btnregister').click(function() {
        window.location.href = '/register'
    })
    $('#welcomebtn').click(function() {
        window.location.href = '/auth/homepage'
    })
    $('#adminloginpage').click(function() {
        window.location.href = '/login'
    })
    $('#backwelcomepage').click(function() {
        window.location.href = '/'
    })
    $('#login').click(function() {
        var username = document.getElementById('admin-username').value
        var password = document.getElementById('admin-password').value

        $.ajax({
            type: 'POST',
            url: '/loginadmin',
            data: { username: username, password: password },
            success: function(response) {
                if (response === 'success') {
                    window.location.href = '/newadminse'
                } else {
                    document.getElementById('check-login').innerHTML =
                        'username หรือ password ไม่ถูกต้อง'
                }
                //check response ก่อนว่า succes or fail  แล้วค่อย redirect
            },
            error: function(xhr) {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            },
        })
    })
    $('#backhomepage').click(function() {
        window.location.href = '/'
    })

    $('#btn-forgotpwd').click(function() {
        window.location.href = '/forgotpassword'
    })

    $('#forgotpwd').click(function() {
        var username = document.getElementById('admin-newusername').value
        var idcard = document.getElementById('admin-idcard').value
        var newpassword = document.getElementById('admin-newpassword').value
        var confirmnewpassword = document.getElementById('admin-confirmnewpassword')
            .value

        console.log(username + idcard + newpassword + confirmnewpassword)
        if (newpassword == confirmnewpassword) {
            if (username && idcard) {
                $.ajax({
                    type: 'PUT',
                    url: '/forgotpwd',
                    data: {
                        idcard: idcard,
                        username: username,
                        newpassword: newpassword,
                    },
                    success: function(response) {
                        if (response == 'success') {
                            alert('เปลี่ยนรหัสผ่านสำเร็จ')
                            window.location.href = '/login'
                        } else {
                            document.getElementById('status-forgotpwd').innerHTML =
                                'username หรือ รหัสประจำตัวประชาชนไม่ถูกต้อง'
                        }
                    },
                    error: function(xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: xhr.responseText,
                        })
                    },
                })
            } else {
                document.getElementById('status-forgotpwd').innerHTML =
                    'username หรือ รหัสประจำตัวประชาชนไม่ถูกต้อง'
            }
        } else {
            document.getElementById('status-forgotpwd').innerHTML =
                'รหัสผ่านไม่ตรงกัน'
        }
    })

    //     const signUpButton = document.getElementById('signUp');
    // const signInButton = document.getElementById('signIn');
    // const container = document.getElementById('container');

    // signUpButton.addEventListener('click', () => {
    // 	container.classList.add("right-panel-active");
    // });

    // signInButton.addEventListener('click', () => {
    // 	container.classList.remove("right-panel-active");
    // });
})