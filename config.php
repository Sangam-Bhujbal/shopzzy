<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ecommerce_db');

// Application Configuration
define('SITE_NAME', 'E-Commerce Store');
define('SITE_URL', 'http://localhost/ecommerce');
define('ADMIN_EMAIL', 'admin@example.com');
// Default admin credentials (used only to seed the first admin user if none exists)
// CHANGE THESE in production. Password below is plain text only for initial seeding — it will be hashed before storing.
define('ADMIN_DEFAULT_EMAIL', 'admin@estore.com');
define('ADMIN_DEFAULT_PASSWORD', 'Admin@12345');

// Database Connection Class
class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    // Prevent cloning
    private function __clone() {}

    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

// Security Configuration
class Security {
    public static function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }

    public static function generateCSRFToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function validateCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }

    public static function hashPassword($password) {
        // Use Argon2id when available, otherwise fallback to PASSWORD_DEFAULT
        if (defined('PASSWORD_ARGON2ID')) {
            return password_hash($password, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 3
            ]);
        }

        // Fallback for older PHP versions
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public static function generateSecureToken($length = 32) {
        return bin2hex(random_bytes($length));
    }

    public static function isValidEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function isValidPhone($phone) {
        return preg_match('/^[6-9]\d{9}$/', $phone);
    }
}

// Session Configuration
class SessionManager {
    public static function start() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function set($key, $value) {
        self::start();
        $_SESSION[$key] = $value;
    }

    public static function get($key, $default = null) {
        self::start();
        return $_SESSION[$key] ?? $default;
    }

    public static function has($key) {
        self::start();
        return isset($_SESSION[$key]);
    }

    public static function remove($key) {
        self::start();
        unset($_SESSION[$key]);
    }

    public static function destroy() {
        self::start();
        session_destroy();
    }

    public static function regenerate() {
        self::start();
        session_regenerate_id(true);
    }
}

// File Upload Configuration
class FileUpload {
    public static $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    public static $maxFileSize = 5 * 1024 * 1024; // 5MB
    public static $uploadPath = '../uploads/';

    public static function uploadImage($file, $allowedTypes = null, $maxSize = null) {
        $allowedTypes = $allowedTypes ?: self::$allowedImageTypes;
        $maxSize = $maxSize ?: self::$maxFileSize;

        // Validate file
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error');
        }

        if ($file['size'] > $maxSize) {
            throw new Exception('File too large');
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Invalid file type');
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $filepath = self::$uploadPath . $filename;

        // Create directory if it doesn't exist
        if (!is_dir(self::$uploadPath)) {
            mkdir(self::$uploadPath, 0755, true);
        }

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Failed to move uploaded file');
        }

        return $filename;
    }

    public static function deleteImage($filename) {
        $filepath = self::$uploadPath . $filename;
        if (file_exists($filepath)) {
            return unlink($filepath);
        }
        return false;
    }
}

// Email Configuration (using PHPMailer)
class EmailConfig {
    public static $smtpHost = 'smtp.gmail.com';
    public static $smtpPort = 587;
    public static $smtpUsername = 'your-email@gmail.com';
    public static $smtpPassword = 'your-app-password';
    public static $smtpEncryption = 'tls';
    public static $fromEmail = 'noreply@yourstore.com';
    public static $fromName = 'E-Commerce Store';

    public static function isConfigured() {
        return !empty(self::$smtpUsername) && !empty(self::$smtpPassword);
    }
}

// Cache Configuration
class Cache {
    private static $cacheDir = '../cache/';
    private static $defaultTTL = 3600; // 1 hour

    public static function get($key) {
        $filename = self::$cacheDir . md5($key) . '.cache';

        if (!file_exists($filename)) {
            return null;
        }

        $data = json_decode(file_get_contents($filename), true);

        if ($data['expires'] < time()) {
            unlink($filename);
            return null;
        }

        return $data['value'];
    }

    public static function set($key, $value, $ttl = null) {
        $ttl = $ttl ?: self::$defaultTTL;
        $filename = self::$cacheDir . md5($key) . '.cache';

        if (!is_dir(self::$cacheDir)) {
            mkdir(self::$cacheDir, 0755, true);
        }

        $data = [
            'value' => $value,
            'expires' => time() + $ttl
        ];

        return file_put_contents($filename, json_encode($data)) !== false;
    }

    public static function delete($key) {
        $filename = self::$cacheDir . md5($key) . '.cache';
        if (file_exists($filename)) {
            return unlink($filename);
        }
        return false;
    }

    public static function clear() {
        $files = glob(self::$cacheDir . '*.cache');
        foreach ($files as $file) {
            unlink($file);
        }
    }
}

// API Response Helper
class Response {
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public static function error($message, $statusCode = 400) {
        self::json(['error' => $message], $statusCode);
    }

    public static function success($data = null, $message = 'Success') {
        self::json(['success' => true, 'message' => $message, 'data' => $data]);
    }

    public static function redirect($url, $statusCode = 302) {
        http_response_code($statusCode);
        header('Location: ' . $url);
        exit;
    }
}

// Utility Functions
class Utils {
    public static function formatPrice($price, $currency = '₹') {
        return $currency . number_format($price, 0, '.', ',');
    }

    public static function formatDate($date, $format = 'd M Y') {
        return date($format, strtotime($date));
    }

    public static function truncateText($text, $length = 100) {
        if (strlen($text) <= $length) {
            return $text;
        }
        return substr($text, 0, $length) . '...';
    }

    public static function generateSlug($text) {
        return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text)));
    }

    public static function isAjaxRequest() {
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }

    public static function getClientIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }

    public static function logActivity($action, $details = null) {
        $logFile = '../logs/activity.log';
        $logDir = dirname($logFile);

        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => self::getClientIP(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'action' => $action,
            'details' => $details,
            'user_id' => SessionManager::get('user_id')
        ];

        file_put_contents($logFile, json_encode($logEntry) . PHP_EOL, FILE_APPEND);
    }
}

// Initialize session
SessionManager::start();

// Error reporting (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set timezone
date_default_timezone_set('Asia/Kolkata');
?>
