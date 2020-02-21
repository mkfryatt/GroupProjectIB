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
    $stmt = $dbconn->prepare("SELECT wishes.id, wishes.startTime, wishes.endTime, metadata.wisher_id FROM wishes 
JOIN metadata on wishes.meta_id = metadata.id
WHERE startTime >= ? AND endTime <= ?");
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
FROM trips JOIN locations on trips.loc_id = locations.id WHERE startTime >= ? AND endTime <= ?
");
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

function getUnepPresencesWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT unep_presences.name, unep_presences.startTime, 
       unep_presences.endTime, locations.city, locations.country, locations.lat, locations.lon
       FROM unep_presences JOIN locations on unep_presences.loc_id = locations.id
        WHERE startTime >= ? AND endTime <= ?");
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
                case 'LOCATION':
                    $locEntry = getLocationFromId($row['loc_id']);
                    $result["organisations"][] = $locEntry;
                default:
                    error("Stuff happened while getting constraints.");
            }
        }
    }
    return $result;
}

function getAllWishesFromUser($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT wishes.id, email, startTime, endTime  FROM wishes
JOIN metadata ON metadata.id = wishes.meta_id
JOIN unep_reps ON metadata.wisher_id = unep_reps.id
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

function getAllSuggestionsForTravel($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT suggestions.id, suggestions.score, startTime, endTime  FROM trips
JOIN suggestions ON suggestions.trip_id = trips.id
WHERE trips.id = ? ORDER BY suggestions.score");
    $stmt->bindValue(1, $params->trip_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
}

function getOrCreateLocation($data)
{
    global $dbconn;
    $locStmt = $dbconn->prepare("SELECT id FROM locations WHERE city = ? AND country = ?");
    $locStmt->bindValue(1, $data['city']);
    $locStmt->bindValue(2, $data['country']);
    $rows = $locStmt->execute();
    if ($rows->rowCount() == 0) {
        $newLocStmt = $dbconn->prepare("INSERT INTO locations(lat,lon,city,country) VALUES(?,?,?,?)");
        $newLocStmt->bindValue(1, $data['lat'], SQLITE3_FLOAT);
        $newLocStmt->bindValue(2, $data['lon'], SQLITE3_FLOAT);
        $newLocStmt->bindValue(3, $data['city'], SQLITE3_TEXT);
        $newLocStmt->bindValue(4, $data['country'], SQLITE3_TEXT);
        $newLocStmt->execute();
        return sqlite_last_insert_rowid($dbconn);
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

    $stmt = $dbconn->prepare("INSERT INTO trips (loc_id,startTime,endTime) VALUES(?,?,?)");
    $stmt->bindValue(1, $locId, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(3, $params->endTime, SQLITE3_INTEGER);


    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    return ($result);
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
    $wish_id = null;
    //TIP: LAST_INSERT_ROWID() returns last inserted id in the DB.
    //it's determined on a per-connection basis so no need to worry about concurrency.
    foreach ($time_constraints as $time_constraint) {
        $time_constraint->startTime;
        $time_constraint->endTime;
        //TODO: insert time constraint using these two limits.
        //error("unvalid range") when startTime > endTime.
    }

    //TODO: similarly for org_constraints, loc_constraints. Content structure is specified in util.js

    return (object)array('outcome'=>'succeeded','inserted_id'=> $wish_id);
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

    case 'getAllTravelFromUser':
        $result = getAllTravelFromUser($request->params);
        answerJsonAndDie($result);
        break;

    case 'getAllWishesFromUser':
        $result = getAllWishesFromUser($request->params);
        answerJsonAndDie($result);
        break;

    case 'getAllSuggestionsForTravel':
        $result = getAllSuggestionsForTravel($request->params);
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
        $result = createNewWish($request->params);
        answerJsonAndDie($result);
        break;

    case 'deleteWishFromId':
        $result = deleteWishFromId($request->params);
        answerJsonAndDie($result);
        break;


    default:
        error('method: "' . $request->method . '" is not defined');
}
