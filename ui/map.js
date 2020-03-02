//Icons for map display, no licence required.

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

//Per-map (i.e. singleton) layers/shell/spiderfying capsule.
var baseCurrentLayer;
var wishCurrentLayer;
var map;
var oms;
var map_initializing; //Allows spiderfy to distinguish if user is clicking or if icons being set.
var selectionAdmin, selectionWish, selectionTravel; //For initializing geocoders

//Run at first map usage (i.e. at login) - and once only.
function initMap() {
	map = L.map('map').setView({lon: 0.0917, lat: 52.2196 }, 2);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: mapBoxKey}).addTo(map);	

	oms = new OverlappingMarkerSpiderfier(map, legWeight = 10); //Setup spiderfier for clustering points

	var legend = L.control({position: 'bottomleft'}); //Setup for key
    legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'legend');
		div.style.width = "20%";
		div.innerHTML = '<img src="../images/key.png" width="100%" height="100%"></img>';	
		return div; }
	legend.addTo(map);
	updateMap();  //Pull points
}

//Utility to convert unix to dd/mm/yyyy
function dateFormatter(unixIn){
	var DTform = new Date(unixIn * 1000);
	return (DTform.getDate() + '/' + (DTform.getMonth()+1) + '/' + DTform.getFullYear())
}

