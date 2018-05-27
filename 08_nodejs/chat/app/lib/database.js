const {promisify} = require('util');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'db',
	user: 'root',
	password: 'root',
	database: 'chat'
});

const promisified = promisify(connection.query).bind(connection);

const Database = {
	query: async (sql, params = null) => {
		return await promisified(sql, params);
	}
}

module.exports = Database;
