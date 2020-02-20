function deleteMatch(id) {
  console.log("test");
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

  //clear fields
  var attrs = ["searchbox", "start-date", "end-date"];
  attrs.forEach(element => {
    $("#"+element+"-travel").attr("value", "");
  });

  // switch back to view of all travel
  $("#travel-default").empty();
  getTravel();
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