<?php

try {
    $dbconn = new SQLite3('../database.db');
} catch (Exception $e) {
    //TODO: fix this
    die("Couldn't connect to DB.");
}


/*
<?php
$db = new SQLite3;
$statement = $db->prepare('SELECT * FROM table WHERE id = :id;');
$statement->bindValue(':id', $id);
$result = $statement->execute();
?>
 */

function answerJsonAndDie($obj)
{
    header('Content-Type: application/json');
    echo json_encode($obj, JSON_NUMERIC_CHECK);
    die();
}

function error($error)
{
    $obj = new stdClass();
    $obj->error = $error;
    answerJsonAndDie($obj);
}

function getAllTables($params)
{
    global $dbconn;
    $rows = $dbconn->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function getWishesWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT wishes.id, wc.startTime, wc.endTime, wishes.wisher_id FROM wishes
JOIN wish_constraints AS wc ON wc.wish_id = wishes.id 
WHERE wc.type = 'TIME' AND startTime<? AND endTime<?");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function getTravelWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT trips.id, trips.startTime, trips.endTime, locations.city, locations.country, locations.lat, locations.lon
FROM trips JOIN locations on trips.loc_id = locations.id WHERE endTime >= ? OR startTime <= ?
");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        $resultRow = $row;
        //Get all involved organisations
        $stmt = $dbconn->prepare("SELECT o.name from trip_org_presences JOIN organisations o on trip_org_presences.org_id = o.id WHERE trip_org_presences.trip_id = ?");
        $stmt->bindValue(1, $row['id'], SQLITE3_INTEGER);
        $orgrows = $stmt->execute();
        if (!$orgrows) error('Query failed ' . $dbconn->lastErrorMsg());
        $orgs = array();
        while ($org = $orgrows->fetchArray()) {
            $orgs[] = $org;
        }
        $resultRow['organisations'] = $orgs;

        //Get all involved unep_reps
        $stmt = $dbconn->prepare("SELECT r.email, r.firstName, r.lastName FROM rep_trips rt JOIN unep_reps r on rt.rep_id = r.id where rt.trip_id = ?");
        $stmt->bindValue(1, $row['id'], SQLITE3_INTEGER);
        $reprows = $stmt->execute();
        if (!$reprows) error('Query failed ' . $dbconn->lastErrorMsg());
        $reps = array();
        while ($rep = $reprows->fetchArray()) {
            $reps[] = $rep;
        }
        $resultRow['unep_reps'] = $reps;
        array_push($result, (object)$resultRow);
    }
    return ($result);
}

function getUnepPresencesWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT unep_presences.name, unep_presences.startTime, 
       unep_presences.endTime, locations.city, locations.country, locations.lat, locations.lon
       FROM unep_presences JOIN locations on unep_presences.loc_id = locations.id
        WHERE endTime >= ? OR startTime <= ?");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function getOrganisationPresencesWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT p.id, o.name, p.startTime, p.endTime, l.city, l.country, l.lat, l.lon FROM presences p
        JOIN organisations o on p.org_id = o.id
        JOIN locations l on p.loc_id = l.id
        WHERE endTime >= ? OR startTime <= ?");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function getAllTravelFromUser($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT email, locations.city, locations.country, locations.lat, locations.lon, startTime, endTime  
FROM unep_reps
JOIN rep_trips ON unep_reps.id = rep_trips.rep_id
JOIN trips ON trips.id = rep_trips.trip_id
JOIN locations ON locations.id = trips.loc_id 
WHERE unep_reps.email = ?");
    $stmt->bindValue(1, $params->email, SQLITE3_TEXT);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function getOrganisationFromId($org_id)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from organisations where id = ?");
    $stmt->bindValue(1, $org_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    return $rows->fetchArray();
}

