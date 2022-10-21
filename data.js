// all things related to retriving data with axios
// goes here
const API_BASE_URL = "https://developer.nps.gov/api/v1/";
const API_KEY = "a9cQTv8P7L1oKzHLwGQ3aZe82umGBfhcbiowErxT";

const headers = {
    "accept": "application/json", // tells the API server that the format of the data we are sending is JSON
}

async function main() {
        let response = await axios.get(API_BASE_URL + "parks", {
            "params": {
            "stateCode": "AZ",
            "q": "grand canyon",
            "limit": 50,
             "api_key": API_KEY
            }
        } );
        console.log(response.data);
}

main();