//Setup SpiderfyListener to detect clusters being selected/deselected and update icons accordingly
function setMapSpiderListener(oms){
	oms.addListener('click', function(mark){
		var classformat;
		if (mark.trueIcon == travelIcon){
				classformat = "popupTravel" }
		else if(mark.trueIcon == wishIcon){
			classformat = "popupWish"}
		else{ classformat = "popupPres"}

		//When cluster clicked, set icon to its 'true' icon rather than the cluster one.
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
	oms.clearListeners('click'); //Reset spiderfy references by deleting all listeners and clearing markers
	oms.clearListeners('spiderfy');
	oms.clearListeners('unspiderfy');
	oms.clearMarkers();
	
	//Clean-out current layers
	if (baseCurrentLayer != null){map.removeLayer(baseCurrentLayer)}
	baseCurrentLayer = new L.FeatureGroup().addTo(map);
	if (wishCurrentLayer != null){map.removeLayer(wishCurrentLayer)};
	if (document.getElementById("start-date-map").disable == true){
		document.getElementById("end-date-map").disable = false;
		document.getElementById("start-date-map").disable = false;
	}	
	setMapSpiderListener(oms);

	//Read in date filter fields
	var start = Math.round(document.getElementById("start-date-map").valueAsDate/1000);
	var end = Math.round(document.getElementById("end-date-map").valueAsDate/1000);

	//Pull all user wishes
	getAllWishesFromUser(email,function (wishes){

		if (wishes.length>0 && wishes[0].hasOwnProperty("error")) {
		  console.error("Error getting wishes:\n"+JSON.stringify(wishes));
		} 
		else{

			//Setup passing to displayPin
			wishes.forEach(element=>{
				var locationPrint = "";
				var locationlat;
				var locationlon;
				var orgs;
				if (element.constraints.locations.length !=0){ //If locations set for wish then plot, else don't
					locationPrint = locationPrint.concat(element.constraints.locations[0].city, ", ", element.constraints.locations[0].country);
					locationlat = element.constraints.locations[0].lat;
					locationlon = element.constraints.locations[0].lon;

				if (element.constraints.organisations.length != 0){ //If there's organisations, accrue them in orgs for display.
						orgs = element.constraints.organisations[0].name;
					}
				displayPin(wishIcon,
					element.name,
					locationlat,
					locationlon,
					orgs, //No organisation specifically sometimes
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

	//Same for wishes as for travel, except these always have locations
	getTravelWithinTimeframe(start,end,function (travel) {
		if (travel.hasOwnProperty("error")) {
		  console.error("Error getting travel:\n"+JSON.stringify(travel));
		}
		else{
			travel.forEach(element=>{
				var attendees = "";
				var orgs;
				element.unep_reps.forEach(person=>{attendees = attendees.concat(person.firstName," ", person.lastName) });
				
				if (element.organisations.length != 0){
					orgs = element.organisations[0].name;
				}
				displayPin(travelIcon,
					element.travel_name,
					element.lat,
					element.lon,
					orgs,
					element.city + ", " + element.country,
					attendees,
					dateFormatter(element.startTime) + " to " + dateFormatter(element.endTime),
					baseCurrentLayer
					)
				}
			)
		}

	}); 

	//Pull external organisations HQs/Presence
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
}


//Master pin display function, takes many parameters for all types of display.
function displayPin(eventType, eventName, eventX, eventY, organisation, eventLocationName, eventPerson, eventRange, targLayer) {
	
	
	var popupString = "";
	map_initializing = true;

	//Accrue optional arguments into string for display, if not null
	for (var i=4; i<arguments.length-1; i++){
		if (arguments[i]!=null){
			popupString+=arguments[i];
			popupString+="<br />";
		}
	}

	//Create marker on map, add to wish or base layer. Base layer for normal map, wish layer for map showing wishes and matches.
	var marker = L.marker([eventX,eventY], {icon: eventType}).on('click', function(e){e.setZIndexOffset = 100000 })
	marker.addTo(targLayer);
	marker.trueIcon = eventType; //Set true icon as custom property for unpacking when cluster expanded.
	marker.desc = ("<p>" + eventName.bold() + "<br />" + popupString + "</p>");
	oms.addMarker(marker);

	//Force spiderfy then unspiderfy - glitch with spiderfy requires this for properly initializing the icons
	marker.fireEvent('click');
	map.fireEvent('click'); 
	map_initializing = false;  //so that all the pop-ups don't appear as you trigger the listeners.
	
}


//Called to fetch new wish matches and update the map, takes wishid of wish being viewed.
function wishesMapUpdate(wishid){
	getWishFromId(wishid, function(resultx){
		if (resultx[0].constraints.locations.length != 0){ //Can only display wishes with a location.
			result = resultx[0];	//Clear away map and set wish layer.
			oms.clearMarkers();
			map.removeLayer(baseCurrentLayer);
			document.getElementById("end-date-map").disable = true;
			document.getElementById("start-date-map").disable = true;
			if (wishCurrentLayer != null){
				map.removeLayer(wishCurrentLayer);}
			wishCurrentLayer = new L.FeatureGroup().addTo(map);
			

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
		
			

		getAllSuggestionsFromWish(wishid, function(resulty){
			resulty.forEach(element=>{
				console.log(element);
				if (element.hasOwnProperty('unepPresenceName')){
					displayPin(homeIcon,
						element.unepPresenceName + "<br />" + "Carbon saved:" + element.emissions,
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
					element.unep_reps.forEach(person=>{attendees = attendees.concat(person.firstName," ", person.lastName) });
					if (element.organisations.length != 0){
						orgs = element.organisations[0].name;
					}displayPin(travelIcon,
						element.unepTripName + "<br />" + "Carbon saved:" + element.emissions,
						element.lat,
						element.lon,
						orgs, 
						element.city + ", " + element.country,
						attendees,
						dateFormatter(element.unepTripStart) + " to " + dateFormatter(element.unepTripEnd),
						wishCurrentLayer
						)
					}
				})
			})

			//Read in user's wish (display as wish), and matches (display as travel)
			//displaypin for wish, displaypin for all travels.
		}}); 
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

//LEAFLET:
/*
Copyright (c) 2010-2019, Vladimir Agafonkin
Copyright (c) 2010-2011, CloudMade
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


/*Overlapping Marker Spiderfier for Leaflet - jawj - MIT licence: https://opensource.org/licenses/mit-license.php*/