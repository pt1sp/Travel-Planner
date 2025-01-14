<?php
include 'config.php';
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "IDが指定されていません。"]);
    exit;
}

$id = intval($data['id']);

try {
    $stmt = $pdo->prepare("DELETE FROM plans WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "旅行計画を削除しました。"]);
    } else {
        echo json_encode(["status" => "error", "message" => "削除対象の計画が見つかりません。"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "データベースエラー: " . $e->getMessage()]);
}
