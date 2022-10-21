// all things related to retriving data with axios
// goes here
const API_BASE_URL = "https://developer.nps.gov/api/v1/";
const API_KEY = "a9cQTv8P7L1oKzHLwGQ3aZe82umGBfhcbiowErxT";

async function search(stateCode, query, limit){
    let response = await axios.get(API_BASE_URL + "parks", {
        "params": {
            "stateCode": stateCode,
            "q": query,
            "limit": limit,
            "api_key": API_KEY
        }
    });
    return response.data;
}
