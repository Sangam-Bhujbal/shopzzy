<?php
require_once __DIR__ . '/config.php';

// This script seeds a default admin user if no admin exists.
// It is safe to include on admin pages; it will only create the admin once.

try {
    $db = Database::getInstance()->getConnection();

    // Check if any admin exists
    $stmt = $db->prepare("SELECT ur.id FROM user_roles ur WHERE ur.role = 'admin' LIMIT 1");
    $stmt->execute();
    $adminExists = $stmt->fetch();

    if (!$adminExists) {
        // Check if the default admin email exists as a user
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => ADMIN_DEFAULT_EMAIL]);
        $user = $stmt->fetch();

        if ($user) {
            $userId = $user['id'];
        } else {
            // Insert user
            $passwordHash = Security::hashPassword(ADMIN_DEFAULT_PASSWORD);
            $insert = $db->prepare("INSERT INTO users (email, password, first_name, last_name, phone, is_active, is_verified, created_at) VALUES (:email, :password, :first_name, :last_name, :phone, 1, 1, NOW())");
            $insert->execute([
                ':email' => ADMIN_DEFAULT_EMAIL,
                ':password' => $passwordHash,
                ':first_name' => 'Admin',
                ':last_name' => 'User',
                ':phone' => '0000000000'
            ]);
            $userId = $db->lastInsertId();
        }

        // Assign admin role
        $assign = $db->prepare("INSERT INTO user_roles (user_id, role, created_at) VALUES (:user_id, 'admin', NOW())");
        $assign->execute([':user_id' => $userId]);

        Utils::logActivity('init_admin_created', ['user_id' => $userId, 'email' => ADMIN_DEFAULT_EMAIL]);
    }
} catch (Exception $e) {
    // Don't expose errors in production; log them
    Utils::logActivity('init_admin_error', ['error' => $e->getMessage()]);
}

?>