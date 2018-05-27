CREATE DATABASE chat;
use chat;

CREATE TABLE comment (
	`id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`content` VARCHAR(256),
	`room_id` INT NOT NULL,
	`user_name` VARCHAR(256) -- Actually create user table and replace user_id
);

CREATE TABLE room (
	`id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`name` VARCHAR(256)
);

-- Seed

INSERT INTO room (`name`) VALUES ('kopen-room');