function getOrganisationIdFromName($org_name)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from organisations where name=?");
    $stmt->bindValue(1, $org_name, SQLITE3_TEXT);
    $rows = $stmt->execute();
    $row = $rows->fetchArray();
    return $row['id'];
}

function getLocationFromId($loc_id)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from locations WHERE id = ?");
    $stmt->bindValue(1, $loc_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    return $rows->fetchArray();
}

function getUnepRepFromId($rep_id)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from unep_reps where id = ?");
    $stmt->bindValue(1, $rep_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    return $rows->fetchArray();
}

function getTravelFromId($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from trips where id = ?");
    $stmt->bindValue(1, $params->travel_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    return $rows->fetchArray();
}

function getUnepRepIdFromEmail($email)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from unep_reps where email = ?");
    $stmt->bindValue(1, $email, SQLITE3_TEXT);

    $rows = $stmt->execute();
    $row = $rows->fetchArray();
    return $row["id"];
}

function getAllConstraintsFromWish($wishId)
{
    global $dbconn;

    $result = array();
    $result["orgs"] = array();
    $result["times"] = array();
    $result["locations"] = array();

    $stmt = $dbconn->prepare("SELECT * FROM wish_constraints WHERE wish_id=?");
    $stmt->bindValue(1, $wishId);

    $rows = $stmt->execute();

    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    else {
        while ($row = $rows->fetchArray()) {
            switch ($row['type']) {
                case 'TIME':
                    $timeEntry = array();
                    $timeEntry["startTime"] = $row['startTime'];
                    $timeEntry["endTime"] = $row['endTime'];
                    $result["times"][] = $timeEntry;
                    break;
                case 'ORGANISATION':
                    $orgEntry = getOrganisationFromId($row['org_id']);
                    $result["organisations"][] = $orgEntry;
                    break;
                case 'LOCATION':
                    $locEntry = getLocationFromId($row['loc_id']);
                    $result["locations"][] = $locEntry;
                    break;
                default:
                    error("Invalid type while getting constraints. Type:" . $row['type']);
            }
        }
    }
    return $result;
}

function getAllWishesFromUser($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT wishes.id, email FROM wishes
JOIN unep_reps ON wishes.wisher_id = unep_reps.id
WHERE unep_reps.email = ?");
    $stmt->bindValue(1, $params->email, SQLITE3_TEXT);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        $rowTemp = $row;
        $rowTemp['constraints'] = getAllConstraintsFromWish($row['id']);
        array_push($result, (object)$rowTemp);
    }
    return ($result);
}

//function getAllSuggestionsForTravel($params)
//{
//    global $dbconn;
//    $stmt = $dbconn->prepare("SELECT suggestions.id, suggestions.emissions, suggestions.emmission_delta, suggestions.time_wasted, suggestions.score  FROM trips
//JOIN suggestions ON suggestions.trip_id = trips.id
//WHERE trips.id = ? ORDER BY suggestions.score");
//    $stmt->bindValue(1, $params->trip_id, SQLITE3_INTEGER);
//    $rows = $stmt->execute();
//    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
//    $result = array();
//    while ($row = $rows->fetchArray()) {
//        array_push($result, (object)$row);
//    }
//    return ($result);
//}

