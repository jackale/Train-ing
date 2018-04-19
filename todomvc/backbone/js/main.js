$(() => {
	const EVENT = {
		'BIRTH_TASK': 0,
	};

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
				collection.add({ contet: v });
			});
		},
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
			// this.footerView     = new FooterView();

			this.createTaskView.on(EVENT.BIRTH_TASK, (content) => {
				const model = new TaskModel({ 'content': content });
				this.taskCollection.add(model);
			});
		}
	});

	const CreateTaskView = Backbone.View.extend({
		el: '#card-box-generator',
		events: {
			'blur input': 'createTask',
			'keydown input': 'createTaskIfEnter'
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
		}
	});

	const TaskView = Backbone.View.extend({
		template: _.template($('#tpl-card').html()),
		events: {
			'click .card-checkbox': 'onToggleComplete',
		},
		initialize: function () {
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
		}
	});


	const TaskListView = Backbone.View.extend({
		el: '#card-box-list',
		initialize: function () { 
			this.collection.on('add', (model) => {
				const newTaskView = new TaskView({model: model});

				newTaskView.on(EVENT.DELETE_TASK, () => {
					// 削除処理
				});
				newTaskView.on(EVENT.TRIGGER_CHECKBOX, function (model) {
					model.set('isCompleted', !model.isCompleted);
				});
				
				this.$el.append(newTaskView.$el);
			});
		}
	});


	// const CreateTaskView = Backbone.View.extend({

	// });

	new RootView();
	
	// const a = new TaskCollection();
	// const v = new TaskView({collection: a});


});