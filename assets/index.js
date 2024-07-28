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
    let weather = await getWeather(latLon[0].lat, latLon[0].lon)
    let forecasts = await getForecasts(latLon[0].lat, latLon[0].lon)
    renderSearch(city, weather, forecasts)
}


async function getCoordinates(coordParams){
    const resp = await fetch(coordParams);
    const data = await resp.json();
    console.log(data)
    return data
};

async function getWeather(lat, lon){
    let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`);
    let weather = await resp.json();
    console.log(weather)
    return weather
}

async function getForecasts(lat, lon){
    let resp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`);
    let data = await resp.json();
    let forecasts = data.list.filter((forecast, index) => index % 8 === 0)
    console.log(forecasts)
    return forecasts
}

function renderSearch(city, weather, forecasts){
    console.log (forecasts)

    //Revert html
    $('#current').html("")
    $('#five-day-forecast').html("")
    $('#five-day-title').html("")

    //Build current weather data
    const currentCard = $('#current')
    .addClass('border border-2 border-dark')
    .append($('<h2>')
        .text(`${city} (${dayjs().format('M/D/YYYY')})`)
    )
    //append icon
    .append($('<p>')
        .text(`Temp: ${weather.main.temp}°F`)
    )
    .append($('<p>')
    .text(`Wind: ${weather.wind.speed} MPH`)
    )
    .append($('<p>')
        .text(`Humidity: ${weather.main.humidity} %`)
    )
    
    //Build 5-day  forecast cards
    $('#five-day-title').text("5-Day Forecast:")

    for (i=0; i<forecasts.length; i++){
        $('#five-day-forecast')
        .append($('<div>')
            .addClass('bg-primary m-2 p-2')
            .append($('<h3>')
                .addClass('text-white')
                .text(`${dayjs(forecasts[i].dt_txt).format('M/D/YYYY')}`)
            )
            //append icon
            .append($('<p>')
                .addClass('text-white')
                .text(`Temp: ${forecasts[i].main.temp}°F`)
            )
            .append($('<p>')
                .addClass('text-white')
                .text(`Wind: ${forecasts[i].wind.speed} MPH`)
            )
            .append($('<p>')
                .addClass('text-white')
                .text(`Humidity: ${forecasts[i].main.humidity} %`)
            )
        )
    }
    


}
//use weather data to build page

//store search history in local storage

$(document).ready(function (){
    $('#search-btn').on('click', search)




})