const itemTemplate = document.getElementById('tk-todo-item-template').content
const appTemplate = document.getElementById('tk-todo-app-template').content
const storageKey = 'tk:todoList'
customElements.define('tk-todo-app', class extends HTMLElement {
    todoList = [
        {text: '1', completed: false},
        {text: '2', completed: false},
        {text: '3', completed: false},
        {text: '4', completed: false},
        {text: '5', completed: false},
        {text: '6', completed: false},
    ]

    constructor() {
        super();
        this.componentRoot$ = this.attachShadow({mode: 'open'});
        this.componentRoot$.append(appTemplate.cloneNode(true));
        this.componentRoot$.querySelector('.tk-add-todo-form')
            .addEventListener('submit', this.addTodo)
        this.list$ = this.componentRoot$.querySelector('.todo-list-items');
        const todoStr = localStorage.getItem(storageKey);
        if (todoStr) {
            this.todoList = JSON.parse(todoStr);
        }
    }

    renderTodoItem(todo, index) {
        const newItem$ = itemTemplate.cloneNode(true);
        newItem$.querySelector('.itemName').innerHTML = todo.text;
        if (todo.completed) {
            newItem$.querySelector('.tk-todo-item').classList.add('completed');
            newItem$.querySelector('.toggle').checked = true;
        }
        newItem$.querySelector('.toggle').addEventListener('click', () => this.checkTodo(index, !todo.completed))
        newItem$.querySelector('.destroy').addEventListener('click', this.removeTodo)
        this.list$.append(newItem$)
    }

    render() {
        this.list$.innerHTML = "";

        this.todoList.forEach((todo, index) => {
            this.renderTodoItem(todo, index)
        })
    }

    addTodo = (event) => {
        event.preventDefault();
        const submitData = new FormData(event.target);
        const newTodo = {
            text: submitData.get('text'),
            completed: false,
        }
        const index = this.todoList.push(newTodo);
        this.renderTodoItem(newTodo, index - 1);
        this.saveList();
    }

    checkTodo = (todoIndex, completed) => {
        this.todoList[todoIndex].completed = completed;

        const item$ = this.list$.querySelector(`.tk-todo-item:nth-of-type(${todoIndex + 1})`);
        item$.querySelector('.toggle').checked = completed;
        if (completed) {
            item$.classList.add('completed');
        } else {
            item$.classList.remove('completed');
        }
        this.saveList();
    }

    removeTodo = (event) => {
        const todoItem$ = event.target.parentNode.parentNode;
        const todoIndex = Array.prototype.indexOf.call(this.list$.children, todoItem$);
        this.todoList.splice(todoIndex, 1);
        this.list$.removeChild(todoItem$);
        this.saveList();
    }

    connectedCallback() {
        this.render();
    }

    saveList() {
        localStorage.setItem(storageKey, JSON.stringify(this.todoList));
    }
});
