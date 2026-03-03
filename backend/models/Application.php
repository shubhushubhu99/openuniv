<?php
/**
 * Application Model
 * Location: backend/models/Application.php
 * 
 * Handles all database operations related to user applications
 * Uses prepared statements for security
 */

require_once __DIR__ . '/../config/Database.php';

class Application {
    private $db;
    private $table = 'applications';

    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
        
        if ($this->db === false) {
            throw new Exception('Database connection failed');
        }
    }

    /**
     * Create a new application
     * 
     * @param string $name Full name
     * @param string $email Email address
     * @param string $password Plain text password (will be hashed)
     * @param string $role Role (contributor or admin)
     * @param array $extra Extra fields (optional)
     * 
     * @return array|false Application data with ID or false on failure
     */
    public function create($name, $email, $password, $role = 'contributor', $extra = []) {
        try {
            // Validate inputs
            if (empty($name) || empty($email) || empty($role)) {
                throw new Exception('Name, email, and role are required');
            }

            // Validate email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }

            // Validate role
            if (!in_array($role, ['contributor', 'admin'])) {
                throw new Exception('Invalid role. Must be "contributor" or "admin"');
            }

            // Check if email already exists
            if ($this->emailExists($email)) {
                throw new Exception('Email already registered');
            }

            // Hash password if not already hashed
            $hashedPassword = $password;
            if (strlen($password) < 20) {
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
            }

            // Extract extra fields
            $reason = isset($extra['reason']) ? $extra['reason'] : '';
            $github_url = isset($extra['github_url']) ? $extra['github_url'] : '';
            $managed_team = isset($extra['managed_team']) ? $extra['managed_team'] : null;
            $team_experience = isset($extra['team_experience']) ? $extra['team_experience'] : null;

            // Prepare INSERT query with all fields
            $query = "INSERT INTO " . $this->table . " 
                      (name, email, password, role, github_url, reason, managed_team, team_experience, status, created_at)
                      VALUES 
                      (:name, :email, :password, :role, :github_url, :reason, :managed_team, :team_experience, 'Pending', NOW())";

            $stmt = $this->db->prepare($query);

            // Bind parameters
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':role', $role, PDO::PARAM_STR);
            $stmt->bindParam(':github_url', $github_url, PDO::PARAM_STR);
            $stmt->bindParam(':reason', $reason, PDO::PARAM_STR);
            
            // Handle managed_team - can be NULL or a value
            if ($managed_team === null || $managed_team === '') {
                $stmt->bindValue(':managed_team', null, PDO::PARAM_NULL);
            } else {
                $stmt->bindParam(':managed_team', $managed_team, PDO::PARAM_STR);
            }
            
            // Handle team_experience - can be NULL or a value
            if ($team_experience === null || $team_experience === '') {
                $stmt->bindValue(':team_experience', null, PDO::PARAM_NULL);
            } else {
                $stmt->bindParam(':team_experience', $team_experience, PDO::PARAM_STR);
            }

            // Execute query
            if ($stmt->execute()) {
                return [
                    'id' => $this->db->lastInsertId(),
                    'name' => $name,
                    'email' => $email,
                    'role' => $role,
                    'github_url' => $github_url,
                    'reason' => $reason,
                    'managed_team' => $managed_team,
                    'team_experience' => $team_experience,
                    'status' => 'Pending',
                    'created_at' => date('Y-m-d H:i:s')
                ];
            }

            return false;
        } catch (Exception $e) {
            error_log('Application Create Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check if email already exists
     * 
     * @param string $email Email to check
     * 
     * @return bool True if email exists, false otherwise
     */
    public function emailExists($email) {
        try {
            $query = "SELECT id FROM " . $this->table . " WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log('Email Check Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get application by ID
     * 
     * @param int $id Application ID
     * 
     * @return array|false Application data or false if not found
     */
    public function getById($id) {
        try {
            $query = "SELECT id, name, email, role, status, created_at FROM " . $this->table . " 
                      WHERE id = :id LIMIT 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }

            return false;
        } catch (PDOException $e) {
            error_log('Get Application Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get application by email
     * 
     * @param string $email Email address
     * 
     * @return array|false Application data or false if not found
     */
    public function getByEmail($email) {
        try {
            $query = "SELECT id, name, email, role, status, created_at FROM " . $this->table . " 
                      WHERE email = :email LIMIT 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }

            return false;
        } catch (PDOException $e) {
            error_log('Get Application by Email Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update application status (for admin approval)
     * 
     * @param int $id Application ID
     * @param string $status New status (approved, rejected, pending)
     * 
     * @return bool Success or failure
     */
    public function updateStatus($id, $status) {
        try {
            if (!in_array($status, ['pending', 'approved', 'rejected'])) {
                throw new Exception('Invalid status');
            }

            $query = "UPDATE " . $this->table . " SET status = :status, updated_at = NOW() 
                      WHERE id = :id";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $status, PDO::PARAM_STR);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log('Update Status Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get pending applications (for admin dashboard)
     * 
     * @param int $limit Number of results to return
     * 
     * @return array Pending applications
     */
    public function getPendingApplications($limit = 50) {
        try {
            $query = "SELECT id, name, email, role, status, created_at FROM " . $this->table . " 
                      WHERE status = 'pending' 
                      ORDER BY created_at DESC 
                      LIMIT :limit";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log('Get Pending Applications Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Verify password for authentication
     * 
     * @param int $id Application ID
     * @param string $password Plain text password
     * 
     * @return bool True if password matches
     */
    public function verifyPassword($id, $password) {
        try {
            $query = "SELECT password FROM " . $this->table . " WHERE id = :id LIMIT 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                return password_verify($password, $row['password']);
            }

            return false;
        } catch (PDOException $e) {
            error_log('Password Verify Error: ' . $e->getMessage());
            return false;
        }
    }
}
?>
