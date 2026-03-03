<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once('../config/Database.php');

$database = new Database();
$conn = $database->connect();

if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM events ORDER BY start_date ASC");
    $stmt->execute();

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $today = date('Y-m-d');

    foreach ($events as &$event) {
        if ($today < $event['start_date']) {
            $event['computed_status'] = 'upcoming';
        } elseif ($today >= $event['start_date'] && $today <= $event['end_date']) {
            $event['computed_status'] = 'ongoing';
        } else {
            $event['computed_status'] = 'completed';
        }
    }

    echo json_encode($events);

} catch (PDOException $e) {
    echo json_encode([
        "error" => "Query failed",
        "message" => $e->getMessage()
    ]);
}