const Model = require('./model');
const Database = require('../database');
const { promisify } = require('util');

class User extends Model {
	constructor() {
		// this.table = "user";
		// this.schema = {
		// 	"name": "string",
		// }
	}

	find() {
		throw 'Not impletented';
	}

	async static findByName(name, callback) {
		Database.query('select * from user where name = ?', [name], (err, result, fields) => {
			if (err) throw err;
			resolve(result, fields);
		});
	}

	save(callback) {
		const data = {
			name: this.name
		};
		Database.query('insert into user set ?', data, (err, result, fields) => {
			if (err) throw err;
			callback(result, fields);
		});
	}
}

module.exports = User;