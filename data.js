// all things related to retriving data with axios
// goes here
const API_BASE_URL = "https://developer.nps.gov/api/v1/";
const API_KEY = "a9cQTv8P7L1oKzHLwGQ3aZe82umGBfhcbiowErxT";

async function searchParks(stateCode, query=""){
    let response = await axios.get(API_BASE_URL + "parks", {
        "params": {
            "stateCode": stateCode,
            "limit": 1000,
            "q": query,
            "api_key": API_KEY
        }
    });
    return response.data;
}


async function searchCampgrounds(stateCode){
    let response = await axios.get(API_BASE_URL + "campgrounds", {
        "params": {
            "stateCode": stateCode,
            "limit": 1000,
            "api_key": API_KEY
        }
    });
    return response.data;
    console.log(response.data);
}

async function searchParkinglots(stateCode){
    let response = await axios.get(API_BASE_URL + "parkinglots", {
        "params": {
            "stateCode": stateCode,
            "limit": 1000,
            "api_key": API_KEY
        }
    });
    return response.data;
    console.log(response.data);
}

const FOURSQUARE_API_BASE_URL = "https://api.foursquare.com/v3/places/";
const FOURSQUARE_API_KEY = "fsq3lGzITu/HhGgCQuJNFdxn1/uAei20lEU0p/skhYAGIEQ=";

const headers = {
    "Accept": "application/json",  
    "Authorization": FOURSQUARE_API_KEY
}

async function search(ll) {
   
    let url = FOURSQUARE_API_BASE_URL + "search";
    let response = await axios.get(url,{
        "headers": headers,
        "params":{
            "ll": ll,
            "radius": 10000, 
            "category": 17057,  
            "limit":50,
            "v": '20210903'
        }
    });

    return response.data; 
    console.log(response.data);
}


// // API-weather
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = "0678d0efe2e6677d40a9cc5e43d90249";

let exclude = 'minutely,hourly,daily,alerts';

async function weather(lat,lon) {

let url = WEATHER_API_BASE_URL + `?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
let response = await axios.get(url);

return (response.data);

};

let weatherSearch = weather(39.82, -98.58);
console.log(weatherSearch);
