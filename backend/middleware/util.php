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
    answerJsonAndDie($result);
}

function getWishesWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * FROM wishes WHERE startTime <= ? AND endTime >= ?");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
}

function getTravelWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * FROM trips WHERE startTime <= ? AND endTime >= ?");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
}

function getUnepPresencesWithinTimeframe($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT * FROM unep_presences WHERE startTime <= ? AND endTime >= ?");
    $stmt->bindValue(1, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(2, $params->endTime, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
}

function getAllTravelFromUser($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT email, locations.name as location, startTime, endTime  FROM unep_reps
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
    answerJsonAndDie($result);
}

function getAllWishesFromUser($params)
{
    //TODO: FINISH THIS, MORE COMPLICATED DUE TO CONSTRAINTS

    global $dbconn;
    $stmt = $dbconn->prepare("SELECT email, startTime, endTime  FROM wishes
JOIN metadata ON metadata.id = wishes.meta_id
JOIN unep_reps ON metadata.wisher_id = unep_reps.id
WHERE unep_reps.email = ?");
    $stmt->bindValue(1, $params->email, SQLITE3_TEXT);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
}

function getAllSuggestionsForTravel($params)
{
    global $dbconn;
    $stmt = $dbconn->prepare("SELECT startTime, endTime  FROM trips
JOIN suggestions ON suggestions.trip_id = trips.id
WHERE trips.id = ?");
    $stmt->bindValue(1, $params->trip_id, SQLITE3_INTEGER);
    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
}

function getOrCreateLocation($data)
{
    global $dbconn;
    $locStmt = $dbconn->prepare("SELECT id FROM locations WHERE name = ?");
    $locStmt->bindValue(1, $data['name']);
    $rows = $locStmt->execute();
    if (!$rows) {
        $newLocStmt = $dbconn->prepare("INSERT INTO locations(name,lat,lon,geocode) VALUES(?,?,?,?)");
        $newLocStmt->bindValue(1, $data['name'], SQLITE3_TEXT);
        $newLocStmt->bindValue(2, $data['lat'], SQLITE3_FLOAT);
        $newLocStmt->bindValue(3, $data['lon'], SQLITE3_FLOAT);
        $newLocStmt->bindValue(4, $data['geocode'], SQLITE3_TEXT);
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
    $stmt = $dbconn->prepare("INSERT INTO trips (loc_id,startTime,endTime) VALUES(?,?,?)");
    $stmt->bindValue(2, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(3, $params->endTime, SQLITE3_INTEGER);


    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
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
    answerJsonAndDie($result);
}

function createNewWish($params)
{
    //TODO: IMPLEMENT
    global $dbconn;
    $stmt = $dbconn->prepare("INSERT INTO trips (loc_id,startTime,endTime) VALUES(?,?,?)");
    $stmt->bindValue(2, $params->startTime, SQLITE3_INTEGER);
    $stmt->bindValue(3, $params->endTime, SQLITE3_INTEGER);


    $rows = $stmt->execute();
    if (!$rows) error('Query failed ' . $dbconn->lastErrorMsg());
    $result = array();
    while ($row = $rows->fetchArray()) {
        array_push($result, (object)$row);
    }
    answerJsonAndDie($result);
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
    answerJsonAndDie($result);
}

$request = json_decode($_GET['q']);

switch ($request->method) {
    case 'getAllTables':
        getAllTables($request->params);
        break;

    case 'getWishesWithinTimeframe':
        getWishesWithinTimeframe($request->params);
        break;

    case 'getTravelWithinTimeframe':
        getTravelWithinTimeframe($request->params);
        break;

    case 'getUnepPresencesWithinTimeframe':
        getUnepPresencesWithinTimeframe($request->params);
        break;

    case 'getAllTravelFromUser':
        getAllTravelFromUser($request->params);
        break;

    case 'getAllWishesFromUser':
        getAllWishesFromUser($request->params);
        break;

    case 'getAllSuggestionsForTravel':
        getAllSuggestionsForTravel($request->params);
        break;

    case 'createNewTravel':
        createNewTravel($request->params);
        break;

    case 'deleteTravelFromId':
        deleteTravelFromId($request->params);
        break;

    case 'createNewWish':
        createNewWish($request->params);
        break;

    case 'deleteWishFromId':
        deleteWishFromId($request->params);
        break;


    default:
        error('method: "' . $request->method . '" is not defined');
}
