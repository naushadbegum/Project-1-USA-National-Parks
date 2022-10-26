// all things related to retriving data with axios
// goes here
const API_BASE_URL = "https://developer.nps.gov/api/v1/";
const API_KEY = "a9cQTv8P7L1oKzHLwGQ3aZe82umGBfhcbiowErxT";

async function searchParks(query, stateCode=""){
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
// async function searchCampgrounds(query, stateCode=""){
//     let response = await axios.get(API_BASE_URL + "campgrounds", {
//         "params": {
//             "stateCode": stateCode,
//             "q": query,
//             "limit": 1000,
//             "api_key": API_KEY
//         }
//     });
//     response.data
// }

