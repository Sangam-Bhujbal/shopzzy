<?php
require_once __DIR__ . '/includes/config.php';
SessionManager::start();
Utils::logActivity('user_logout', ['user_id' => SessionManager::get('user_id')]);
SessionManager::destroy();
Response::redirect(SITE_URL . '/index.html');
