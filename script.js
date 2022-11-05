// Use DOMContentLoaded as our main entry point
window.addEventListener("DOMContentLoaded", async function () {

    // this function is to setup the application
    function init() {
        let map = initMap();

        // let campClusterLayer = L.layerGroup();
        // campClusterLayer.addTo(map);

        let campMarkerClusterLayer = L.markerClusterGroup();
        campMarkerClusterLayer.addTo(map);

        // let parkinglotsClusterLayer = L.layerGroup();
        // parkinglotsClusterLayer.addTo(map);

        let parkinglotspMarkerClusterLayer = L.markerClusterGroup();
        parkinglotspMarkerClusterLayer.addTo(map);

        // let supermarketClusterLayer = L.layerGroup();
        // supermarketClusterLayer.addTo(map);

        let supermarketMarkerClusterLayer = L.markerClusterGroup();
        supermarketMarkerClusterLayer.addTo(map);
        
        // let amenities = L.layerGroup([campClusterLayer, parkinglotsClusterLayer, supermarketClusterLayer]);

        let osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
        })
        let baseMaps = {
            "OpenStreetMap": osm,
        };
        let overlayMaps = {
            "Campgrounds": campMarkerClusterLayer,
            "Parking Lots": parkinglotspMarkerClusterLayer,
            "Convenience Stores": supermarketMarkerClusterLayer
        };
    
        let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

        // let searchResultLayer = L.layerGroup();
        // searchResultLayer.addTo(map);
        let parksClusterLayer = L.markerClusterGroup(); // <-- only available because we included the marker cluster JS file
        parksClusterLayer.addTo(map);
        // mobile first 
        document.querySelector("#btnToggleSearch").addEventListener("click", function () {
            let searchContainerElement = document.querySelector(".tabs-container");
            let currentDisplay = searchContainerElement.style.display;
            if (!currentDisplay || currentDisplay == 'none') {
                searchContainerElement.style.display = "block";
            } else {
                searchContainerElement.style.display = "none";
            }
        });

        document.querySelector("#btnSearch").addEventListener("click", async function () {

            parksClusterLayer.clearLayers(); // previous results gets deleted
            let query = document.querySelector("#searchTerms").value;
            // alert(query);
            let stateCode = document.querySelector("#states-dropdown").value;
            let searchResults = await searchParks(stateCode, query);
// console.log(searchResults);
            let searchResultElement = document.querySelector("#results");
            searchResultElement.innerHTML = "";
            // validation
            if (query.trim() == "") {
                searchResultElement.innerHTML = "Type a park name";
            }
            else if (searchResults.data.length == 0){
                searchResultElement.innerHTML = "No such park found";
            }
            for (let r of searchResults.data) {
                //display marker
                let lat = r.latitude;
                let lng = r.longitude;
                console.log(lat, lng);
                const parkIcon = L.divIcon({
                    html: '<i class="fa-solid fa-tree"></i>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    className: 'parkIcon'
                });
                let marker = L.marker([lat, lng], { icon: parkIcon }).addTo(parksClusterLayer);
                marker.bindPopup(`<h1>${r.fullName}</h1><img class="imgIcon" src="${r.images[0].url}"/><h3 style="font-weight:bold;text-decoration:underline;">Address:</h3><h3>${r.addresses[0].line1}</h3><h3>${r.addresses[0].city}</h3><h3>${r.addresses[0].postalCode}</h3>`);

                // add to the search results
                let resultElement = document.createElement("div");
                resultElement.innerText = r.fullName;
                resultElement.classList.add("search-result");
                resultElement.classList.add("ul");
                resultElement.classList.add("li");

                // function validation(){
                //     let v = document.querySelector("#results").value;
                //     let text;
                //     if (v == ""){
                //         text = "Search results 0";
                //         return false;
                //     } 
                // }
                // doc

                // flys and shows the name of the park
                resultElement.addEventListener("click", function () {
                    map.flyTo([lat, lng], 10);
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
            let latOfStates = [];
            let lngOfStates = [];

            for (each of features) {
                let stateCode = each.id;
                stateCodes.push(stateCode);

                let stateName = each.properties.name;
                stateNames.push(stateName);

                // let latOfState = each.geometry.coordinates[0][0][0];
                // let lngOfState = each.geometry.coordinates[0][0][1];
                // latOfStates.push(latOfState);
                // lngOfStates.push(lngOfState);
            }

            let selectElement = document.getElementById("states-dropdown");
            for (let i = 0; i < stateNames.length; i++) {
                let opt = stateNames[i];
                let stateOptions = document.createElement("option");
                stateOptions.text = opt;
                stateOptions.value = stateCodes[i];
// add event listeners to stateoptions
                selectElement.appendChild(stateOptions);
            }
            let stateCode = document.querySelector("#states-dropdown").value;

        })();


        // create a radiobutton for campgrounds
        let campgroundsElement = document.querySelector("#campgroundsRadio");
        campgroundsElement.addEventListener("change", async function () {
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
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    className: 'campgroundsIcon'
                });
                L.marker([lat, lng], { icon: campgroundsIcon }).addTo(campMarkerClusterLayer).bindPopup(`<h1>${c.name}<h1><img class="imgIcon" src="${c.images[0].url}"/><h3 style="font-weight:bold;text-decoration:underline;">Address:</h3><h3>${c.addresses[0].line1}</h3><h3>${c.addresses[0].city}</h3><h3>${c.addresses[0].postalCode}</h3>`);
            }
        })
        // create a checkbox for parkinglots

        let checkboxParkinglotsElement = document.querySelector("#parkinglotsRadio");
        checkboxParkinglotsElement.addEventListener("change", async function () {
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
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    className: 'carparkIcon'
                });
                L.marker([lat, lng], { icon: carparkIcon }).addTo(parkinglotspMarkerClusterLayer).bindPopup(`<h1>${p.name}<h1><h3 style="font-weight:bold;text-decoration:underline;">Parking Information:</h3><h4>${p.description}<h4>`);
            }
        })

        
        // adding foursquare to search for supermarkets to buy essentials before going campsites
        let checkbox = document.querySelector("#convenienceStoresRadio");
        checkbox.addEventListener('change', async function () {
            // console.log(response.data);
            // console.dir(checkbox);
            if (checkbox.checked) {
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
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                        className: 'supermarketIcon'
                    });
                    // let redIcon = L.icon({
                    //     iconUrl: ,
                    //     iconSize: [38, 95], // size of the icon
                    //     iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                    // });
                    L.marker([lat, lng], { icon: supermarketIcon }).addTo(supermarketMarkerClusterLayer).bindPopup(`<h1>${each.name}<h1>`);
                }

            }
        });
    }
    init();
})



function initMap() {
    // create a map object
    //moved the zoom control to the bottomright 
    let map = L.map('map', {
        zoomControl: false
    });
    
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    // set the center point and the zoom
    map.setView([39.82, -98.58], 5);

    // need set up the tile layer
    let osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
    }).addTo(map);
    L.geoJson(statesData).addTo(map);

    function getColor(d) {
        return d > 10 ? 'FFFFFF' :
            'FFFFFF';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: '#8FDDE7',
            // dashArray: '3',
            fillOpacity: 0
        };
    }

    L.geoJson(statesData, { style: style }).addTo(map);


    return map; //return map as result of the function
}


