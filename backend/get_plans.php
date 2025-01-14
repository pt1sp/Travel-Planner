<?php
include 'config.php';
include 'db.php';

// ユーザーIDを取得
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    echo json_encode(["error" => "ユーザーIDが指定されていません。"]);
    exit;
}

try {
    // ユーザーIDに基づいて旅行計画を取得
    $stmt = $pdo->prepare("SELECT id, name, CONCAT(start_date, ' - ', end_date) AS period FROM plans WHERE user_id = ? ORDER BY start_date ASC");
    $stmt->execute([$user_id]);
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($plans);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
