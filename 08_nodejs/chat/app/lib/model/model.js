const Database = require('../database');
class Model {
	// TOOD: columnsを配列じゃなくて連想配列でオプション(not nullとか)設定する形式に
	constructor(params = null) {
		// this._columns = [];
		// this.table = '';
		this.params = {};
		// FIXME: この辺りの関係を整理してちゃんとクラス変数的に扱う
		this.table = this.constructor.table;
		this._columns = this.constructor._columns;


		if (this._columns.length <= 0 || this.table.length <= 0) {
			throw new Error('Unset columns or table.');
		}

		if (params !== null) {
			for (let [key, value] of Object.entries(params)) {
				if (this.hasKey(key)) {
					this.params[key] = value;
				}
			}
			// TODO: オプション設定で拾う
			if (params.id !== undefined) {
				this.params.id = params.id;
			}
		}
	}

	validate() {
		const length = this._columns.length;
		for (let i = 0; i < length; i++) {
			const key = this._columns[i];
			if (this.params[key] === undefined) {
				console.log(key);

				return false;
			}
		}
		return true;
	}

	set(key, params = null) {
		if (params === null) {
			params = key;
			for (let [key, value] of Object.entries(params)) {
				if (this._columns.indexOf(key) >= 0) {
					this.params[key] = value;
				}
			}
		}
		else {
			if (this.hasKey(key)) {
				this.params[key] = params;
			}
		}
	}

	hasKey(key) {
		return this._columns.indexOf(key) >= 0;
	}

	async save() {
		if (!this.validate()) {
			throw new Error('Validation Error.');
		}

		if (this.params.id === undefined) {
			const inserted = await Database.query('insert into ?? set ?;', [this.table, this.params]);
			this.params.id = inserted.insertId;
		} else {
			await Database.query('update ?? set ? where id = ?;', [this.table, this.params, this.params.id]);
		}
	}

	static async create(params = null) {
		if (params === null) {
			throw new Error('Unset params.');
		}

		const instance = new this(params);
		await instance.save();
		return instance;
	}

	static async find(id) {
		if (id === null) return null;

		const room = await Database.query('select * from ?? where id = ?', [this.table, id]);
		return (room.length > 0) ? new this(room[0]) : null;
	}

	static async findBy(key, name) {
		const room = await Database.query('select * from ?? where ?? = ?', [this.table, key, name]);
		return (room.length > 0) ? new this(room[0]) : null;
	}

	static async getAll() {
		return await Database.query('select * from ??;', [this.table]);
	}
}

module.exports = Model;