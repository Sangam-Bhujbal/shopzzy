<?php
require_once __DIR__ . '/../includes/admin_auth.php';
SessionManager::start();
AdminAuth::requireLogin();

$db = Database::getInstance()->getConnection();

// Handle delete action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $csrf = $_POST['csrf_token'] ?? '';
    if (!Security::validateCSRFToken($csrf)) {
        Utils::logActivity('admin_user_delete_csrf_failed', ['admin' => SessionManager::get('admin_user_id')]);
    } else {
        $userId = (int) ($_POST['user_id'] ?? 0);
        if ($userId > 0) {
            $del = $db->prepare("DELETE FROM users WHERE id = :id");
            $del->execute([':id' => $userId]);
            Utils::logActivity('admin_deleted_user', ['admin' => SessionManager::get('admin_user_id'), 'deleted_user' => $userId]);
        }
    }
    Response::redirect('/ecommerce/admin/users.php');
}

// Fetch users
$stmt = $db->query("SELECT id, email, first_name, last_name, phone, is_active, is_verified, created_at FROM users ORDER BY created_at DESC");
$users = $stmt->fetchAll();
$csrf = Security::generateCSRFToken();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Users - Admin</title>
    <link rel="stylesheet" href="/ecommerce/admin/css/admin.css">
</head>
<body class="admin-body">
    <aside class="admin-sidebar">
        <div class="admin-logo">E-Store Admin</div>
        <nav>
            <ul>
                <li><a href="dashboard.php">Dashboard</a></li>
                <li><a href="users.php" class="active">Users</a></li>
                <li><a href="products.php">Products</a></li>
                <li><a href="orders.php">Orders</a></li>
                <li><a href="settings.php">Settings</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>
    </aside>
    <main class="admin-main">
        <header class="admin-header">
            <h1>Users</h1>
            <div>Welcome, <?php echo htmlspecialchars(SessionManager::get('admin_name')); ?></div>
        </header>

        <section class="admin-list">
            <table style="width:100%;border-collapse:collapse;background:#fff;padding:12px;border-radius:8px;overflow:hidden;">
                <thead style="background:#f7fafc;text-align:left;">
                    <tr>
                        <th style="padding:12px">ID</th>
                        <th style="padding:12px">Email</th>
                        <th style="padding:12px">Name</th>
                        <th style="padding:12px">Phone</th>
                        <th style="padding:12px">Active</th>
                        <th style="padding:12px">Verified</th>
                        <th style="padding:12px">Joined</th>
                        <th style="padding:12px">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $u): ?>
                        <tr>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $u['id']; ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo htmlspecialchars($u['email']); ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo htmlspecialchars($u['first_name'] . ' ' . $u['last_name']); ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo htmlspecialchars($u['phone']); ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $u['is_active'] ? 'Yes' : 'No'; ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $u['is_verified'] ? 'Yes' : 'No'; ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $u['created_at']; ?></td>
                            <td style="padding:12px;border-top:1px solid #eee">
                                <form method="post" style="display:inline;" onsubmit="return confirm('Delete this user?');">
                                    <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="user_id" value="<?php echo $u['id']; ?>">
                                    <button class="btn" type="submit">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>
    </main>
</body>
</html> (end)