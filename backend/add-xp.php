<?php
/**
 * Add XP Endpoint
 * Location: backend/add-xp.php
 * 
 * Adds 10 XP to user and recalculates level
 * Level = floor(xp / 100) + 1
 * 
 * POST /backend/add-xp.php
 * 
 * Response:
 * {
 *   "success": true,
 *   "xp": 160,
 *   "level": 2
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

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    
    // Get current XP
    $query = "SELECT xp FROM users WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        throw new Exception('User not found');
    }
    
    // Add 10 XP
    $newXp = $user['xp'] + 10;
    
    // Calculate new level (base level is 1)
    $newLevel = floor($newXp / 100) + 1;
    
    // Update database
    $update = "UPDATE users SET xp = :xp, level = :level WHERE id = :id";
    $stmt = $db->prepare($update);
    $stmt->execute([
        ':xp' => $newXp,
        ':level' => $newLevel,
        ':id' => $userId
    ]);
    
    AuthHelper::sendJSON([
        'success' => true,
        'xp' => $newXp,
        'level' => $newLevel
    ], 200);
    
} catch (Exception $e) {
    error_log('Add XP Error: ' . $e->getMessage());
    
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'An error occurred'
    ], 500);
}
?>
