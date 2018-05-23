const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3000;

app.use(express.static('public'));

let tasks = {}; // FIXME: use mysql
let latestId = 0;

const createTask = (task) => {
	const id = latestId;
	task['id'] = id;
	tasks[id] = task;
	latestId++;
	return tasks[id];
}

const updateTask = (task) => {
	tasks[task['id']] = task;
	return task;
}

const deleteTask = (id) => {
	delete tasks[id];
	return id;
}

const fethAllTasks = () => {
	return tasks;
}

io.on('connection', (socket) => {
	socket.on('create', (task) => {
		console.log('create');

		io.sockets.emit('add', createTask(task));
	});

	socket.on('update', (task) => {
		console.log('update');

		io.sockets.emit('update', updateTask(task));
	});

	socket.on('delete', (id) => {
		console.log('delete');

		io.sockets.emit('delete', deleteTask(id));
	});

	// FIXME: do not use socket.io (fetch all task list)
	socket.on('fetch', () => {
		console.log('fetch');

		io.sockets.emit('fetch', fethAllTasks());
	});
});

// io.on('connection', function (socket) {
// 	console.log('a user connected');
// 	const room = createRoom(DEFAULT_ROOM);
// 	const user = new User('Guest' + users.length, room);
// 	users.push(user);
// 	socket.join(room.name);

// 	socket.emit('info', {
// 		currentRoom: room.name,
// 		roomList: getRoomList(),
// 	});

// 	socket.on('message', (msg) => {
// 		io.to(user.room.name).emit('message', `${user.name}: ${msg}`);
// 	});

// 	socket.on('command', (command, args) => {
// 		if (command === "join") {
// 			const name = args[0];
// 			if (name == null || name.length === 0) {
// 				return;
// 			}
// 			const room = createRoom(name);
// 			socket.join(room.name);
// 			user.moveRoom(room);
// 			io.to(user.room.name).emit('info', {
// 				currentRoom: room.name,
// 				roomList: getRoomList(),
// 			});
// 			io.to(user.room.name).emit('message', `${user.name} is joined`);
// 		} else if (command === "nick") {
// 			const name = args[0];
// 			if (name == null || name.length === 0) {
// 				return;
// 			}
// 			const oldName = user.name;
// 			user.changeName(name);
// 			io.to(user.room.name).emit('message', `${oldName} is now known as ${name}`);
// 		}
// 		console.log("command receive: " + command + " " + args.join(' '));
// 	});

// 	socket.on('disconnect', function () {
// 	});
// });

http.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});

