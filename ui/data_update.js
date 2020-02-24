function deleteMatch(id) {
  $("#confirm-removal").remove();
  //TODO tell backend to delete it
  $("#card-"+id).remove();
}

function submitTravelEdit(id) {
  deleteTravel(id);
  submitTravelNew();
}

function submitTravelNew() {
  //get org constraints
  var org = $("#org-travel").val();

  //get time sonstraints
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
  var city = $("#searchbox-travel").val().split(",")[0];
  var country = $("#searchbox-travel").val().split(" ")[1];
  var lat = selectionTravel.location.latitude;
  var lon = selectionTravel.location.longitude;

  //tell backend
  //TODO tell them email + org
  createNewTravel(city, country, lat, lon, start, end, updateMap);
  clearForm("travel");

  // switch back to view of all travel
  $("#travel-default").empty();
  showDefaultTravel();
  $("#travel-default").show();
  $("#travel-add").hide();
}

function deleteTravel(id) {
  $("#confirm-removal").remove();
  //TODO change callback
  deleteTravelFromId(id, updateMap);
  $("#travel-"+id).remove();
}

function submitWish() {
  //get org constraints
  var org;
  if ($("#org-wish").val()=="") {
    org = [];
  } else {
    org = [{org_name:$("#org-wish").val()}];
  }

  //get time sonstraints
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
  $("#warning-wish").hide();
  var lat, lon, city, country, loc;
  city = $("#searchbox-wish").val().split(",")[0];
  country = $("#searchbox-wish").val().split(" ")[1];
  lat = selectionWish.location.latitude;
  lon = selectionWish.location.longitude;
  loc = [{city: city, country: country, lat: lat, lon:lon}];

  //tell backend
  createNewWish(email, time, org, loc, updateMap);
  clearForm("wish");
}

function submitAdmin() {
  //get org constraints
  if ($("#org-admin").val()=="") {
    $("#warning-admin").text("Please enter an organisation.");
    $("#warning-admin").show();
    return;
  }
  $("#warning-admin").hide();
  var org = $("#org-admin").val();

  //get time sonstraints
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
  $("#warning-admin").hide();
  var city = $("#searchbox-admin").val().split(",")[0];
  var country = $("#searchbox-admin").val().split(" ")[1];
  var lat = selectionAdmin.location.latitude;
  var lon = selectionAdmin.location.longitude;

  //tell backend
  //TODO change this function
  createNewTravel(city, country, lat, lon, start, end, updateMap);

  clearForm("admin");
}

function clearForm(type) {
  var attrs = ["org", "searchbox", "start-date", "end-date"];
  attrs.forEach(element => {
    $("#"+element+"-"+type).val("");
  });
}