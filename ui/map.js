//todo: fix organisations for wishes, just check if code.
//listeners for date fields

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

	
	$('start-date-map').change(function(){updateMap()});
	$('end-date-map').change(function(){updateMap()});
	$("matches-back-btn").click(function(){updateMap()});
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
	console.log("UM");
	console.trace();
	oms.clearListeners('click');
	oms.clearListeners('spiderfy');
	oms.clearListeners('unspiderfy');
	oms.clearMarkers();
	
	if (baseCurrentLayer != null){map.removeLayer(wishCurrentLayer)}
	baseCurrentLayer = new L.FeatureGroup().addTo(map);
	if (wishCurrentLayer != null){map.removeLayer(wishCurrentLayer)};
	if (document.getElementById("start-date-map").disable == true){
		document.getElementById("end-date-map").disable = false;
		document.getElementById("start-date-map").disable = false;
	}	
	setMapSpiderListener(oms);


	
	var start = Math.round(document.getElementById("start-date-map").valueAsDate/1000);
	var end = Math.round(document.getElementById("end-date-map").valueAsDate/1000);


	console.log(start);
	console.log(end);


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
			console.log(travel);
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
	console.log("maptrigger");
	getWishFromId(wishid, function(resultx){
		if (resultx[0].constraints.locations.length != 0){
			result = resultx[0];	
			oms.clearMarkers();
			map.removeLayer(baseCurrentLayer);
			document.getElementById("end-date-map").disable = true;
			document.getElementById("start-date-map").disable = true;
			if (wishCurrentLayer != null){
				map.removeLayer(wishCurrentLayer);}
			wishCurrentLayer = new L.FeatureGroup().addTo(map);
			map.eachLayer(function(layer){console.log(layer)});
			

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
			console.log(resulty);
			resulty.forEach(element=>{
				if (element.hasOwnProperty('unepPresenceName')){
					displayPin(homeIcon,
						element.unepPresenceName + "<br />" + "Carbon saved:",
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
					/*element.organisation.forEach(org=>{orgs += org.firstName}); */
					displayPin(travelIcon,
						element.unepTripName + "<br />" + "Carbon saved:",
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