$(() => {
	const EVENT = {
		'BIRTH_TASK': 0,
		'SWITCH_ALL_TASK': 1,
		'CHNAGE_TASK_STATUS': 2,
	};

	const StorageManager = new class {
		constructor() {
			this._key = 'todomvc/backbone';
			this._data = this._getFromLS();
		}

		find(id) {
			return (_.has(id, this._data)) ? this._data[id] : null;
		}

		create(model) {
			if (!model.id) {
				model.id = this._publishId();
				model.set('id', model.id);
			}

			this._set(model.id, this.modelToJSON(model));
			this.save();

			return this.find(model);
		}

		update(model) {
			const id = model.id;
			this._set(id, this.modelToJSON(model));
			this.save();

			return this.find(model);
		}

		remove(model) {
			const id = model.id;
			this._remove(id);
			this.save();
		}

		modelToJSON(model) {
			const obj = model.toJSON();
			return {
				id: obj.id,
				content: obj.content,
				isCompleted: obj.isCompleted
			};
		}

		save() {
			localStorage.setItem(this._key, JSON.stringify(this._data));
		}

		_set(id, data) {
			console.log(id, data);

			this._data[id] = data;
		}

		_remove(id) {
			delete this._data[id];
		}

		_getFromLS() {
			const data = localStorage.getItem(this._key);
			return (data !== null) ? JSON.parse(data) : {};
		}

		_publishId() {
			const key = 'todomvc/backbone:latest_id';

			const latestId = localStorage.getItem(key);
			const newId = (latestId !== null) ? +latestId + 1 : 0;
			localStorage.setItem(key, newId);
			return newId;
		}
	}

	Backbone._sync = Backbone.sync;
	Backbone.sync = function (method, model, options) {
		const methodMap = {
			'read': read,
			'create': create,
			'patch': update,
			'update': update,
			'delete': remove
		}

		console.log("sync : " + method);

		function read(model) {
			return StorageManager.find(model.id);
		}
		function create(model) {
			return StorageManager.create(model);
		}
		function update(model) {
			return StorageManager.update(model);
		}
		function remove(model) {
			StorageManager.remove(model);
		}

		return methodMap[method](model);
	}

	// == Model & Collection =================
	const TaskModel = Backbone.Model.extend({
		defaults: {
			'content': '',
			'isCompleted': false
		},
		initialize: function (attr, options) {
		}
	});
	const TaskCollection = Backbone.Collection.extend({
		model: TaskModel,
		initialize: function (attr) {
			const taskList = [
				'hoge',
				'fuga',
				'foo',
				'bar'
			];
			const collection = this;
			taskList.forEach(function (v) {
				// collection.add({ content: v });
			});
		},
		getActiveCount: function () {
			const count = this.countBy(function (model) {
				return (!model.get('isCompleted')) ? 'active' : 'completed';
			});
			return (_.has(count, 'active')) ? count['active'] : 0;
		},
		getCounts: function () {
			return this.countBy(function (model) {
				return (!model.get('isCompleted')) ? 'active' : 'completed';
			});
		},
		deleteCompleted: function () {
			const models = this.filter((model) => {
				return model.get('isCompleted');
			});
			this.remove(models);
		}
		// publishId: function () {
		// 	const latestId = localStorage.getItem('todomvc/latest_id');
		// 	const newId = (latestId === null) ? 0 : latestId + 1;
		// 	return newId;
		// }
	});

	// == View =================
	const RootView = Backbone.View.extend({
		el: $('#card-box'),
		initialize: function () {
			this.taskCollection = new TaskCollection();

			this.createTaskView = new CreateTaskView();
			this.taskListView   = new TaskListView({collection: this.taskCollection});
			this.footerView     = new FooterView({collection: this.taskCollection});

			this.createTaskView.on(EVENT.BIRTH_TASK, (content) => {
				const model = new TaskModel({ 'content': content });
				model.save();
				this.taskCollection.add(model);
			});
			this.createTaskView.on(EVENT.SWITCH_ALL_TASK, () => {
				const isAllComplete = this.taskCollection.every(function (model) {
					return model.get('isCompleted');
				});
				this.taskCollection.each(function (model) {
					// model.set('isCompleted', !isAllComplete);
					model.save('isCompleted', !isAllComplete);
				});
			});
			this.taskCollection.on(EVENT.CHANGE_TASK_STATUS, (counts) => {
				this.createTaskView.trigger(EVENT.CHANGE_TASK_STATUS, counts);
			});

			this.footerView.on(EVENT.FILTER_LIST, (type) => {
				this.taskListView.trigger(EVENT.FILTER_LIST, type);
			});
		}
	});

	const CreateTaskView = Backbone.View.extend({
		el: '#card-box-generator',
		events: {
			'keydown input': 'createTaskIfEnter',
			'click #switch-all-checkbox': 'switchAllTask'
		},
		initialize: function () {
			this.bind(EVENT.CHANGE_TASK_STATUS, (counts) => {
				const active = (_.has(counts, 'active')) ? counts['active'] : 0;
				const completed = (_.has(counts, 'completed')) ? counts['completed'] : 0;
				if (active === 0 && completed === 0) {
					this.$el.find('#switch-all-checkbox').attr('data-action', 'none');
				} else if (active === 0) {
					this.$el.find('#switch-all-checkbox').attr('data-action', 'uncomplete');
				} else {
					this.$el.find('#switch-all-checkbox').attr('data-action', 'complete');
				}
			});
		},
		createTaskIfEnter: function (e) {
			if (e.keyCode === 13) {
				this.createTask();
			}
		},
		createTask: function () {
			const content = this.$el.find('input').val();
			if (content === '') return;

			this.$el.find('input').val('');

			this.trigger(EVENT.BIRTH_TASK, content);
		},
		switchAllTask: function () {
			this.trigger(EVENT.SWITCH_ALL_TASK);
		}
	});

	const TaskView = Backbone.View.extend({
		template: _.template($('#tpl-card').html()),
		events: {
			'click .card-checkbox': 'onToggleComplete',
			'dblclick .card-text': 'changeEditable',
			'blur .card-text-edit': 'updateTaskContent',
			'keydown .card-text-edit': 'updateTaskContentIfEnter',
			'click .card-delete-area': 'deleteTask',
			'mouseover': 'showRemoveButton',
			'mouseleave': 'hideRemoveButton',
		},
		initialize: function () {
			this.model.bind('change:isCompleted', this.changeIsCompleted, this);
			this.model.bind('change:content', this.updateTextContent, this);
			this.model.bind('remove', this.removeTask, this);
			this.render();
		},
		onToggleComplete: function () {
			this.trigger(EVENT.TRIGGER_CHECKBOX, this.model);
		},
		render: function () {
			const attr = this.model.attributes;
			const data = {
				id: attr.cid,
				content: attr.content,
				isCompleted: '' + attr.isCompleted
			};
			this.$el.html(this.template(data));
		},
		changeIsCompleted: function () {
			const isCompleted = this.model.get('isCompleted');
			this.$el.find('.card').attr('data-completed', isCompleted);
		},
		changeEditable: function () {
			this.$el.find('.card-text').hide();
			this.$el.find('.card-delete-area').hide();
			const $editArea = this.$el.find('.card-text-edit');
			$editArea.find('input').val(this.model.get('content'));
			$editArea.show();
			$editArea.find('input').focus();
		},
		updateTaskContent: function () {
			const $editArea = this.$el.find('.card-text-edit');
			const content = $editArea.find('input').val();

			if (content === '') {
				this.model.destroy();
			} else {
				this.model.save({content: content});
				this.$el.find('.card-text').show();
				this.$el.find('.card-delete-area').show();
				$editArea.hide();
			}
		},
		updateTaskContentIfEnter: function (e) {
			if (e.keyCode === 13) {
				this.updateTaskContent();
			}
		},
		updateTextContent: function () {
			this.$el.find('.card-text').text(this.model.get('content'));
		},
		deleteTask: function () {
			this.model.destroy();
		},
		removeTask: function () {
			this.$el.empty();
		},
		showRemoveButton: function () {
			this.$el.find('.card-delete-area').text('×');
		},
		hideRemoveButton: function () {
			this.$el.find('.card-delete-area').text('');
		}
	});


	const TaskListView = Backbone.View.extend({
		el: '#card-box-list',
		initialize: function () {
			this.on(EVENT.FILTER_LIST, (type) => {
				if (type === 'all') {
					this.$el.find('.card').show();
				} else if (type === 'active') {
					this.$el.find('.card').hide();
					this.$el.find('.card[data-completed="false"]').show();
				} else if (type === 'completed') {
					this.$el.find('.card').hide();
					this.$el.find('.card[data-completed="true"]').show();
				}
			});
			this.collection.on('add', (model) => {
				const newTaskView = new TaskView({model: model});

				newTaskView.on(EVENT.TRIGGER_CHECKBOX, function (model) {
					// model.set('isCompleted', !model.get('isCompleted'));
					model.save({
						'isCompleted': !model.get('isCompleted')}
					);
				});

				this.$el.append(newTaskView.$el);
			});
		}
	});


	const FooterView = Backbone.View.extend({
		el: $('#card-box-footer'),
		events: {
			'click .btn-filter-list': 'filterExec',
			'click': 'hoge',
			'click #clear-all-completed': 'clearAllCompletedTask'
		},
		initialize: function () {
			this.collection.bind('add change:isCompleted remove', function () {
				this.trigger(EVENT.CHANGE_TASK_STATUS, this.getCounts());
			});
			this.collection.on(EVENT.CHANGE_TASK_STATUS, this.chanageNumber, this);
			// WIP: Collectionの初期化時に考える
			// this.collection.trigger(EVENT.CHANGE_TASK_STATUS, this.collection.getCounts());
		},
		filterExec: function (e) {
			const type = $(e.target).attr('data-type');
			this.$el.find('.btn-filter-list').attr('data-selected', false);
			this.$el.find('.btn-filter-list[data-type="'+type+'"]').attr('data-selected', true);
			this.trigger(EVENT.FILTER_LIST, type);
		},
		chanageNumber: function (counts) {
			const active    = (_.has(counts, 'active')) ? counts['active'] : 0;
			const completed = (_.has(counts, 'completed')) ? counts['completed'] : 0;

			const item = (active === 1) ? 'item' : 'items';
			this.$el.find('.card-left-num').text(`${active} ${item} left`);
			if (completed === 0) {
				this.$el.find('.card-clear-completed').hide();
			} else {
				this.$el.find('.card-clear-completed').show();
			}
		},
		clearAllCompletedTask: function () {
			this.collection.deleteCompleted();
		},
		hoge: function () {
			console.log(this.collection.each((model) => {
				console.log(model);
			}));
		}
	});

	new RootView();

	// const a = new TaskCollection();
	// const v = new TaskView({collection: a});


});