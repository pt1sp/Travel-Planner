<?php
include 'config.php';
include 'db.php';

// リクエストデータを取得
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// JSONデータが正しく解析されたかチェック
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["status" => "error", "message" => "不正な入力データです。"]);
    exit;
}

// 必須フィールドの存在確認
if (!isset($data['id'], $data['name'], $data['start_date'], $data['end_date'], $data['activities'])) {
    echo json_encode(["status" => "error", "message" => "必須フィールドが不足しています。"]);
    exit;
}

// 受け取ったデータ
$id = $data['id'];
$name = $data['name'];
$start_date = $data['start_date'];
$end_date = $data['end_date'];
$activities = $data['activities'];

// プラン更新
$stmt = $pdo->prepare("UPDATE plans SET name = ?, start_date = ?, end_date = ? WHERE id = ?");
$stmt->execute([$name, $start_date, $end_date, $id]);

// 既存のアクティビティを削除（新しい予定だけを挿入するため）
$stmt = $pdo->prepare("DELETE FROM activities WHERE plan_id = ?");
$stmt->execute([$id]);

// アクティビティの更新（新しいアクティビティを追加）
foreach ($activities as $activity) {
    $time = $activity['time'];
    $destination = $activity['destination'];
    $notes = $activity['notes'];
    $activity_date = $activity['date'];

    // アクティビティの追加処理
    $stmt = $pdo->prepare("INSERT INTO activities (plan_id, time, destination, notes, date) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$id, $time, $destination, $notes, $activity_date]);
}

echo json_encode(["status" => "success", "message" => "プランが更新されました。"]);
?>
