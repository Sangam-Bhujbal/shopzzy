<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/register.php';
header('Content-Type: application/json');

try {
    $res = register('Test','User','test+' . time() . '@example.com','Test1234','Test1234','9876543210');
    echo json_encode($res);
} catch (Exception $e) {
    // Development: return full exception for debugging
    echo json_encode(['success' => false, 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
}
?>