var title;
var nextLaunch;

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

	var intervalId = window.setInterval(function(){
		replaceResult()
	  }, 1000);
};

function replaceResult(){

	t = getTimeRemaining(nextLaunch)

	title.innerHTML = t.days + ' days, ' + t.hours + ' hours, ' + t.minutes + ' minutes and ' + t.seconds + ' seconds';
	console.log('test');
}

let getAPI = async () => {
	// Eerst bouwen we onze url op
	const ENDPOINT = `https://api.spacexdata.com/v4/launches/next`;

	// Met de fetch API proberen we de data op te halen.
	const request = await fetch(`${ENDPOINT}`);
	const data = await request.json();
	console.log(data);
	nextLaunch = data.date_utc;

	showResult();

};

document.addEventListener('DOMContentLoaded', function() {
	title = document.querySelector('.js-title');
	getAPI();
});