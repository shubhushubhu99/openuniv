<?php
/**
 * User Logout Endpoint
 * Location: backend/logout.php
 * 
 * Destroys user session and clears authentication
 * 
 * POST /backend/logout.php
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
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

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'Method not allowed'
    ], 405);
}

try {
    // Clear session variables
    $_SESSION = [];
    
    // Destroy the session
    session_destroy();
    
    // Delete session cookie
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    
    AuthHelper::sendJSON([
        'success' => true,
        'message' => 'Logged out successfully'
    ], 200);
    
} catch (Exception $e) {
    error_log('Logout Error: ' . $e->getMessage());
    
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'An error occurred during logout'
    ], 500);
}
?>
