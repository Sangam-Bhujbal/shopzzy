<?php
require_once __DIR__ . '/../includes/admin_auth.php';
SessionManager::start();
AdminAuth::requireLogin();

$db = Database::getInstance()->getConnection();

// Simple stats
$stats = [];
$stats['users'] = $db->query("SELECT COUNT(*) as cnt FROM users")->fetch()['cnt'];
$stats['products'] = $db->query("SELECT COUNT(*) as cnt FROM products")->fetch()['cnt'];
$stats['orders'] = $db->query("SELECT COUNT(*) as cnt FROM orders")->fetch()['cnt'];

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Dashboard - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="/ecommerce/admin/css/admin.css">
</head>
<body class="admin-body">
    <aside class="admin-sidebar">
        <div class="admin-logo">E-Store Admin</div>
        <nav>
            <ul>
                <li><a href="dashboard.php" class="active">Dashboard</a></li>
                <li><a href="users.php">Users</a></li>
                <li><a href="products.php">Products</a></li>
                <li><a href="orders.php">Orders</a></li>
                <li><a href="settings.php">Settings</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>
    </aside>
    <main class="admin-main">
        <header class="admin-header">
            <h1>Dashboard</h1>
            <div>Welcome, <?php echo htmlspecialchars(SessionManager::get('admin_name')); ?></div>
        </header>
        <section class="admin-stats">
            <div class="stat-card">
                <h3>Users</h3>
                <p><?php echo $stats['users']; ?></p>
            </div>
            <div class="stat-card">
                <h3>Products</h3>
                <p><?php echo $stats['products']; ?></p>
            </div>
            <div class="stat-card">
                <h3>Orders</h3>
                <p><?php echo $stats['orders']; ?></p>
            </div>
        </section>
    </main>
</body>
</html>