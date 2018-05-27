const Database = require('./database');
class Room {
	constructor (name = '') {
		if (name !== '') {
			this.set('name', name);
		}
	}

	set(key, params = null) {
		if (params === null) {
			// TODO: for in
		} else {
			this[key] = params;
		}
	}

	save() {
		if(this.id === undefined) {
			if (this.name === undefined) {
				throw new Error('name is not set.');
			}
			Database.query('insert into room values (?);', [this.name]);
		} else {
			Database.query('update room set  where id = ?;');
		}
	}

	static async find(id) {
		if (id === null) return null;
		const room = await Database.query('select * from room where id = ?', [id]);
		return (room.length > 0) ? room[0] : null;
	}
}

module.exports = Room;