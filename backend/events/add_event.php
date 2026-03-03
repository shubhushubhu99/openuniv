<?php
header("Content-Type: application/json");
include("../config/Database.php");

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'];
$description = $data['description'];
$date = $data['date'];
$venue = $data['venue'];
$type = $data['type'];

$stmt = $conn->prepare("INSERT INTO events (title, description, date, venue, type) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $title, $description, $date, $venue, $type);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>