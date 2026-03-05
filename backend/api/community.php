<?php
header("Access-Control-Allow-Origin: http://localhost:5173");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';

$database = new Database();
$db = $database->connect();

if (!$db) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_posts':
            $sort = $_GET['sort'] ?? 'hot';
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $search = $_GET['search'] ?? '';
            $offset = ($page - 1) * $limit;

            $orderBy = "ORDER BY created_at DESC"; // Default for 'new'

            if ($sort === 'hot') {
                // Hot: (upvotes * 1.5) + (comments * 2) - penalty for older posts
                $orderBy = "ORDER BY ((upvotes * 1.5) + (comment_count * 2)) / POWER(TIMESTAMPDIFF(HOUR, created_at, NOW()) + 2, 1.5) DESC";
            }
            else if ($sort === 'top') {
                $orderBy = "ORDER BY upvotes DESC";
            }

            // Build WHERE clause for search
            $whereClause = "";
            $params = [];
            if (!empty($search)) {
                $whereClause = "WHERE title LIKE ? OR content LIKE ?";
                $searchTerm = '%' . $search . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            // Get total count for hasMore logic
            $countStmt = $db->prepare("SELECT COUNT(*) FROM community_posts $whereClause");
            $countStmt->execute($params);
            $totalCount = $countStmt->fetchColumn();

            // Fetch paginated posts
            $query = "SELECT * FROM community_posts $whereClause $orderBy LIMIT ? OFFSET ?";
            $stmt = $db->prepare($query);

            // Bind parameters
            $paramIndex = 1;
            if (!empty($search)) {
                $stmt->bindValue($paramIndex++, $searchTerm, PDO::PARAM_STR);
                $stmt->bindValue($paramIndex++, $searchTerm, PDO::PARAM_STR);
            }
            $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
            $stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);

            $stmt->execute();

            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $hasMore = ($offset + $limit) < $totalCount;

            echo json_encode(['success' => true, 'data' => $posts, 'hasMore' => $hasMore]);
            break;

        case 'create_post':
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->author_name) || !isset($data->content) || !isset($data->title)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            $stmt = $db->prepare("INSERT INTO community_posts (author_name, title, content, category) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data->author_name, $data->title, $data->content, $data->category ?? 'Discussion']);
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
            break;

        case 'get_sidebar_data':
            $stmt = $db->query("SELECT COUNT(DISTINCT author_name) as count FROM (SELECT author_name FROM community_posts UNION SELECT author_name FROM community_comments) as authors");
            $membersRow = $stmt->fetch(PDO::FETCH_ASSOC);
            $realMembers = (int)$membersRow['count'];

            $stmt = $db->query("SELECT id, title, comment_count as postsCount, (upvotes + comment_count * 2) as score FROM community_posts ORDER BY score DESC LIMIT 5");
            $trending = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'data' => [
                    'stats' => [
                        'members' => 15300 + $realMembers, // Added baseline to look active
                        'online' => 300 + rand(10, 99) // Mock randomized online count
                    ],
                    'trending' => empty($trending) ? [
                        ['id' => 1, 'title' => 'Welcome to OpenUniverse', 'postsCount' => 1]
                    ] : $trending
                ]
            ]);
            break;

        case 'get_comments':
            if (!isset($_GET['post_id'])) {
                echo json_encode(['success' => false, 'message' => 'Missing post_id']);
                break;
            }
            $postId = $_GET['post_id'];
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50; // comment limit
            $offset = ($page - 1) * $limit;

            // Count root comments
            $countStmt = $db->prepare("SELECT COUNT(*) FROM community_comments WHERE post_id = ? AND parent_id IS NULL");
            $countStmt->execute([$postId]);
            $totalRootComments = $countStmt->fetchColumn();

            // Fetch root comments paginated
            $stmt = $db->prepare("SELECT id FROM community_comments WHERE post_id = :post_id AND parent_id IS NULL ORDER BY upvotes DESC, created_at ASC LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':post_id', $postId, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $rootIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (empty($rootIds)) {
                echo json_encode(['success' => true, 'data' => [], 'hasMore' => false]);
                break;
            }

            $stmtFlat = $db->prepare("SELECT * FROM community_comments WHERE post_id = :post_id ORDER BY created_at ASC LIMIT :limit OFFSET :offset");
            $stmtFlat->bindValue(':post_id', $postId, PDO::PARAM_INT);
            $stmtFlat->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmtFlat->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmtFlat->execute();
            $comments = $stmtFlat->fetchAll(PDO::FETCH_ASSOC);
            
            $countFlatStmt = $db->prepare("SELECT COUNT(*) FROM community_comments WHERE post_id = ?");
            $countFlatStmt->execute([$postId]);
            $totalComments = $countFlatStmt->fetchColumn();

            $hasMore = ($offset + $limit) < $totalComments;

            echo json_encode(['success' => true, 'data' => $comments, 'hasMore' => $hasMore]);
            break;

        case 'create_comment':
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->post_id) || !isset($data->author_name) || !isset($data->content)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            // Insert comment
            $stmt = $db->prepare("INSERT INTO community_comments (post_id, parent_id, author_name, content) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data->post_id,
                isset($data->parent_id) ? $data->parent_id : null,
                $data->author_name,
                $data->content
            ]);
            $commentId = $db->lastInsertId();

            // Increment post comment count
            $stmt = $db->prepare("UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = ?");
            $stmt->execute([$data->post_id]);

            echo json_encode(['success' => true, 'id' => $commentId]);
            break;

        case 'vote':
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->type) || !isset($data->id) || !isset($data->amount)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            $table = $data->type === 'post' ? 'community_posts' : 'community_comments';
            $amount = (int)$data->amount; //  1 or -1

            $stmt = $db->prepare("UPDATE $table SET upvotes = upvotes + ? WHERE id = ?");
            $stmt->execute([$amount, $data->id]);

            echo json_encode(['success' => true]);
            break;

        case 'delete_post':
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->id) || !isset($data->author_name)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            // Delete post only if author_name matches
            $stmt = $db->prepare("DELETE FROM community_posts WHERE id = ? AND author_name = ?");
            $stmt->execute([$data->id, $data->author_name]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true]);
            }
            else {
                echo json_encode(['success' => false, 'message' => 'Unauthorized or post not found']);
            }
            break;

        case 'delete_comment':
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->id) || !isset($data->author_name) || !isset($data->post_id)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            // Delete comment only if author_name matches
            $stmt = $db->prepare("DELETE FROM community_comments WHERE id = ? AND author_name = ?");
            $stmt->execute([$data->id, $data->author_name]);

            if ($stmt->rowCount() > 0) {
                // Decrement post comment count
                $stmt = $db->prepare("UPDATE community_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ?");
                $stmt->execute([$data->post_id]);
                echo json_encode(['success' => true]);
            }
            else {
                echo json_encode(['success' => false, 'message' => 'Unauthorized or comment not found']);
            }
            break;

        case 'report_item':
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->item_type) || !isset($data->item_id) || !isset($data->reporter_name) || !isset($data->reason)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            $stmt = $db->prepare("INSERT INTO community_reports (item_type, item_id, reporter_name, reason) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data->item_type, $data->item_id, $data->reporter_name, $data->reason]);
            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
}
catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
