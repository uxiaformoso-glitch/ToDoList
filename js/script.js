const taskName = document.getElementById('inputTasca');
const addButton = document.getElementById('boto-afegir');
const listTasks = document.getElementById('llistaTasques');
const statistics = document.getElementById('estadistiques');
const deleteAllButton = document.getElementById('boto-eliminar-tot');
const filterButtons = document.querySelectorAll('.boto-filtre');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let actualFilter = 'Totes';

//Functions
//Save state on localStorage
function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Update statistics
function updateStatistics() {
    const all = tasks.length;
    const completed = tasks.filter(t => t.complete).length;
    const pending = all - completed;

    statistics.textContent = `Total: ${all} | Pendents: ${pending} | Completades: ${completed}`;
}

//Render list by selected filter
function renderTasks(){
    //Clear list to avoid duplicates
    listTasks.innerHTML = '';

    //Filter tasks by active filter
    const filteredTasks = tasks.filter(task => {
        if (actualFilter === 'Pendents') return !task.complete;
        if (actualFilter === 'Completades') return task.complete;
        return true;
    });

    if (filteredTasks.length === 0) {
        const voidMessage = document.createElement('li');
        voidMessage.className = 'missatge-buit';
        voidMessage.textContent = actualFilter === 'Totes'
            ? 'No hi ha tasques. Afegeix-ne una!'
            : `No hi ha tasques ${actualFilter.toLowerCase()}.`;
        
            listTasks.appendChild(voidMessage);
            updateStatistics();
            return;
    }

    //Create elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `tasca ${task.complete ? 'completada' : ''}`;

        //Checkbox to change state
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = task.complete;
        checkbox.addEventListener('change', () => changeState(task.id));

        //Text of the task
        const spanText = document.createElement('span');
        spanText.className = 'text-tasca';
        spanText.textContent = task.name;

        //Individual delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'boto-eliminar';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        //li tag structure
        li.appendChild(checkbox);
        li.appendChild(spanText);
        li.appendChild(deleteButton);

        listTasks.appendChild(li);
    });

    updateStatistics();
}


//Add new task
function addTask() {
    const nameValue = taskName.value.trim();

    //Validate field is not void
    if (nameValue === ''){
        alert('Escribe una tarea válida.');
        return;
    }

    //Basic structure object
    const newTask = {
        id: Date.now(),
        name: nameValue,
        complete: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();

    //Clean input
    taskName.value = '';
    taskName.focus();
}

//Change state
function changeState(id){
    tasks = tasks.map(task => {
        if (task.id === id) {
            return{...task, complete: !task.complete};
        }
        return task;
    });

    saveToLocalStorage();
    renderTasks();
}

//Delete individual task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

//Delete all tasks
function deleteAllTasks(){
    if (tasks.length === 0) return;

    if (confirm('¿Quieres eliminar TODAS las tareas?')) {
        tasks = [];
        saveToLocalStorage();
        renderTasks();
    }
}

//Event Listeners for buttons
//Add Button
addButton.addEventListener('click', addTask);

//Delete ALL Button
deleteAllButton.addEventListener('click', deleteAllTasks);

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        //Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('actiu'));

        //Add active class to clicked button
        e.target.classList.add('actiu');

        actualFilter = e.target.textContent.trim();
        renderTasks();
    });
});

renderTasks();