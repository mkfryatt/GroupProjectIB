function submitTravelEdit(id) {
  deleteTravel(id);
  submitTravelNew();
}

function submitTravelNew() {
  //get org constraints
  var org = $("#org-travel").val();

  //get time constraints
  var start = Math.round(document.getElementById("start-date-travel").valueAsDate/1000);
  var end = Math.round(document.getElementById("end-date-travel").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-travel").text("Please select a valid start and end date.");
    $("#warning-travel").show();
    return;
  }

  //get position constraints
  if (selectionTravel==null || $("#searchbox-travel").val()=="") {
    $("#warning-travel").text("Please select a location from the drop down list before submitting.");
    $("#warning-travel").show();
    return;
  }
  $("#warning-travel").hide();
  var city = selectionTravel.address.locality;
  var country = selectionTravel.address.countryRegion;
  var lat = selectionTravel.location.latitude;
  var lon = selectionTravel.location.longitude;

  //tell backend
  createNewTravel(city, country, lat, lon, start, end, email, org, updateMap);
}

function callbackSubmitTravel(result) {
  if (result.hasOwnProperty("error")) {
    console.log("error submitting travel");
    $("#warning-travel").text("Error: " + result.error);
    $("#warning-travel").show();
  } else {
    clearForm("travel");
    $("#warning-travel").hide();
    updateMap();
    makeDefaultTravel();
  }
}

function deleteTravel(id) {
  $("#confirm-removal").remove();
  deleteTravelFromId(id, callbackDeleteTravel);
}

function callbackDeleteTravel(result) {
  if (result.hasOwnProperty("error")) {
    console.log("error deleting travel");
  } else {
    updateMap();
    $("#travel-"+id).remove();
  }
}

function submitWish() {
  //get org constraints
  var org;
  if ($("#org-wish").val()=="") {
    org = [];
  } else {
    org = [{org_name:$("#org-wish").val()}];
  }

  //get time constraints
  var start, end, time;
  start = Math.round(document.getElementById("start-date-wish").valueAsDate/1000);
  end = Math.round(document.getElementById("end-date-wish").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-wish").text("Please select a valid start and end date.");
    $("#warning-wish").show();
    return;
  }
  time = [{startDate: start, endDate: end}];

  //get position constraints
  if (selectionWish==null || $("#searchbox-wish").val()=="") {
    $("#warning-wish").text("Please select a location from the drop down list before submitting.");
    $("#warning-wish").show();
    return;
  }
  var lat, lon, city, country, loc;
  var city = selectionTravel.address.locality;
  var country = selectionTravel.address.countryRegion;
  lat = selectionWish.location.latitude;
  lon = selectionWish.location.longitude;
  loc = [{city: city, country: country, lat: lat, lon:lon}];

  //tell backend
  createNewWish(email, time, org, loc, callbackSubmitWish);
}

function callbackSubmitWish(result) {
  if (result.hasOwnProperty("error")) {
    console.log("error submitting wish");
    $("#warning-wish").text("Error: " + result.error);
    $("#warning-wish").show();
  } else {
    $("#warning-wish").hide();
    updateMap();
    showWishes();
    clearForm("wish");
    openTab("wish");
  }
}

function deleteWish(id) {
  $("#confirm-removal").remove();
  deleteWishFromId(id, callbackDeleteWish);
}

function callbackDeleteWish(result) {
  if (result.hasOwnProperty("error")) {
    console.log("error deleting wish");
  } else {
    updateMap();
    $("#wish-"+id).remove();
  }
}

function submitAdmin() {
  var unep_project = $("#unep-check").is(':checked');

  //get org constraints
  if ($("#org-admin").val()=="") {
    if (unep_project) {
      $("#warning-admin").text("Please enter a project name.");
    } else {
      $("#warning-admin").text("Please enter an organisation.");
    }
    $("#warning-admin").show();
    return;
  }
  $("#warning-admin").hide();
  var org_project = $("#org-admin").val();

  //get time constraints
  var start = Math.round(document.getElementById("start-date-admin").valueAsDate/1000);
  var end = Math.round(document.getElementById("end-date-admin").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-admin").text("Please select a valid start and end date.");
    $("#warning-admin").show();
    return;
  }

  //get position constraints
  if (selectionAdmin==null || $("#searchbox-admin").val()=="") {
    $("#warning-admin").text("Please select a location from the drop down list before submitting.");
    $("#warning-admin").show();
    return;
  }
  var city = selectionTravel.address.locality;
  var country = selectionTravel.address.countryRegion;
  var lat = selectionAdmin.location.latitude;
  var lon = selectionAdmin.location.longitude;

  //tell backend
  if (unep_project) {
    createNewUnepPresence(org_project, city, country, lon, lat, start, end, callbackSubmitAdmin);
  } else {
    createNewOrganisationPresence(org_project, city, country, lon, lat, start, end, callbackSubmitAdmin);
  }
}

function callbackSubmitAdmin(result) {
  if (result.hasOwnProperty("error")) {
    console.log("error submitting admin");
    $("#warning-admin").text("Error: " + result.error);
    $("#warning-admin").show();
  } else {
    $("#warning-admin").hide();
    clearForm("admin");
    updateMap();
  }
}

function acceptMatch(match_id) {
  $("#confirm-removal").remove();
  //tell backend that match has been accepted
  //delete match

  //acceptMatch(match_id, completeWish);
}

function callbackAcceptMatch(result) {
  if (result.hasOwnProperty("error")) {
    console.log("error accepting match");
  } else {
    updateMap();
    $("#match-previews").hide();
    $("#wish-"+id).remove();
    $("#wish-previews").show();
    //TODO: update carbon counter
  }
}

function clearForm(type) {
  var attrs = ["org", "searchbox", "start-date", "end-date"];
  attrs.forEach(element => {
    $("#"+element+"-"+type).val("");
  });
}