function getAllSuggestionsFromWish($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("
SELECT s.id, w.wisher_id, s.emissions, s.emmission_delta, s.time_wasted, s.score,
l.city as wishCity, l.country as wishCountry, l.lat as wishLat, l.lon as wishLon, 
s.trips__dep_id as unepTripId, t.startTime as unepTripStart, t.endTime as unepTripEnd,
up.id as unepPresenceId, up.name as unepPresenceName,
s.trip_org_presences__dep_id, o1.name as 'tripOrgName', l2.city as 'tripCity', l2.country as 'tripCountry', l2.lon as 'tripLon', l2.lat as 'tripLat',
s.presences__dep_id, o2.name as 'presenceOrgName', l3.city as 'orgCity', l3.country as 'orgCountry', l3.lon as 'orgLon', l3.lat as 'orgLat'
FROM suggestions s
JOIN wishes w ON s.wish_id = w.id
LEFT JOIN wish_constraints wc ON wc.wish_id = w.id AND wc.type = 'LOCATION'
LEFT JOIN locations l ON wc.loc_id = l.id

LEFT JOIN trips t ON s.trips__dep_id = t.id
LEFT JOIN unep_presences up ON s.unep_presences__dep_id = up.id

LEFT JOIN trip_org_presences top ON s.trip_org_presences__dep_id = top.id
LEFT JOIN organisations o1 ON top.org_id = o1.id
LEFT JOIN trips t2 ON top.trip_id = t2.id
LEFT JOIN locations l2 ON t2.loc_id = l2.id


LEFT JOIN presences p ON s.presences__dep_id = p.id
LEFT JOIN organisations o2 ON p.org_id = o2.id
LEFT JOIN locations l3 ON p.loc_id = l3.id

WHERE w.id = ?

ORDER BY s.score DESC");
    $stmt->bindValue(1, $params->wish_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();

    $baseKeys = array("id", "wisher_id", "emissions", "emmision_delta", "time_wasted", "score");
    $locConstraintKeys = array("wishCity", "wishCountry", "wishLat", "wishLon");
    $usedLoc = false;
    $unepTripKeys = array("unepTripId", "unepTripStart", "unepTripEnd");
    $usedTrip = false;
    $unepPresenceKeys = array("unepPresenceId", "unepPresenceName");
    $usedUnepPresence = false;
    $tripOrgKeys = array("tripOrgName", "tripCity", "tripCountry", "tripLon", "tripLat");
    $usedTripOrg = false;
    $orgPresenceKeys = array("presenceOrgName", "orgCity", "orgCountry", "orgLon", "orgLat");
    $usedOrgPresence = false;

    while ($row = $rows->fetchArray()) {
        $allKeys = $baseKeys;
        if (!is_null($row['wishCity'])) {
            $allKeys = array_merge($allKeys, $locConstraintKeys);
            $usedLoc = true;
        }
        if (!is_null($row['unepTripId'])) {
            $allKeys = array_merge($allKeys, $unepTripKeys);
            $usedTrip = true;
        }
        if (!is_null($row['unepPresenceId'])) {
            $allKeys = array_merge($allKeys, $unepPresenceKeys);
            $usedUnepPresence = true;
        }
        if (!is_null($row['tripOrgName'])) {
            $allKeys = array_merge($allKeys, $tripOrgKeys);
            $usedTripOrg = true;
        }
        if (!is_null($row['presenceOrgName'])) {
            $allKeys = array_merge($allKeys, $orgPresenceKeys);
            $usedOrgPresence = true;
        }

        //Filter results
        $newRow = array_intersect_key($row, array_flip($allKeys));

        //Rename as appropriate
        if($usedLoc){
            $newRow['city'] = $newRow['wishCity'];
            $newRow['country'] = $newRow['wishCountry'];
            $newRow['lon'] = $newRow['wishLon'];
            $newRow['lat'] = $newRow['wishLat'];

            unset($newRow['wishCity']);
            unset($newRow['wishCountry']);
            unset($newRow['wishLon']);
            unset($newRow['wishLat']);
        }

        if($usedTripOrg){
            $newRow['city'] = $newRow['tripCity'];
            $newRow['country'] = $newRow['tripCountry'];
            $newRow['lon'] = $newRow['tripLon'];
            $newRow['lat'] = $newRow['tripLat'];

            unset($newRow['tripCity']);
            unset($newRow['tripCountry']);
            unset($newRow['tripLon']);
            unset($newRow['tripLat']);
        }

        if($usedOrgPresence){
            $newRow['city'] = $newRow['tripCity'];
            $newRow['country'] = $newRow['tripCountry'];
            $newRow['lon'] = $newRow['tripLon'];
            $newRow['lat'] = $newRow['tripLat'];

            unset($newRow['tripCity']);
            unset($newRow['tripCountry']);
            unset($newRow['tripLon']);
            unset($newRow['tripLat']);
        }

        array_push($result, (object)$newRow);
    }
    return ($result);
}

function getOrCreateLocation($data)
{
    global $dbconn;
    $locStmt = $dbconn->prepare("SELECT id FROM locations WHERE city = ? AND country = ?");
    $locStmt->bindValue(1, $data->city);
    $locStmt->bindValue(2, $data->country);
    $rows = $locStmt->execute();
    if ($rows->rowCount() == 0) {
        $newLocStmt = $dbconn->prepare("INSERT INTO locations(lat,lon,city,country) VALUES(?,?,?,?)");
        $newLocStmt->bindValue(1, $data->lat, SQLITE3_FLOAT);
        $newLocStmt->bindValue(2, $data->lon, SQLITE3_FLOAT);
        $newLocStmt->bindValue(3, $data->city, SQLITE3_TEXT);
        $newLocStmt->bindValue(4, $data->country, SQLITE3_TEXT);
        $newLocStmt->execute();
        return $dbconn->lastInsertRowID();
    } else {
        while ($row = $rows->fetchArray()) {
            return $row['id'];
        }
    }
}

function createNewTravel($params)
{
    global $dbconn;

    $locId = getOrCreateLocation($params);
    $rep_id = getUnepRepIdFromEmail($params->email);

    $stmt = $dbconn->prepare("INSERT INTO trips (loc_id,startTime,endTime) VALUES(?,?,?)");
    $stmt->bindValue(1, $locId, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(3, $params->endTime, SQLITE3_INTEGER);


    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());

    $trip_id = $dbconn->lastInsertRowID();

    $stmt = $dbconn->prepare("INSERT INTO rep_trips(rep_id,trip_id) VALUES(?,?)");
    $stmt->bindValue(1, $rep_id, SQLITE3_INTEGER);
    $stmt->bindValue(2, $trip_id, SQLITE3_INTEGER);
    $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());

    if ($params->org !== "") {
        $org_id = getOrganisationIdFromName($params->org);
        $stmt = $dbconn->prepare("INSERT INTO trip_org_presences(trip_id, org_id) VALUES(?,?)");
        $stmt->bindValue(1, $trip_id, SQLITE3_INTEGER);
        $stmt->bindValue(2, $org_id, SQLITE3_INTEGER);
        $stmt->execute();
        if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    }


    return (object)array('outcome' => 'succeeded', 'inserted_id' => $trip_id);
}

function deleteTravelFromId($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("DELETE FROM trips WHERE id = ?");
    $stmt->bindValue(1, $params->id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function createNewWish($rep_id, $time_constraints, $org_constraints, $loc_constraints)
{
    global $dbconn;

    //TODO: insert new wish for that rep_id

    $stmt = $dbconn->prepare("INSERT INTO wishes(wisher_id) VALUES (?)");
    $stmt->bindValue(1, $rep_id->id, SQLITE3_INTEGER);
    $rows = $stmt->execute();

    $wish_id = $dbconn->lastInsertRowID();
    //TIP: LAST_INSERT_ROWID() returns last inserted id in the DB.
    //it's determined on a per-connection basis so no need to worry about concurrency.
    foreach ($time_constraints as $time_constraint) {
        //TODO: insert time constraint using these two limits.
        //error("invalid range") when startTime > endTime.

        $startTime = $time_constraint->startTime;
        $endTime = $time_constraint->endTime;

        if ($endTime < $startTime) {
            error("invalid time range (endTime<startTime");
        }

        $stmt = $dbconn->prepare("INSERT INTO wish_constraints(type,startTime,endTime) VALUES ('TIME',?,?)");
        $stmt->bindValue(1, $startTime, SQLITE3_INTEGER);
        $stmt->bindValue(2, $endTime, SQLITE3_INTEGER);
        $rows = $stmt->execute();
    }

    foreach ($org_constraints as $org_constraint) {
        $stmt = $dbconn->prepare("INSERT INTO wish_constraints(type,org_id) VALUES ('ORGANISATION',?)");
        $org_id = getOrganisationIdFromName($org_constraint->name);
        $stmt->bindValue(1, org_id, SQLITE3_INTEGER);
        $rows = $stmt->execute();
    }

    foreach ($loc_constraints as $loc_constraint) {
        $stmt = $dbconn->prepare("INSERT INTO wish_constraints(type,loc_id) VALUES ('LOCATION',?)");
        $loc_id = getOrCreateLocation($loc_constraint);
        $stmt->bindValue(1, loc_id, SQLITE3_INTEGER);
        $rows = $stmt->execute();
    }

    //TODO: similarly for org_constraints, loc_constraints. Content structure is specified in util.js
    return (object)array('outcome' => 'succeeded', 'inserted_id' => $wish_id);
}

function deleteWishFromId($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("DELETE FROM wishes WHERE id = ?");
    $stmt->bindValue(1, $params->id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function createNewUnepPresence($params)
{
    global $dbconn;

    $locId = getOrCreateLocation($params);

    $stmt = $dbconn->prepare("INSERT INTO unep_presences (name, loc_id,startTime,endTime) VALUES(?,?,?,?)");
    $stmt->bindValue(1, $params->name, SQLITE3_INTEGER);
    $stmt->bindValue(2, $locId, SQLITE3_INTEGER);
    $stmt->bindValue(3, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(4, $params->endTime, SQLITE3_INTEGER);


    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());

    $unep_presence_id = $dbconn->lastInsertRowID();

    return (object)array('outcome' => 'succeeded', 'inserted_id' => $unep_presence_id);
}

function createNewOrganisationPresence($params)
{
    global $dbconn;

    $org_id = getOrganisationIdFromName($params->orgName);
    $locId = getOrCreateLocation($params);

    $stmt = $dbconn->prepare("INSERT INTO presences (org_id, loc_id,startTime,endTime) VALUES(?,?,?,?)");
    $stmt->bindValue(1, $org_id, SQLITE3_INTEGER);
    $stmt->bindValue(2, $locId, SQLITE3_INTEGER);
    $stmt->bindValue(3, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(4, $params->endTime, SQLITE3_INTEGER);


    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());

    $unep_presence_id = $dbconn->lastInsertRowID();

    return (object)array('outcome' => 'succeeded', 'inserted_id' => $unep_presence_id);
}

function acceptSuggestion($params){
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * from suggestions s JOIN wishes w on s.wish_id = w.id WHERE s.id = ?");
    $stmt->bindValue(1,$params->suggestion_id,SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if(!$rows) error('Query failed ' . $dbconn->lastErrorMsg());

    $row = $rows->fetchArray();

    $stmt = $dbconn->prepare("INSERT INTO acceptedSuggestions(wisher_id, emissions, emission_delta) VALUES(?,?,?)");
    $stmt->bindValue(1,$row['wisher_id'], SQLITE3_INTEGER);
    $stmt->bindValue(2,$row['emissions'], SQLITE3_FLOAT);
    $stmt->bindValue(3,$row['emmission_delta'], SQLITE3_FLOAT);

    $stmt->execute();

    if(!$rows) error('Query failed ' . $dbconn->lastErrorMsg());

    $entry_id = $dbconn->lastInsertRowID();

    return (object)$row;
//    return (object)array('outcome' => 'succeeded', 'inserted_id' => $entry_id);
}

function getTotalEmissionsSaved($params){
    global $dbconn;

    $stmt = $dbconn->prepare("SELECT SUM(emission_delta) FROM acceptedSuggestions");
    $row = $stmt->execute()->fetchArray();

    return (object)array('totalEmissionsSaved' => $row['SUM(emission_delta)']);
}

function getEmissionsSavedFromUser($params){
    global $dbconn;

    $stmt = $dbconn->prepare("SELECT SUM(emission_delta) 
    FROM acceptedSuggestions 
    JOIN unep_reps ur on acceptedSuggestions.wisher_id = ur.id WHERE ur.email=?");
    $stmt->bindValue(1,$params->email,SQLITE3_TEXT);
    $row = $stmt->execute()->fetchArray();

    return (object)$row;

}

$request = json_decode($_GET['q']);

switch ($request->method) {
    case 'stub':
        break;

    case 'getAllTables':
        $result = getAllTables($request->params);
        answerJsonAndDie($result);
        break;

    case 'getWishesWithinTimeframe':
        $result = getWishesWithinTimeframe($request->params);
        answerJsonAndDie($result);
        break;

    case 'getTravelWithinTimeframe':
        $result = getTravelWithinTimeframe($request->params);
        answerJsonAndDie($result);
        break;

    case 'getUnepPresencesWithinTimeframe':
        $result = getUnepPresencesWithinTimeframe($request->params);
        answerJsonAndDie($result);
        break;

    case 'getLocationFromId':
        $result = getLocationFromId($request->params);
        answerJsonAndDie($result);
        break;

    case 'getOrganisationFromId':
        $result = getOrganisationFromId($request->params);
        answerJsonAndDie($result);
        break;

    case 'getUnepRepFromId':
        $result = getUnepRepFromId($request->params);
        answerJsonAndDie($result);
        break;

    case 'getTravelFromId':
        $result = getTravelFromId($request->params);
        answerJsonAndDie($result);
        break;

    case 'getAllTravelFromUser':
        $result = getAllTravelFromUser($request->params);
        answerJsonAndDie($result);
        break;

    case 'getAllWishesFromUser':
        $result = getAllWishesFromUser($request->params);
        answerJsonAndDie($result);
        break;

//    case 'getAllSuggestionsForTravel':
//        $result = getAllSuggestionsForTravel($request->params);
//        answerJsonAndDie($result);
//        break;

    case 'getAllSuggestionsFromWish':
        $result = getAllSuggestionsFromWish($request->params);
        answerJsonAndDie($result);
        break;

    case 'createNewTravel':
        $result = createNewTravel($request->params);
        answerJsonAndDie($result);
        break;

    case 'deleteTravelFromId':
        $result = deleteTravelFromId($request->params);
        answerJsonAndDie($result);
        break;

    case 'createNewWish':
        $result = createNewWish($request->params->rep_id, $request->params->timeConstraints, $request->params->orgConstraints, $request->params->locConstraints);
        answerJsonAndDie($result);
        break;

    case 'deleteWishFromId':
        $result = deleteWishFromId($request->params);
        answerJsonAndDie($result);
        break;

    case 'getOrganisationPresencesWithinTimeframe':
        $result = getOrganisationPresencesWithinTimeframe($request->params);
        answerJsonAndDie($result);
        break;

    case 'createNewUnepPresence':
        $result = createNewUnepPresence($request->params);
        answerJsonAndDie($result);
        break;

    case 'createNewOrganisationPresence':
        $result = createNewOrganisationPresence($request->params);
        answerJsonAndDie($result);
        break;

    case 'acceptSuggestion':
        $result = acceptSuggestion($request->params);
        answerJsonAndDie($result);
        break;

    case 'getTotalEmissionsSaved':
        $result = getTotalEmissionsSaved($request->params);
        answerJsonAndDie($result);
        break;

    case 'getEmissionsSavedFromUser':
        $result = getEmissionsSavedFromUser($request->params);
        answerJsonAndDie($result);
        break;

    default:
        error('method: "' . $request->method . '" is not defined');
}