// const { route } = require("../../../routes/auth-routes");

var lat
var lng
var _lat
var _lng
    // var _state
var beachMarker = []
var connection = new WebSocket('ws://localhost:34000')
    // var connection = new WebSocket('wss://pytransit.szo.me')
var array = []
var current_lat
var current_lng
var user_email
var user_name
var driver_id
var id
var info_
var score
var comment
var ratestatus
var dataCar
connection.onopen = function() {
    // จะทำงานเมื่อเชื่อมต่อสำเร็จ
    console.log('connect webSocket')
        // connection.send("Hello ESUS"); // ส่ง Data ไปที่ Server
}
connection.onerror = function(error) {
    console.error('WebSocket Error ' + error)
}

var maps
    // var position = { lat: current_lat, lng: current_lng};

function geocoderAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location)
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
            })
        } else {
            alert('Geocode was not successful for the following reason: ' + status)
        }
    })
}

function getLocation() {
    console.log('hi')
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        alert('Geolocation is not supported by this browser.')
    }
}

function showPosition(position) {
    current_lat = position.coords.latitude
    current_lng = position.coords.longitude
}

$(document).ready(function() {
    getLocation()
    setInterval(checksendrequest, 1000) //ทำทุก 1 วินาที
    $('#close').click(function() {
        $('.popup_box').css({
            opacity: '',
            'pointer-events': 'auto',
        })
    })

    $('#eiei').click(function() {
        $('.popup_box').css({
            opacity: '1',
            'pointer-events': 'auto',
        })
    })
    $('.btn1').click(function() {
        $('.popup_box').css({
            opacity: '1',
            'pointer-events': 'none',
        })
        requesttodb(1)
        checksendrequest()
    })
    $('.btn2').click(function() {
        $('.popup_box').css({
            opacity: '1',
            'pointer-events': 'none',
        })
        requesttodb(0)
        checksendrequest()
    })
    $('#Logout').click(function(e) {
        e.preventDefault()
        window.location.replace('/auth/logout')
    })

    $('#star5').click(function() {
        ratestatus = 'ปรับปรุง'
        document.getElementById('ratestatus').innerHTML = ratestatus
    })
    $('#star4').click(function() {
        ratestatus = 'พอใช้'
        document.getElementById('ratestatus').innerHTML = ratestatus
    })

    $('#star3').click(function() {
        ratestatus = 'ปานกลาง'
        document.getElementById('ratestatus').innerHTML = ratestatus
    })
    $('#star2').click(function() {
        ratestatus = 'ดี'
        document.getElementById('ratestatus').innerHTML = ratestatus
    })
    $('#star1').click(function() {
        ratestatus = 'ดีมาก'
        document.getElementById('ratestatus').innerHTML = ratestatus
    })

    // var score_ = $('.fa-star').val()
    // // console.log(score_)
    $('#sendinfo').click(function() {
        score = $('.fa-star').val()
            // console.log(score)
        var point = document.getElementsByName('star')
        console.log(point)
        for (let i = 0; i < point.length; i++) {
            if (point[i].checked) {
                if (point[i].value == 5) {
                    score = 1
                    console.log(score)
                } else if (point[i].value == 1) {
                    score = 5
                    console.log(score)
                } else if (point[i].value == 2) {
                    score = 4
                    console.log(score)
                } else if (point[i].value == 4) {
                    score = 2
                    console.log(score)
                } else {
                    score = point[i].value
                    console.log(score)
                }
            }
            comment = $('.getdata').val()
        }

        $.ajax({
            type: 'POST',
            url: '/review',
            data: {
                user_email: user_email,
                user_name: user_name,
                driver_id: driver_id,
                point: score,
                report: comment,
            },
            success: function(response) {
                Swal.fire({
                    title: 'ให้คะแนนสำเร็จ✔✔✔',
                    text: 'ขอขอบคุณสำหรับความคิดเห็น',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem('requestid', response)
                        var x = document.getElementById('review')
                        var y = document.getElementById('eiei')
                        x.style.display = 'none'
                        y.style.display = 'block'
                        sessionStorage.removeItem('requestid')
                        checksendrequest()
                        window.location.reload()
                    }
                })
            },
            error: function(xhr) {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            },
        })
    })
})

function requesttodb(direction) {
    $('.popup_box').css({
        opacity: '0',
        'pointer-events': 'auto',
    })
    $.ajax({
        type: 'POST',
        url: '/request',
        data: {
            user_email: user_email,
            user_name: user_name,
            lat: current_lat,
            lng: current_lng,
            route: direction,
        },
        success: function(response) {
            Swal.fire({
                title: 'เรียกรถสำเร็จ✔✔✔',
                text: 'โปรดรอ... คนขับรถกำลังจะมารับท่าน',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes',
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem('lat', current_lat)
                    sessionStorage.setItem('lng', current_lng)
                    sessionStorage.setItem('requestid', response)
                    window.location.replace('/mapping')
                }
            })
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: xhr.responseText,
            })
        },
    })
}

