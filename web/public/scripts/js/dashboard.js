// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map, heatmap;
var getlocale = []
var current_lat;
var current_lng;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 19.02502397770961, lng: 99.94342031550569 },
        mapTypeId: "satellite",
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map,
    });
    //   document
    //   .getElementById("toggle-heatmap")
    //   .addEventListener("click", toggleHeatmap);
    // document
    //   .getElementById("change-gradient")
    //   .addEventListener("click", changeGradient);
    // document
    //   .getElementById("change-opacity")
    //   .addEventListener("click", changeOpacity);
    // document
    //   .getElementById("change-radius")
    //   .addEventListener("click", changeRadius);
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    const gradient = [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)",
    ];
    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
    heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
    heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
    return getlocale;
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/showrequest",
        success: function(response) {
            for (let i = 0; i < response.length; i++) {
                getlocale.push(new google.maps.LatLng(response[i].lat, response[i].lng))
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: "error",
                title: xhr.responseText,
            });
        }
    });
})