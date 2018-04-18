window.onload = function () {
    // 使い道があまりなくなったので廃止
    // class Task {
    //     constructor(content, isCompleted = false) {
    //         this.content = content;
    //         this.isCompleted = isCompleted;
    //     }
    //     complete() {
    //         this.isCompleted = true;
    //     }
    //     unComplete() {
    //         this.isCompleted = false;
    //     }
    //     update(content) {
    //         this.content = content;
    //     }
    // }

    /**
     * Taskを管理するクラス
     * localStorageと依存関係
     * localStorageに一つのキーでタスクを配列でぶっこむ。面倒なのでtaskIdは配列の順番
     */
    const TaskManager = new class {
        
        constructor() {
            this.taskList = this._getFromStorage();
        }

        getTask(taskId) { return  (taskId >= this.taskList.length) ? null : this.taskList[taskId]; }

        add(task) {
            this.taskList.push(task);
            this._syncStorage();
        }

        delete(taskId) {
            if (taskId >= this.taskList.length) return; // 簡易Validate
            this.taskList.splice(taskId, 1);
            this._syncStorage();
        }

        update(taskId, newTask) {
            if (taskId >= this.taskList.length) return; // 簡易Validate
            this.taskList[taskId] = newTask;
            this._syncStorage();
        }

        get list() { return this.taskList; }

        // FIXME: Storage用のクラスに切り分ける
        _getKey() { return 'todomvc'; } // クラス定数無理やり＼(^o^)／

        _getFromStorage() {
            const key = this._getKey();
            const val = localStorage.getItem(key);
            // NOTE: 状態が三つ存在する。null, [], [something, ...]
            return (val === null) ? [] : JSON.parse(val);
        }

        // オブジェクトとlocalStorageの内容を同期
        _syncStorage() {
            const key = this._getKey();
            const val = JSON.stringify(this.taskList);
            localStorage.setItem(key, val);
        }
    };

    // =============== Controller =============== //

    const vTaskCard = new class {
        constructor() {
            this.template = document.getElementById('tpl-card');
        }
        
        generateDOM(taskId, taskText, isCompleted) {
            let node = document.importNode(this.template.content, true);
            
            node.querySelector('.card').setAttribute('data-task-id', taskId);

            let domCheckbox = node.querySelector('.card-checkbox');
            domCheckbox.setAttribute('data-checked', isCompleted+'');
            // domCheckbox.addEventListener('click', '');

            let domCardText = node.querySelector('.card-text');
            domCardText.textContent = taskText;
            // domCardText.addEventListener('click', '');

            let domDeleteArea = node.querySelector('.card-delete-area');
            // domDeleteArea.addEventListener('click', '');

            return node;
        }

        create(taskId) {
            const task = TaskManager.getTask(taskId);
            const dom = this.generateDOM(taskId, task.content, task.isCompleted);
            document.getElementById('card-box-list').appendChild(dom);
        }
    };

    // =============== View =============== //








};