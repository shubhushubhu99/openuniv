<?php
/**
 * Debug Session Info - FOR DEVELOPMENT ONLY
 * Location: backend/debug-session.php
 * 
 * Shows current session state and cookies
 * DELETE THIS FILE BEFORE PRODUCTION
 */

// Import helpers
require_once __DIR__ . '/middleware/AuthHelper.php';

// Setup CORS
AuthHelper::setupCORS();

// Handle preflight
AuthHelper::handlePreflight();

// Initialize session
AuthHelper::initSession();

// Show debug info
$debug = [
    'session_id' => session_id(),
    'session_status' => session_status() === PHP_SESSION_ACTIVE ? 'ACTIVE' : 'INACTIVE',
    'session_data' => $_SESSION,
    'request_cookies' => $_COOKIE,
    'response_headers' => headers_list(),
    'php_version' => phpversion(),
    'server_name' => $_SERVER['HTTP_HOST'] ?? 'unknown'
];

AuthHelper::sendJSON($debug, 200);
?>
