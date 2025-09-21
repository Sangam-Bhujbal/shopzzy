<?php
require_once __DIR__ . '/../includes/admin_auth.php';
SessionManager::start();
AdminAuth::requireLogin();

$db = Database::getInstance()->getConnection();
$errors = [];
$success = '';

// Handle product create
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    $csrf = $_POST['csrf_token'] ?? '';
    if (!Security::validateCSRFToken($csrf)) {
        $errors[] = 'Invalid CSRF token';
    }

    $name = Security::sanitizeInput($_POST['name'] ?? '');
    $slug = Security::sanitizeInput($_POST['slug'] ?? '');
    $short_description = Security::sanitizeInput($_POST['short_description'] ?? '');
    $description = Security::sanitizeInput($_POST['description'] ?? '');
    $sku = Security::sanitizeInput($_POST['sku'] ?? '');
    $price = floatval($_POST['price'] ?? 0);
    $compare_price = $_POST['compare_price'] !== '' ? floatval($_POST['compare_price']) : null;
    $quantity = intval($_POST['quantity'] ?? 0);
    $is_featured = isset($_POST['is_featured']) ? 1 : 0;
    $is_new = isset($_POST['is_new']) ? 1 : 0;
    $is_active = isset($_POST['is_active']) ? 1 : 0;
    $category_id = intval($_POST['category_id'] ?? 0);

    if (empty($name)) {
        $errors[] = 'Product name is required.';
    }
    if ($price <= 0) {
        $errors[] = 'Price must be greater than zero.';
    }

    if (empty($slug)) {
        $slug = Utils::generateSlug($name);
    }

    // If no errors, insert
    if (empty($errors)) {
        try {
            $stmt = $db->prepare("INSERT INTO products (name, slug, description, short_description, sku, price, compare_price, quantity, is_featured, is_new, is_active, created_at) VALUES (:name, :slug, :description, :short_description, :sku, :price, :compare_price, :quantity, :is_featured, :is_new, :is_active, NOW())");
            $stmt->execute([
                ':name' => $name,
                ':slug' => $slug,
                ':description' => $description,
                ':short_description' => $short_description,
                ':sku' => $sku,
                ':price' => $price,
                ':compare_price' => $compare_price,
                ':quantity' => $quantity,
                ':is_featured' => $is_featured,
                ':is_new' => $is_new,
                ':is_active' => $is_active
            ]);

            $productId = $db->lastInsertId();

            // Attach product to category if provided
            if ($category_id > 0) {
                $pc = $db->prepare('INSERT INTO product_categories (product_id, category_id) VALUES (:product_id, :category_id)');
                $pc->execute([':product_id' => $productId, ':category_id' => $category_id]);
            }

            // Handle images: primary_image (single) and extra_images (multiple)
            if (!empty($_FILES['primary_image']) && $_FILES['primary_image']['error'] !== UPLOAD_ERR_NO_FILE) {
                try {
                    $filename = FileUpload::uploadImage($_FILES['primary_image']);
                    $imgStmt = $db->prepare('INSERT INTO product_images (product_id, image_path, alt_text, sort_order, is_primary, created_at) VALUES (:product_id, :image_path, :alt_text, 0, 1, NOW())');
                    $imgStmt->execute([':product_id' => $productId, ':image_path' => $filename, ':alt_text' => $name]);
                } catch (Exception $e) {
                    // non-fatal: image upload failed
                    $errors[] = 'Primary image upload failed: ' . $e->getMessage();
                }
            }

            if (!empty($_FILES['extra_images'])) {
                $extras = $_FILES['extra_images'];
                for ($i = 0; $i < count($extras['name']); $i++) {
                    if ($extras['error'][$i] === UPLOAD_ERR_OK) {
                        $file = [
                            'name' => $extras['name'][$i],
                            'type' => $extras['type'][$i],
                            'tmp_name' => $extras['tmp_name'][$i],
                            'error' => $extras['error'][$i],
                            'size' => $extras['size'][$i]
                        ];
                        try {
                            $filename = FileUpload::uploadImage($file);
                            $imgStmt = $db->prepare('INSERT INTO product_images (product_id, image_path, alt_text, sort_order, is_primary, created_at) VALUES (:product_id, :image_path, :alt_text, :sort_order, 0, NOW())');
                            $imgStmt->execute([':product_id' => $productId, ':image_path' => $filename, ':alt_text' => $name, ':sort_order' => $i]);
                        } catch (Exception $e) {
                            $errors[] = 'Extra image upload failed (' . $file['name'] . '): ' . $e->getMessage();
                        }
                    }
                }
            }

            Utils::logActivity('admin_created_product', ['admin' => SessionManager::get('admin_user_id'), 'product_id' => $productId]);
            $success = 'Product created successfully.';
        } catch (Exception $e) {
            $errors[] = 'Failed to create product: ' . $e->getMessage();
            Utils::logActivity('admin_create_product_error', ['error' => $e->getMessage()]);
        }
    }
}

