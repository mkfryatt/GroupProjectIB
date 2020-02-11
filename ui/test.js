function init() {
  document.getElementById("start_date_map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end_date_map").valueAsDate = date;
  //TODO update map with these dates

  document.getElementById("cal").style.display = "block";
  document.getElementById("default_tab").className += " active";
}

function openTab(event, type) {
    var i, tabcontent, tablinks;

    if (type=="match") {
      addMatchPreviews();
    } else {
      removeMatchPreviews();
    }

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(type).style.display = "block";
    event.currentTarget.className += " active";
}

function addMatchPreviews() {
  //TODO get list of matches
  var matches = [{"reason": "blah", "matches": 3, "id": 343}, {"reason": "blah", "matches": 3, "id": 343}, {"reason": "blah", "matches": 3, "id": 343}, {"reason": "blah", "matches": 3, "id": 343}, {"reason": "blah", "matches": 3, "id": 343}, {reason: "dfdsvf", matches: 23, "id": 45}];

  removeMatchPreviews();
  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-3");
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
    view.setAttribute("onclick", "viewMatch(" + element.id + ")");
    view.setAttribute("class", "btn btn-success");

    var remove = document.createElement("button");
    remove.innerHTML = "Remove";
    remove.setAttribute("onclick", "removeMatch(" + element.id + ")");
    remove.setAttribute("class", "btn btn-danger");

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    btns.appendChild(view);
    btns.appendChild(remove);
    cardBody.appendChild(btns);
    card.appendChild(cardBody);
    div.appendChild(card);

    document.getElementById("match-container").appendChild(div);
  });
}

function removeMatchPreviews() {
  document.getElementById("match-container").innerHTML = "";
}

function viewMatch(id) {
  //TODO get list of matches for this wish
  var matches = [{"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}, {"person": "john smith"}];

  removeMatchPreviews();
  var back = document.createElement("button");
  back.innerHTML = "Back";
  back.setAttribute("onclick", "addMatchPreviews()");
  back.setAttribute("class", "btn btn-pimary");
  document.getElementById("match").appendChild(back);

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

    list.appendChild(stat1);
    list.appendChild(stat2);
    list.appendChild(stat3);

    card.appendChild(cardHeader);
    card.appendChild(list);
    div.appendChild(card);

    document.getElementById("match-container").appendChild(div);
  });
}

function removeMatch(id) {
  //TODO dialogue box
  //TODO tell db to delete it
  document.getElementById("match-container").removeChild(document.getElementById("card_"+id));
}