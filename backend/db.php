<?php
// データベース接続設定
$host = 'localhost';
$db = 'travel_planner';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "データベースエラー: " . $e->getMessage()]);
    exit;
}
?>
