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

// SQLクエリ
$sql = "SELECT id, password FROM users WHERE name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // パスワードの検証
    if (password_verify($password, $user['password'])) {
        echo json_encode(["status" => "success", "userId" => $user['id']]);
    } else {
        echo json_encode(["status" => "error", "message" => "パスワードが間違っています"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "ユーザー名が見つかりません"]);
}

$stmt->close();
$conn->close();
?>
