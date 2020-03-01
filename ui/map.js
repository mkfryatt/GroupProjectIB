//todo: fix organisations for wishes, just check if code.
//wishes tab display.
//listeners for date fields
//Licences for stuff !
//Keys field for bing?
// add a key (like a guide to the icons) on the map
//


var genericIcon = L.icon({
	iconUrl: '../images/generic.png',
	iconSize: [32, 32],
	iconAnchor: [16,32],
});

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

var baseCurrentLayer;
var wishCurrentLayer;
var map;
var oms;
var map_initializing; //Allows spiderfy to distinguish if user is clicking or if icons being set.
var selectionAdmin, selectionWish, selectionTravel;

function initMap() {
	map = L.map('map').setView({lon: 0.0917, lat: 52.2196 }, 2);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: mapBoxKey}).addTo(map);	

	oms = new OverlappingMarkerSpiderfier(map, legWeight = 10);
	baseCurrentLayer = L.layerGroup().addTo(map);

	document.getElementById("start-date-map").addEventListener('change',updateMap());
	document.getElementById("end-date-map").addEventListener('change',updateMap());
	document.getElementById("matches-back-btn").addEventListener('click',updateMap());
	updateMap(); 

}

function dateFormatter(unixIn){
	var DTform = new Date(unixIn * 1000);
	return (DTform.getDate() + '/' + (DTform.getMonth()+1) + '/' + DTform.getFullYear())
}

function setMapSpiderListener(oms){
	oms.addListener('click', function(mark){
		var classformat;
		if (mark.trueIcon == travelIcon){
				classformat = "popupTravel" }
		else if(mark.trueIcon == wishIcon){
			classformat = "popupWish"}
		else{ classformat = "popupPres"}

		var popup = new L.popup({
			offset: [0,10],
			className: classformat
		});
		popup.setContent(mark.desc);
		popup.setLatLng(mark.getLatLng());
		if (!map_initializing){ //Suppress popups during icon-setting
			map.openPopup(popup);
		}
	})
	

	oms.addListener('spiderfy', function(mark){
		for (var i=0; i<mark.length; i++) { mark[i].setIcon(mark[i].trueIcon)}
	}) 

	oms.addListener('unspiderfy', function(mark){
		for (var i=0; i<mark.length; i++) { mark[i].setIcon(genericIcon)}

	});

}


function updateMap(){ /* Core map display, all wishes and travel within date-range */
	oms.clearListeners('click');
	oms.clearListeners('spiderfy');
	oms.clearListeners('unspiderfy');
	oms.clearMarkers();
	
	if (wishCurrentLayer != null){map.removeLayer(wishCurrentLayer);}
	if (baseCurrentLayer != null){map.removeLayer(baseCurrentLayer); baseCurrentLayer = null;}
	baseCurrentLayer = L.layerGroup().addTo(map);
	if (document.getElementById("start-date-map").disable == true){
		document.getElementById("end-date-map").disable = false;
		document.getElementById("start-date-map").disable = false;
	}	
	setMapSpiderListener(oms);


	
	var start = Math.round(document.getElementById("start-date-map").valueAsDate/1000);
	var end = Math.round(document.getElementById("end-date-map").valueAsDate/1000);



	getAllWishesFromUser(email,function (wishes){

		if (wishes.length>0 && wishes[0].hasOwnProperty("error")) {
		  console.log("error getting wishes");
		} 
		else{

			wishes.forEach(element=>{
				var locationPrint = "";
				var locationlat;
				var locationlon;
				if (element.constraints.locations.length !=0){
					locationPrint = locationPrint.concat(element.constraints.locations[0].city, ", ", element.constraints.locations[0].country);
					locationlat = element.constraints.locations[0].lat;
					locationlon = element.constraints.locations[0].lon;
				
				displayPin(wishIcon,
					element.name,
					locationlat,
					locationlon,
					null, //No organisation specifically sometimes, handle later
					locationPrint,
					null,
					dateFormatter(element.constraints.times[0].startTime) + " to "+dateFormatter(element.constraints.times[0].endTime), //Currently only one date range visible as this is all UI allows.
					baseCurrentLayer
					)
				}
			}
			)
		}
	
	});

	getTravelWithinTimeframe(start,end,function (travel) {
		if (travel.length>0 && travel[1].hasOwnProperty("error")) {
		  console.log("error getting travel");
		}
		else{
			travel.forEach(element=>{
				var attendees = "";
				var orgs = "";
				element.unep_reps.forEach(person=>{attendees = attendees.concat(person.firstName," ", person.lastName) });
				/*element.organisation.forEach(org=>{orgs += org.firstName}); */
				displayPin(travelIcon,
					element.travel_name,
					element.lat,
					element.lon,
					null, //No organisation specifically sometimes, handle later
					element.city + ", " + element.country,
					attendees,
					dateFormatter(element.startTime) + " to " + dateFormatter(element.endTime),
					baseCurrentLayer
					)
				}
			)
		}
		//If time distinguish users travel from all travel

	}); 

	getOrganisationPresencesWithinTimeframe(start,end, function(result){
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
				period,
				baseCurrentLayer				
				)
		
		})

	});

	getUnepPresencesWithinTimeframe(start,end, function (result){
		result.forEach(hq=>{

			var period = null;
			if (hq.startTime != 0){ //if not headquarters
				period = dateFormatter(hq.startTime) + " to " + dateFormatter(hq.endTime);
			}

			displayPin(homeIcon, hq.name, hq.lat, hq.lon, null, hq.city + ", " + hq.country, null, period, baseCurrentLayer)
		})
	})
	//Read in everyone's travel, your own wishes, and all presences (Unep, and external)
}


