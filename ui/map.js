var travelIcon = L.icon({
	iconUrl: '../images/travel.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});

var wishIcon = L.icon({
	iconUrl: '../images/wish.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});

var presenceIcon = L.icon({
	iconUrl: '../images/presence.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});


var map;

function initMap() {
	map = L.map('map').setView({lon: 0.0917, lat: 52.2196 }, 2);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoiamdjNDYiLCJhIjoiY2s2N3N0N3czMGIwaDNtb2RxNHZzazgwNSJ9.1OQ8CCRVLbUBbycUpn4T5Q'}).addTo(map);

	updateMap(); 
}

function updateMap(){ /* Core map display, all wishes and travel within date-range */
	var start = document.getElementById("start-date-map").valueAsDate;
	var end = document.getElementById("end-date-map").valueAsDate;

	getTravelWithinTimeframe(start,end,function (result) {
		console.log(JSON.stringify(result));
	})
	//Read in everyone's travel, your own wishes, and all presences.
	//iteratively call displayPin

	//Filter by date from db file and display pins
	displayPin(travelIcon,"Goldfish conference", "Btec", 38.72, -9.14, "Lisbon", "Mark Smith", "1/04/20", "3/04/20");
	displayPin(wishIcon,"Lemon meeting", "Atec" , 51.547, 0, "London", "Mark Smith", "1/04/20", "3/04/20");

}


function displayPin(eventType, eventName, organisation, eventX, eventY, eventLocationName, eventPerson, eventStart, eventEnd) {
	//Event name & Institution 
	//Location (need Co-ords and city name)
	//Person -> unep_rep & name
	//Time

	var marker = L.marker([eventX,eventY], {icon: eventType}).addTo(map);
	marker.bindPopup("<p>" + eventName.bold() + "<br />" + organisation + "<br />" + eventLocationName +"<br />" + eventPerson + "<br />" + eventStart + " to " + eventEnd +"</p>");
}

function wishesMapUpdate(email){
	//Read in user's wish (display as wish), and matches (display as travel)



}

function loadMapScenario() {
	loadMapScenarioTravel();
	loadMapScenarioWish();
	loadMapScenarioAdmin();
}

function loadMapScenarioAdmin() {
	Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', {
		callback: onLoad,
	});
	function onLoad() {
		var options = { maxResults: 3, countryRegionSuggestions: false };
		var manager = new Microsoft.Maps.AutosuggestManager(options);
		manager.attachAutosuggest('#searchbox-admin', '#searchbox-container-admin', passLatLong);
	}
	function passLatLong(selection) {
	  console.log(selection.address.locality)
	}     
}

function loadMapScenarioWish() {
  Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', {
      callback: onLoad,
  });
  function onLoad() {
      var options = { maxResults: 3, countryRegionSuggestions: false };
      var manager = new Microsoft.Maps.AutosuggestManager(options);
      manager.attachAutosuggest('#searchbox-wish', '#searchbox-container-wish', passLatLong);
  }
  function passLatLong(selection) {
    console.log(selection.address.locality)
  }     
}

function loadMapScenarioTravel() {
  Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', {
      callback: onLoad,
  });
  function onLoad() {
      var options = { maxResults: 3, countryRegionSuggestions: false };
      var manager = new Microsoft.Maps.AutosuggestManager(options);
      manager.attachAutosuggest('#searchbox-travel', '#searchbox-container-travel', passLatLong);
  }
  function passLatLong(selection) {
    console.log(selection.address.locality)
    /* City = selection.address.locality - UNDEFINED for country/continent/Seas
    /*City/Location = selection.formattedSuggestion
    Lat = selection.location.latitude
    lon = selection.location.longitude

    Basically this needs to store it to somewhere so it can be submitted when the rest of the form is.
    */
  }     
}