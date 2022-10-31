// Use DOMContentLoaded as our main entry point
window.addEventListener("DOMContentLoaded", async function () {

    // this function is to setup the application
    function init() {
        let map = initMap();

        // let searchResultLayer = L.layerGroup();
        // searchResultLayer.addTo(map);
        let markerClusterLayer = L.markerClusterGroup(); // <-- only available because we included the marker cluster JS file
        markerClusterLayer.addTo(map);
        // mobile first 
        // document.querySelector("#btnToggleSearch").addEventListener("click", function () {
        //     let searchContainerElement = document.querySelector("#search-container");
        //     let currentDisplay = searchContainerElement.style.display;
        //     if (!currentDisplay || currentDisplay == 'none') {
        //         searchContainerElement.style.display = "block";
        //     } else {
        //         searchContainerElement.style.display = "none";
        //     }
        // });

        document.querySelector("#btnSearch").addEventListener("click", async function () {

            markerClusterLayer.clearLayers(); // previous results gets deleted
            let query = document.querySelector("#searchTerms").value;
            let stateCode = document.querySelector("#states-dropdown").value;
            let searchResults = await searchParks(stateCode, query);

            let searchResultElement = document.querySelector("#results");

            for (let r of searchResults.data) {
                //display marker
                let lat = r.latitude;
                let lng = r.longitude;
                console.log(lat, lng);
                const parkIcon = L.divIcon({
                    html: '<i class="fa-solid fa-tree"></i>',
                    iconSize: [20,20],
                    iconAnchor: [22, 94], 
                    className: 'parkIcon'
                });
                let marker = L.marker([lat, lng], { icon: parkIcon }).addTo(markerClusterLayer);
                marker.bindPopup(`<h1>${r.fullName}</h1>`);

                // add to the search results
                let resultElement = document.createElement("div");
                resultElement.innerText = r.fullName;
                resultElement.classList.add("search-result");

                // flys and shows the name of the park
                resultElement.addEventListener("click", function () {
                    map.flyTo([lat, lng], 16);
                    marker.openPopup();
                })
                
                searchResultElement.appendChild(resultElement);

            }
        });

        // for displaying the names of the states
        (async function searchStates() {
            let stateOptionValues = await axios.get("us-states.json"); // let response = await axios.get("us-states.json");
            let features = stateOptionValues.data.features; // let data = response.data;

            let stateCodes = [];
            let stateNames = [];
            for (each of features) {
                let stateCode = each.id;
                stateCodes.push(stateCode);

                let stateName = each.properties.name;
                stateNames.push(stateName);
            }

            let selectElement = document.getElementById("states-dropdown");
            for (let i = 0; i < stateNames.length; i++) {
                let opt = stateNames[i];
                let stateOptions = document.createElement("option");
                stateOptions.text = opt;
                stateOptions.value = stateCodes[i];
                selectElement.appendChild(stateOptions);
            }
            let stateCode = document.querySelector("#states-dropdown").value;
        })();

        // create a button for campgrounds
        let campgroundsElement = document.querySelector("#campgrounds");
        campgroundsElement.addEventListener("click", async function () {
            // alert("hi");
            let selectedCampgrounds = "";
            let stateCode = document.querySelector("#states-dropdown").value;
            let usCampgrounds = await searchCampgrounds(stateCode);
            for (let c of usCampgrounds.data) {
                //display campground icon
                let lat = c.latitude;
                let lng = c.longitude;
                console.log(lat, lng);
                const campgroundsIcon = L.divIcon({
                    html: '<i class="fa-solid fa-campground"></i>',
                    iconSize: [20,20],
                    iconAnchor: [22, 94], 
                    className: 'campgroundsIcon'
                });
                L.marker([lat, lng], { icon: campgroundsIcon }).addTo(markerClusterLayer).bindPopup(`<h1>${c.name}<h1>`);
            }
        })
        // create a radio button for parkinglots

        let radioParkinglotsElement = document.querySelector("#parkinglots");
        radioParkinglotsElement.addEventListener("click", async function () {
            let selectedParkinglots = "";
            let stateCode = document.querySelector("#states-dropdown").value;
            let usParkinglots = await searchParkinglots(stateCode);
            for (let p of usParkinglots.data) {
                // display parkinglots icon
                let lat = p.latitude;
                let lng = p.longitude;
                console.log(lat, lng);
                const carparkIcon = L.divIcon({
                    html: '<i class="fa-solid fa-square-parking"></i>',
                    iconSize: [20,20],
                    iconAnchor: [22, 94],
                    className: 'carparkIcon'
                });
                L.marker([lat, lng], { icon: carparkIcon }).addTo(markerClusterLayer).bindPopup(`<h1>${p.name}<h1><h3>${p.description}<h3>`);
            }
        })

        // adding foursquare to search for supermarkets to buy essentials before going campsites
        let checkbox = document.querySelector("#supermarketsCheck");
        checkbox.addEventListener('click', async function () {
            // console.log(response.data);
            // console.dir(checkbox);
            if (checkbox.checked){
                let boundaries = map.getBounds();
                let center = boundaries.getCenter();
                let latlng = center.lat + "," + center.lng;
                let supermarketsResults = await search(latlng);
                for (let each of supermarketsResults.results) {
                    // console.log(each);
                    let lat = each.geocodes.main.latitude;
                    let lng = each.geocodes.main.longitude;
                    const supermarketIcon = L.divIcon({
                        html: '<i class="fa-solid fa-bag-shopping"></i>',
                        iconSize: [20,20],
                        iconAnchor: [22, 94], 
                        className: 'supermarketIcon'
                    });
                    // let redIcon = L.icon({
                    //     iconUrl: ,
                    //     iconSize: [38, 95], // size of the icon
                    //     iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                    // });
                    L.marker([lat, lng], { icon: supermarketIcon }).addTo(markerClusterLayer).bindPopup(`<h1>${each.name}<h1>`);
            }
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
    L.geoJson(statesData).addTo(map);

    return map; //return map as result of the function
}


