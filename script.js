'use strict';


//selectors
const setDateTime = document.querySelector('.date-time');


const inputCity = document.querySelector('#search_field');


const submitCity = document.querySelector('#search_button');

const container = document.querySelector('.container')
document.querySelector('.container').style.height="90vh";
/*-----------------------------------------------*/
const locale = navigator.language;
const date = new Date();
const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
    second: 'numeric'
}
const data = new Intl.DateTimeFormat(locale, options).format(date);
setDateTime.textContent = data;
/*---------------------------------------------*/


/*---------------------------------------------*/
let cityName = undefined;
submitCity.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.container').style.height="auto";
    cityName = inputCity.value.toLowerCase();
    const toArray = cityName.split(' ');
    const lowerArray = toArray.map(function(name) {
        const [a, b] = [name[0].toUpperCase(), name.slice(1)];
        return (a + b);

    })
    const finalCityName = lowerArray.join(' ');

    //TRY TO BUILD API REQUEST
    const request = new XMLHttpRequest();
    request.open('GET', `https://api.weatherapi.com/v1/current.json?key=73027853214e4bc18f0151641212408&q=${finalCityName}&aqi=yes`);
    request.send();

    request.addEventListener('load', function() {
        if (request.status == 400)
            console.log("error");
        else {
            const dataFirst = JSON.parse(this.responseText);




            //callback hell
            const request1 = new XMLHttpRequest();
            request1.open('GET', `https://restcountries.eu/rest/v2/name/${dataFirst.location.country}?fullText=true`);

            request1.send();

            request1.addEventListener('load', function() {
                const dataSecond = JSON.parse(request1.responseText);


                displayResult(dataFirst, dataSecond);

            })
        }
    })
});

function displayResult(dataFirst, dataSecond) {
    //succesful inputs are obtained
    const name = dataFirst.location.name.toUpperCase();
    const country = dataFirst.location.country;
    let region = dataFirst.location.region;
    if (region == "")
        region = dataFirst.location.name;
    const condition = dataFirst.current.condition.text;
    const temp = dataFirst.current.temp_c
    const feelslike_c = dataFirst.current.feelslike_c;
    const precipitation = dataFirst.current.precip_mm;
    const humidity = dataFirst.current.humidity;
    const [wind_dir, wind_speed] = [dataFirst.current.wind_dir, dataFirst.current.wind_kph];
    const [visib, uv] = [dataFirst.current.vis_km, Number(dataFirst.current.uv)];
    let day = dataFirst.current.is_day;
    if (day == 0)
        day = "Night 🌃";
    else
        day = "Day 🌄";
    let uvIndex = undefined;
    if (uv < 1)
        uvIndex = "Very Low";
    else if (uv >= 1 && uv <= 2)
        uvIndex = "Low";
    else if (uv > 2 && uv <= 3)
        uvIndex = "Average";
    else if (uv > 3 && uv <= 5)
        uvIndex = "Moderate";
    else if (uv > 5 && uv <= 7)
        uvIndex = "High";
    else if (uv > 7 && uv <= 10)
        uvIndex = "High";
    else
        uvIndex = "Extreme";


    const htmltoPut =
        `<div class="result-outer">
                <div class="town">${name}</div>
                <div class="country__region">
                    <div class="country col-1-of-2">${country}&emsp;</div>
                    <div class="region col-1-of-2">&nbsp;${region}</div>
                </div>
                <div class="condition">${condition}</div>
                <div class="temp">Temperature: ${temp} °C</div>
                <div class="feels-like">Feels Like: ${feelslike_c} °C</div>
                <div class="precipitation">🌧️:&emsp;${precipitation} mm</div>
                <div class="humidity">Humidity:&emsp;${humidity}%</div>
                <div class="wind">🌬️:&emsp;${wind_dir}  ${wind_speed} kph</div>
                <div class="visib">Visibility:&emsp;${visib}km</div>
                <div class="uv">UV: ${uvIndex}</div>
                <div class="livesIn">City in ${day}</div>
             </div>`;
    container.innerHTML = "";
    container.insertAdjacentHTML("beforeend", htmltoPut);
    setTimeout(function() {
        inputCity.value = "";
    }, 1000);

    //second JSON will be used in upcomig version
}