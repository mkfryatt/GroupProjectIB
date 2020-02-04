function init() {
  //TODO
}

function openTab(event, type) {
    var i, tabcontent, tablinks;

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

function submitWish() {
    var name, loc, reason, from, to;

    name = document.getElementById("name_wish").value;
    reason = document.getElementById("reason_wish").value;
    loc = document.getElementById("loc_wish").value;
    from = new Date(document.getElementById("from_wish").value);
    to = new Date(document.getElementById("to_wish").value);

    //use an api to get the lat + lng of the location
    //check that from < to
    document.getElementById("name_wish").value = "";
    document.getElementById("reason_wish").value = "";
    document.getElementById("loc_wish").value = "";
    document.getElementById("from_wish").value = Date.now;
    document.getElementById("to_wish").value = Date.now;
}

function submitAdmin() {
    var loc, org, from, to;

    loc = document.getElementById("loc_admin").value;
    org = document.getElementById("org_admin").value;
    from = new Date(document.getElementById("from_admin").value);
    to = new Date(document.getElementById("to_admin").value);

    //use an api to get the lat + lng of the location
    //check that from < to
    document.getElementById("loc_admin").value = "";
    document.getElementById("org_admin").value = "";
    document.getElementById("from_admin").value = Date.now;
    document.getElementById("to_admin").value = Date.now;
}

function submitCalendar() {
  
}