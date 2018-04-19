$(() => {
	const TaskManager = new class {
		constructor() {
			this.taskList = this._getFromStorage();
		}
		
		
		
		find(id) {
			const task = this.taskList[id];
			return (task === undefined) ? null : task;
		}

		add(task) {
			const id = 'task_' + this._publishId();
			task.id = id;
			this.taskList[id] = task;
			this.syncStorage();
		}

		update(id, newTask) {
			this.taskList[id] = newTask;
			this.syncStorage();
		}

		delete(id) {
			delete this.taskList[id];
			this.syncStorage();
		}

		clear() {
			this.taskList = {};
			this.syncStorage();
			localStorage.clear();
		}

		
		syncStorage() {
			const key = this._getKey();
			localStorage.setItem(key, JSON.stringify(this.taskList));
		}

		_getKey() { return 'todomvc'; }
		
		_getFromStorage() {
			const key = this._getKey();
			const val = localStorage.getItem(key);
			return (val === null) ? {} : JSON.parse(val);
		}

		_publishId() {
			const key = 'todomvc/latest_id';
			const latestId = localStorage.getItem(key);
			const newId = (latestId === null) ? 0 : +latestId + 1;
			localStorage.setItem(key, newId);
			return newId;
		}
	};

	TaskManager.clear();
	TaskManager.add(
		{
			hoge: 2,
			fuga: 1
		}
	);
	TaskManager.add(
		{
			hoge: 3,
			fuga: 1
		}
	);
	
	
});