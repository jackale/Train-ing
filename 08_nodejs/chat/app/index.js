const Room = require('./lib/model/room');
const Post = require('./lib/model/post');
const User = require('./lib/user');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3000;

// const Database = require('./lib/database');

// const {promisify} = require('util');
// const mysql = require('mysql');
// const connection = mysql.createConnection({
// 	host: 'db',
// 	user: 'root',
// 	password: 'root',
// 	database: 'chat'
// });


// (async function hoge() {
// 	const a = await Database.query('update ?? set ? where id = ?;', ['room', {name: 'updated'}, 1]);
// 	console.log(a);
// })();

const DEFAULT_ROOM_ID = 1;

let rooms = {},	users = [];
const createRoom = (name) => {
	if (rooms.hasOwnProperty(name)) {
		return rooms[name];
	}
	const room = new Room(name);
	rooms[room.name] = room;

	return room;
}

const getRoomList = async () => {
	return await Room.getAll();
}

app.use(express.static('public'));

io.on('connection', async function (socket) {
	// const room = createRoom(DEFAULT_ROOM);
	const room = await Room.find(DEFAULT_ROOM_ID);
	const user = new User('Guest'+users.length, room);

	users.push(user);
	socket.join(room.id);

	socket.emit('info', {
		currentRoom: room.name,
		roomList: await getRoomList(),
	});

	socket.on('message', (msg) => {
		io.to(user.room.id).emit('message', `${user.name}: ${msg}`);
	});

	socket.on('command', async (command, args) => {
		if (command === "join") {
			const name = args[0];
			if (name == null || name.length === 0) {
				return;
			}
			let room = await Room.findBy('name', name);
			if (room === null) {
				room = await Room.create({name: name});
			}

			socket.join(room.id);
			user.moveRoom(room);

			io.to(user.room.id).emit('info', {
				currentRoom: room.name,
				roomList: await getRoomList(),
			});
			io.to(user.room.id).emit('message', `${user.name} is joined`);
		} else if (command === "nick") {
			const name = args[0];
			if (name == null || name.length === 0) {
				return;
			}
			const oldName = user.name;
			user.changeName(name);
			io.to(user.room.id).emit('message', `${oldName} is now known as ${name}`);
		}
		console.log("command receive: "+command +" " + args.join(' '));
	});

	socket.on('disconnect', function () {
	});
});

http.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});
