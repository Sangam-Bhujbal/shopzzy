<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/init_admin.php';

// Admin authentication helpers
class AdminAuth {
    public static function check() {
        SessionManager::start();
        return SessionManager::get('is_admin') === true && SessionManager::has('admin_user_id');
    }

    public static function requireLogin() {
        if (!self::check()) {
            // Save intended URL
            SessionManager::set('redirect_after_login', $_SERVER['REQUEST_URI']);
            Response::redirect('/ecommerce/admin/login.php');
            exit;
        }
    }

    public static function login($email, $password) {
        $db = Database::getInstance()->getConnection();

        $stmt = $db->prepare("SELECT u.id, u.password, u.first_name, u.last_name FROM users u WHERE u.email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            return ['success' => false, 'message' => 'Invalid credentials'];
        }

        if (!Security::verifyPassword($password, $user['password'])) {
            return ['success' => false, 'message' => 'Invalid credentials'];
        }

        // Check role
        $roleStmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = :user_id AND role = 'admin' LIMIT 1");
        $roleStmt->execute([':user_id' => $user['id']]);
        $role = $roleStmt->fetch();

        if (!$role) {
            return ['success' => false, 'message' => 'Not authorized'];
        }

        // Set session
        SessionManager::regenerate();
        SessionManager::set('admin_user_id', $user['id']);
        SessionManager::set('admin_name', $user['first_name'] . ' ' . $user['last_name']);
        SessionManager::set('is_admin', true);

        Utils::logActivity('admin_login', ['user_id' => $user['id']]);

        return ['success' => true];
    }

    public static function logout() {
        Utils::logActivity('admin_logout', ['user_id' => SessionManager::get('admin_user_id')]);
        SessionManager::remove('admin_user_id');
        SessionManager::remove('admin_name');
        SessionManager::remove('is_admin');
        SessionManager::remove('redirect_after_login');
        SessionManager::regenerate();
    }
}

?>