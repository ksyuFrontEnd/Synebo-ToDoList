const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const todoList = document.querySelector('#todoList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

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
    console.log(tasks);

    const cssClass = newTask.done ? "task-title task-title--done" : "task-title";
    
    const taskHTML = `
                    <li id="${newTask.id}" class="list-group-item">
                        <span class="${cssClass}">${newTask.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">Done</button>
                            <button type="button" data-action="delete" class="btn-action">X</button>
                        </div>
                    </li>`

    todoList.insertAdjacentHTML('beforeend', taskHTML);

    // Clear input after adding the task and return focus
    taskInput.value = "";
    taskInput.focus();

    // Delete emptyList item if there are tasks to do in the list
    if (todoList.children.length > 1) {
        emptyList.classList.add('none');
    }
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

    parentNode.remove();
    
    // Show emptyList item if there are no tasks in the list
    if (todoList.children.length === 1) {
        emptyList.classList.remove('none');
    }
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

    const taskTitle = parentNode.querySelector('span');

    taskTitle.classList.toggle('task-title--done');
}
