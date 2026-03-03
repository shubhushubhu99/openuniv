<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/Database.php";

try {
    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    }

    $query = "SELECT * FROM repositories ORDER BY id DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $repos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($repos);

} catch (Exception $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}