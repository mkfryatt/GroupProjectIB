var mapBoxKey = 'pk.eyJ1IjoiamdjNDYiLCJhIjoiY2s2N3N0N3czMGIwaDNtb2RxNHZzazgwNSJ9.1OQ8CCRVLbUBbycUpn4T5Q';
var bingMapsKey;

var email = "";
var firstUser = true;

//this is called once (when the page loads)
function init() {
  showLogin();

  //add listener to checkbox on admin tab
  $("#unep-check").change(function(){
    if($(this).is(':checked')) {
      $("#org-admin").attr("placeholder", "Project Name");
      //get rid of warning for org name
      $("#org-admin").attr("class", "form-control");
    } else {
      $("#org-admin").attr("placeholder", "Organisation");
      organisationExists($("#org-admin").val(), result => {
        if (!result.exists) {
          $("#org-admin").attr("class", "form-control is-invalid");
        } else {
          $("#org-admin").attr("class", "form-control");
        }
      });
    }
  });

  //default timeframe for map is one month (from today)
  document.getElementById("start-date-map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end-date-map").valueAsDate = date;

  //open correct tab
  var tabs = ["travel", "wish", "admin"];
  tabs.forEach(type => {
    $("#warning-"+type).hide();
    //add listener to org fields so that it detect when new orgs are typed in
    $("#org-"+type).focusout(e => organisationExists($("#org-"+type).val(), result => {
      if ($("#org-"+type).val()!="" && !result.exists && (type!="admin" || !$("#unep-check").is(":checked"))) {
        $("#org-"+type).attr("class", "form-control is-invalid");
      } else {
        $("#org-"+type).attr("class", "form-control");
      }
    }));
  });
  openTab("cal");
}

//type is "cal", "wish", "match",  or "admin"
function openTab(type) {
  $(".tabcontent").hide();
  $(".tab button").css("background-color", "");
  $("#"+type+"-btn").css("background-color", "#f4f4f4");
  $("#"+type).show();
}

function switchUser() {
  //reset timeframe
  document.getElementById("start-date-map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end-date-map").valueAsDate = date;

  //reset tabs
  var tabs = ["travel", "wish", "admin"];
  tabs.forEach(e => {
    $("#warning-"+e).hide();
    clearForm(e);
  });
  openTab("cal");

  showLogin();
}

function showLogin() {
  var div = document.createElement("div");
  var warning = document.createElement("div");
  warning.setAttribute("class", "alert alert-danger");
  warning.setAttribute("id", "warning");
  warning.innerText = "Please enter a valid email address.";
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "form-control");
  input.setAttribute("id", "email");
  input.setAttribute("placeholder", "Email");
  input.setAttribute("value", "");
  div.append(warning);
  div.append(input);

  var dialog = createDialog("login", "Log In", "", "tryLogin()", div);
  $("body").append(dialog);
  $("#warning").hide();
  $("#login").show();
  $("#email").focus();
}

function tryLogin() {
  //email can't be empty string
  if ($("#email").val()=="") {
    $("#warning").show();
  } else {
    email = $("#email").val();
    //if unknown email, need to ask for name to create new user
    userExists(email, result => {
      if (result.exists) {
        doLogin();
      } else {
        showNewUser();
      }
    });
  }
}

//bring up dialog to create a new user
function showNewUser() {
  var div = document.createElement("div");
  div.setAttribute("class", "form-group");
  var firstName = document.createElement("input");
  firstName.setAttribute("type", "text");
  firstName.setAttribute("class", "form-control");
  firstName.setAttribute("id", "first-name");
  firstName.setAttribute("placeholder", "First Name");
  var lastName = document.createElement("input");
  lastName.setAttribute("type", "text");
  lastName.setAttribute("class", "form-control");
  lastName.setAttribute("id", "last-name");
  lastName.setAttribute("placeholder", "Last Name");
  div.append(firstName);
  div.append(lastName);

  var dialog = createDialog("new-user",
  "Create New User",
  "The email "+ email + " is unrecognised. Please submit your details.",
  "makeNewUser()",
  div);

  $("body").append(dialog);
  $("#new-user").show();
  $("#first-name").focus();
}