function check_request() {
    $.ajax({
        type: 'POST',
        url: '/request',
        data: {
            user_email: user_email,
            user_name: user_name,
            lat: current_lat,
            lng: current_lng,
            route: direction,
        },
        success: function(response) {
            Swal.fire({
                title: 'เรียกรถสำเร็จ✔✔✔',
                text: 'โปรดรอ... คนขับรถกำลังจะมารับท่าน',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes',
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem('lat', current_lat)
                    sessionStorage.setItem('lng', current_lng)
                    sessionStorage.setItem('requestid', response)
                    window.location.replace('/mapping')
                }
            })
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: xhr.responseText,
            })
        },
    })
}

function checksendrequest() {
    var request = sessionStorage.getItem('requestid')
    if (request) {
        var x = document.getElementById('review')
        var y = document.getElementById('eiei')
        x.style.display = 'none'
        y.style.display = 'none'

        $.ajax({
            type: 'POST',
            url: '/requestinfo',
            data: { requestdata: request },
            success: function(response) {
                if (response[0].res_driver) {
                    driver_id = response[0].res_driver
                    x.style.display = 'block'
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
        var x = document.getElementById('review')
        var y = document.getElementById('eiei')
        sessionStorage.removeItem('lat')
        sessionStorage.removeItem('lng')
            //setmarker()
        y.style.display = 'block'
        x.style.display = 'none'
    }
}

function getemail() {
    $.ajax({
        type: 'GET',
        url: '/verify',
        success: function(response) {
            user_email = response.email
            user_name = response.name
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: xhr.responseText,
            })
        },
    })
}

function getcarmatch() {
    $.ajax({
        type: 'GET',
        url: '/carmatch',
        success: function(response) {
            dataCar = response
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: xhr.responseText,
            })
        },
    })
    return dataCar
}

// This example creates a 2-pixel-wide red polyline showing the path of
// the first trans-Pacific flight between Oakland, CA, and Brisbane,
// Australia which was made by Charles Kingsford Smith.

function initMap() {
    getcarmatch()

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
    })
    const map = new google.maps.Map(document.getElementById('map'), {})

    directionsRenderer.setMap(map)
    calculateAndDisplayRoute(directionsService, directionsRenderer)
    var greeen = '/image/carGreen.png'
    var yelow = '/image/carYelow.png'
    var blue = '/image/carBlue.png'
    var red = '/image/carRed.png'
        // beachMarker = new google.maps.Marker({
        //     position: (lat, lng),
        //     map: map,
        //     icon: image,
        //     id: 1
        // });

    //console.log(dataCar)
    var myMarkers = new Array()
    $.ajax({
        type: 'GET',
        url: '/carmatch',
        success: function(response) {
            for (let index = 0; index < response.length; index++) {
                myMarkers[index] = addMarker(
                    map,
                    response[index].info,
                    response[index].type,
                )
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: xhr.responseText,
            })
        },
    })

    function addMarker(map, info, type) {
        //create the markers
        const infowindow = new google.maps.InfoWindow({
            content: info,
        })
        if (type == 1) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: greeen,
            })
        } else if (type == 2) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: blue,
            })
        } else if (type == 3) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: yelow,
            })
        } else {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: red,
            })
        }

        marker.addListener('click', () => {
            infowindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            })
        })
        return marker
    }

    connection.onmessage = function(e) {
        var obj = JSON.parse(e.data)
        console.log(obj.topic)
            //ty(map, array)
        var index = dataCar.findIndex(
                (std) => JSON.stringify(std.driver_id) === obj.topic,
            )
            //console.log(index)
        var latlng = new google.maps.LatLng(obj.lat, obj.lng)
        myMarkers[index].setPosition(latlng)
        if (obj.status == '0') {
            myMarkers[index].setPosition(lat, lng)
        }
    }

    infoWindow = new google.maps.InfoWindow()

    const locationButton = document.createElement('button')

    locationButton.classList.add('custom-map-control-button')
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton)
        // addEventListener("click", () => {
    if (sessionStorage.getItem('lat') && sessionStorage.getItem('lng')) {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                    myMarker = new google.maps.Marker({
                            position: pos,
                            map: map,
                        })
                        // infoWindow.setPosition(pos);
                        // infoWindow.setContent("Location found.");
                        // infoWindow.open(map);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter())
                },
            )
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter())
        }
    }
    // });
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos)
        infoWindow.setContent(
            browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            "Error: Your browser doesn't support geolocation.",
        )
        infoWindow.open(map)
    }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var waypts = []

    stop = new google.maps.LatLng(19.161438, 99.913639)
    waypts.push({
        location: stop,
        stopover: true,
    })
    stop = new google.maps.LatLng(19.168859, 99.903858)
    waypts.push({
        location: stop,
        stopover: true,
    })
    stop = new google.maps.LatLng(19.172269, 99.898099)
    waypts.push({
        location: stop,
        stopover: true,
    })
    stop = new google.maps.LatLng(19.170169, 99.897192)
    waypts.push({
        location: stop,
        stopover: true,
    })

    directionsService
        .route({
            origin: '19.030976, 99.926385',
            destination: '19.030976, 99.926385',
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypts,
        })
        .then((response) => {
            directionsRenderer.setDirections(response)
        })
        .catch((e) => window.alert('Directions request failed due to ' + status))
}