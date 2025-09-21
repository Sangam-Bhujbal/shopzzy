<?php
require_once __DIR__ . '/../includes/admin_auth.php';
SessionManager::start();

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = Security::sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $csrf = $_POST['csrf_token'] ?? '';

    if (!Security::validateCSRFToken($csrf)) {
        $errors[] = 'Invalid CSRF token';
    }

    if (empty($email) || empty($password)) {
        $errors[] = 'Email and password are required';
    } elseif (!Security::isValidEmail($email)) {
        $errors[] = 'Invalid email format';
    }

    if (empty($errors)) {
        $res = AdminAuth::login($email, $password);
        if ($res['success']) {
            $redirect = SessionManager::get('redirect_after_login') ?? '/ecommerce/admin/dashboard.php';
            SessionManager::remove('redirect_after_login');
            Response::redirect($redirect);
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
    <title>Admin Login - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="/ecommerce/admin/css/admin.css">
</head>
<body class="admin-login-body">
    <div class="admin-login-card">
        <h2>Admin Login</h2>
        <?php if (!empty($errors)): ?>
            <div class="admin-errors">
                <?php foreach ($errors as $err) echo '<div class="error">' . htmlspecialchars($err) . '</div>'; ?>
            </div>
        <?php endif; ?>

        <form method="post" action="">
            <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">
            <div class="form-row">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" required>
            </div>
            <div class="form-row">
                <label for="password">Password</label>
                <input id="password" type="password" name="password" required>
            </div>
            <div class="form-row">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
        </form>
        <p>Default admin: <?php echo ADMIN_DEFAULT_EMAIL; ?> / <?php echo ADMIN_DEFAULT_PASSWORD; ?></p>
    </div>
</body>
</html>