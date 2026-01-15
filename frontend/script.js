const API_URL = 'http://localhost:3000/tasks';
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const errorMsg = document.getElementById('error-msg');


function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    setTimeout(() => errorMsg.style.display = 'none', 5000);
}


async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar tareas');
        const tasks = await response.json();
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    } catch (err) {
        
        const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        renderTasks(localTasks);
        showError('Servidor no disponible, usando datos locales: ' + err.message);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-content">
                <strong>${task.title}</strong>
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${task.id}, ${task.completed})">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                <button onclick="editTask(${task.id})">Editar</button>
                <button onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        if (task.completed) li.classList.add('completed');
        taskList.appendChild(li);
    });
}


taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    if (!title) return showError('Título requerido');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        if (!response.ok) throw new Error('Error al añadir tarea');
        taskForm.reset();
        loadTasks();
    } catch (err) {
        showError('Error al añadir: ' + err.message);
    }
});


async function toggleComplete(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !completed })
        });
        if (!response.ok) throw new Error('Error al actualizar');
        loadTasks();
    } catch (err) {
        showError('Error al completar: ' + err.message);
    }
}


function editTask(id) {
    const li = event.target.closest('li');
    const contentDiv = li.querySelector('.task-content');
    const actionsDiv = li.querySelector('.task-actions');
    const title = contentDiv.querySelector('strong').textContent;
    const description = contentDiv.querySelector('p').textContent;
    contentDiv.innerHTML = `
        <input type="text" value="${title}" maxlength="100" required>
        <textarea maxlength="200">${description}</textarea>
    `;
    actionsDiv.innerHTML = `
        <button onclick="saveEdit(${id})">Guardar</button>
        <button onclick="cancelEdit()">Cancelar</button>
    `;
    li.classList.add('edit-mode');
}


async function saveEdit(id) {
    const li = document.querySelector('.edit-mode');
    const title = li.querySelector('input').value.trim();
    const description = li.querySelector('textarea').value.trim();
    if (!title) return showError('Título requerido');
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        if (!response.ok) throw new Error('Error al guardar edición');
        loadTasks();
    } catch (err) {
        showError('Error al guardar: ' + err.message);
    }
}


function cancelEdit() {
    loadTasks();
}

async function deleteTask(id) {
    if (!confirm('¿Eliminar tarea?')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');
        loadTasks();
    } catch (err) {
        showError('Error al eliminar: ' + err.message);
    }
}


loadTasks();
