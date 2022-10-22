// Use DOMContentLoaded as our main entry point
window.addEventListener("DOMContentLoaded", async function () {

    // this function is to setup the application
    function init() {
        let map = initMap();

        let searchResultLayer = L.layerGroup();
        searchResultLayer.addTo(map);

        document.querySelector("#btnSearch").addEventListener("click", async function () {
            
            searchResultLayer.clearLayers();
            let searchTerms = document.querySelector("#searchTerms").value;
            let boundaries = map.getBounds();
            let center = boundaries.getCenter();
            let searchResults = await search("AZ", searchTerms, 50);

            let searchResultElement = document.querySelector("#results");

            for (let r of searchResults.data) {
                //display marker
                let lat = r.latitude;
                let lng = r.longitude;
                console.log(lat, lng);
                let marker = L.marker([lat, lng]).addTo(searchResultLayer);
                marker.bindPopup(`<h1>${r.fullName}</h1>`)

                // add to the search results
                let resultElement = document.createElement("div");
                resultElement.innerText = r.fullName;

                searchResultElement.appendChild(resultElement);

            }
        });
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
