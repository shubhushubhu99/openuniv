CREATE TABLE IF NOT EXISTS `community_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Discussion',
  `content` text NOT NULL,
  `title` text NOT NULL,
  `upvotes` int(11) NOT NULL DEFAULT 0,
  `comment_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `community_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `author_name` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `upvotes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`post_id`) REFERENCES `community_posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `community_comments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `community_reports` (
  id INT PRIMARY KEY AUTO_INCREMENT, 
 item_type VARCHAR(20) NOT NULL,
  item_id INT NOT NULL, 
  reporter_name VARCHAR(255) NOT NULL, 
  reason VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);