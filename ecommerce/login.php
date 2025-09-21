<?php
require_once __DIR__ . '/includes/config.php';
SessionManager::start();

// If already logged in, redirect to homepage
if (SessionManager::has('user_id')) {
    Response::redirect(SITE_URL . '/index.html');
}

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = Security::sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $csrf = $_POST['csrf_token'] ?? '';

    if (!Security::validateCSRFToken($csrf)) {
        $errors[] = 'Invalid request (CSRF)';
    }

    if (empty($email) || empty($password)) {
        $errors[] = 'Email and password are required.';
    } elseif (!Security::isValidEmail($email)) {
        $errors[] = 'Invalid email format.';
    }

    if (empty($errors)) {
        try {
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare('SELECT id, email, password, first_name, last_name, is_active FROM users WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();

            if (!$user) {
                $errors[] = 'Invalid email or password.';
            } else {
                if (!$user['is_active']) {
                    $errors[] = 'Account is disabled. Contact support.';
                } elseif (!Security::verifyPassword($password, $user['password'])) {
                    $errors[] = 'Invalid email or password.';
                } else {
                    // Success
                    SessionManager::regenerate();
                    SessionManager::set('user_id', $user['id']);
                    SessionManager::set('user_name', trim($user['first_name'] . ' ' . $user['last_name']));
                    SessionManager::set('is_logged_in', true);

                    Utils::logActivity('user_login', ['user_id' => $user['id']]);

                    // Redirect back to intended page if present
                    $redirect = SessionManager::get('redirect_after_login') ?: SITE_URL . '/index.html';
                    SessionManager::remove('redirect_after_login');
                    Response::redirect($redirect);
                }
            }
        } catch (Exception $e) {
            $errors[] = 'An error occurred. Please try again later.';
            Utils::logActivity('login_error', ['error' => $e->getMessage()]);
        }
    }
}

$csrfToken = Security::generateCSRFToken();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
    <div class="container" style="max-width:480px;margin:48px auto;">
        <div class="card">
            <h2>Login</h2>
            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <?php foreach ($errors as $err) echo '<div>' . htmlspecialchars($err) . '</div>'; ?>
                </div>
            <?php endif; ?>

            <form method="post" action="">
                <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit">Login</button>
                </div>
            </form>

            <p>Don't have an account? <a href="register.php">Register</a></p>
            <p><a href="forgot-password.php">Forgot password?</a></p>
        </div>
    </div>
</body>
</html>