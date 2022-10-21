// Use DOMContentLoaded as our main entry point
window.addEventListener("DOMContentLoaded", async function () {

    // this function is to setup the application
    function init() {
        let map = initMap();
    }
    init();
})

function initMap() {
    // create a map object
    let map = L.map('map');
    // set the center point and the zoom
    map.setView([39.82, -98.58], 5);

    // need set up the tile layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
    }).addTo(map);
    return map; //return map as result of the function
}
// // create marker
// let response = await axios.get("https://developer.nps.gov/api/v1/parks?limit=468&sort=&api_key=a9cQTv8P7L1oKzHLwGQ3aZe82umGBfhcbiowErxT");
// for (let each of response.data.data) {
//     let lat = each.latitude;
//     let lng = each.longitude;
//     let marker = L.marker([lat, lng]);
//     marker.addTo(map)
// }
// let searchBtn = document.querySelector("#btnSearch");
// searchBtn.addEventListener("click", async function () {
//     // alert("click me");
// })