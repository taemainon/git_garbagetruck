$(document).ready(function () {
    var mode = "";
    var weight = 0;
    var label = []

    // var label = ['รถขยะมูลฝอยอินทรีย์', 'รถขยะมูลฝอยทั่วไป ์', 'รถขยะมูลฝอยนำกลับมาใช้ใหม', ' รถขยะมูลฝอยที่เป็นพิษ หรืออันตรายจากชุมชน']
    var data1 = []
    var data2 = []
    var data3 = []
    var data4 = []


    $.ajax({
        type: "GET",
        url: "/weight",
        success: function (response) {
            var j = 0;
            type = [];
            weight = [];
            var startDate = new Date().setHours(0,0,0,0);
            var endDate = new Date().setHours(0,0,0,0);

            for (let i = 0; i < response.length; i++) {
                const e = response[i];
                let newDate = new Date(e['date']);
                newDate.setHours(0,0,0,0)
                if(i == 0) {
                    endDate = newDate
                    startDate = newDate
                }
                if(newDate > endDate) {
                    endDate = newDate
                }
                if(newDate < startDate) {
                    startDate = newDate
                }
            }
            for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                var date =  new Date(d);
                label.push( ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' +  date.getFullYear() );
                
                var trash1 = 0;
                var trash2 = 0;
                var trash3 = 0;
                var trash4 = 0;

                for (let i = 0; i < response.length; i++) {
                    const e = response[i];
                    let newDate = new Date(e['date']);
                    newDate.setHours(0,0,0,0)
                    if(date.getDay() == newDate.getDay() && date.getMonth() == newDate.getMonth() && date.getFullYear() == newDate.getFullYear()) {
                        switch (e['type']) {
                            case 1:
                                trash1 += e['SUM(a.weight)']
                                break;
                            case 2:
                                trash2 += e['SUM(a.weight)']
                                break;
                            case 3:
                                trash3 += e['SUM(a.weight)']
                                break;
                            case 4:
                                trash4 += e['SUM(a.weight)']
                                break;
                            default:
                                break;
                        }
                    }
                }

                data1.push(trash1);
                data2.push(trash2);
                data3.push(trash3);
                data4.push(trash4);

            }

            new Chart(document.getElementById("line-chart"), {
                type: 'line',
                data: {
                    labels: label,
                    datasets: [{
                        data: data1,
                        // data: [1],

                        label: "รถขยะมูลฝอยอินทรีย์",
                        borderColor: "#3e95cd",
                        labelColor: "#fff",
                        fill: false,
                        hoverBackgroundColor: "rgba(222,105,90,0.8)",
                        hoverBorderColor: "DodgerBlue",
                    },
                    {
                        data: data2,

                
                        label: "รถขยะมูลฝอยทั่วไป",
                        borderColor: "#440004",
                        labelColor: "#fff",
                        fill: false,
                        hoverBackgroundColor: "rgba(242,105,90,0.8)",
                        hoverBorderColor: "Gray",
                    },
                    {
                        data: data3,

                        label: "รถขยะมูลฝอยนำกลับมาใช้ใหม่",
                        borderColor: "#58d310",
                        labelColor: "#fff",
                        fill: false,
                        hoverBackgroundColor: "rgba(222,105,90,0.8)",
                        hoverBorderColor: "MediumSeaGreen",
                    },
                    {
                        data: data4,

                        label: "รถขยะมูลฝอยที่เป็นพิษ หรืออันตรายจากชุมชน",
                        borderColor: "#ee000e",
                        labelColor: "#fff",
                        fill: false,
                        hoverBackgroundColor: "rgba(212,105,90,0.8)",
                        hoverBorderColor: "LightGray",
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'สถิติการเก็บขยะของรถแต่ละประเภท(หน่วย:กิโลกรัม)',
                        fontColor: "#FFF",
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "white",
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "white",
                            }
                        }]
                    }
                }
            });
            Chart.render();
        },
    });
});