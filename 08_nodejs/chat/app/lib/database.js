const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'db',
	user: 'root',
	password: 'root',
	database: 'chat'
});

module.exports = connection;
