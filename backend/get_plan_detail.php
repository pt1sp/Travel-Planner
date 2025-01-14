<?php
include 'config.php';
include 'db.php';

if (isset($_GET['id'])) {
    $planId = (int)$_GET['id'];
    

    try {
        // プランの詳細を取得
        $stmt = $pdo->prepare("SELECT id, name, start_date, end_date FROM plans WHERE id = ?");
        $stmt->execute([$planId]);
        $plan = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($plan) {
            // 活動情報を取得
            $activityStmt = $pdo->prepare("SELECT time, destination, notes, date FROM activities WHERE plan_id = ?");
            $activityStmt->execute([$planId]);
            $activities = $activityStmt->fetchAll(PDO::FETCH_ASSOC);

            $plan['activities'] = $activities; // 活動をプランに追加
            echo json_encode($plan); // プラン詳細を返す
        } else {
            echo json_encode(["error" => "プランが見つかりません"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
        echo $id;
    }
} else {
    echo json_encode(["error" => "IDが指定されていません"]);
    echo $planId;
}
?>
