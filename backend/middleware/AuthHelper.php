<?php
/**
 * CORS and Session Helper
 * Location: backend/middleware/AuthHelper.php
 * 
 * Manages CORS headers, preflight requests, and session handling
 */

class AuthHelper {
    
    /**
     * Setup CORS headers with session support
     */
    public static function setupCORS() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        // Allow any localhost origin (for dev with different ports)
        if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Content-Type: application/json; charset=utf-8');
    }
    
    /**
     * Handle preflight (OPTIONS) request
     */
    public static function handlePreflight() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
    
    /**
     * Initialize secure session
     */
    public static function initSession() {
        // Configure session security
        // Set to 'Strict' for same-origin requests, 'None' requires Secure flag
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.cookie_secure', '0'); // HTTP only for local dev (no HTTPS)
        ini_set('session.cookie_httponly', '1'); // Protect from JS access
        ini_set('session.cookie_domain', '');  // Allow cookies across different ports
        
        // Ensure session is started before any output
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    /**
     * Send JSON response
     */
    public static function sendJSON($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Check if user is authenticated
     */
    public static function isAuthenticated() {
        return isset($_SESSION['user_id']);
    }
    
    /**
     * Get current user ID
     */
    public static function getUserId() {
        return $_SESSION['user_id'] ?? null;
    }
}
?>
