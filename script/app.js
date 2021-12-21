var htmlFlight;
var htmlTime;
var htmlDate;
var htmlRocket;
var htmlLaunchpad;
var htmlRegion;

var nextLaunch;
var rocket;
var flightnr;
var launchpad;
var region;

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
	htmlLaunchpad.innerHTML = launchpad;
	htmlRegion.innerHTML = region;

	var intervalId = window.setInterval(function(){
		replaceResult()
	  }, 1000);
};

function replaceResult(){

	t = getTimeRemaining(nextLaunch)

	htmlTime.innerHTML = t.days + ' days, ' + t.hours + ' hours, ' + t.minutes + ' minutes and ' + t.seconds + ' seconds';
}

let getNextLaunch = async () => {
	const ENDPOINT = `https://api.spacexdata.com/v4/launches/next`;
	
	const request = await fetch(`${ENDPOINT}`);
	const dataLaunch = await request.json();
	
	var utcDate = dataLaunch.date_utc;
	var localDate = new Date(utcDate);
	
	nextLaunch = localDate;

	flightnr = dataLaunch.flight_number;

	var rocketID = dataLaunch.rocket;
	await getRocket(rocketID);

	var launchpadID = dataLaunch.launchpad
	await getLaunchpad(launchpadID)
}

let getRocket = async (rocketID) => {
	const ENDPOINT = `https://api.spacexdata.com/v4/rockets/` + rocketID;

	const request = await fetch(`${ENDPOINT}`);
	const dataRocket = await request.json();
	rocket = dataRocket.name;
}

let getLaunchpad = async (launchpadID) => {
	const ENDPOINT = `https://api.spacexdata.com/v4/launchpads/` + launchpadID;
	const request = await fetch(`${ENDPOINT}`);
	const dataLaunchpad = await request.json();
	
	launchpad = dataLaunchpad.full_name;
	region = dataLaunchpad.region;
}

let getAPI = async () => {

	await getNextLaunch();
	showResult();

};

document.addEventListener('DOMContentLoaded', function() {
	htmlFlight = document.querySelector('.js-flight');
	htmlTime = document.querySelector('.js-time');
	htmlDate = document.querySelector('.js-date');
	htmlRocket = document.querySelector('.js-rocket');
	htmlLaunchpad = document.querySelector('.js-launchpad');
	htmlRegion = document.querySelector('.js-region');
	getAPI();
});