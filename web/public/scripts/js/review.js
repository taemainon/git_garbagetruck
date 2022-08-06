$(document).ready(function() {
    const btn = document.querySelector("button");
    const post = document.querySelector(".post");
    const widget = document.querySelector(".rating");
    const editBtn = document.querySelector(".edit");
    btn.onclick = () => {
        widget.style.display = "none";
        post.style.display = "block";
        editBtn.onclick = () => {
            widget.style.display = "block";
            post.style.display = "none";

        }

        var data = $('.getdata').val();
        var driver_id = 7;
        var user_email = "pipat@getemail.com";
        var point = document.getElementsByName('star');
        var score
            // for (let i = 0; i < point.length; i++) {
            //   if (point[i].checked) {
            //     score = point[i].value
            //   }
            //   alert(score)

        // }
        $.ajax({
            type: "POST",
            url: "/review",
            data: { driver_id: driver_id, user_email: user_email, point: point },
            success: function(response) {
                Swal.fire({
                    title: 'Add score success',
                    text: "Thank you for rating us",
                    icon: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace('/mapping')
                    }
                })
            },
            error: function(xhr) {
                Swal.fire({
                    icon: "error",
                    title: xhr.responseText,
                });
            }
        });

    }
})