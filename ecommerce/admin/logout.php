<?php
require_once __DIR__ . '/../includes/admin_auth.php';
SessionManager::start();
AdminAuth::logout();
Response::redirect('/ecommerce/admin/login.php');
