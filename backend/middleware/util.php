<?php

try{
    $dbconn = new SQLite3('../database.db');
}catch (Exception $e){
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

function getUnepPresencesWithinTimeframe($params)
{
    //TODO: query DB with $params->start, $params->end
    global $dbconn;
    $rows = $dbconn->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    if (!$rows) error('Query failed '.$dbconn->lastErrorMsg());
    $result = array();
    while($row = $rows->fetchArray()) {
        array_push($result,(object) $row);
    }
    answerJsonAndDie($result);
}


$request = json_decode($_GET['q']);

switch ($request->method) {
    case 'getUnepPresencesWithinTimeframe':
        getUnepPresencesWithinTimeframe($request->params);
        break;

    default:
        error('method: "' . $request->method . '" is not defined');
}