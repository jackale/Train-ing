class User {
	constructor(name, room) {
		this.name = name;
		this.currentRoom = room;
	}
	get room() { return this.currentRoom.params; }
	get roomId() { return this.currentRoom.params.id; }

	moveRoom(room) {
		this.currentRoom = room;
	}

	changeName(name) {
		this.name = name;
	}

}

module.exports = User;