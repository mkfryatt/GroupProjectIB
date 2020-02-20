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
  //TODO submit travel to backend
  clearForm("travel");

  // switch back to view of all travel
  $("#travel-default").empty();
  showDefaultTravel();
  $("#travel-default").show();
  $("#travel-add").hide();
}

function deleteTravel(id) {
  $("#confirm-removal").remove();
  //TODO tell backend to delete it
  $("#travel-"+id).remove();
}

function submitWish() {
  //TODO submit wish to backend
  clearForm("wish");
}

function submitAdmin() {
  //TODO submit presence to backend
  clearForm("admin");
}

function clearForm(type) {
  var attrs = ["name", "reason", "org", "searchbox", "start-date", "end-date"];
  attrs.forEach(element => {
    $("#"+element+"-"+type).val("");
  });
}