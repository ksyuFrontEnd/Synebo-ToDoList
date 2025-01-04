const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const todoList = document.querySelector('#todoList');
const emptyList = document.querySelector('#emptyList');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add new task to the list
    const taskText = taskInput.value;
    
    const taskHTML = `
                    <li class="list-group-item">
                        <span class="task-title">${taskText}</span>
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
    if(todoList.children.length > 1) {
        emptyList.classList.add('none')
    }
                    
})

