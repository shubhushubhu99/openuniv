-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 03, 2026 at 03:16 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `openuniverse`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `permissions` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `application_id`, `user_id`, `permissions`, `created_at`) VALUES
(1, 1, '8', NULL, '2026-02-25 19:09:29');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('contributor','admin') NOT NULL DEFAULT 'contributor',
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reason` text DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `managed_team` enum('Yes','No') DEFAULT NULL,
  `team_experience` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `name`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`, `reason`, `github_url`, `managed_team`, `team_experience`) VALUES
(1, 'Test User', 'test@example.com', '$2y$12$rW4oJ/5sJXDzlAVZjnnjC.fudaltdtEyIqv93q4DDzpfR5kK9QMsu', 'contributor', 'Pending', '2026-02-25 13:30:14', '2026-02-25 13:30:14', NULL, NULL, NULL, NULL),
(2, 'test', 'test@gmail.com', '$2y$12$fIgdPSc.nvK3RfbAmHQgb.e42Mvk0MUetWnqiQwBSd4WQT5MYw2Xq', 'contributor', 'Pending', '2026-02-25 13:34:43', '2026-02-25 13:34:43', NULL, NULL, NULL, NULL),
(3, 'shubham', 'shubh@gmail.com', '$2y$12$WTdhMY3clmKfVJ45BPwlDefNMnbr9ziOJcM9UEb.GvBDyXnD/Wr0C', 'admin', 'Pending', '2026-02-25 13:42:34', '2026-02-25 13:42:34', NULL, NULL, NULL, NULL),
(5, 'Test User', 'test789@example.com', '$2y$12$.02aHSU6g/5Dk65w0nx1/.ogoCgMn7wWA8fC1LgE5MO5cVfcBWO7i', 'contributor', 'Pending', '2026-02-25 18:20:03', '2026-02-25 18:20:03', 'Testing the form', 'https://github.com/test', NULL, NULL),
(6, 'Admin User', 'admin123@example.com', '$2y$12$OZV7JjPNBxvi5SIxvSLDG.7nMHLI5z/fuSWaDZXoIGe3Focp.fJVS', 'admin', 'Pending', '2026-02-25 18:20:10', '2026-02-25 18:20:10', 'I want to be admin', 'https://github.com/admin', 'Yes', 'I have managed 5 people'),
(7, 'Shivam yadav', 'test@openuniverse.in', '$2y$12$VpqpB/ABvrglCpsQvqSxn.mfam.gJkJ2MKgPuJr7fl3J1m8nP3VCq', 'admin', 'Pending', '2026-02-25 18:22:09', '2026-02-25 18:22:09', 'qwerty', 'qwerty', 'Yes', 'qwerty');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `date` varchar(100) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `type` enum('hackathon','drive','workshop') NOT NULL,
  `status` enum('upcoming','ongoing','completed') DEFAULT 'upcoming',
  `participants` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `start_date`, `end_date`, `date`, `venue`, `type`, `status`, `participants`, `created_at`) VALUES
(1, 'OpenUniverse Hackathon 2030', '48-hour national level hackathon focused on AI, Cybersecurity and Open Source Innovation.', '2030-03-20', '2030-03-22', 'March 20-22, 2026', 'Main Auditorium, Tech Block', 'hackathon', 'upcoming', 320, '2026-02-25 14:49:39'),
(2, 'Open Source Contribution Drive', 'One month long contribution sprint to improve community repositories and fix real issues.', '2030-04-01', '2030-04-30', 'April 1-30, 2026', 'Online (GitHub + Discord)', 'drive', 'upcoming', 210, '2026-02-25 14:49:39'),
(3, 'React + Flask Workshop', 'Hands-on workshop covering frontend React and backend Flask integration for production apps.', '2030-04-12', '2030-04-12', 'April 12, 2026', 'Lab 3, Computer Science Department', 'workshop', 'upcoming', 95, '2026-02-25 14:49:39'),
(4, 'Cyber Security Capture The Flag', 'Advanced cybersecurity competition with real-world vulnerability challenges.', '2025-12-15', '2025-12-16', 'December 5-6, 2025', 'Cyber Lab', 'hackathon', 'completed', 180, '2026-02-25 14:49:39'),
(5, 'Backend Systems Optimization Drive', 'Improve backend performance and scalability of open source projects.', '2026-02-08', '2026-02-09', 'May 15-30, 2026', 'Online Collaboration', 'drive', 'upcoming', 140, '2026-02-25 14:49:39'),
(6, 'Documentation & DevOps Bootcamp', 'Learn documentation best practices and CI/CD deployment pipelines.', '2026-02-27', '2026-02-28', 'June 10, 2026', 'Seminar Hall 2', 'workshop', 'upcoming', 75, '2026-02-25 14:49:39');

-- --------------------------------------------------------

--
-- Table structure for table `repositories`
--

CREATE TABLE `repositories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `admin` varchar(255) NOT NULL,
  `listed_by` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `stars` varchar(50) DEFAULT NULL,
  `contributors` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repositories`