function makeNewUser() {
  var first = $("#first-name").val();
  var last = $("#last-name").val();
  if (first!="" && last!="") {
    createNewUser(email, first, last, 
      result => {
        if (result.hasOwnProperty("error")) {
          showNewUser();
        } else {
          //remove dialog and set up their page
          $("#new-user").remove();
          doLogin();
        }
      });
  }
}

function doLogin() {
  $("#current-user").text(email);
  $("#login").remove();

  //set up travel tab
  getAllTravelFromUser(email, makeDefaultTravel);
  $("#travel-add").hide();
  $("#travel-default").show();

  //set up wishes tab, with wish previews open
  getAllWishesFromUser(email, makeWishes);
  $("#match-previews").hide();
  $("#matches-back-btn").hide(); //this button is only for the match preview page
  $("#wish-previews").show();

  getEmissionsSavedFromUser(email, updateCarbonCounter);

  //can only call initMap once, so if this is't the first user, just updateMap
  if (firstUser) {
    initMap();
    firstUser = false;
  }
  else{
   updateMap();
  }
}

//makes the wishes tab, doesn't show it
//callback function for getAllWishesFromUser
function makeWishes(wishes) {
  if (wishes.length>0 && wishes[0].hasOwnProperty("error")) {
    console.error("Error making wishes:\n"+ JSON.stringify(wishes));
    return;
  }

  //update to the wish view
  $("#wish-previews").empty();
  $("#match-title").text("View all wishes");

  wishes.forEach(element => {
    //get the number of matches for that wish
    getAllSuggestionsFromWish(element.id, matches => $("#num-matches-"+element.id).text(matches.length));

    //needs wish id so it can be easily removed if needed
    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "wish-"+ element.id);

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    //needs wish id so that the number of matches can be filled in later
    var cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = "<span class='badge badge-success' id='num-matches-"+element.id+"'></span>";
    
    var cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");

    //add org and loc info for wish
    cardText.innerHTML = "<b>" + element.name + "</b><br>";
    if (element.constraints.hasOwnProperty("organisations")) {
      element.constraints.organisations.forEach(org => cardText.innerHTML += org.name + "<br>");
    }
    if (element.constraints.hasOwnProperty("locations")) {
      element.constraints.locations.forEach(loc => cardText.innerHTML += loc.city + ", " + loc.country + "<br>");
    }
    
    var btns = document.createElement("div");
    btns.setAttribute("class", "btn-group");

    //button gets all matches for that wish, then displays them
    var view = document.createElement("button");
    view.innerHTML = "View";
    view.setAttribute("onclick", "getAllSuggestionsFromWish(" + element.id + ", showMatches)");
    view.setAttribute("class", "btn btn-success");
    $(view).click(e => wishesMapUpdate(element.id));

    //button brings up wish delete confirmation
    var remove = document.createElement("button");
    remove.innerHTML = "Remove";
    remove.setAttribute("onclick", "removeWishConfirmation(" + element.id + ")");
    remove.setAttribute("class", "btn btn-danger");

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    btns.append(view);
    btns.append(remove);
    cardBody.append(btns);
    card.append(cardBody);
    div.append(card);
    $("#wish-previews").append(div);
  });
}

//hides the matches view and goes back to all wishes view
function hideMatches() {
  $("#match-previews").empty();
  $("#matches-back-btn").hide();
  $("#match-previews").hide();
  $("#match-title").text("View all wishes");
  $("#wish-previews").show();

  updateMap();
}

