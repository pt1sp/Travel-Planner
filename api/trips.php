<?php
header('Content-Type: application/json');
$data = ["destination" => "Tokyo", "days" => 5];
echo json_encode($data);
?>