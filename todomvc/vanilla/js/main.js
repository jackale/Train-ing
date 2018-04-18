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
    * localStorageに一つのキーでタスク配列でぶっこむ。
    * NOTE: 面倒なのでidは配列の順番。保持してないのでidの逆引きはできない
    * そうなるとdeleteした時にidが全部変更されて困るのでやっぱ保持する
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
    
    // NOTE: モデルと合体させる？？
    const vTaskCard = new class {
        constructor() {
            this.template = document.getElementById('tpl-card');
        }
        
        generate(taskId, taskText, isCompleted) {
            let node = document.importNode(this.template.content, true);
            
            let domParent = node.querySelector('.card');
            domParent.setAttribute('data-task-id', taskId);
            domParent.setAttribute('data-completed', isCompleted+'');
            
            
            let domCheckbox = node.querySelector('.card-checkbox');
            domCheckbox.addEventListener('click', function () {
                const parent      = this.parentNode;
                const isCompleted = parent.getAttribute('data-completed');
                const setVal = (isCompleted === 'true') ? false : true;
                
                // Update task
                const taskId = parent.getAttribute('data-task-id');
                const task = TaskManager.getTask(taskId);
                task.isCompleted = setVal;
                TaskManager.update(taskId, task);
                
                // Update view
                parent.setAttribute('data-completed', setVal);
            });
            
            let domCardText = node.querySelector('.card-text');
            domCardText.textContent = taskText;
            domCardText.addEventListener('dblclick', function () {
                const domCardTextEdit = this.parentNode.querySelector('.card-text-edit');
                
                domCardTextEdit.style = 'display: block';
                domCardTextEdit.querySelector('input').value = this.textContent;
                
                this.style = 'display: none;';
                this.parentNode.querySelector('.card-delete-area').style = 'display: none;';
                
                domCardTextEdit.querySelector('input').focus();
            });
            
            // FIXME: 両方にイベントを設定して削除するのでなんか変なエラー出るから直す
            let domCardTextEdit = node.querySelector('.card-text-edit input');
            domCardTextEdit.addEventListener('blur', function () {
                const domCardTextEdit = this.parentNode;
                const taskId = domCardTextEdit.parentNode.getAttribute('data-task-id');
                
                // TODO: 消すので共通化
                if (this.value === '') {
                    TaskManager.delete(taskId);
                    domCardTextEdit.parentNode.parentNode.removeChild(domCardTextEdit.parentNode);
                } else {
                    const domCardText = domCardTextEdit.parentNode.querySelector('.card-text');
                    
                    let task = TaskManager.getTask(taskId);
                    task.content = this.value;
                    TaskManager.update(taskId, task);
                    
                    domCardTextEdit.style = 'display: none;';
                    
                    domCardText.textContent = this.value;
                    domCardText.style = 'display: block';
                    domCardText.parentNode.querySelector('.card-delete-area').style = 'display: block;';
                }
                return false;
            });
            // FIXME: 最悪なので直すこと
            domCardTextEdit.addEventListener('keydown', function (e) {
                if(e.keyCode !== 13) return;
                const domCardTextEdit = this.parentNode;
                const taskId = domCardTextEdit.parentNode.getAttribute('data-task-id');

                // TODO: 消すので共通化
                if (this.value === '') {
                    TaskManager.delete(taskId);
                    domCardTextEdit.parentNode.parentNode.removeChild(domCardTextEdit.parentNode);
                } else {
                    const domCardText = domCardTextEdit.parentNode.querySelector('.card-text');

                    let task = TaskManager.getTask(taskId);
                    task.content = this.value;
                    TaskManager.update(taskId, task);

                    domCardTextEdit.style = 'display: none;';

                    domCardText.textContent = this.value;
                    domCardText.style = 'display: block';
                    domCardText.parentNode.querySelector('.card-delete-area').style = 'display: block;';
                }
                return false;
            });
            
            
            let domDeleteArea = node.querySelector('.card-delete-area');
            domDeleteArea.addEventListener('click', function() {
                const taskId = this.parentNode.getAttribute('data-task-id');
                
                TaskManager.delete(taskId);
                this.parentNode.parentNode.removeChild(this.parentNode);
            });
            
            return node;
        }
        
        add(taskId) {
            const task = TaskManager.getTask(taskId);
            const dom = this.generate(taskId, task.content, task.isCompleted);
            document.getElementById('card-box-list').appendChild(dom);
        }
    };
    
    
    // =============== View =============== //
    const createTask = function (e) {
        if (e.keyCode !== 13) return false; // 13 is Key Code of Enter
        if (this.value === '') return false;
        const task = {
            content: this.value,
            isCompleted: false
        };
        
        TaskManager.add(task);
        vTaskCard.add(TaskManager.taskList.length - 1);
        
        this.value = '';
    };
    document.querySelector('#card-box-generator input').addEventListener('keydown', createTask);
    
    TaskManager.list.forEach(function (task, taskId) {
        vTaskCard.add(taskId);
    });

    const switchAllTask = function () {
        const isAllCompleted = TaskManager.list.every(function (task) {
            return task.isCompleted === true;
        });
        const updateParameter = (isAllCompleted) ? false : true;


        TaskManager.list.forEach(function (task, taskId) {
            task.isCompleted = updateParameter;
            TaskManager.update(taskId, task);
        });

        const cardList = document.getElementById('card-box-list').children;
        for (let i = 0; i < cardList.length; i++) {
            const card = cardList[i];
            card.setAttribute('data-completed', updateParameter);   
            
        }
    };
    document.getElementById('switch-all-checkbox').addEventListener('click', switchAllTask);
    
    const filterClosure = function (type) {
        const checker = {
            'all': function () { return true; },
            'active': function (isCompleted) { return isCompleted === false; },
            'completed': function (isCompleted) { return isCompleted === true;}
        }[type];
        return function () {
            const cardList = document.getElementById('card-box-list').children;
            for (let i = 0; i < cardList.length; i++) {
                const card = cardList[i];
                
                const isCompleted = (card.getAttribute('data-completed') === 'true') ? true : false;
                (checker(isCompleted)) ? show(card) : hide(card);
            }
        };
    };

    function show(elem) { elem.style = 'display:block;'; };
    function hide(elem) { elem.style = 'display:none;'; };

    Array.prototype.slice.call(document.getElementsByClassName('btn-filter-list')).forEach(function (elem) {
        elem.addEventListener('click', filterClosure(elem.getAttribute('data-type')));
    });

};