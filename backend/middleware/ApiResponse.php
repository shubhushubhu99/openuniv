<?php
/**
 * Middleware for API Response Headers
 * Location: backend/middleware/ApiResponse.php
 * 
 * Sets proper headers for API responses and handles CORS
 */

class ApiResponse {
    
    /**
     * Set JSON response headers and enable CORS
     * 
     * @param int $statusCode HTTP status code
     */
    public static function setHeaders($statusCode = 200) {
        // Set HTTP status code
        http_response_code($statusCode);
        
        // Set content type to JSON
        header('Content-Type: application/json; charset=utf-8');
        
        // CORS headers - Allow requests from frontend
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 3600');
    }

    /**
     * Send JSON response
     * 
     * @param array $response Response array
     * @param int $statusCode HTTP status code
     */
    public static function send($response, $statusCode = 200) {
        self::setHeaders($statusCode);
        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Handle preflight requests (OPTIONS method)
     */
    public static function handlePreflight() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::setHeaders(200);
            exit;
        }
    }

    /**
     * Validate request method
     * 
     * @param string|array $allowed Allowed HTTP method(s)
     * 
     * @return bool True if valid, false otherwise
     */
    public static function validateMethod($allowed) {
        $allowed = is_array($allowed) ? $allowed : [$allowed];
        return in_array($_SERVER['REQUEST_METHOD'], $allowed);
    }
}
?>
