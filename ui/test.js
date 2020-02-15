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

function init() {
  document.getElementById("start_date_map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end_date_map").valueAsDate = date;

  getMatchPreviews();
  openTab("cal");

  var map = L.map('map').setView({lon: 0, lat: 0}, 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: 19,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  updateMap(map);
  document.getElementById("start_date_map").addEventListener();
}

function updateMap(map){
  var start = document.getElementById("start_date_map").valueAsDate;
  var end = document.getElementById("end_date_map").valueAsDate;

  //Filter by date from db file and display pins
 displayPin(map, tickIcon,"Goldfish conference", 38.72, -9.14, "Lisbon", "Mark Smith", "1/04/20", "3/04/20");
 displayPin(map, wishIcon,"Lemon meeting", 51.547, 0, "London", "Mark Smith", "1/04/20", "3/04/20");

}

function displayPin(map, eventType, eventName, eventX, eventY, eventLocationName, eventPerson, eventStart, eventEnd){
  //Event name & Institution 
  //Location (need Co-ords and city name)
  //Person -> unep_rep & name
  //Time

  var marker = L.marker([eventX,eventY], {icon: eventType}).addTo(map);
  marker.bindPopup("<p>" + eventName.bold() + "<br />" + eventLocationName +"<br />" + eventPerson + "<br />" + eventStart + " to " + eventEnd +"</p>");
}

function openTab(type) {
    $(".tabcontent").hide();
    $(".tab button").css("background-color", "");
    $("#"+type+"_btn").css("background-color", "#f59191");
    $("#"+type).show();
}

function removeMatch(id) {
  //TODO dialogue box
  //TODO tell backend to delete it
  $("#confirm-removal").show();
  //$("#card_"+id).remove();
}

function getMatchPreviews() {
  //TODO get list of matches from backend
  var matches = [{"reason": "reason goes here", "matches": 3, "id": 343}, {"reason": "reason goes here", "matches": 4, "id": 343}, {"reason": "blah", "matches": 3, "id": 343}, {"reason": "reason goes here", "matches": 3, "id": 343}, {"reason": "reason goes here", "matches": 3, "id": 343}, {reason: "dfdsvf", matches: 23, "id": 45}];

  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "card_"+ element.id);

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    var cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = "<span class=\"badge badge-success\">" + element.matches + "</span>";
    
    var cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.innerHTML = element.reason;

    var btns = document.createElement("div");
    btns.setAttribute("class", "btn-group");

    var view = document.createElement("button");
    view.innerHTML = "View";
    view.setAttribute("onclick", "showMatch(" + element.id + ")");
    view.setAttribute("class", "btn btn-success");

    var remove = document.createElement("button");
    remove.innerHTML = "Remove";
    remove.setAttribute("onclick", "removeMatch(" + element.id + ")");
    remove.setAttribute("class", "btn btn-danger");

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    btns.append(view);
    btns.append(remove);
    cardBody.append(btns);
    card.append(cardBody);
    div.append(card);
    $("#match-previews").append(div);

  });

  $("#match-title").text("View all matches");
  $("#match-view").hide();
  $("#match-back-btn").hide();
  $("#match-previews").show();
}

function hideMatch() {
  $("#match-view").empty();
  $("#match-back-btn").hide();
  $("#match-view").hide();
  $("#match-title").text("View all matches");
  $("#match-previews").show();
}

function showMatch(id) {
  //TODO get list of matches for this wish from backend
  var matches = [{"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}];

  $("#match-title").text("View choices for match");
  $("#match-back-btn").show();

  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-3");

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    cardHeader.innerHTML = element.person;
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");

    var stat1 = document.createElement("li");
    stat1.setAttribute("class", "list-group-item");
    stat1.innerHTML = "carbon saving: ???";

    var stat2 = document.createElement("li");
    stat2.setAttribute("class", "list-group-item");
    stat2.innerHTML = "city: ???";

    var stat3 = document.createElement("li");
    stat3.setAttribute("class", "list-group-item");
    stat3.innerHTML = "travel dates: ???";

    list.append(stat1);
    list.append(stat2);
    list.append(stat3);

    card.append(cardHeader);
    card.append(list);
    div.append(card);

    $("#match-view").append(div);
  });
  $("#match-previews").hide();
  $("#match-view").show();
}

function carbonDetails() {
  
}