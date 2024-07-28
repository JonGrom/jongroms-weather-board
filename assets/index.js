APIkey = "bf85452823f8c175453a602a3c49c748";

// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ```
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// ```



async function search(){
    let city = $("#search-input").val()
    let coordParams = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    let latLon = await getCoordinates(coordParams)
    let data = await getWeather(latLon[0].lat, latLon[0].lon)
    renderSearch(data)
}


async function getCoordinates(coordParams){
    const resp = await fetch(coordParams);
    const data = await resp.json();
    console.log(data)
    return data
};

async function getWeather(lat, lon){
    let resp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`);
    let data = await resp.json();
    console.log(data)
}

function renderSearch(data){

}
//use weather data to build page

//store search history in local storage

$(document).ready(function (){
    $('#search-btn').on('click', search)




})