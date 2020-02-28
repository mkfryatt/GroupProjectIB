//todo: organisations needs fixing....
//todo: handle multiple pins in a location
//todo wishes tab display.
//dateformatter still a bit broken
//listeners for date fields
//Licences for stuff !
//Keys fields

<script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier-Leaflet/0.2.6/oms.min.js"></script>

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

var homeIcon = L.icon({
	iconUrl: '../images/home.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});


var map;
var layerGroup;

var selectionAdmin, selectionWish, selectionTravel;

function initMap() {
	map = L.map('map').setView({lon: 0.0917, lat: 52.2196 }, 2);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoiamdjNDYiLCJhIjoiY2s2N3N0N3czMGIwaDNtb2RxNHZzazgwNSJ9.1OQ8CCRVLbUBbycUpn4T5Q'}).addTo(map);	

	layerGroup = L.layerGroup().addTo(map);
	updateMap(); 
	wishesMapUpdate(1);
}

function dateFormatter(unixIn){
	var DTform = new Date(unixIn);
	return (DTform.getDate() + '/' + (DTform.getMonth()+1) + '/' + DTform.getFullYear())
}

function updateMap(){ /* Core map display, all wishes and travel within date-range */
	layerGroup.clearLayers();

	var start = Math.round(document.getElementById("start-date-map").valueAsDate/1000);
	var end = Math.round(document.getElementById("end-date-map").valueAsDate/1000);

	getTravelWithinTimeframe(start,end,function (travel) {
		console.log("Travel: \n"+ JSON.stringify(travel));
		if (travel.length>0 && travel[1].hasOwnProperty("error")) {
		  console.log("error getting travel");
		}
		else{
			travel.forEach(element=>{
				var attendees = "";
				var orgs = "";
				element.unep_reps.forEach(person=>{attendees = attendees.concat(person.firstName," ", person.lastName) });
				console.log("attending" + attendees)
				/*element.organisation.forEach(org=>{orgs += org.firstName}); */
				displayPin(travelIcon,
					element.travel_name,
					element.lat,
					element.lon,
					null, //No organisation specifically sometimes, handle later
					element.city + ", " + element.country,
					attendees,
					dateFormatter(element.startTime) + " to " + dateFormatter(element.endTime)
					)
				}
			)
		}
		//If time distinguish users travel from all travel

	}); 

	getAllWishesFromUser(email,function (wishes){
		console.log(wishes)
		console.log("Wishes: \n"+ JSON.stringify(wishes));
		if (wishes.length>0 && wishes[0].hasOwnProperty("error")) {
		  console.log("error getting wishes");
		} 
		else{
			console.log("displays")
			wishes.forEach(element=>{
				var locationPrint = "";
				var locationlat;
				var locationlon;
				if (element.constraints.locations.length ==0){
					locationPrint = null;
					locationlat = null;
					locationlon = null;
				}
				else{
					locationPrint = locationPrint.concat(element.constraints.locations[0].city, ", ", element.constraints.locations[0].country);
					locationlat = element.constraints.locations[0].lat;
					locationlon = element.constraints.locations[0].lon;
				}
				var location = "";
				displayPin(wishIcon,
					element.name,
					locationlat,
					locationlon,
					null, //No organisation specifically sometimes, handle later
					locationPrint,
					null,
					dateFormatter(element.startTime) + " to "+dateFormatter(element.endTime)
					)
				}
			)
		}
	
	});

	getOrganisationPresencesWithinTimeframe(start,end, function(result){
		console.log(result);
		result.forEach(pres=>{
			var period = null;
			if (pres.startTime != 0){ //if not headquarters
				period = dateFormatter(pres.startTime) + " to " + dateFormatter(pres.endTime);
			}
			displayPin(presenceIcon,
				pres.name,
				pres.lat,
				pres.lon,
				null,
				pres.city + ", " + pres.country,
				null,
				period				
				)
		
		})

	});

	getUnepPresencesWithinTimeframe(start,end, function (result){
		result.forEach(hq=>{

			var period = null;
			if (hq.startTime != 0){ //if not headquarters
				period = dateFormatter(hq.startTime) + " to " + dateFormatter(hq.endTime);
			}

			displayPin(homeIcon, hq.name, hq.lat, hq.lon, null, hq.city + ", " + hq.country, null, period)
		})
	})


	//Read in everyone's travel, your own wishes, and all presences (Unep, and external)
}


function displayPin(eventType, eventName, eventX, eventY, organisation, eventLocationName, eventPerson, eventRange) {
	
	var popupString = "";

	for (var i=4; i<arguments.length; i++){
		if (arguments[i]!=null){
			popupString+=arguments[i];
			popupString+="<br />";
		}
	}

	var marker = L.marker([eventX,eventY], {icon: eventType}).addTo(layerGroup);
	marker.bindPopup("<p>" + eventName.bold() + "<br />" + popupString + "</p>");
	
}

function wishesMapUpdate(wishid){
	layerGroup.clearLayers();

	//get wishbyid and display it
	getWishFromId(wishid, function(result){
		console.log(result);
	})
	

	/*getAllSuggestionsFromWish */

	//Need wish id passed in to query?


	//Read in user's wish (display as wish), and matches (display as travel)
	//displaypin for wish, displaypin for all travels.


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
	selectionTravel = selection;
    /* City = selection.address.locality - UNDEFINED for country/continent/Seas
    /*City/Location = selection.formattedSuggestion
    Lat = selection.location.latitude
    lon = selection.location.longitude

    Basically this needs to store it to somewhere so it can be submitted when the rest of the form is.
    */
  }     
}