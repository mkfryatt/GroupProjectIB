var tickIcon = L.icon({
	iconUrl: 'iconmonstr-location-7-240.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});

var wishIcon = L.icon({
	iconUrl: 'iconmonstr-location-13-240.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});

var selectionTravel, selectionWish, selectionAdmin;

function initMap() {
	var map = L.map('map').setView({lon: 0.0917, lat: 52.2196 }, 2);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoiamdjNDYiLCJhIjoiY2s2N3N0N3czMGIwaDNtb2RxNHZzazgwNSJ9.1OQ8CCRVLbUBbycUpn4T5Q'}).addTo(map);

	updateMap(map);
}

function updateMap(map){
	var start = document.getElementById("start-date-map").valueAsDate;
	var end = document.getElementById("end-date-map").valueAsDate;

	//Filter by date from db file and display pins
	displayPin(map, tickIcon,"Goldfish conference", 38.72, -9.14, "Lisbon", "Mark Smith", "1/04/20", "3/04/20");
	displayPin(map, wishIcon,"Lemon meeting", 51.547, 0, "London", "Mark Smith", "1/04/20", "3/04/20");

}

function displayPin(map, eventType, eventName, eventX, eventY, eventLocationName, eventPerson, eventStart, eventEnd) {
	//Event name & Institution 
	//Location (need Co-ords and city name)
	//Person -> unep_rep & name
	//Time

	var marker = L.marker([eventX,eventY], {icon: eventType}).addTo(map);
	marker.bindPopup("<p>" + eventName.bold() + "<br />" + eventLocationName +"<br />" + eventPerson + "<br />" + eventStart + " to " + eventEnd +"</p>");
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
	  console.log(selection.address.locality);
	  selectionAdmin = selection;
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
	console.log(selection.address.locality);
	selectionWish = selection;
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
	console.log(selection.address.locality);
	selectionTravel = selection;
    /* City = selection.address.locality - UNDEFINED for country/continent/Seas
    /*City/Location = selection.formattedSuggestion
    Lat = selection.location.latitude
    lon = selection.location.longitude

    Basically this needs to store it to somewhere so it can be submitted when the rest of the form is.
    */
  }    
}