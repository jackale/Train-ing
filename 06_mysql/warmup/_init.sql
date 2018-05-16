-- Initialize
DROP USER 'arai'@'localhost';
DROP USER 'nakano'@'localhost';
DROP USER 'horie'@'localhost';
DROP USER 'saito'@'localhost';
DROP DATABASE study;

-- Create Users
CREATE USER 'arai'@'localhost' IDENTIFIED BY 'arai';
CREATE USER 'nakano'@'localhost' IDENTIFIED BY 'nakano';
CREATE USER 'horie'@'localhost' IDENTIFIED BY 'horie';
CREATE USER 'saito'@'localhost' IDENTIFIED BY 'saito';

-- Setting permision
grant all on *.* to 'arai'@'localhost';
grant all on *.* to 'nakano'@'localhost';
grant all on *.* to 'horie'@'localhost';
grant all on *.* to 'saito'@'localhost';