//makes and shows matches
function showMatches(matches) {
  if (matches.length>0 && matches[0].hasOwnProperty("error")) {
    console.error("Error getting matches:\n"+JSON.stringify(matches));
    return;
  }

  $("#match-previews").empty();
  $("#match-title").text("View all matches for your wish");
  $("#matches-back-btn").show(); //this button takes user back to wish view
  
  //sorts by score, highest to lowest
  matches.sort((a, b) => b.score - a.score);

  matches.forEach(element => {
    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    var reps = "";
    if (element.hasOwnProperty("unep_reps")) {
      element.unep_reps.forEach(rep => reps += rep.firstName + " "+ rep.lastName + "<br>");
    }
    cardHeader.innerHTML = reps;
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");
    list.append(createLI("Emissions", Math.round(element.emissions)));

    //two types of match: static unep hq (no dates needed); person's travel to visit org / loc
    if (element.hasOwnProperty("unepPresenceId")) {
      list.append(createLI("Presence", element.unepPresenceName));
      list.append(createLI("Location", element.city + ", " + element.country));
    } else {
      var options = {year: "numeric", month: "short", day: "numeric" };
      var start = (new Date(element.unepTripStart * 1000)).toLocaleDateString("en-GB", options);
      var end = (new Date(element.unepTripEnd * 1000)).toLocaleDateString("en-GB", options);

      list.append(createLI("Organisation", element.tripOrgName));
      list.append(createLI("Location", element.city + ", " + element.country));
      list.append(createLI("Dates", start + " - " + end));
    }

    var btn = document.createElement("button");
    btn.setAttribute("class", "btn btn-success");
    btn.setAttribute("onclick", "acceptMatchConfirmation("+element.id+")");
    btn.innerText = "Accept";
    list.append(btn);

    card.append(cardHeader);
    card.append(list);
    div.append(card);
    $("#match-previews").append(div);
  });

  $("#wish-previews").hide();
  $("#match-previews").show();
}

function updateCarbonCounter(carbon) {
  if (carbon.hasOwnProperty("error")) {
    console.error("Error getting carbon saved:\n"+JSON.stringify(carbon));
    return;
  }
  $("#carbon-saved").text("Carbon Saved: " + Math.round(carbon.emissionsSaved));
}

function showCarbonDetails(details) {
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

  //TODO add carbon details

  btnX.append(span);
  divHeader.append(title);
  divHeader.append(btnX);

  divContent.append(divHeader);
  divContent.append(divBody);

  div2.append(divContent);
  div1.append(div2);

  $("body").prepend(div1);
  $("#carbon-details").show();
}

//shows travel page with all user's travel cards
function showDefaultTravel() {
  $("#travel-add").hide();
  $("#travel-warning").hide();
  clearForm("travel");
  $("#travel-default").show();
}

//makes travel page with card for each travel item of current user
function makeDefaultTravel(travels) {
  if (travels.hasOwnProperty("error")) {
    console.error("Error getting travels:\n"+JSON.stringify(travels));
    return;
  }
  $("#travel-default").empty();

  var btnAdd = document.createElement("button");
  btnAdd.setAttribute("class", "btn btn-success");
  btnAdd.setAttribute("onclick", "showAddTravel()");
  btnAdd.innerText = "Add new travel";
  $("#travel-default").append(btnAdd);

  travels.forEach(element => {
    //needs travel id so that it can be removed if needed
    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "travel-"+element.travel_id);

    var card = document.createElement("div");
    card.setAttribute("class", "card");
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");

    var footer = document.createElement("div");
    footer.setAttribute("class", "card-footer");

    var btnGroup = document.createElement("div");
    btnGroup.setAttribute("class", "btn-group");

    //button switches travel tab to edit travel form
    var btnEdit = document.createElement("button");
    btnEdit.setAttribute("class", "btn btn-primary");
    btnEdit.setAttribute("onclick", "getTravelFromId("+element.travel_id+", showEditTravel)");
    btnEdit.innerText = "Edit";

    //button brings up delete travel confirmation
    var btnRemove = document.createElement("button");
    btnRemove.setAttribute("class", "btn btn-danger");
    btnRemove.setAttribute("onclick", "removeTravelConfirmation("+element.travel_id+")");
    btnRemove.innerText = "Remove";

    var options = {year: "numeric", month: "short", day: "numeric" };
    var start = (new Date(element.startTime * 1000)).toLocaleDateString("en-GB", options);
    var end = (new Date(element.endTime * 1000)).toLocaleDateString("en-GB", options);

    list.append(createLI("Trip", element.travel_name));
    //orgs is optional, so have to check if this element has it
    if (element.hasOwnProperty("organisations")) {
      var orgs = "";
      element.organisations.forEach(org => orgs += org.name + "<br>");
      list.append(createLI("Organisations", orgs));
    }
    list.append(createLI("Location", element.city + ", " + element.country));
    list.append(createLI("Times", start + " - " + end));

    btnGroup.append(btnEdit);
    btnGroup.append(btnRemove);
    footer.append(btnGroup);
    card.append(list);
    card.append(footer);
    div.append(card);
    $("#travel-default").append(div);
  });
}

