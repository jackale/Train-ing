$(() => {
	console.log("hoge");
	const socket = io();
	console.log(socket);

	const displayRoomList = (roomList) => {
		let listDomStr = "<ul>";
		$.each(roomList, (_, name) => {
			listDomStr += "<li>" + name + "</li>";
		});
		listDomStr += "</ul>";
		$('#room-list').empty().append(listDomStr);
	}

	socket.on('message', (msg) => {
		console.log(`${msg} is given`);
		appendMessage(msg);
	});

	socket.on('info', (info) => {
		$('#room-name').text(info.currentRoom);
		displayRoomList(info.roomList);
	});

	const sendCommand = (command, args) => {
		socket.emit('command', command, args);
	}

	const sendMessage = (msg) => {
		socket.emit('message', msg);
	};

	const appendMessage = (msg) => {
		const $div = $('#chat-text-area');
		$div.append('<p>' + msg + '</p>');
	}

	const compileInput = () => {
		const text = $('#chat-input-text').val();
		if (text.length === 0) {
			return false;
		}

		const match = text.match(/^\/(.+)$/);
		if (match !== null) {
			const commands = match[1].split(' ');
			const [command, args] = [commands[0], commands.slice(1)];
			sendCommand(command, args);
		} else {
			sendMessage(text);
		}

		$('#chat-input-text').val('');
	}

	$(document).on('click', 'input[type=submit]', compileInput);
	$(document).on('keyup', '#chat-input-text', (e) => {
		if(e.keyCode === 13) {
			compileInput();
		}
	});


});