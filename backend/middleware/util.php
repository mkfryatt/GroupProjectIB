<?php

function answerJsonAndDie($obj)
{
    header('Content-Type: application/json');
    echo json_encode($obj, JSON_NUMERIC_CHECK);
    die();
}

function error($error){
    $obj = new stdClass();
    $obj->error = $error;
    returnJson($obj);
}

function getUnepPresencesWithinTimeframe($params){

    //TODO: query DB with $params->start, $params->end
    sleep(2); //simulate latency
    $result = array();
    for($i  = 0; $i<10;$i++){
        $pre = new stdClass();
        $pre->organization = 'Microsoft';
        $pre->timeframe->start = $params->start + ($params->end - $params->start)/10;
        $pre->timeframe->start = $params->end;
        array_push($result,$pre);
    }
    answerJsonAndDie($result);
}



//TODO: connect to db
$request = json_decode($_GET['q']);

switch ($request->method) {
    case 'getUnepPresencesWithinTimeframe':
        getUnepPresencesWithinTimeframe($request->params);
        break;

    default:
        error('method: "'.$request->method.'" is not defined');
}