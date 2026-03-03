<?php
/**
 * Database Configuration and Connection
 * Location: backend/config/Database.php
 * 
 * Handles all database connections using PDO
 * Implements secure connection handling with error management
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'openuniverse';
    private $user = 'root';
    private $password = '';
    private $conn;

    /**
     * Connect to database
     * 
     * @return PDO|false Connection object or false on failure
     */
    public function connect() {
        $this->conn = null;

        try {
            $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';charset=utf8mb4';
            
            $this->conn = new PDO($dsn, $this->user, $this->password);
            
            // Set error mode to exceptions
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            return $this->conn;
        } catch (PDOException $e) {
            error_log('Database Connection Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get database connection
     * 
     * @return PDO|null
     */
    public function getConnection() {
        if ($this->conn === null) {
            return $this->connect();
        }
        return $this->conn;
    }

    /**
     * Set custom database credentials (for testing or config files)
     * 
     * @param string $host Database host
     * @param string $db_name Database name
     * @param string $user Database username
     * @param string $password Database password
     */
    public function setCredentials($host, $db_name, $user, $password) {
        $this->host = $host;
        $this->db_name = $db_name;
        $this->user = $user;
        $this->password = $password;
    }
}
?>
