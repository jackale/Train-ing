const Database = require('../database');
const Model = require('./model');

class Post extends Model {
	static async getPostsInRoom(id) {
		return await Database.query(
			'select * from ?? where room_id = ?;',
			[this.table, id]
		);
	}
}

Post._columns = ['content', 'room_id', 'user_name'];
Post.table = 'post';

module.exports = Post;