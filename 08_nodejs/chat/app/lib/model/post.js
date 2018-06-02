const Model = require('./model');

class Post extends Model {}

Post._columns = ['content', 'room_id', 'user_name'];
Post.table = 'post';

module.exports = Post;