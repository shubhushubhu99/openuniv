<?php
/**
 * Session Check Endpoint
 * Location: backend/check_session.php
 * 
 * Verifies if user is authenticated and returns user data
 * Called on app initialization to restore session
 * 
 * GET /backend/check_session.php
 * 
 * Response (if authenticated):
 * {
 *   "success": true,
 *   "user": {
 *     "id": "1",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "contributor"
 *   }
 * }
 * 
 * Response (if not authenticated):
 * {
 *   "success": false,
 *   "message": "Not authenticated"
 * }
 */

// Enable error logging
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');
error_reporting(E_ALL);

// Import helpers
require_once __DIR__ . '/middleware/AuthHelper.php';

// Setup CORS and headers
AuthHelper::setupCORS();

// Handle preflight request
AuthHelper::handlePreflight();

// Initialize session
AuthHelper::initSession();

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'Method not allowed'
    ], 405);
}

try {
    // Check if user is authenticated
    if (!AuthHelper::isAuthenticated()) {
        AuthHelper::sendJSON([
            'success' => false,
            'message' => 'Not authenticated'
        ], 401);
    }
    
    // Return user data from session
    AuthHelper::sendJSON([
        'success' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'],
            'role' => $_SESSION['user_role']
        ]
    ], 200);
    
} catch (Exception $e) {
    error_log('Check Session Error: ' . $e->getMessage());
    
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'An error occurred'
    ], 500);
}
?>
