var email = "";

function init() {
  showLogin();

  document.getElementById("start-date-map").valueAsDate = new Date();
  var date = new Date();
  date.setMonth(1 + date.getMonth());
  document.getElementById("end-date-map").valueAsDate = date;

  showDefaultTravel();
  showMatchPreviews();
  openTab("cal");

  initMap();
}

function openTab(type) {
  $(".tabcontent").hide();
  $(".tab button").css("background-color", "");
  $("#"+type+"-btn").css("background-color", "#f4f4f4");
  $("#"+type).show();
}

function showLogin() {
  var div1 = document.createElement("div");
  div1.setAttribute("class", "modal");
  div1.setAttribute("id", "login");

  var div2  = document.createElement("div");
  div2.setAttribute("class", "modal-dialog");

  var divContent = document.createElement("div");
  divContent.setAttribute("class", "modal-content");

  var divBody = document.createElement("div");
  divBody.setAttribute("class", "modal-body");

  var warning = document.createElement("div");
  warning.setAttribute("class", "alert alert-danger");
  warning.setAttribute("id", "warning");
  warning.innerText = "Please enter a valid email address.";

  var input = document.createElement("input");
  input.setAttribute("class", "form-control");
  input.setAttribute("id", "email");
  input.setAttribute("placeholder", "Email");
  input.setAttribute("value", "");

  var button = document.createElement("button");
  button.setAttribute("class", "btn btn-primary");
  button.setAttribute("onclick", "tryLogin()");
  button.innerText = "Login";

  divBody.append(warning);
  divBody.append(input);
  divBody.append(button);

  divContent.append(divBody);

  div2.append(divContent);
  div1.append(div2);

  $("body").append(div1);
  $("#warning").hide();
  $("#login").show();
}

function tryLogin() {
  if ($("#email").val()=="") {
    //TODO better email validation
    $("#warning").show();
  } else {
    email = $("#email").val();
    $("#login").remove();
  }
}

function showMatchPreviews() {
  var matches = getMatchPreviews();

  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "card-"+ element.id);

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
    remove.setAttribute("onclick", "removeMatchConfirmation(" + element.id + ")");
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
  var matches = getMatchDetails(id);

  $("#match-title").text("View choices for match");
  $("#match-back-btn").show();

  matches.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");

    var card = document.createElement("div");
    card.setAttribute("class", "card");

    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    cardHeader.innerHTML = element.person;
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");

    list.append(createLI("Carbon Saving", "???", ""));
    list.append(createLI("City", "???", ""));
    list.append(createLI("Dates", "???", ""));

    card.append(cardHeader);
    card.append(list);
    div.append(card);

    $("#match-view").append(div);
  });

  $("#match-previews").hide();
  $("#match-view").show();
}

function showCarbonDetails() {
  var details = getCarbonDetails();

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

  //TODO add stuff to div body

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

function showDefaultTravel() {
  $("#travel-default").empty();
  var travels = getAllTravel();

  var btnAdd = document.createElement("button");
  btnAdd.setAttribute("class", "btn btn-success");
  btnAdd.setAttribute("onclick", "showAddTravel()");
  btnAdd.innerText = "Add new travel";

  $("#travel-default").append(btnAdd);

  travels.forEach(element => {

    var div = document.createElement("div");
    div.setAttribute("class", "col-sm-1");
    div.setAttribute("id", "travel-"+element.id);

    var card = document.createElement("div");
    card.setAttribute("class", "card");
    
    var list = document.createElement("ul");
    list.setAttribute("class", "list-group list-group-flush");

    var footer = document.createElement("div");
    footer.setAttribute("class", "card-footer");

    var btnGroup = document.createElement("div");
    btnGroup.setAttribute("class", "btn-group");

    var btnEdit = document.createElement("button");
    btnEdit.setAttribute("class", "btn btn-primary");
    btnEdit.setAttribute("onclick", "showEditTravel("+element.id+")");
    btnEdit.innerText = "Edit";

    var btnRemove = document.createElement("button");
    btnRemove.setAttribute("class", "btn btn-danger");
    btnRemove.setAttribute("onclick", "removeTravelConfirmation("+element.id+")");
    btnRemove.innerText = "Remove";

    list.append(createLI("City", element.city, element.id));
    list.append(createLI("Country", element.country, element.id));
    list.append(createLI("Start", element.startDate, element.id));
    list.append(createLI("End", element.endDate, element.id));

    btnGroup.append(btnEdit);
    btnGroup.append(btnRemove);
    footer.append(btnGroup);

    card.append(list);
    card.append(footer);
    div.append(card);

    $("#travel-default").append(div);
  });

  $("#travel-add").hide();
  $("#travel-default").show();
}

function showAddTravel() {
  $("#travel-default").hide();
  $("#travel-add").show();
  $("#travel-btn").attr("onclick", "submitTravelNew()");
}

function showEditTravel(id) {
  var travel = getTravelByID(id);

  $("#travel-default").hide();
  $("#travel-add").show();

  var textAttrs = ["name", "org", "reason", "searchbox"];
  var textVals = [travel.name, travel.org, travel.reason, travel.city];
  for (var i=0; i<2; i++) {
    $("#"+textAttrs[i]+"-travel").val(textVals[i]);
  }

  //TODO fix the date parsing part
  var dateAttrs = ["start", "end"];
  var dateVals = [travel.startDate, travel.endDate];
  for (var i=0; i<2; i++) {
    $("#"+dateAttrs[i]+"-travel").val(dateVals[i]);
  }

  $("#travel-btn").attr("onclick", "submitTravelEdit("+id+")");
}

function removeTravelConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Remove Travel", 
    "Would you like to permanently delete this travel item?", 
    "deleteTravel("+id+")");

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function removeMatchConfirmation(id) {
  var dialog = createDialog("confirm-removal", 
    "Remove Wish", 
    "Would you like to permanently delete this wish?", 
    "deleteMatch("+id+")");

  $("body").append(dialog);
  $("#confirm-removal").show();
}

function createDialog(dialogID, dialogTitle, dialogQuestion, dialogOK) {
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

  var btnDelete = document.createElement("button");
  btnDelete.setAttribute("class", "btn btn-primary");
  btnDelete.setAttribute("onclick", dialogOK);
  btnDelete.innerText = "Delete";

  var btnCancel = document.createElement("button");
  btnCancel.setAttribute("class", "btn btn-secondary");
  btnCancel.setAttribute("onclick", "$('#"+dialogID + "').remove()");
  btnCancel.innerText = "Cancel";

  btnX.append(span);
  divHeader.append(title);
  divHeader.append(btnX);

  divBody.append(p);

  divFooter.append(btnDelete);
  divFooter.append(btnCancel);

  divContent.append(divHeader);
  divContent.append(divBody);
  divContent.append(divFooter);

  div2.append(divContent);
  div1.append(div2);

  return div1;
}

function createLI(title, value, id) {
  var li = document.createElement("li");
  li.setAttribute("class", "list-group-item");
  li.innerText = title + ": \n" + value;
  return li;
}