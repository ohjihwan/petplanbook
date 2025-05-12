CREATE DATABASE IF NOT EXISTS `database`;
USE `database`;

CREATE TABLE IF NOT EXISTS `saved_place` (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
	`title` VARCHAR(255) NOT NULL,
	`addr1` VARCHAR(255) NOT NULL,
	`tel` VARCHAR(20) NOT NULL, -- 010-9992-1888, 010-9778-6518 케이스 발견 varchar 값 변경 필요
	`category` VARCHAR(50) NOT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

select * from saved_place;