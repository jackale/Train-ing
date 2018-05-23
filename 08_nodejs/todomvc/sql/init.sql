create database todomvc;

use todomvc;
create table todos (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	content VARCHAR(256) NOT NULL,
	is_completed BOOLEAN DEFAULT FALSE
);