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
  document.getElementById("start-date-map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end-date-map").valueAsDate = date;

  getTravel();
  getMatchPreviews();
  openTab("cal");

  var map = L.map('map').setView({lon: 0, lat: 0}, 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: 19,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

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

function openTab(type) {
  $(".tabcontent").hide();
  $(".tab button").css("background-color", "");
  $("#"+type+"-btn").css("background-color", "#f59191");
  $("#"+type).show();
}

function createDialog(dialogID, dialogTitle, dialogQuestion, dialogOK) {
  var div1 = document.createElement("div");
  div1.setAttribute("class", "modal");
  div1.setAttribute("id", dialogID);

  var div2  = document.createElement("div");
  div2.setAttribute("class", "modal-dialog");

  var divContent = document.createElement("div");
  divContent.setAttribute("class", "modal-content");

  var divHeader = document.createElement("div");
  divHeader.setAttribute("class", "modal-header");

  var title = document.createElement("h5");
  title.setAttribute("class", "modal-title");
  title.innerText = dialogTitle;

  var btnX =document.createElement("button");
  btnX.setAttribute("class", "close");
  btnX.setAttribute("onclick", "$('#"+dialogID + "').remove()");

  var span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML = "&times";

  var divBody = document.createElement("div");
  divBody.setAttribute("class", "modal-body");

  var p = document.createElement("p");
  p.innerText = dialogQuestion;

  var divFooter = document.createElement("div");
  divFooter.setAttribute("class", "modal-footer");

  var btnDelete = document.createElement("button");
  btnDelete.setAttribute("class", "btn btn-primary");
  btnDelete.setAttribute("onclick", dialogOK);
  btnDelete.innerText = "Delete";

  var btnCancel = document.createElement("button");
  btnCancel.setAttribute("class", "btn btn-secondary");
  btnCancel.setAttribute("onclick", "$('#"+dialogID + "').remove()");
  btnCancel.innerText = "Cancel";

  btnX.append(span);
  divHeader.append(title);
  divHeader.append(btnX);

  divBody.append(p);

  divFooter.append(btnDelete);
  divFooter.append(btnCancel);

  divContent.append(divHeader);
  divContent.append(divBody);
  divContent.append(divFooter);

  div2.append(divContent);
  div1.append(div2);

  return div1;
}

function removeMatchConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Remove Wish", 
    "Would you like to permanently delete this wish?", 
    "deleteMatch("+id+")");

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function deleteMatch(id) {
  console.log("test");
  $("#confirm-removal").remove();
  //TODO tell backend to delete it
  $("#card-"+id).remove();
}

function getMatchPreviews() {
  //TODO get list of matches from backend
  var matches = [{"reason": "reason goes here", "matches": 3, "id": 1}, 
  {"reason": "reason goes here", "matches": 4, "id": 2}, 
  {"reason": "blah", "matches": 3, "id": 3}, 
  {"reason": "reason goes here", "matches": 3, "id": 4}, 
  {"reason": "reason goes here", "matches": 3, "id": 5}, 
  {reason: "dfdsvf", matches: 23, "id": 6}];

  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "card-"+ element.id);

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
    remove.setAttribute("onclick", "removeMatchConfirmation(" + element.id + ")");
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
    div.setAttribute("class", "col-sm-1");

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    cardHeader.innerHTML = element.person;
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");

    list.append(createLI("Carbon Saving", "???", ""));
    list.append(createLI("City", "???", ""));
    list.append(createLI("Dates", "???", ""));

    card.append(cardHeader);
    card.append(list);
    div.append(card);

    $("#match-view").append(div);
  });

  $("#match-previews").hide();
  $("#match-view").show();
}

function carbonDetails() {
//TODO get carbon savings from backend

  var div1 = document.createElement("div");
  div1.setAttribute("class", "modal");
  div1.setAttribute("id", "carbon-details");

  var div2  = document.createElement("div");
  div2.setAttribute("class", "modal-dialog modal-dialog-centered");

  var divContent = document.createElement("div");
  divContent.setAttribute("class", "modal-content");

  var divHeader = document.createElement("div");
  divHeader.setAttribute("class", "modal-header");

  var title = document.createElement("h5");
  title.setAttribute("class", "modal-title");
  title.innerText = "Your Carbon Savings";

  var btnX =document.createElement("button");
  btnX.setAttribute("class", "close");
  btnX.setAttribute("onclick", "$('#carbon-details').remove()");

  var span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML = "&times";

  var divBody = document.createElement("div");
  divBody.setAttribute("class", "modal-body");

  //add stuff to div body

  btnX.append(span);
  divHeader.append(title);
  divHeader.append(btnX);

  //add stuff to div body

  divContent.append(divHeader);
  divContent.append(divBody);

  div2.append(divContent);
  div1.append(div2);

  $("body").prepend(div1);
  $("#carbon-details").show();
}

