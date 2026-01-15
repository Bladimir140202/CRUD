let tasks = [];
let nextId = 1;

function getAllTasks() {
    return tasks;
}

function createTask(title, description) {
    const task = { id: nextId++, title, description, completed: false };
    tasks.push(task);
    return task;
}

function updateTask(id, updates) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        Object.assign(task, updates);
        return task;
    }
    return null;
}

function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        return tasks.splice(index, 1)[0];
    }
    return null;
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
