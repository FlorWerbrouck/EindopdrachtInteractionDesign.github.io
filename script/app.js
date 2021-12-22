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

	htmlFlight.innerHTML = '<bold>Flight #</bold>' +  flightnr;
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
	
	nextLaunch = localDate.toLocaleString();

	flightnr = dataLaunch.flight_number + ": " + dataLaunch.name;

	await getRocket(dataLaunch.rocket);

	await getLaunchpad(dataLaunch.launchpad);

	await getLaunches();0
}

let getRocket = async (rocketID) => {
	const ENDPOINT = `https://api.spacexdata.com/v4/rockets/` + rocketID;

	const request = await fetch(`${ENDPOINT}`);
	const dataRocket = await request.json();
	rocket = "This launch will happen with the " + dataRocket.type + " <a href='" + dataRocket.wikipedia + "'>" + dataRocket.name + "</a>. <br />" + dataRocket.description;
}

let getLaunchpad = async (launchpadID) => {
	const ENDPOINT = `https://api.spacexdata.com/v4/launchpads/` + launchpadID;
	const request = await fetch(`${ENDPOINT}`);
	const dataLaunchpad = await request.json();
	
	var lat = dataLaunchpad.latitude;
	var lng = dataLaunchpad.longitude;
	launchpad = "<a href='https://maps.google.com/?q=" + lat + "," + lng + "'>"+ dataLaunchpad.full_name + "</a>";
	region = dataLaunchpad.region;
}

function indexOf2dArray(array2d, itemtofind) {
    index = [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind);
                
    // return "false" if the item is not found
    if (index === -1) { return false; }
    
    // Use any row to get the rows' array length
    // Note, this assumes the rows are arrays of the same length
    numColumns = array2d[0].length;
    
    // row = the index in the 1d array divided by the row length (number of columns)
    row = parseInt(index / numColumns);
    
    return row; 
}

let getLaunches = async () => {
	const ENDPOINT = `https://api.spacexdata.com/v4/launches`;
	const request = await fetch(`${ENDPOINT}`);
	const dataLaunches = await request.json();
	
	var years = [];
  	var dteNow = new Date().getFullYear();
  	for (i = 2006; i <= dteNow+1; i++) {
    	years.push([String(i), 0]);
  	}

	dataLaunches.forEach(obj => {
		row = indexOf2dArray(years,String(obj.date_utc).substring(0, 4))
		years[row][1] += 1;
    });

	years.unshift(["year", "launches"]);

	google.charts.load('current', {'packages':['corechart', 'bar']});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = google.visualization.arrayToDataTable(years);
	
		var options = {
			chart: {
			},
			bars: "vertical",
			hAxis: { format: "", showTextEvery: 1 },
			height: 300,
			colors: ["#430653"],
			legend: { position: "none" }
		};
	
		var chart = new google.charts.Bar(document.getElementById("js-chart"));
	
		chart.draw(data, google.charts.Bar.convertOptions(options));
	}

	$(window).resize(function() {
		drawChart();
	});
}

let getAPI = async () => {

	await getNextLaunch();
	showResult();

};

function setTheme(themeName) {
	localStorage.setItem('theme', themeName);
	document.documentElement.className = themeName;
}

function toggleTheme() {
	if (localStorage.getItem('theme') === 'theme-dark') {
		setTheme('theme-light');
	} else {
		setTheme('theme-dark');
	}
}

(function () {
	if (localStorage.getItem('theme') === 'theme-dark') {
		setTheme('theme-dark');
	} else {
		setTheme('theme-light');
	}
})();

document.addEventListener('DOMContentLoaded', function() {
	

	htmlFlight = document.querySelector('.js-flight');
	htmlTime = document.querySelector('.js-time');
	htmlDate = document.querySelector('.js-date');
	htmlRocket = document.querySelector('.js-rocket');
	htmlLaunchpad = document.querySelector('.js-launchpad');
	htmlRegion = document.querySelector('.js-region');
	getAPI();

});