<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header('Content-Type: application/json');
$data = [
  "destination" => "Kyoto",
  "days" => 4,
  "message" => "This is a test trip to Kyoto"
];
echo json_encode($data);
?>
