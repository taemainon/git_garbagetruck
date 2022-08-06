$(document).ready(function() {
    var datapoint = [{
        y: 0,
        label: "มกราคม"
    }, {
        y: 0,
        label: "กุมภาพันธ์"
    }, {
        y: 0,
        label: "มีนาคม"
    }, {
        y: 0,
        label: "เมษายน"
    }, {
        y: 0,
        label: "พฤษภาคม"
    }, {
        y: 0,
        label: "มิถุนายน"
    }, {
        y: 0,
        label: "กฤกฏาคม"
    }, {
        y: 0,
        label: "สิงหาคม"
    }, {
        y: 0,
        label: "กันยายน"
    }, {
        y: 0,
        label: "ตุลาคม"
    }, {
        y: 0,
        label: "พฤษจิกายน"
    }, {
        y: 0,
        label: "ธันวาคม"
    }, ]



    $.ajax({
        type: "GET",
        url: "/graph_reqdata",
        success: function(response) {
            var j = 0
            for (var i = 1; i <= 12; i++) {

                if (i == response[j]._month) {

                    datapoint[i - 1].y = response[j].num;
                    //alert('เพิ่ม :' + response[j].num)

                    // alert('เดือน' + i + 'ค่า' + response[j].num)
                    datapoint[i].y = response[j].num;
                    if (j == response.length - 1) {
                        j = response.length - 1

                    } else {
                        j++
                    }
                } else {
                    // datapoint.y.push(response[j].num)
                    //  alert(i)
                    // alert('เดือน' + i + 'ค่า 0')
                    datapoint[i - 1].y = 0;
                }
            }

            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title: {
                    text: "สถิติเรียกรถ(รายเดือน)"
                },
                axisY: {
                    title: "จำนวนการเรียกรถ(ครั้ง)"
                },
                data: [{
                    type: "column",
                    dataPoints: datapoint,
                }]
            });
            chart.render();
        }
    });


});