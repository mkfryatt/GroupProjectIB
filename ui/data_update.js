//if id=-1, then this is a whole new travel item
function submitTravel(id) {
  console.log("submit travel new");

  //get org constraints
  var org_name = $("#org-travel").val();

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

  //i it is an edited travel item, delete the original
  if (id!=-1) {
    deleteTravel(id);
  }

  //submit new travel item
  createNewTravel(org_name, city, country, lat, lon, start, end, email, "", result => {
    console.log("Submit travel: "+ JSON.stringify(result));
    if (result.hasOwnProperty("error")) {
      console.log("error submitting travel");
      $("#warning-travel").text("Error: " + result.error);
      $("#warning-travel").show();
    } else {
      clearForm("travel");
      $("#warning-travel").hide();
      updateMap();
      getAllTravelFromUser(email, makeDefaultTravel);
      selectionTravel = null;
    }
  });
}

function deleteTravel(id) {
  console.log("delete travel: "+ id);
  $("#confirm-removal").remove();
  deleteTravelFromId(id, result => {
    console.log(JSON.stringify("Delete travel: " +result));
    if (result.hasOwnProperty("error")) {
      console.log("error deleting travel");
    } else {
      updateMap();
      $("#travel-"+id).remove();
    }
  });
}

function submitWish() {
  console.log("submit wish");

  //get tag
  var tag;
  if ($("#tag-wish").val()=="") {
    $("#warning-wish").text("Please enter a tag or name for your wish before submitting.");
    $("#warning-wish").show();
    return;
  }
  tag = $("#tag-wish").val();

  //get org constraints
  var org;
  if ($("#org-wish").val()=="") {
    org = [];
  } else {
    org = [{name:$("#org-wish").val()}];
  }

  console.log(JSON.stringify(org));

  //get time constraints
  var start, end, time;
  start = Math.round(document.getElementById("start-date-wish").valueAsDate/1000);
  end = Math.round(document.getElementById("end-date-wish").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-wish").text("Please select a valid start and end date.");
    $("#warning-wish").show();
    return;
  }
  time = [{startTime: start, endTime: end}];

  //get position constraints
  if (selectionWish==null || $("#searchbox-wish").val()=="") {
    $("#warning-wish").text("Please select a location from the drop down list before submitting.");
    $("#warning-wish").show();
    return;
  }
  var lat, lon, city, country, loc;
  var city = selectionWish.address.locality;
  var country = selectionWish.address.countryRegion;
  lat = selectionWish.location.latitude;
  lon = selectionWish.location.longitude;
  loc = [{city: city, country: country, lat: lat, lon: lon}];

  //tell backend
  createNewWish(tag, email, time, org, loc, result => {
    console.log("Submit wish: "+ JSON.stringify(result));
    if (result.hasOwnProperty("error")) {
      console.log("error submitting wish");
      $("#warning-wish").text("Error: " + result.error);
      $("#warning-wish").show();
    } else {
      $("#warning-wish").hide();
      updateMap();
      getAllWishesFromUser(email, makeWishes);
      clearForm("wish");
      openTab("wish");
      submitWish = null;
    }
  });
}

function deleteWish(id) {
  console.log("delete wish: "+ id);
  $("#confirm-removal").remove();

  deleteWishFromId(id, result => {
    console.log("Delete wish: "+ JSON.stringify(result));
    if (result.hasOwnProperty("error")) {
      console.log("error deleting wish");
    } else {
      updateMap();
      $("#wish-"+id).remove();
    }
  });
}

function submitAdmin() {
  console.log("submit admin");
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
  var city = selectionAdmin.address.locality;
  var country = selectionAdmin.address.countryRegion;
  var lat = selectionAdmin.location.latitude;
  var lon = selectionAdmin.location.longitude;

  function callback(result) {
    console.log("Submit admin: "+ JSON.stringify(result));
    if (result.hasOwnProperty("error")) {
      console.log("error submitting admin");
      $("#warning-admin").text("Error: " + result.error);
      $("#warning-admin").show();
    } else {
      $("#warning-admin").hide();
      clearForm("admin");
      updateMap();
      selectionAdmin = null;
    }
  }

  //tell backend
  if (unep_project) {
    createNewUnepPresence(org_project, city, country, lon, lat, start, end, callback);
  } else {
    createNewOrganisationPresence(org_project, city, country, lon, lat, start, end, callback);
  }
}

function acceptMatch(id) {
  console.log("accept match: "+ id);
  $("#confirm-removal").remove();
  acceptSuggestion(id, result => {
    console.log("Accept match: "+ JSON.stringify(result));
    if (result.hasOwnProperty("error")) {
      console.log("error accepting match");
    } else {
      updateMap();
      getAllWishesFromUser(email, makeWishes);
      $("#match-previews").hide();
      $("#matches-back-btn").hide();
      $("#wish-previews").show();
      getEmissionsSavedFromUser(email, updateCarbonCounter);
    }
  });
}

function clearForm(type) {
  var attrs = ["org", "searchbox", "start-date", "end-date", "tag"];
  attrs.forEach(element => $("#"+element+"-"+type).val(""));
}