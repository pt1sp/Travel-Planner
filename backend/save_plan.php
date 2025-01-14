<?php
include 'config.php';
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
if ($data === null) {
    echo json_encode([
        "status" => "error",
        "message" => "リクエストのデータが正しく送信されていません",
    ]);
    exit;
}

$name = $data["name"];
$startDate = $data["startDate"];
$endDate = $data["endDate"];
$planDays = $data["planDays"];
$userId = $data["userId"];  // ユーザーID

// データベース接続
$pdo = new PDO("mysql:host=localhost;dbname=travel_planner", "root", "");

try {
    $pdo->beginTransaction();

    // ユーザーIDが存在するか確認 (usersテーブル)
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode([
            "status" => "error",
            "message" => "指定されたユーザーが存在しません",
        ]);
        exit;
    }

    // プランを`plans`テーブルに挿入
    $stmt = $pdo->prepare("INSERT INTO plans (name, start_date, end_date, user_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $startDate, $endDate, $userId]);
    $planId = $pdo->lastInsertId();

    // 各日程を`activities`テーブルに挿入 (plan_days テーブルは削除したため、直接 activities に挿入)
    $activityStmt = $pdo->prepare("INSERT INTO activities (plan_id, date, time, destination, notes) VALUES (?, ?, ?, ?, ?)");
    foreach ($planDays as $day) {
        $date = $day["date"];  // 各日の日時
        foreach ($day["activities"] as $activity) {
            $time = $activity["time"];
            $destination = $activity["destination"];
            $notes = $activity["notes"];
            
            // activities テーブルに挿入
            $activityStmt->execute([$planId, $date, $time, $destination, $notes]);
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
    ]);
}
?>