--

INSERT INTO `repositories` (`id`, `name`, `admin`, `listed_by`, `description`, `stars`, `contributors`, `status`, `created_at`) VALUES
(1, 'VulnXScanner', 'Shubhu Cyber', 'Elite Coders', 'AI-powered vulnerability scanner with deep scan and security analysis capabilities.', '1.4k', 18, 'Active', '2026-02-25 21:09:28'),
(2, 'ScanX', 'Shubhu Cyber', 'OpenUniverse Team', 'Reputation intelligence system analyzing domain trust, reviews and security signals.', '980', 12, 'Active', '2026-02-25 21:09:28'),
(3, 'CyberWatch', 'Security Admin', 'Core Team', 'Real-time cyber monitoring dashboard for enterprise threat detection.', '2.1k', 25, 'Active', '2026-02-25 21:09:28'),
(4, 'OpenShield', 'Security Core', 'OpenUniverse Team', 'Enterprise-grade security monitoring platform with real-time alerting and analytics.', '1.9k', 22, 'Active', '2026-02-25 21:21:36'),
(5, 'DevTrack', 'Platform Admin', 'Elite Coders', 'Advanced project tracking and workflow management system for development teams.', '870', 14, 'Active', '2026-02-25 21:21:36'),
(6, 'CloudSentinel', 'Infra Team', 'Core Maintainers', 'Cloud infrastructure monitoring tool with automated threat detection capabilities.', '2.3k', 30, 'Active', '2026-02-25 21:21:36'),
(7, 'AI Recon', 'Research Division', 'OpenUniverse AI Lab', 'AI-driven reconnaissance engine for intelligent vulnerability detection and classification.', '1.1k', 16, 'Active', '2026-02-25 21:21:36'),
(8, 'SecureAuthX', 'Auth Team', 'OpenUniverse Security', 'Modern authentication framework with multi-factor authentication and OAuth support.', '740', 11, 'Active', '2026-02-25 21:21:36'),
(9, 'NetProbe', 'Network Admin', 'Elite Coders', 'Network analysis and deep packet inspection tool for advanced security research.', '1.6k', 19, 'Active', '2026-02-25 21:21:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `xp` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `department`, `year`, `password`, `xp`, `level`, `created_at`, `email_verified`, `verification_token`) VALUES
(1, 'Utkarsh', 'test@gmail.com', 'CSE', '3rd Year', '$2y$10$Zygf5Eg2/ztJr9JEI2skFuY6XEpyu7K9QYDi8wtf24oNN/bYPGjxS', 0, 1, '2026-02-19 17:57:37', 0, NULL),
(2, 'shubh', 'qwerty@gmail.com', 'IT', '2nd Year', '$2y$10$l2ct4cj9DEmDyf67LtndReBrUcyKaj8t.CcQU1EqYBGKV7LsxecnS', 1960, 20, '2026-02-19 18:01:50', 0, NULL),
(3, 'sasasa', 'dummy@gmail.vom', 'IT', '3rd Year', '$2y$10$GpXi0oRi1pOmIo6gdWaP5ecY1pumftwXyRvF1m2OqH5ovy1YaH.1i', 0, 1, '2026-02-20 08:56:16', 0, NULL),
(4, 'etb', 'test@fuck.in', 'IT', '3rd Year', '$2y$10$Al2EW/hhgbJJwiEMkRDgSO8TAHgVAdkBZ05WW.oPO1L2KVVoxpS9u', 25, 1, '2026-02-20 19:29:07', 0, NULL),
(5, 'qweewq', 'tesssst', 'CSE', '1st Year', '$2y$10$ScECiAUbihHaMFBSexJ0pubMS9TjSe8z137oSiVEMGBUsseB3H0Di', 25, 1, '2026-02-21 17:03:26', 0, NULL),
(6, 'test', 'testt@gmail.com', 'IT', '2nd Year', '$2y$10$ExQTsWGfe7n0z.glsimsCOfepwAZglxUqLOxxzD9md0bySSFDJ9by', 25, 1, '2026-02-21 18:48:25', 0, NULL),
(7, 'yuiop', 'oiuyt', 'IT', '2nd Year', '$2y$10$3U0/epMsJ6TmanA5cgyX1.9yzxbTknwD/NOsmS3oVKM/l4h7DOC6W', 25, 1, '2026-02-22 03:40:42', 0, NULL),
(8, 'Test User', 'testauth@example.com', NULL, NULL, '$2y$12$mERSXwsFUOkBIEzMHn4RQefuLIhK13A5moWr5HJB5zj0DfdB1pgIy', 0, 1, '2026-02-25 19:08:49', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_points`
--

CREATE TABLE `user_points` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `total_points` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 1,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `application_id` (`application_id`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repositories`
--
ALTER TABLE `repositories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_points`
--
ALTER TABLE `user_points`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_application` (`application_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `repositories`
--
ALTER TABLE `repositories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_points`
--
ALTER TABLE `user_points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_points`
--
ALTER TABLE `user_points`
  ADD CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
