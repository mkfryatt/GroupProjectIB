function deleteMatch(id) {
  console.log("test");
  $("#confirm-removal").remove();
  //TODO tell backend to delete it
  $("#card-"+id).remove();
}

function submitTravelEdit(id) {
  var email = $("#email").val();
  if (email == "") {
    //TODO tell them no
}
  deleteTravel(id);
  submitTravelNew();
}

function submitTravelNew() {
  var attrs = ["searchbox", "start-date", "end-date"];

  //TODO submit travel to backend
  console.log("submit travel");

  //clear fields
  attrs.forEach(element => {
    $("#"+element+"-travel").attr("value", "");
  });

  // switch back to view of all travel
  $("#travel-default").empty();
  showDefaultTravel();
  $("#travel-default").show();
  $("#travel-add").hide();
}

function deleteTravel(id) {
  $("#confirm-removal").remove();

  //TODO tell backend to delete it
  /* something like this??
  $.post("backend.php", 
    {type: delete_travel, travel_id: id}, 
    function(data, status) {
      alert("Data: " + data + "\nStatus: " + status);
    }
  );
  */

  $("#travel-"+id).remove();
}

function submitWish() {
  //TODO submit wish to backend

  //clear fields
}