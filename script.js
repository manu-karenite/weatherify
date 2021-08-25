'use strict';


//selectors
const setDateTime = document.querySelector('.date-time');


const inputCity = document.querySelector('#search_field');


const submitCity = document.querySelector('#search_button');

/*-----------------------------------------------*/
const locale = navigator.language;
const date = new Date();
const options = 
{
    day : 'numeric',
    month : 'long',
    year : 'numeric',
    hour : 'numeric',
    minute : 'numeric',
    weekday : 'long',
    second : 'numeric'
}
const data = new Intl.DateTimeFormat(locale,options).format(date);
setDateTime.textContent=data;
/*---------------------------------------------*/


/*---------------------------------------------*/
let cityName = undefined;
submitCity.addEventListener('click',function(e)
{
    e.preventDefault();

    cityName=inputCity.value.toLowerCase(); 
    const toArray = cityName.split(' ');
    const lowerArray = toArray.map(function(name)
    {
        const [a,b]=[name[0].toUpperCase() ,name.slice(1)];
        return (a+b);

    })
    const finalCityName=  lowerArray.join(' ');

    //TRY TO BUILD API REQUEST
    const request = new XMLHttpRequest();
    request.open('GET',`https://api.weatherapi.com/v1/current.json?key=73027853214e4bc18f0151641212408&q=${finalCityName}&aqi=yes`);
    request.send();

    request.addEventListener('load',function()
    {
        if(request.status==400)
            console.log("error");
        else
        {
        const data= JSON.parse(this.responseText);
        
        console.log(data);

        

        //callback hell
        const request1 = new XMLHttpRequest();
        request1.open('GET',`https://restcountries.eu/rest/v2/name/${data.location.country}?fullText=true`);
        request1.send();

        request1.addEventListener('load',function()
        {
            const data = JSON.parse(request1.responseText);
            console.log(data);
            
        })
    }})

    
    
    
    
 
});



