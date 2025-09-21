<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/register.php';
SessionManager::start();

// If already logged in, redirect to homepage
if (SessionManager::has('user_id')) {
    Response::redirect(SITE_URL . '/index.html');
}

$errors = [];
$successMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = Security::sanitizeInput($_POST['first_name'] ?? '');
    $last_name = Security::sanitizeInput($_POST['last_name'] ?? '');
    $email = Security::sanitizeInput($_POST['email'] ?? '');
    $phone = Security::sanitizeInput($_POST['phone'] ?? null);
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $csrf = $_POST['csrf_token'] ?? '';

    if (!Security::validateCSRFToken($csrf)) {
        $errors[] = 'Invalid request (CSRF).';
    }

    if (empty($errors)) {
        $res = register($first_name, $last_name, $email, $password, $confirm_password, $phone);
        if ($res['success']) {
            // Auto login
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare('SELECT id, email, first_name, last_name FROM users WHERE id = :id LIMIT 1');
            $stmt->execute([':id' => $res['user_id']]);
            $user = $stmt->fetch();

            SessionManager::regenerate();
            SessionManager::set('user_id', $user['id']);
            SessionManager::set('user_name', trim($user['first_name'] . ' ' . $user['last_name']));
            SessionManager::set('is_logged_in', true);

            Utils::logActivity('user_auto_login_after_register', ['user_id' => $user['id']]);

            Response::redirect(SITE_URL . '/index.html');
        } else {
            $errors[] = $res['message'];
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
    <title>Register - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
    <div class="container" style="max-width:640px;margin:48px auto;">
        <div class="card">
            <h2>Create Account</h2>
            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <?php foreach ($errors as $err) echo '<div>' . htmlspecialchars($err) . '</div>'; ?>
                </div>
            <?php endif; ?>

            <form method="post" action="">
                <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">

                <div class="form-row">
                    <label>First name</label>
                    <input type="text" name="first_name" required value="<?php echo isset($first_name) ? htmlspecialchars($first_name) : ''; ?>">
                </div>

                <div class="form-row">
                    <label>Last name</label>
                    <input type="text" name="last_name" required value="<?php echo isset($last_name) ? htmlspecialchars($last_name) : ''; ?>">
                </div>

                <div class="form-row">
                    <label>Email</label>
                    <input type="email" name="email" required value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>">
                </div>

                <div class="form-row">
                    <label>Phone (optional)</label>
                    <input type="text" name="phone" value="<?php echo isset($phone) ? htmlspecialchars($phone) : ''; ?>">
                </div>

                <div class="form-row">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>

                <div class="form-row">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" required>
                </div>

                <div class="form-row">
                    <button class="btn btn-primary" type="submit">Register</button>
                </div>
            </form>

            <p>Already have an account? <a href="login.php">Login</a></p>
        </div>
    </div>
</body>
</html>