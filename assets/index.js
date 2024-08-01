//Declare API key and get search histroy from local storage
const APIkey = "bf85452823f8c175453a602a3c49c748";
let searchHistory = JSON.parse(localStorage.getItem("searches"));
// localStorage.clear()

// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ```
// THEN I am presented with an icon representation of weather conditionsd
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// ```

function search(){
    //Check for previous invalid response
    if ($('#invalid')){
        $('#invalid').remove()
    }

    //define city
    let city = $("#search-input").val()

    //makeCalls
    apiCalls(city)

}

function historySearch(event){
    let city = event.target.dataset.city
    console.log(event.target)
    console.log(city)
    apiCalls(city)
}

//Call OpenWeatherMap's API to get coordinates, current weather, and a 5-day forecast
async function apiCalls(city){
    //Get coorinates from city name
    let coordParams = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    let latLon = await getCoordinates(coordParams)
    console.log(latLon)
    //Check Validity

    if(!latLon[0] || !latLon[0].lat){
        $('#search-area').append($('<p id="invalid">').addClass('text-danger').text('Invalid City Name!'))
    } else {

        //Do not repeat searches in histroy
        searchHistory = searchHistory.filter( (value) => { 
            return value !== city })

        //Update Local Storage
        searchHistory.push(city)
        searchHistory.sort()
        localStorage.setItem('searches', JSON.stringify(searchHistory))

        //Get forescasts from coordinates
        let weather = await getWeather(latLon[0].lat, latLon[0].lon)
        let forecasts = await getForecasts(latLon[0].lat, latLon[0].lon)
        renderForecast(city, weather, forecasts)
        renderSearches()
    }
}


async function getCoordinates(coordParams){
    const resp = await fetch(coordParams);
    const data = await resp.json();
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

function renderForecast(city, weather, forecasts){
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
    .append($(`<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">`))
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
            .addClass('bg-primary p-4')
            .append($('<h5>')
                .addClass('text-white')
                .text(`${dayjs(forecasts[i].dt_txt).format('M/D/YYYY')}`)
            )
            .append($(`<img src="https://openweathermap.org/img/wn/${forecasts[i].weather[0].icon}@2x.png">`))
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
        );
    };
}

function renderSearches(){

    $('#search-history').html("")
    searchHistory.forEach( (city) => {
        $('#search-history')
        .append($('<button>')
            .addClass('btn-secondary mb-3 rounded p-1')
            .text(city)
            .attr('data-city', city)
            .on('click', historySearch)
        )
    })
}

$(document).ready(function (){
    if (searchHistory){
        renderSearches()
    } else {
        searchHistory = []
    }

    $('#search-btn').on('click', search)
})