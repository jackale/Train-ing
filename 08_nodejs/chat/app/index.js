const Room = require('./lib/room.js');
const User = require('./lib/user.js');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3000;

const DEFAULT_ROOM = "コウペンちゃんの部屋";

let rooms = {},	users = [];
const createRoom = (name) => {
	if (rooms.hasOwnProperty(name)) {
		return rooms[name];
	}
	const room = new Room(name);
	rooms[room.name] = room;

	return room;
}

const getRoomList = () => {
	return Object.keys(rooms);
}

app.use(express.static('public'));

io.on('connection', function (socket) {
	console.log('a user connected');
	const room = createRoom(DEFAULT_ROOM);
	const user = new User('Guest'+users.length, room);
	users.push(user);
	socket.join(room.name);

	socket.emit('info', {
		currentRoom: room.name,
		roomList: getRoomList(),
	});

	socket.on('message', (msg) => {
		io.to(user.room.name).emit('message', `${user.name}: ${msg}`);
	});

	socket.on('command', (command, args) => {
		if (command === "join") {
			const name = args[0];
			if (name == null || name.length === 0) {
				return;
			}
			const room = createRoom(name);
			socket.join(room.name);
			user.moveRoom(room);
			io.to(user.room.name).emit('info', {
				currentRoom: room.name,
				roomList: getRoomList(),
			});
			io.to(user.room.name).emit('message', `${user.name} is joined`);
		} else if (command === "nick") {
			const name = args[0];
			if (name == null || name.length === 0) {
				return;
			}
			const oldName = user.name;
			user.changeName(name);
			io.to(user.room.name).emit('message', `${oldName} is now known as ${name}`);
		}
		console.log("command receive: "+command +" " + args.join(' '));
	});

	socket.on('disconnect', function () {
	});
});

http.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});

