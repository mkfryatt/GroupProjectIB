function getAllTravel() {
  return [{"city":"cambridge", "country":"uk", "startDate": "2020-06-06", "endDate": "2020-07-06", "id":1}];
}

function getTravelByID(id) {
  return {city:"cambridge", country:"uk", startDate: "2020-06-06", endDate: "2020-07-06", id:1};
}

function getMatchPreviews() {
  return [{"reason": "reason goes here", "matches": 3, "id": 1},
  {"reason": "reason goes here", "matches": 4, "id": 2},
  {"reason": "blah", "matches": 3, "id": 3}, 
  {"reason": "reason goes here", "matches": 3, "id": 4}, 
  {"reason": "reason goes here", "matches": 3, "id": 5}];
}

function getMatchDetails(id) {
  return [{"person": "john smith"}, 
  {"person": "john smith"}, 
  {"person": "john smith"}, 
  {"person": "john smith"}, 
  {"person": "john smith"}, 
  {"person": "john smith"}]
}

function getCarbonDetails() {
  return [];
}