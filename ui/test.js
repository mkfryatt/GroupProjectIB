function init() {
  document.getElementById("start_date_map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end_date_map").valueAsDate = date;
  //TODO: update map with these dates
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
  var matches = [{"reason": "blah", "matches": 3, "id": 343}, {reason: "dfdsvf", matches: 23, "id": 45}];

  removeMatchPreviews();
  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "match_preview");
    div.setAttribute("id", "match_preview_"+ element.id);

    var p1 = document.createElement("p");
    p1.innerHTML = "Reason: " + element.reason;
    div.appendChild(p1);

    var p2 = document.createElement("p");
    p2.innerHTML = "Matches: " + element.matches;
    div.appendChild(p2);

    var button1 = document.createElement("button");
    button1.innerHTML = "View";
    button1.setAttribute("onclick", "viewMatch(" + element.id + ")");
    div.appendChild(button1);

    var button2 = document.createElement("button");
    button2.innerHTML = "Remove";
    button2.setAttribute("onclick", "removeMatch(" + element.id + ")");
    div.appendChild(button2);

    document.getElementById("match").appendChild(div);
  });
}

function removeMatchPreviews() {
  document.getElementById("match").innerHTML = "<h3>View your matches</h3>";
}

function viewMatch(id) {
  document.getElementById("match").innerHTML = "";

  var div = document.createElement("div");
  div.setAttribute("class", "match_view");
  div.innerHTML = "<p>info about the match here<\p>";

  var button = document.createElement("button");
  button.innerHTML = "Back";
  button.setAttribute("onclick", "addMatchPreviews()");
  div.appendChild(button);
  
  document.getElementById("match").appendChild(div);
}

function removeMatch(id) {
  //TODO alert box
  //TODO tell db to delete it
  document.getElementById("match").removeChild(document.getElementById("match_preview_"+id));
}