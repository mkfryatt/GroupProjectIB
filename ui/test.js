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
      addMatches();
    } else {
      removeMatches();
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

function addMatches() {
  //TODO get list of matches
  var matches = [{"reason": "blah", "matches": 3, "id": 343}, {reason: "dfdsvf", matches: 23, "id": 45}];
  matches.forEach(element => {
    var div = document.createElement("div");
    div.setAttribute("class", "match_preview");
    var inside = "<p>Reason: " 
    + element.reason 
    + "</p><p>Matches: " 
    + element.matches 
    + "</p><button id=\"view_match\" onclick=\"viewMatch("
    + element.id
    +")\">View</button><button id=\"remove_match\" onclick=\"viewMatch("
    + element.id
    +")\">X</button>"
    div.innerHTML = inside;
    document.getElementById("match").appendChild(div);
  });
}

function removeMatches() {
  document.getElementById("match").innerHTML = "<h3>View your matches</h3>";
}