function init() {
  document.getElementById("start_date_map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end_date_map").valueAsDate = date;

  getMatchPreviews();
  openTab("cal");
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