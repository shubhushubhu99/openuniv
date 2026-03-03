<?php
/**
 * Application Controller
 * Location: backend/controllers/ApplicationController.php
 * 
 * Handles business logic for application submissions
 * Validates input, manages errors, and returns JSON responses
 */

require_once __DIR__ . '/../models/Application.php';

class ApplicationController {
    private $application;
    
    public function __construct() {
        $this->application = new Application();
    }

    /**
     * Submit a new application (Join Now)
     * 
     * Accepts both data formats:
     * Format 1: name, email, password, role
     * Format 2: name, email, github, experience, reason, role_applied
     * 
     * @param array $data POST data
     * 
     * @return array JSON response
     */
    public function submitApplication($data) {
        try {
            // Validate required fields - accept either format
            $full_name = trim($data['full_name'] ?? $data['name'] ?? '');
            $email = trim(strtolower($data['email'] ?? ''));
            $github_url = trim($data['github_url'] ?? $data['github'] ?? '');
            $role = trim($data['role'] ?? $data['role_applied'] ?? '');
            $reason = trim($data['reason'] ?? '');
            
            // Extract admin-specific fields
            $managed_team = trim($data['managed_team'] ?? '');
            $team_experience = trim($data['team_experience'] ?? '');
            
            // Validate required fields
            if (!$full_name || !$email || !$role) {
                return $this->errorResponse('Full name, email, and role are required', 400);
            }

            if (!$email || !$reason) {
                return $this->errorResponse('Email and reason are required', 400);
            }

            // Validate name length
            if (strlen($full_name) < 2 || strlen($full_name) > 255) {
                return $this->errorResponse('Name must be between 2 and 255 characters', 400);
            }

            // Normalize role
            $role = strtolower($role);
            if (strpos($role, 'admin') !== false) {
                $role = 'admin';
            } else {
                $role = 'contributor';
            }

            // Create application with all fields
            $extra = [
                'reason' => $reason,
                'github_url' => $github_url,
                'managed_team' => $managed_team,
                'team_experience' => $team_experience
            ];
            
            $result = $this->application->create($full_name, $email, 'temppass123', $role, $extra);

            if ($result) {
                return $this->successResponse(
                    'Application submitted successfully. We will review your application soon.',
                    $result
                );
            }

        } catch (Exception $e) {
            // Log the error
            error_log('Submit Application Error: ' . $e->getMessage());
            
            // Return user-friendly error message
            if (strpos($e->getMessage(), 'already') !== false) {
                return $this->errorResponse($e->getMessage(), 409);
            }
            
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Get application by ID (for retrieval)
     * 
     * @param int $id Application ID
     * 
     * @return array JSON response
     */
    public function getApplication($id) {
        try {
            if (!is_numeric($id)) {
                return $this->errorResponse('Invalid application ID', 400);
            }

            $application = $this->application->getById((int)$id);

            if ($application) {
                return $this->successResponse(
                    'Application retrieved successfully',
                    $application,
                    200
                );
            }

            return $this->errorResponse('Application not found', 404);

        } catch (Exception $e) {
            error_log('Get Application Error: ' . $e->getMessage());
            return $this->errorResponse('Error retrieving application', 500);
        }
    }

    /**
     * Update application status (Admin function)
     * 
     * @param int $id Application ID
     * @param string $status New status
     * 
     * @return array JSON response
     */
    public function updateApplicationStatus($id, $status) {
        try {
            if (!is_numeric($id)) {
                return $this->errorResponse('Invalid application ID', 400);
            }

            if (empty($status)) {
                return $this->errorResponse('Status is required', 400);
            }

            $result = $this->application->updateStatus((int)$id, $status);

            if ($result) {
                return $this->successResponse(
                    'Application status updated successfully',
                    ['id' => $id, 'status' => $status],
                    200
                );
            }

            return $this->errorResponse('Failed to update application status', 500);

        } catch (Exception $e) {
            error_log('Update Status Error: ' . $e->getMessage());
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Get pending applications (Admin function)
     * 
     * @param int $limit Number of results
     * 
     * @return array JSON response
     */
    public function getPendingApplications($limit = 50) {
        try {
            $applications = $this->application->getPendingApplications($limit);

            return $this->successResponse(
                'Pending applications retrieved successfully',
                ['total' => count($applications), 'applications' => $applications],
                200
            );

        } catch (Exception $e) {
            error_log('Get Pending Applications Error: ' . $e->getMessage());
            return $this->errorResponse('Error retrieving pending applications', 500);
        }
    }

    /**
     * Format success response
     * 
     * @param string $message Success message
     * @param mixed $data Response data
     * @param int $code HTTP status code
     * 
     * @return array Formatted response
     */
    private function successResponse($message, $data, $code = 200) {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'code' => $code
        ];
    }

    /**
     * Format error response
     * 
     * @param string $message Error message
     * @param int $code HTTP status code
     * 
     * @return array Formatted response
     */
    private function errorResponse($message, $code = 400) {
        return [
            'success' => false,
            'message' => $message,
            'code' => $code
        ];
    }
}
?>
