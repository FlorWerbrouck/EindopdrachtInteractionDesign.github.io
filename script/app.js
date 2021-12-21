var htmlFlight;
var htmlTime;
var htmlDate;
var htmlRocket;

var nextLaunch;
var rocket;
var flightnr;

function getTimeRemaining(endtime){
	const total = Date.parse(endtime) - Date.parse(new Date());
	const seconds = Math.floor( (total/1000) % 60 );
	const minutes = Math.floor( (total/1000/60) % 60 );
	const hours = Math.floor( (total/(1000*60*60)) % 24 );
	const days = Math.floor( total/(1000*60*60*24) );
  
	return {
	  total,
	  days,
	  hours,
	  minutes,
	  seconds
	};
  }

const showResult = () => {

	t = getTimeRemaining(nextLaunch)

	htmlFlight.innerHTML = '<bold>Flight #:</bold> ' +  flightnr;
	htmlTime.innerHTML = t.days + ' days, ' + t.hours + ' hours, ' + t.minutes + ' minutes and ' + t.seconds + ' seconds';
	htmlDate.innerHTML = nextLaunch;
	htmlRocket.innerHTML = rocket;

	var intervalId = window.setInterval(function(){
		replaceResult()
	  }, 1000);
};

function replaceResult(){

	t = getTimeRemaining(nextLaunch)

	htmlTime.innerHTML = t.days + ' days, ' + t.hours + ' hours, ' + t.minutes + ' minutes and ' + t.seconds + ' seconds';
}

let getAPI = async () => {
	// Eerst bouwen we onze url op
	const ENDPOINT = `https://api.spacexdata.com/v4/launches/next`;
	const ENDPOINT2 = `https://api.spacexdata.com/v4/rockets/`;

	// Met de fetch API proberen we de data op te halen.
	const request = await fetch(`${ENDPOINT}`);
	const dataLaunch = await request.json();
	var utcDate = dataLaunch.date_utc;
	var localDate = new Date(utcDate);
	
	nextLaunch = localDate;
	flightnr = dataLaunch.flight_number;
	console.log(flightnr);
	
	const request2 = await fetch(`${ENDPOINT2 + dataLaunch.rocket}`);
	const dataRocket = await request2.json();
	rocket = dataRocket.name;

	showResult();

};

document.addEventListener('DOMContentLoaded', function() {
	htmlFlight = document.querySelector('.js-flight');
	htmlTime = document.querySelector('.js-time');
	htmlDate = document.querySelector('.js-date');
	htmlRocket = document.querySelector('.js-rocket');
	getAPI();
});