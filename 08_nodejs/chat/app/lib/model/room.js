const Model = require('./model');

class Room extends Model {}

Room._columns = ['name'];
Room.table = 'room';

module.exports = Room;