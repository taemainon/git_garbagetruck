$(document).ready(function () {
    var mode = "";
    var carmatch = 0;
    var label = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    var data = []

    $.ajax({
        type: "GET",
        url: "/graph_carmatch",
        success: function (response) {
            var j = 0
            for (var i = 1; i <= 12; i++) {
                if (i == response[j]._month) {
                    data.push(response[j].num)
                    if (j == response.length - 1) {
                        j = response.length - 1
                    } else {
                        j++
                    }
                } else {
                    data.push(0)
                }
            }
            // alert(response[0].num)
            // window.location.replace(response);
            new Chart(document.getElementById("line-chart"), {
                type: 'line',
                data: {
                    labels: label,
                    datasets: [{
                        data: data,
                        label: "จำนวนคน",
                        borderColor: "#3e95cd",
                        labelColor: "#fff",
                        fill: false,
                        hoverBackgroundColor: "rgba(232,105,90,0.8)",
                        hoverBorderColor: "orange",
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'จำนวนการจับคู่รายเดือน',
                        fontColor: "#FFF",
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "white",
                                // fontSize: 18,
                                // stepSize: 1,


                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "white",
                                // fontSize: 14,
                                // stepSize: 1,

                            }
                        }]
                    }
                }
            });
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: xhr.responseText,
            });
        }
    });



    $(".closes").click(function () {
        $("#exampleModal").modal("toggle");
    })

    $(".close2").click(function () {
        $("#exampleModal2").modal("toggle");
    })

    $(".btnDelete").click(function () {
        carmatch = $(this).attr("blogID");
        $("#exampleModal2").modal("toggle");
    })

    $("#btnModalSave").click(function () {
        // close modal
        $("#exampleModal").modal("toggle");

        // add       
        let data = {
            name: $("#name").val(),
            lastname: $("#lastname").val(),
            License_plate: $("#carplate").val(),
        };
        let method = "POST";
        let url = "/addcarmatch";

        // edit
        if (mode == "edit") {
            data = {
                name: $("#name").val(),
                lastname: $("#lastname").val(),
                License_plate: $("#carplate").val(),
                carmatch: carmatch
            };
            method = "PUT";
            url = "/updatecarmatch";
        }

        $.ajax({
            type: method,
            url: url,
            data: data,
            success: function (response) {
                alert("Success")
                window.location.replace(response);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: xhr.responseText,
                });
            }
        });
    });


    $("#adduser").click(function () {
        $("#btnModalSave").html("เพิ่ม")
        mode = "add";
        // change the modal title
        // change the modal title
        $("#exampleModalLabel").text("จับคู่รถ");
        // console.log(postData);
        $("#name").val('');
        $("#lastnamel").val('');
        $("#carplate").val('');
        // show modal
        $("#exampleModal").modal("toggle");

    });

    // Edit button
    $(".editbut").click(function () {
        $("#btnModalSave").html("แก้ไข")
        mode = "edit";
        // change the modal title
        $("#exampleModalLabel").text("แก้ไขการจับคู่");
        // show modal
        $("#exampleModal").modal("toggle");
        // get selected post data
        const postData = JSON.parse($(this).attr("blogData"));
        console.log(postData);
        $("#name").val(postData.name);
        $("#lastname").val(postData.lastname);
        $("#carplate").val(postData.License_plate);
        carmatch = postData.carmatch;

    });

    $("#deletekiki").click(function () {
        $.ajax({
            type: "DELETE",
            url: "/deletecarmatch",
            data: { carmatch: carmatch },
        }).done(function (data, state, xhr) {
            alert("delete success")
            window.location.replace(data)
        })
    })








    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/

                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        var array = inp.value.split(' ');
                        var _name = array[0]
                        var _last = array[1]
                        inp.value = _name
                        $("#lastname").val(_last)
                        closeAllLists();



                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up 
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
    /*An array containing all the country names in the world:*/
    var countries = [];
    $.ajax({
        type: "GET",
        url: "/namelastname",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                countries.push(response[i].name + " " + response[i].lastname)
            }
        },

        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: xhr.responseText,
            });
        }
    });



    var countries1 = [];
    $.ajax({
        type: "GET",
        url: "/license_plate",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                countries1.push(response[i].License_plate)

            }

        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: xhr.responseText,
            });
        }
    });
    autocompletes(document.getElementById("carplate"), countries1);

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("name"), countries);








    function autocompletes(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            console.log(arr)
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/

                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        $("#carplate").val(inp.value)
                        closeAllLists();



                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up 
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
    /*An array containing all the country names in the world:*/

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/



});