<?php
include 'config.php';
// データベース接続
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_planner";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];

// 入力値のバリデーション
if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "入力は必須です"]);
    exit;
}

// パスワードのハッシュ化
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// SQLクエリ
$sql = "INSERT INTO users (name, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $hashedPassword);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    echo json_encode(["status" => "success", "userId" => $userId]);
} else {
    echo json_encode(["status" => "error", "message" => "登録エラー"]);
}

$stmt->close();
$conn->close();
?>
