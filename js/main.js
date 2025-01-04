const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const todoList = document.querySelector('#todoList');
const emptyList = document.querySelector('#emptyList');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.querySelector('#clearCompleted');
const itemsLeft = document.querySelector('#itemsLeft');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function(task) {
        renderTask(task);
    })
}

checkEmptyList();

updateItemsLeft();

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
    updateItemsLeft();

}

// Delete task
todoList.addEventListener('click', deleteTask);

function deleteTask(e) {

    // Delete task from the list
    if (e.target.dataset.action !== 'delete') return;

    const parentNode = e.target.closest('li'); 

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
    updateItemsLeft();
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

    updateItemsLeft();
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

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener('click', filterTasks);
});

function filterTasks(event) {
    const filter = event.target.id; 
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    let filteredTasks = [];

    if (filter === 'filterAll') {
        filteredTasks = tasks;
    } else if (filter === 'filterActive') {
        filteredTasks = tasks.filter(task => !task.done);
    } else if (filter === 'filterCompleted') {
        filteredTasks = tasks.filter(task => task.done);
    }

    todoList.innerHTML = ""; 
    filteredTasks.forEach(renderTask);

    checkEmptyList();
}

// Clear all completed tasks
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

function clearCompletedTasks() {
    
    tasks = tasks.filter(task => !task.done);

    saveToLocalStorage();

    todoList.innerHTML = "";

    tasks.forEach(renderTask);
    
    checkEmptyList();
    updateItemsLeft();
}

// Count incomplete tasks
function updateItemsLeft() {
    const activeTasksCount = tasks.filter(task => !task.done).length;
    itemsLeft.textContent = `${activeTasksCount} items left`;
}