function createLI(title, value, id) {
  var li = document.createElement("li");
  li.setAttribute("class", "list-group-item");

  var pTitle = document.createElement("p");
  pTitle.innerText = title + ": ";

  var pValue = document.createElement("p");
  pValue.setAttribute("id", title.toLowerCase() + "-" + id);
  pValue.innerText = value;

  li.append(pTitle);
  li.append(pValue);

  return li;
}

function getTravel() {
  //get travel from db
  $("#travel-default").empty();

  var travels = [{city:"cambridge", country:"uk", startDate: "2020-06-06", endDate: "2020-07-06", id:1}];

  var btnAdd = document.createElement("button");
  btnAdd.setAttribute("class", "btn btn-success");
  btnAdd.setAttribute("onclick", "showAddTravel()");
  btnAdd.innerText = "Add new travel";

  $("#travel-default").append(btnAdd);

  travels.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "travel-"+element.id);

    var card = document.createElement("div");
    card.setAttribute("class", "card");
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");

    var footer = document.createElement("div");
    footer.setAttribute("class", "card-footer");

    var btnGroup = document.createElement("div");
    btnGroup.setAttribute("class", "btn-group");

    var btnEdit = document.createElement("button");
    btnEdit.setAttribute("class", "btn btn-primary");
    btnEdit.setAttribute("onclick", "showEditTravel("+element.id+")");
    btnEdit.innerText = "Edit";

    var btnRemove = document.createElement("button");
    btnRemove.setAttribute("class", "btn btn-danger");
    btnRemove.setAttribute("onclick", "removeTravelConfirmation("+element.id+")");
    btnRemove.innerText = "Remove";

    list.append(createLI("City", element.city, element.id));
    list.append(createLI("Country", element.country, element.id));
    list.append(createLI("Start", element.startDate, element.id));
    list.append(createLI("End", element.endDate, element.id));

    btnGroup.append(btnEdit);
    btnGroup.append(btnRemove);
    footer.append(btnGroup);

    card.append(list);
    card.append(footer);
    div.append(card);

    $("#travel-default").append(div);
  });

  $("#travel-add").hide();
  $("#travel-default").show();
}

function showAddTravel() {
  $("#travel-default").hide();
  $("#travel-add").show();
  $("travel-btn").attr("onclick", "submitTravelNew()");
}

function showEditTravel(id) {
  $("#travel-default").hide();
  $("#travel-add").show();

  var textAttrs = ["city", "country"];
  textAttrs.forEach(element => {
    $("#"+element+"-travel").attr("value", $("#"+element+"-"+id).text());
  });

  //TODO fix the parsing part
  var dateAttrs = ["start", "end"];
  dateAttrs.forEach(element => {
    document.getElementById(element+"-travel").valueAsDate = Date.parse($("#"+element+"-"+id).text());
  });

  $("#travel-btn").attr("onclick", "submitTravelEdit("+id+")");
}

function submitTravelEdit(id) {
  deleteTravel(id);
  submitTravelNew();
}

function submitTravelNew() {
  //TODO submit travel to backend

  //clear fields
  var attrs = ["city", "country", "start-date", "end-date"];
  attrs.forEach(element => {
    $("#"+element+"-travel").attr("value", "");
  });

  // switch back to view of all travel
  $("#travel-default").empty();
  getTravel();
  $("#travel-default").show();
  $("#travel-add").hide();
}

function removeTravelConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Remove Travel", 
    "Would you like to permanently delete this travel item?", 
    "deleteTravel("+id+")");

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function deleteTravel(id) {
  $("#confirm-removal").remove();

  //TODO tell backend to delete it
  /* something like this??
  $.post("backend.php", 
    {type: delete_travel, travel_id: id}, 
    function(data, status) {
      alert("Data: " + data + "\nStatus: " + status);
    }
  );
  */

  $("#travel-"+id).remove();
}