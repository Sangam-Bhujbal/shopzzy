<?php
require_once __DIR__ . '/includes/config.php';
header('Content-Type: application/json');
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query('SELECT 1 as ok');
    $row = $stmt->fetch();
    echo json_encode(['db' => 'ok', 'row' => $row]);
} catch (Exception $e) {
    echo json_encode(['db' => 'error', 'message' => $e->getMessage()]);
}
?>