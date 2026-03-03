<?php
/**
 * User Login Endpoint
 * Location: backend/login.php
 * 
 * Handles user authentication with email, password, and role verification
 * Returns user data on successful login
 * 
 * POST /backend/login.php
 * Content-Type: application/json
 * 
 * Request:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "role": "Contributor" or "Project Admin"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "user": {
 *     "id": "1",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "contributor"
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

// Only allow POST for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'Method not allowed'
    ], 405);
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'Invalid JSON request'
    ], 400);
}

// Validate required fields
if (empty($input['email']) || empty($input['password']) || empty($input['role'])) {
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'Email, password, and role are required'
    ], 400);
}

$email = trim($input['email']);
$password = $input['password'];
$requestedRole = str_replace(' ', '', $input['role']); // "ProjectAdmin" or "Contributor"

try {
    // Connect to database
    $database = new Database();
    $db = $database->connect();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }
    
    // Query user by email
    $query = "SELECT id, name, email, password FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if user exists and password is correct
    if (!$user || !password_verify($password, $user['password'])) {
        AuthHelper::sendJSON([
            'success' => false,
            'message' => 'Invalid email or password'
        ], 401);
    }
    
    // Determine user role based on admin status
    $userRole = 'contributor';
    
    if ($requestedRole === 'ProjectAdmin' || $requestedRole === 'Project Admin') {
        // Check if user is an admin
        $adminQuery = "SELECT id FROM admins WHERE user_id = :user_id LIMIT 1";
        $adminStmt = $db->prepare($adminQuery);
        $adminStmt->execute([':user_id' => $user['id']]);
        $adminRecord = $adminStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($adminRecord) {
            $userRole = 'admin';
        } else {
            // User is not an admin but requested admin login
            AuthHelper::sendJSON([
                'success' => false,
                'message' => 'You are not authorized as a Project Admin'
            ], 403);
        }
    }
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $userRole;
    
    // Return success response
    AuthHelper::sendJSON([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $userRole
        ]
    ], 200);
    
} catch (Exception $e) {
    error_log('Login Error: ' . $e->getMessage());
    
    AuthHelper::sendJSON([
        'success' => false,
        'message' => 'An error occurred during login'
    ], 500);
}
?>

            "role" => $user['role']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
}