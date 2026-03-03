<?php
/**
 * Application Submission Endpoint
 * Location: backend/apply.php
 * 
 * API endpoint for submitting "Join Now" applications
 * Accepts POST requests with: name, email, password, role
 * 
 * Usage:
 * POST /backend/apply.php
 * Content-Type: application/json
 * 
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123",
 *   "role": "contributor"
 * }
 */

// SET CORS HEADERS FIRST - BEFORE ANY OTHER CODE
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json; charset=utf-8');

// Handle CORS preflight request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Initialize response
$response = [
    'success' => false,
    'message' => 'Invalid request',
    'code' => 400
];

try {
    // Require dependencies - with error checking
    if (!file_exists(__DIR__ . '/middleware/ApiResponse.php')) {
        throw new Exception('ApiResponse.php not found');
    }
    require_once __DIR__ . '/middleware/ApiResponse.php';
    
    if (!file_exists(__DIR__ . '/controllers/ApplicationController.php')) {
        throw new Exception('ApplicationController.php not found');
    }
    require_once __DIR__ . '/controllers/ApplicationController.php';
    // Get request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Get request action from URL parameter or POST
    $action = isset($_GET['action']) ? $_GET['action'] : 'submit';

    // Route handling
    switch ($method) {
        case 'POST':
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if ($input === null && !empty($_POST)) {
                // Fallback to POST data if JSON parsing fails
                $input = $_POST;
            }

            if (!is_array($input)) {
                $response = [
                    'success' => false,
                    'message' => 'Invalid request body. Please send valid JSON.',
                    'code' => 400
                ];
                break;
            }

            // Initialize controller
            $controller = new ApplicationController();

            // Route actions
            switch ($action) {
                case 'submit':
                    $response = $controller->submitApplication($input);
                    break;
                
                case 'status':
                    // Update application status (admin only)
                    $applicationId = $input['application_id'] ?? null;
                    $status = $input['status'] ?? null;
                    
                    if (!$applicationId || !$status) {
                        $response = [
                            'success' => false,
                            'message' => 'application_id and status are required',
                            'code' => 400
                        ];
                    } else {
                        $response = $controller->updateApplicationStatus($applicationId, $status);
                    }
                    break;

                default:
                    $response = [
                        'success' => false,
                        'message' => 'Invalid action. Use "submit" or "status"',
                        'code' => 400
                    ];
                    break;
            }
            break;

        case 'GET':
            // Get application details
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                $response = [
                    'success' => false,
                    'message' => 'Application ID is required',
                    'code' => 400
                ];
            } else {
                $controller = new ApplicationController();
                
                if ($action === 'get') {
                    $response = $controller->getApplication($id);
                } elseif ($action === 'pending') {
                    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
                    $response = $controller->getPendingApplications($limit);
                } else {
                    $response = $controller->getApplication($id);
                }
            }
            break;

        default:
            $response = [
                'success' => false,
                'message' => 'Method ' . $method . ' is not allowed. Use GET or POST.',
                'code' => 405
            ];
            break;
    }

} catch (Exception $e) {
    // Log errors
    error_log('Apply Endpoint Error: ' . $e->getMessage());
    
    $response = [
        'success' => false,
        'message' => 'An unexpected error occurred',
        'code' => 500
    ];
}

// Send response with appropriate HTTP status code
$statusCode = $response['code'] ?? 500;
ApiResponse::send($response, $statusCode);
?>