// Fetch categories for selector
$catStmt = $db->query('SELECT id, name FROM categories WHERE is_active = 1 ORDER BY sort_order, name');
$categories = $catStmt->fetchAll();

// Fetch products to list
$prodStmt = $db->query('SELECT p.id, p.name, p.price, p.quantity, p.is_active FROM products p ORDER BY p.created_at DESC LIMIT 100');
$products = $prodStmt->fetchAll();

$csrf = Security::generateCSRFToken();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Products - Admin</title>
    <link rel="stylesheet" href="/ecommerce/admin/css/admin.css">
</head>
<body class="admin-body">
    <aside class="admin-sidebar">
        <div class="admin-logo">E-Store Admin</div>
        <nav>
            <ul>
                <li><a href="dashboard.php">Dashboard</a></li>
                <li><a href="users.php">Users</a></li>
                <li><a href="products.php" class="active">Products</a></li>
                <li><a href="orders.php">Orders</a></li>
                <li><a href="settings.php">Settings</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>
    </aside>
    <main class="admin-main">
        <header class="admin-header">
            <h1>Products</h1>
            <div>Welcome, <?php echo htmlspecialchars(SessionManager::get('admin_name')); ?></div>
        </header>

        <?php if (!empty($errors)): ?>
            <div style="background:#ffe6e6;padding:12px;border-radius:6px;margin-bottom:12px;">
                <?php foreach ($errors as $err) echo '<div>' . htmlspecialchars($err) . '</div>'; ?>
            </div>
        <?php endif; ?>
        <?php if (!empty($success)): ?>
            <div style="background:#e6ffef;padding:12px;border-radius:6px;margin-bottom:12px;">
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>

        <section style="margin-bottom:24px;background:#fff;padding:16px;border-radius:8px;">
            <h2>Create Product</h2>
            <form method="post" action="" enctype="multipart/form-data">
                <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>">
                <input type="hidden" name="action" value="create">

                <div class="form-row">
                    <label>Name</label>
                    <input type="text" name="name" required>
                </div>

                <div class="form-row">
                    <label>Slug (optional)</label>
                    <input type="text" name="slug">
                </div>

                <div class="form-row">
                    <label>Category</label>
                    <select name="category_id">
                        <option value="0">-- Select category --</option>
                        <?php foreach ($categories as $c): ?>
                            <option value="<?php echo $c['id']; ?>"><?php echo htmlspecialchars($c['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-row">
                    <label>Short Description</label>
                    <input type="text" name="short_description">
                </div>

                <div class="form-row">
                    <label>Description</label>
                    <textarea name="description" rows="4"></textarea>
                </div>

                <div class="form-row">
                    <label>SKU</label>
                    <input type="text" name="sku">
                </div>

                <div class="form-row">
                    <label>Price</label>
                    <input type="number" step="0.01" name="price" required>
                </div>

                <div class="form-row">
                    <label>Compare Price</label>
                    <input type="number" step="0.01" name="compare_price">
                </div>

                <div class="form-row">
                    <label>Quantity</label>
                    <input type="number" name="quantity" value="0">
                </div>

                <div class="form-row">
                    <label>Primary Image</label>
                    <input type="file" name="primary_image" accept="image/*">
                </div>

                <div class="form-row">
                    <label>Extra Images</label>
                    <input type="file" name="extra_images[]" accept="image/*" multiple>
                </div>

                <div class="form-row">
                    <label><input type="checkbox" name="is_featured"> Featured</label>
                    <label><input type="checkbox" name="is_new"> New</label>
                    <label><input type="checkbox" name="is_active"> Active</label>
                </div>

                <div class="form-row">
                    <button class="btn btn-primary" type="submit">Create Product</button>
                </div>
            </form>
        </section>

        <section>
            <h2>Products</h2>
            <table style="width:100%;border-collapse:collapse;background:#fff;padding:12px;border-radius:8px;overflow:hidden;">
                <thead style="background:#f7fafc;text-align:left;">
                    <tr>
                        <th style="padding:12px">ID</th>
                        <th style="padding:12px">Name</th>
                        <th style="padding:12px">Price</th>
                        <th style="padding:12px">Qty</th>
                        <th style="padding:12px">Active</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p): ?>
                        <tr>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $p['id']; ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo htmlspecialchars($p['name']); ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo Utils::formatPrice($p['price']); ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $p['quantity']; ?></td>
                            <td style="padding:12px;border-top:1px solid #eee"><?php echo $p['is_active'] ? 'Yes' : 'No'; ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>
    </main>
</body>
</html>