<?php
/**
 * Backend API Router
 * Location: backend/index.php
 * 
 * Routes API requests to appropriate endpoints
 * Direct access to apply.php is recommended from frontend
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Redirect to apply.php for all API calls
require __DIR__ . '/apply.php';
?>
