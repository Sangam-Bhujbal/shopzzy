<?php
require_once __DIR__ . '/config.php';

/**
 * register
 * Creates a new user and assigns the 'user' role.
 * Returns array: ['success' => bool, 'message' => string, 'user_id' => int|null]
 */
function register($first_name, $last_name, $email, $password, $confirm_password, $phone = null) {
    $response = ['success' => false, 'message' => '', 'user_id' => null];

    // Basic validation
    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
        $response['message'] = 'All fields are required.';
        return $response;
    }

    if (!Security::isValidEmail($email)) {
        $response['message'] = 'Invalid email address.';
        return $response;
    }

    if ($password !== $confirm_password) {
        $response['message'] = 'Passwords do not match.';
        return $response;
    }

    if (strlen($password) < 8 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $response['message'] = 'Password must be at least 8 characters long and contain letters and numbers.';
        return $response;
    }

    try {
        $db = Database::getInstance()->getConnection();

        // Check existing email
        $stmt = $db->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        if ($stmt->fetch()) {
            $response['message'] = 'Email is already registered.';
            return $response;
        }

        // Insert user
        $passwordHash = Security::hashPassword($password);
        $insert = $db->prepare('INSERT INTO users (email, password, first_name, last_name, phone, is_active, is_verified, created_at) VALUES (:email, :password, :first_name, :last_name, :phone, 1, 0, NOW())');
        $insert->execute([
            ':email' => $email,
            ':password' => $passwordHash,
            ':first_name' => $first_name,
            ':last_name' => $last_name,
            ':phone' => $phone
        ]);

        $userId = $db->lastInsertId();

        // Assign default role
        $roleStmt = $db->prepare('INSERT INTO user_roles (user_id, role, created_at) VALUES (:user_id, :role, NOW())');
        $roleStmt->execute([':user_id' => $userId, ':role' => 'user']);

        Utils::logActivity('user_registered', ['user_id' => $userId, 'email' => $email]);

        $response['success'] = true;
        $response['message'] = 'Registration successful.';
        $response['user_id'] = (int) $userId;
    } catch (Exception $e) {
        $response['message'] = 'An error occurred while creating account.';
        Utils::logActivity('register_error', ['error' => $e->getMessage()]);
    }

    return $response;
}

?>