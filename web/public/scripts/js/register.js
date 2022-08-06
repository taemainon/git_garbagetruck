$(document).ready(function () {
    $("#submitbutton").click(function () {

        var username = $("#nameuser").val()
        var email = $("#email").val()
        var tel = $("#telnumber").val()
        $.ajax({
            method: "POST",
            url: "/signUp",
            data: { username: username, email: email, tel: tel, role: 1 }
        }).done(function (data, state, xhr) {
            alert(data)
window.location.replace("/")
        })
    })

})