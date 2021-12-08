


let getAPI = async () => {
	// Eerst bouwen we onze url op
	const ENDPOINT = `https://api.spacexdata.com/v4/launches/next`;

	// Met de fetch API proberen we de data op te halen.
	const request = await fetch(`${ENDPOINT}`);
	const data = await request.json();
	console.log(data);

};

document.addEventListener('DOMContentLoaded', function() {
	
	getAPI();
});