//travel tab page to add new travel
function showAddTravel() {
  $("#travel-default").hide();
  $("#travel-add").show();
  $("#travel-btn").attr("onclick", "checkOrganisation('travel', -1)");
  $("#travel-title").text("Add new travel");
}

//travel tab page to edit selected travel item
function showEditTravel(travel) {
  if (travel.hasOwnProperty("error")) {
    console.error("Error getting travel item:\n"+JSON.stringify(travel));
    return;
  }
  $("#travel-default").hide();
  $("#travel-add").show();
  $("#travel-title").text("Edit travel");

  $("#tag-travel").val(travel.name);

  if (travel.hasOwnProperty("organisations") && travel.organisations.length>0) {
    $("#org-travel").val(travel.organisations[0].name);
  }

  getLocationFromId(travel.loc_id, loc => {
    if (loc.hasOwnProperty("error")) {
      console.error("Error getting location from travel:\n"+JSON.stringify(loc));
      return;
    }
    $("#searchbox-travel").val(loc.city + ", "+ loc.country);
  });

  document.getElementById("start-date-travel").valueAsDate = new Date(travel.startTime * 1000);
  document.getElementById("end-date-travel").valueAsDate = new Date(travel.endTime * 1000);

  $("#travel-btn").attr("onclick", "checkOrganisation('travel', "+travel.id+")");
  $("#org-travel").focus();
}

function removeTravelConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Remove Travel", 
    "Would you like to permanently delete this travel item?", 
    "deleteTravel("+id+")",
    null);

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function removeWishConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Remove Wish", 
    "Would you like to permanently delete this wish?", 
    "deleteWish("+id+")",
    null);

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function acceptMatchConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Accept Match", 
    "Would you like to accept this match? It will also permenantly delete the corresponding wish.", 
    "acceptMatch("+id+")",
    null);

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function createDialog(dialogID, dialogTitle, dialogQuestion, dialogOK, fields) {
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

  var btnOK = document.createElement("button");
  btnOK.setAttribute("class", "btn btn-primary");
  btnOK.setAttribute("onclick", dialogOK);
  btnOK.innerText = "OK";

  var btnCancel = document.createElement("button");
  btnCancel.setAttribute("class", "btn btn-secondary");
  btnCancel.setAttribute("onclick", "$('#"+dialogID + "').remove()");
  btnCancel.innerText = "Cancel";

  btnX.append(span);
  divHeader.append(title);
  divHeader.append(btnX);

  divBody.append(p);
  if (fields != null) {
    divBody.append(fields);
  }

  divFooter.append(btnOK);
  divFooter.append(btnCancel);

  divContent.append(divHeader);
  divContent.append(divBody);
  divContent.append(divFooter);

  div2.append(divContent);
  div1.append(div2);

  return div1;
}

function createLI(title, value) {
  var li = document.createElement("li");
  li.setAttribute("class", "list-group-item");
  li.innerHTML = "<b>"+title + "</b><br>" + value;
  return li;
}