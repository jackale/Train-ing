$(() => {
	const EVENT = {
		'BIRTH_TASK': 0,
		'SWITCH_ALL_TASK': 1,
	};

	// == Model & Collection =================
	const TaskModel = Backbone.Model.extend({
		defaults: {
			'content': '',
			'isCompleted': false
		},
		initialize: function (attr, options) {
		},

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
			this.createTaskView.on(EVENT.SWITCH_ALL_TASK, () => {
				const isAllComplete = this.taskCollection.every(function (model) {
					return model.get('isCompleted');
				});
				this.taskCollection.each(function (model) {
					model.set('isCompleted', !isAllComplete);
				});
			});
		}
	});

	const CreateTaskView = Backbone.View.extend({
		el: '#card-box-generator',
		events: {
			'blur input': 'createTask',
			'keydown input': 'createTaskIfEnter',
			'click #switch-all-checkbox': 'switchAllTask'
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
			'click .card-delete-area': 'deleteTask'
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
				this.model.set({content: content});
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
		}
	});


	const TaskListView = Backbone.View.extend({
		el: '#card-box-list',
		initialize: function () {
			this.collection.on('add', (model) => {
				const newTaskView = new TaskView({model: model});

				newTaskView.on(EVENT.TRIGGER_CHECKBOX, function (model) {
					model.set('isCompleted', !model.get('isCompleted'));
				});

				this.$el.append(newTaskView.$el);
			});
		}
	});


	const FooterView = Backbone.View.extend({
		el: $('#card-box-footer'),
		events: {
			'click .btn-filter-list': filterExec,
		},
		filterExec: function (e) {
			const type = $(e.target).attr('data-type');
			// WIP
		}
	});

	new RootView();

	// const a = new TaskCollection();
	// const v = new TaskView({collection: a});


});