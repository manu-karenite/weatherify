'use strict';


//selectors
const setDateTime = document.querySelector('.date-time');


const inputCity = document.querySelector('#search_field');


const submitCity = document.querySelector('#search_button');

const container = document.querySelector('.container')
document.querySelector('.container').style.height="70vh";
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
    request.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${finalCityName}&appid=9e5270f632b2cb2f6fc5eab6a9b3fcdb`);
    
    request.send();

    request.addEventListener('load', function() {
        if (request.status == 400)
            console.log("error");
        else {
            const dataFirst = JSON.parse(this.responseText);




            //callback hell
            const request1 = new XMLHttpRequest();
            request1.open('GET', `https://restcountries.com/v3/alpha/${dataFirst.sys.country}`);

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
    const name = dataFirst.name.toUpperCase();
    const country = dataSecond[0].name.official;
    let region = dataSecond[0].region;
    const condition = dataFirst.weather[0].main;
    const temp = (dataFirst.main.temp*1 - 273).toFixed(2);
    const feelslike_c = (dataFirst.main.feels_like*1 - 273).toFixed(2);
    const precipitation = /*dataFirst.current.precip_mm;*/ 5;
    const humidity = dataFirst.main.humidity;
    const [wind_deg, wind_speed] = [dataFirst.wind.deg, dataFirst.wind.speed];
    const [visib, clouds] = [(((dataFirst.visibility)*1)/1000), Number(dataFirst.clouds.all)];
    const max=(dataFirst.main.temp_max*1 - 273).toFixed(2);
    const min=(dataFirst.main.temp_min*1 - 273).toFixed(2);

    const option = 
    {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        weekday: 'short',
        hour :"numeric",
        minute:"numeric",
      
    }  


    const sunrise = new Date((dataFirst.sys.sunrise*1)*1000).toLocaleDateString(navigator.language,option);
    const sunset = new Date((dataFirst.sys.sunset*1)*1000).toLocaleDateString(navigator.language,option);
    const localtime = new Date((dataFirst.dt*1)*1000).toLocaleDateString(navigator.language,option);
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
                <div class="min-max">Minimum: ${min} °C &emsp;  Maximum: ${max} °C </div>
                <div class="humidity">Humidity:&emsp;${humidity}%</div>
                <div class="wind">🌬️:&emsp;${wind_deg}&deg;  ${wind_speed} mps</div>
                <div class="visib">Visibility:&emsp;${visib}km</div>
                <div class="uv">Clouds: ${clouds}%</div>
                <div class="sunrise">Sunrise 🌅: ${sunrise}</div>
                <div class="sunset">Sunset 🌇: ${sunset}</div>
                
             </div>`;
    container.innerHTML = "";
    container.insertAdjacentHTML("beforeend", htmltoPut);
    setTimeout(function() {
        inputCity.value = "";
    }, 1000);

}
