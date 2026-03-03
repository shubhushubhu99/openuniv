<?php
/**
 * Dashboard Data Endpoint
 * Location: backend/dashboard-data.php
 * 
 * Returns user's XP, level, and name for dashboard display
 * 
 * GET /backend/dashboard-data.php
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "xp": 150,
 *     "level": 2,
 *     "name": "John Doe"
 *   }
 * }
 */

// Enable error logging
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');
error_reporting(E_ALL);

// Import helpers
require_once __DIR__ . '/config/Database.php';
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
            'message' => 'Unauthorized'
        ], 401);
    }
    
    // Get user ID from session
    $userId = AuthHelper::getUserId();
    
    // Connect to database
    $database = new Database();
    $db = $database->connect();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }
    
    // Query user dashboard data
    $query = "SELECT xp, level, name FROM users WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([':id' => $userId]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$data) {
        throw new Exception('User not found');
    }
    
    AuthHelper::sendJSON([
        'success' => true,
        'data' => $data
    ], 200);
    
} catch (Exception $e) {
    error_log('Dashboard Data Error: ' . $e->getMessage());
    
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'An error occurred'
    ], 500);
}
?>