function displayPin(eventType, eventName, eventX, eventY, organisation, eventLocationName, eventPerson, eventRange, targLayer) {
	
	
	var popupString = "";
	map_initializing = true;

	for (var i=4; i<arguments.length-1; i++){
		if (arguments[i]!=null){
			popupString+=arguments[i];
			popupString+="<br />";
		}
	}


	var marker = L.marker([eventX,eventY], {icon: eventType}).on('click', function(e){e.setZIndexOffset = 100000 })
	marker.addTo(targLayer);
	marker.trueIcon = eventType;
	marker.desc = ("<p>" + eventName.bold() + "<br />" + popupString + "</p>");
	oms.addMarker(marker);

	//Force spiderfy then unspiderfy
	marker.fireEvent('click');
	map.fireEvent('click'); 
	map_initializing = false; 
	
}

function wishesMapUpdate(wishid){
	getWishFromId(wishid, function(resultx){
		if (resultx[0].constraints.locations.length != 0){
			result = resultx[0];	
			oms.clearMarkers();
			map.removeLayer(baseCurrentLayer);
			document.getElementById("end-date-map").disable = true;
			document.getElementById("start-date-map").disable = true;
			wishCurrentLayer = L.layerGroup().addTo(map);


			displayPin(wishIcon,
				result.name,
				result.constraints.locations[0].lat,
				result.constraints.locations[0].lon,
				null,
				result.constraints.locations[0].city + ", " + result.constraints.locations[0].country,
				null,
				dateFormatter(result.constraints.times[0].startTime) + " to "  + dateFormatter(result.constraints.times[0].endTime),			
				wishCurrentLayer
				) 	
		}}); 
			

		getAllSuggestionsFromWish(wishid, function(resulty){
			console.log(resulty);
			resulty.forEach(element=>{
				if (element.hasOwnProperty('unepPresenceName')){
					displayPin(travelIcon,
						element.unepPresenceName + "<br />" + "Carbon saved:" + Math.round(element.emissions).toString + "Kg <br />",
						element.lat,
						element.lon,
						null, //No organisation specifically sometimes, handle later
						element.city + ", " + element.country,
						null,
						null,
						wishCurrentLayer
						)
					}
				else{
					var attendees = "";
					var orgs = "";
					element.involvedReps.forEach(person=>{attendees = attendees.concat(person.firstName," ", person.lastName) });
					/*element.organisation.forEach(org=>{orgs += org.firstName}); */
					displayPin(travelIcon,
						"EN", 
						element.lat,
						element.lon,
						orgs, //No organisation specifically sometimes, handle later
						element.city + ", " + element.country,
						null,
						dateFormatter(element.unepTripStart) + " to " + dateFormatter(element.unepTripEnd),
						wishCurrentLayer
						)
					}
				})
			})

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
  }     
}