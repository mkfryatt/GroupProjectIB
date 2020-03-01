function checkOrganisation(type, id) {
  if (email=="") {return;} //just in case they avoided logging in
  var org = $("#org-"+type).val();
  if (org!="" && !(type=="admin"&& $("#unep-check").is(':checked'))) {
    organisationExists(org, result => {
      if (result.hasOwnProperty("error")) {
        console.error("Error checking organisation exists:\n"+JSON.stringify(result));
      } else if (result.exists) {
        doSubmit(type, id);
      } else {
        //org unknown, so ask if they want to create a new one
        var dialog = createDialog("new-org", 
        "Create New Organisation", 
        "Would you like to create a new organisation called '"+org+"'?",
        "createNewOrganisation('"+org+"', e => {doSubmit('"+type+"', "+id+"); $('#new-org').remove()})", 
        null);
        $("body").append(dialog);
        $("#new-org").show();
      }
    });
  }
}

//takes type (travel, wish, admin) and id (always -1 unless submitting edit travel)
function doSubmit(type, id) {
  switch (type) {
    case "travel":
      submitTravel(id);
      break;
    case "wish":
      submitWish();
      break;
    case "admin":
      submitAdmin();
      break;
    default:
      console.error("Error:\nUnknown type when submitting "+type);
  }
}

//if id=-1, then this is a whole new travel item, otherwise it is edit travel
function submitTravel(id) {
  //get name
  var name = $("#tag-travel").val();
  if ($("#tag-travel").val()=="") {
    $("#warning-travel").text("Please enter an event name before submitting.");
    $("#warning-travel").show();
    return;
  }

  //get times
  var start = Math.round(document.getElementById("start-date-travel").valueAsDate/1000);
  var end = Math.round(document.getElementById("end-date-travel").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-travel").text("Please select a valid start and end date.");
    $("#warning-travel").show();
    return;
  }

  //get location fields
  if (selectionTravel==null || $("#searchbox-travel").val()=="") {
    $("#warning-travel").text("Please select a location from the drop down list before submitting.");
    $("#warning-travel").show();
    return;
  }
  var city = selectionTravel.address.locality;
  var country = selectionTravel.address.countryRegion;
  var lat = selectionTravel.location.latitude;
  var lon = selectionTravel.location.longitude;

  //get orgs (optional, may just be "")
  var org = $("#org-travel").val();

  //submit to backend
  createNewTravel(name, city, country, lat, lon, start, end, email, org, result => {
    if (result.hasOwnProperty("error")) {
      console.error("Error submitting travel:\n"+JSON.stringify(result));
      $("#warning-travel").text("Error: " + result.error);
      $("#warning-travel").show();
    } else {
      clearForm("travel");
      $("#warning-travel").hide();
      //if it is an edited travel item, delete the original
      if (id!=-1) {
        deleteTravel(id);
      }
      selectionTravel = null;
      getAllTravelFromUser(email, makeDefaultTravel);
      updateMap();
    }
  });
}

function deleteTravel(id) {
  $("#confirm-removal").remove();
  deleteTravelFromId(id, result => {
    if (result.hasOwnProperty("error")) {
      console.error("Error deleting travel:\n"+JSON.stringify(result));
    } else {
      $("#travel-"+id).remove();
      updateMap();
    }
  });
}

function submitWish() {
  //get tag / name
  var tag = $("#tag-wish").val();
  if (tag=="") {
    $("#warning-wish").text("Please enter a tag or name for your wish before submitting.");
    $("#warning-wish").show();
    return;
  }

  //get org constraints (optional)
  var org;
  if ($("#org-wish").val()=="") {
    org = [];
  } else {
    org = [{name:$("#org-wish").val()}];
  }

  //get time constraints
  var start = Math.round(document.getElementById("start-date-wish").valueAsDate/1000);
  var end = Math.round(document.getElementById("end-date-wish").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-wish").text("Please select a valid start and end date.");
    $("#warning-wish").show();
    return;
  }
  var time = [{startTime: start, endTime: end}];

  //get position constraints (optional)
  var loc = [];
  if ($("#searchbox-wish").val()!="") {
    if (selectionWish==null) {
      //this implies they have typed in a loc
      //but not actually selected anything from the dropdown list
      //so it warns them and fails to submit
      $("#warning-wish").text("Please select a location from the drop down list before submitting.");
      $("#warning-wish").show();
      return;
    } else {
      var city = selectionWish.address.locality;
      var country = selectionWish.address.countryRegion;
      var lat = selectionWish.location.latitude;
      var lon = selectionWish.location.longitude;
      loc = [{city: city, country: country, lat: lat, lon: lon}];
    }
  }

  //must have at least position or org
  if (loc==[] && org==[]) {
    $("#warning-wish").text("Please enter a location or an organisation.");
    $("#warning-wish").show();
    return;
  }

  //tell backend
  createNewWish(tag, email, time, org, loc, result => {
    if (result.hasOwnProperty("error")) {
      console.error("Error submitting wish:\n"+JSON.stringify(result));
      $("#warning-wish").text("Error: " + result.error);
      $("#warning-wish").show();
    } else {
      $("#warning-wish").hide();
      getAllWishesFromUser(email, makeWishes);
      clearForm("wish");
      openTab("wish");
      submitWish = null;
      updateMap();
    }
  });
}

function deleteWish(id) {
  $("#confirm-removal").remove();

  deleteWishFromId(id, result => {
    if (result.hasOwnProperty("error")) {
      console.error("Error deleting wish:\n"+JSON.stringify(result));
    } else {
      $("#wish-"+id).remove();
      updateMap();
    }
  });
}

function submitAdmin() {
  var unep_project = $("#unep-check").is(':checked');

  //get org / project name
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

  //get times
  var start = Math.round(document.getElementById("start-date-admin").valueAsDate/1000);
  var end = Math.round(document.getElementById("end-date-admin").valueAsDate/1000);
  if (end==0 || start==0 || end < start) {
    $("#warning-admin").text("Please select a valid start and end date.");
    $("#warning-admin").show();
    return;
  }

  //get position
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
    if (result.hasOwnProperty("error")) {
      console.error("Error submitting admin:\n"+JSON.stringify(result));
      $("#warning-admin").text("Error: " + result.error);
      $("#warning-admin").show();
    } else {
      $("#warning-admin").hide();
      clearForm("admin");
      selectionAdmin = null;
      updateMap();
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
  $("#confirm-removal").remove();
  acceptSuggestion(id, result => {
    if (result.hasOwnProperty("error")) {
      console.error("Error accepting match:\n"+JSON.stringify(result));
    } else {
      //switch back to all wishes view
      getAllWishesFromUser(email, makeWishes);
      $("#match-previews").hide();
      $("#matches-back-btn").hide();
      $("#wish-previews").show();
      getEmissionsSavedFromUser(email, updateCarbonCounter);
      updateMap();
    }
  });
}

function clearForm(type) {
  var attrs = ["org", "searchbox", "start-date", "end-date", "tag"];
  attrs.forEach(element => $("#"+element+"-"+type).val(""));
  //remove warnings and highlighted boxes
  $("#org-"+type).attr("class", "form-control");
  $("#warning-"+type).hide();
}