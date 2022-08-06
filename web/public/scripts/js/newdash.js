$(document).ready(function() {
    var datapoint = [{
        y: 0,
        label: "จันทร์"
    }, {
        y: 0,
        label: "อังคาร"
    }, {
        y: 0,
        label: "พุธ"
    }, {
        y: 0,
        label: "พฤหัสบดี"
    }, {
        y: 0,
        label: "ศุกร์"
    }, {
        y: 0,
        label: "เสาร์"
    }, {
        y: 0,
        label: "อาทิตย์"
    }, ]

    var datapoint1 = [{
        y: 0,
        label: "จันทร์"
    }, {
        y: 0,
        label: "อังคาร"
    }, {
        y: 0,
        label: "พุธ"
    }, {
        y: 0,
        label: "พฤหัสบดี"
    }, {
        y: 0,
        label: "ศุกร์"
    }, {
        y: 0,
        label: "เสาร์"
    }, {
        y: 0,
        label: "อาทิตย์"
    }, ]


    $.ajax({
        type: "GET",
        url: "/graph_reqdata_week",
        success: function(response) {
            var j = 0
            for (var i = 0; i < 7; i++) {

                if (i == response[j]._day) {

                    datapoint[i].y = response[j].num;
                    //alert('เพิ่ม :' + response[j].num)

                    // alert('เดือน' + i + 'ค่า' + response[j].num)

                    if (j == response.length - 1) {
                        j = response.length - 1

                    } else {
                        j++
                    }
                } else {
                    // datapoint.y.push(response[j].num)
                    //  alert(i)
                    // alert('เดือน' + i + 'ค่า 0')
                    datapoint[i].y = 0;
                }
            }

            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title: {
                    text: "สถิติเรียกรถประจำสัปดาห์\n(จ. - อา.)"
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


    $.ajax({
        type: "GET",
        url: "/graph_carmatch_week",
        success: function(response) {
            var j = 0
            for (var i = 0; i < 7; i++) {

                if (i == response[j].wun) {

                    datapoint1[i].y = response[j].num;
                    //alert('เพิ่ม :' + response[j].num)

                    // alert('เดือน' + i + 'ค่า' + response[j].num)

                    if (j == response.length - 1) {
                        j = response.length - 1

                    } else {
                        j++
                    }
                } else {
                    // datapoint.y.push(response[j].num)
                    //  alert(i)
                    // alert('เดือน' + i + 'ค่า 0')
                    datapoint1[i].y = 0;
                }
            }

            var chart1 = new CanvasJS.Chart("chartContainer1", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title: {
                    text: "จำนวนการจับคู่รถ\n(จ. - อา.)"
                },
                axisY: {
                    title: "จำนวน(บัญชี)"
                },
                data: [{
                    type: "column",
                    dataPoints: datapoint1,
                }]
            });
            chart1.render();
        }
    });
});