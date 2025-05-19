-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: projectedb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('007fc9b4-0b32-11f0-bc70-c018509141a6','Technology','Explore the latest advancements in technology and innovation'),('007ffbfb-0b32-11f0-bc70-c018509141a6','Health & Wellness','Learn about fitness, nutrition, and mental well-being'),('007ffd9e-0b32-11f0-bc70-c018509141a6','Business & Finance','Understand entrepreneurship, investing, and financial management'),('007ffecd-0b32-11f0-bc70-c018509141a6','Photography','Master photography techniques and editing skills'),('007fff6f-0b32-11f0-bc70-c018509141a6','Software Development','Learn programming languages, software engineering, and best practices');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` char(36) NOT NULL DEFAULT (uuid()),
  `instructor_id` char(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `category_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  KEY `instructor_id` (`instructor_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('11975348-70e8-4b5b-bf54-223d2fd2864c','6b031fc1-2486-47dc-a9da-c77e5952e188','Emprenedoria','Apren tot el necessari sobre l\'emprenedoria i sobresortir de la resta de les persones!','007ffd9e-0b32-11f0-bc70-c018509141a6','2025-04-08 17:54:02'),('1c567c47-10ed-4673-b073-6bcd36ce91b0','4f182752-d8a2-41ba-9028-4b7f7de70e40','Express','Learn Express fundamentals','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-08 22:18:35'),('23af1a5c-b7fe-4c77-9cbb-acb688576a62','c5441c25-8a98-4c79-a28f-ddafb48012e2','Test Driven Developmet','All you need to know about TDD, from the basic to advanced topics','007fff6f-0b32-11f0-bc70-c018509141a6','2025-05-07 13:54:35'),('280dc56f-7348-470f-aaaa-cd61f7ad81b5','4f182752-d8a2-41ba-9028-4b7f7de70e40','Ruby fundamentals','Learn everything you need to know about Ruby','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-07 14:19:18'),('63b75705-aaeb-4966-8e0a-66f197b5c8c4','4f182752-d8a2-41ba-9028-4b7f7de70e40','React.JS','React is one of the most used technologies in application web development in the world. In this course you\'ll be able to master react from the most basic features to advanced ones like Redux! ','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-28 11:57:48'),('64c25542-b971-455a-a676-bbcc36e136b6','4f182752-d8a2-41ba-9028-4b7f7de70e40','Amazon S3','Amazon buckets','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-20 11:25:59'),('6e3c2f9b-145f-4631-aba9-017938947aa4','4f182752-d8a2-41ba-9028-4b7f7de70e40','Database Introduction','Introduction to DBMS','007fff6f-0b32-11f0-bc70-c018509141a6','2025-05-05 13:19:04'),('76ac675d-2317-4efd-ad61-abccef7a7d96','6b031fc1-2486-47dc-a9da-c77e5952e188','Node.js','Learn node.js latest updates','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-08 18:23:49'),('7845cc50-04a3-4d14-b426-938ba557829b','6b031fc1-2486-47dc-a9da-c77e5952e188','Fullstack developer','Learn everything you need to know to be a fullstack developer!','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-08 18:26:44'),('99ff8680-3dbf-40aa-969d-c7d4d855536c','4f182752-d8a2-41ba-9028-4b7f7de70e40','Angular','Learn Angular 18','007fc9b4-0b32-11f0-bc70-c018509141a6','2025-03-31 14:04:36'),('c60bbdaa-d125-46e2-9c9c-876393060b0c','4f182752-d8a2-41ba-9028-4b7f7de70e40','SQL','Learn SQL basics','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-14 14:33:12'),('cb55fd66-5523-43d1-8a57-4eee6f12816d','4f182752-d8a2-41ba-9028-4b7f7de70e40','Python','Crash course of python from beggining to advanced','007fc9b4-0b32-11f0-bc70-c018509141a6','2025-03-31 13:36:06'),('d8941470-630b-4394-a272-64c860e2e106','4f182752-d8a2-41ba-9028-4b7f7de70e40','HTML latest features','Learn HTML5 latest tags and features added in 2025 to reduce javascript code','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-07 21:53:21'),('dbbb1ea6-8328-41b6-9113-fc8b0a666ecc','4f182752-d8a2-41ba-9028-4b7f7de70e40','Javascript','Learn what\'s javascript and it\'s basics','007fff6f-0b32-11f0-bc70-c018509141a6','2025-04-14 14:35:40');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `enrollment_id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `user_id` (`user_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES ('1806773e-b279-4bf2-aa2e-78bf47ab937a','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','cb55fd66-5523-43d1-8a57-4eee6f12816d','2025-05-12 17:26:19'),('187ebba6-a5d4-422a-bb3b-bb0b6b6d9b20','4f182752-d8a2-41ba-9028-4b7f7de70e40','11975348-70e8-4b5b-bf54-223d2fd2864c','2025-05-15 15:45:22'),('3061f5fc-5dbc-4872-bd8c-415c8749c83d','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','23af1a5c-b7fe-4c77-9cbb-acb688576a62','2025-05-12 17:26:40'),('5a968bac-5381-4c18-9eae-8a2d80abb707','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','99ff8680-3dbf-40aa-969d-c7d4d855536c','2025-04-23 15:50:39'),('6c41490c-b3b4-44c4-8091-6eefb69fdf7a','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','11975348-70e8-4b5b-bf54-223d2fd2864c','2025-05-12 17:25:55'),('6c6b39c2-b119-419c-a9d8-9b55a7fb7b48','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','dbbb1ea6-8328-41b6-9113-fc8b0a666ecc','2025-05-09 15:56:24'),('8ea947f9-141d-44a3-9b1a-01b44ab38add','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','64c25542-b971-455a-a676-bbcc36e136b6','2025-04-23 15:27:57'),('923b8543-4621-4eb9-b721-71f694abe386','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','63b75705-aaeb-4966-8e0a-66f197b5c8c4','2025-05-12 17:26:28'),('9bcabe69-05e8-4f77-9912-f471321de5c1','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','76ac675d-2317-4efd-ad61-abccef7a7d96','2025-05-12 17:26:11'),('bf2c0437-7613-4849-85e7-93a436d8aab2','4f182752-d8a2-41ba-9028-4b7f7de70e40','6e3c2f9b-145f-4631-aba9-017938947aa4','2025-05-14 15:22:59'),('c48bfc5f-f9b9-4ea3-9fdc-3196d374739b','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','280dc56f-7348-470f-aaaa-cd61f7ad81b5','2025-05-12 17:27:05'),('d17796f5-99e2-405e-80a5-8e771da37de4','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','6e3c2f9b-145f-4631-aba9-017938947aa4','2025-05-12 17:25:59'),('f1ce6343-c213-4239-b48f-299681372ff6','d6da1cdd-90b1-4de2-a811-1a69660a8dd5','c60bbdaa-d125-46e2-9c9c-876393060b0c','2025-05-12 17:26:49');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `lesson_id` char(36) NOT NULL DEFAULT (uuid()),
  `section_id` char(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `position` int DEFAULT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES ('138b45cb-ab36-4181-8365-57c3c01bf562','41cb0063-1aae-4c04-81a1-fb1e44a9956f','Create your first Angular app','https://myed-project.s3.us-east-1.amazonaws.com/course_99ff8680-3dbf-40aa-969d-c7d4d855536c/section_41cb0063-1aae-4c04-81a1-fb1e44a9956f/lesson_138b45cb-ab36-4181-8365-57c3c01bf562/video.mp4',1),('13fb5b61-4329-4a00-9e45-d5819ef4f5b3','d2b0eefe-5f76-4f34-b99c-72f88a76f12f','Javascript first approach','https://myed-project.s3.us-east-1.amazonaws.com/course_dbbb1ea6-8328-41b6-9113-fc8b0a666ecc/section_d2b0eefe-5f76-4f34-b99c-72f88a76f12f/lesson_13fb5b61-4329-4a00-9e45-d5819ef4f5b3/video.mp4',1),('37099f71-53f5-45f6-9b79-e8280987390d','707fdf67-92d8-4053-882b-d9e03561ac4d','Todo List App','https://myed-project.s3.us-east-1.amazonaws.com/course_dbbb1ea6-8328-41b6-9113-fc8b0a666ecc/section_707fdf67-92d8-4053-882b-d9e03561ac4d/lesson_37099f71-53f5-45f6-9b79-e8280987390d/video.mp4',1),('88ddea12-f7c7-4d48-8539-2990b2c7d918','d2b0eefe-5f76-4f34-b99c-72f88a76f12f','Variables','https://myed-project.s3.us-east-1.amazonaws.com/course_dbbb1ea6-8328-41b6-9113-fc8b0a666ecc/section_d2b0eefe-5f76-4f34-b99c-72f88a76f12f/lesson_88ddea12-f7c7-4d48-8539-2990b2c7d918/video.mp4',3),('9f992ba1-404d-4a35-bbcf-5acd638d84a2','b344ce0b-606b-4c7d-83f8-0e8d88dc1b1b','What\'s S3?','https://myed-project.s3.us-east-1.amazonaws.com/course_64c25542-b971-455a-a676-bbcc36e136b6/section_b344ce0b-606b-4c7d-83f8-0e8d88dc1b1b/lesson_9f992ba1-404d-4a35-bbcf-5acd638d84a2/video.mp4',1),('b435f010-0e51-434d-be75-b9f313763f93','d2b0eefe-5f76-4f34-b99c-72f88a76f12f','Printing In console','https://myed-project.s3.us-east-1.amazonaws.com/course_dbbb1ea6-8328-41b6-9113-fc8b0a666ecc/section_d2b0eefe-5f76-4f34-b99c-72f88a76f12f/lesson_b435f010-0e51-434d-be75-b9f313763f93/video.mp4',2),('c5623145-f57d-451d-9f9d-5e6f82042877','ac614fb4-4963-47b4-b306-0a7efc5c615a','DOM Manipulation is easy!','https://myed-project.s3.us-east-1.amazonaws.com/course_dbbb1ea6-8328-41b6-9113-fc8b0a666ecc/section_ac614fb4-4963-47b4-b306-0a7efc5c615a/lesson_c5623145-f57d-451d-9f9d-5e6f82042877/video.mp4',1);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` char(36) NOT NULL DEFAULT (uuid()),
  `course_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `section_id` char(36) NOT NULL DEFAULT (uuid()),
  `course_id` char(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `position` int NOT NULL,
  PRIMARY KEY (`section_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES ('41cb0063-1aae-4c04-81a1-fb1e44a9956f','99ff8680-3dbf-40aa-969d-c7d4d855536c','Introduction',1),('6a0cc0a0-f580-482f-bf1e-c1bb6bebb2e2','99ff8680-3dbf-40aa-969d-c7d4d855536c','Basics of Angular',2),('707fdf67-92d8-4053-882b-d9e03561ac4d','dbbb1ea6-8328-41b6-9113-fc8b0a666ecc','Projects',3),('8d87e37a-4388-4a9e-a13c-ab40442a5847','99ff8680-3dbf-40aa-969d-c7d4d855536c','Advanced Features',4),('ac614fb4-4963-47b4-b306-0a7efc5c615a','dbbb1ea6-8328-41b6-9113-fc8b0a666ecc','DOM manipulation',2),('b344ce0b-606b-4c7d-83f8-0e8d88dc1b1b','64c25542-b971-455a-a676-bbcc36e136b6','Introduction',1),('d2b0eefe-5f76-4f34-b99c-72f88a76f12f','dbbb1ea6-8328-41b6-9113-fc8b0a666ecc','Introduction',1),('feaa1af8-b693-4843-9240-8b1cf4bb8e63','99ff8680-3dbf-40aa-969d-c7d4d855536c','Standalone Components',3);
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stream_messages`
--

DROP TABLE IF EXISTS `stream_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stream_messages` (
  `message_id` char(36) NOT NULL DEFAULT (uuid()),
  `stream_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `stream_id` (`stream_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stream_messages_ibfk_1` FOREIGN KEY (`stream_id`) REFERENCES `streams` (`stream_id`) ON DELETE CASCADE,
  CONSTRAINT `stream_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stream_messages`
--

LOCK TABLES `stream_messages` WRITE;
/*!40000 ALTER TABLE `stream_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `stream_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streams`
--

DROP TABLE IF EXISTS `streams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streams` (
  `stream_id` char(36) NOT NULL DEFAULT (uuid()),
  `instructor_id` char(36) NOT NULL,
  `course_id` char(36) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`stream_id`),
  KEY `instructor_id` (`instructor_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `streams_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `streams_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streams`
--

LOCK TABLES `streams` WRITE;
/*!40000 ALTER TABLE `streams` DISABLE KEYS */;
/*!40000 ALTER TABLE `streams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) NOT NULL DEFAULT (uuid()),
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `bio` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_instructor` tinyint(1) DEFAULT '0',
  `pending_validation` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('06eaf5ac-764f-4920-9459-d89001832bc8','INSTRUCTORTEST','TESTINS@gmail.com','$2b$12$g7baJd/CAy/v5VuISYVBxu8BBwWPNVVLX/l/F6hfuMXyuYalFgVQK',NULL,NULL,'2025-05-07 16:34:20',1,0),('222b1543-92ad-460d-95cc-4f59cf9943c0','maria','maria@gmail.com','$2b$12$zVPOC0/sA7UZo7tbgRvf6OJ9yFawSbh6hYAtG4kFs//le.UnkJIDW',NULL,NULL,'2025-03-23 11:21:30',0,0),('4f182752-d8a2-41ba-9028-4b7f7de70e40','mboada','instructor@gmail.com','$2b$12$mwpHXDZs/IJMDPM2Vv9oWeWaIwynJBXFrjJ14.p3PSPvMY.93lFuy','https://myed-project.s3.us-east-1.amazonaws.com/users/4f182752-d8a2-41ba-9028-4b7f7de70e40/profile_picture.jpg','Teacher with 5 years of experience\r\n','2025-03-26 19:34:12',1,0),('6726e246-0603-48de-8bfc-a83993457445','KlkKlk','klkdimeklk22@gmail.com',NULL,NULL,NULL,'2025-05-12 21:09:56',0,0),('6b031fc1-2486-47dc-a9da-c77e5952e188','lucas','lucas@gmail.com','$2b$12$lV.EooccVXSJsJryFfLEIO.nhnvCZSGpv4I8/XbLVF1FHwEeL8TES',NULL,NULL,'2025-04-08 17:51:05',1,0),('b3da329e-a43b-41b0-a8e8-0a35dc244905','keloke','testtest@gmail.com','$2b$12$IhsXq/.45gTfUfmYnycMTOZf8h1SERMrOQQiUQvAoLbhz2IabjVjK',NULL,NULL,'2025-05-17 15:22:58',0,0),('c5441c25-8a98-4c79-a28f-ddafb48012e2','Jonathan','idk@gmail.com','$2b$12$Xj1j2i8smo3P2BFisd20j.HhU.H/yivZed8MQhw8I/jTDqUk/rhxO',NULL,NULL,'2025-05-07 15:51:59',1,0),('d6da1cdd-90b1-4de2-a811-1a69660a8dd5','JonathanRodas','jona.rierasanchez@gmail.com',NULL,NULL,'I\'m here to learn','2025-04-02 18:29:15',0,0),('e9c196a8-8735-4d4e-a2c1-2236c2968cb3','JonathanOswaldoRodasS├ínchez','jrodas753@boscdelacoma.cat',NULL,NULL,NULL,'2025-04-02 18:12:17',0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 14:20:47
