const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const todoList = document.querySelector('#todoList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function(task) {
        renderTask(task);
    })
}

checkEmptyList();

// Add task
form.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();
    
    // Add new task to the list
    const taskText = taskInput.value;

    // Create an object for a task
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // Add task to array
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    // Clear input after adding the task and return focus
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();

}

// Delete task
todoList.addEventListener('click', deleteTask);

function deleteTask(event) {

    // Delete task from the list
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('li'); 

    const id = Number(parentNode.id);

    tasks = tasks.filter(function (task) {
        if (task.id === id) {
            return false;
        } else {
            return true;
        }
    })

    saveToLocalStorage();

    parentNode.remove();

    checkEmptyList();
}

// Mark task as complete
todoList.addEventListener('click', doneTask);

function doneTask(e) {

    if (e.target.dataset.action !== 'done') return;

    const parentNode = e.target.closest('li');

    const id = Number(parentNode.id);

    const task = tasks.find(function(task) {
        if (task.id === id) {
            return true;
        }
    })

    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('span');

    taskTitle.classList.toggle('task-title--done');
}

// Show or hide emptyList item
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
                                <li id="emptyList" class="empty-list">
                                    <div class="empty-list__title">There are no tasks for today yet...</div>
                                </li>`;

        todoList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title";
    
    const taskHTML = `
                    <li id="${task.id}" class="list-group-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">Done</button>
                            <button type="button" data-action="delete" class="btn-action">X</button>
                        </div>
                    </li>`

    todoList.insertAdjacentHTML('beforeend', taskHTML);
}
