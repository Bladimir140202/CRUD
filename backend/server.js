const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const {getAllTasks, createTask, updateTask, deleteTask} = require('./tasks');
app.get('/tasks', async (req, res) => {
    try {
        res.json(getAllTasks());
    }catch (err){
        res.status(500).json({ error: 'Error interno'});
    }
});

app.post('/tasks',(req, res) => {
    try {
        const {title, description} = req.body;
        if (!title || title.trim().length === 0) return res.status(400).json({error : 'Titulo requerido'});
        if (title.length > 100) return res.status(400).json({error : 'Titulo maximo 100 caracteres'});
        const task = createTask(title, description);
        res.status(201).json(task);
    }catch (err) {
        res.status(500).json({ error: 'Error al crear tarea'});
    }
});


app.put('/tasks/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
        const updates = {};
        if (req.body.title) {
            if (req.body.title.trim().length === 0) return res.status(400).json({ error: 'Título no vacío' });
            updates.title = req.body.title.trim();
        }
        if (req.body.description !== undefined) updates.description = req.body.description.trim();
        if (req.body.completed !== undefined) updates.completed = Boolean(req.body.completed);
        const task = updateTask(id, updates);
        task ? res.json(task) : res.status(404).json({ error: 'Tarea no encontrada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

app.delete('/tasks/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
        const task = deleteTask(id);
        task ? res.json(task) : res.status(404).json({ error: 'Tarea no encontrada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
