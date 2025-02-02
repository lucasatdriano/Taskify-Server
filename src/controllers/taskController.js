import database from '../config/db.js';

export async function getTasksByList(req, res) {
    const { listId } = req.params;

    try {
        const [tasks] = await database.query(
            'SELECT * FROM tbTasks WHERE list_id = ?',
            [listId],
        );

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar tarefas na lista ${listId}.`,
        });
    }
}

export async function getTaskById(req, res) {
    const { listId, taskId } = req.params;

    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [task] = await database.query(
            'SELECT * FROM tbTasks WHERE list_id = ? AND id = ?',
            [listId, taskId],
        );

        if (task.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        res.json(task[0]);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar a tarefa com ID ${taskId}.`,
        });
    }
}

export async function createTask(req, res) {
    const { listId } = req.params;
    const {
        title,
        description,
        priority,
        completed,
        dueDate,
        notification,
        file,
    } = req.body;

    try {
        const [list] = await database.query(
            'SELECT * FROM tbLists WHERE id = ?',
            [listId],
        );

        if (list.length === 0) {
            return res.status(404).json({
                error: `Lista com ID ${listId} não encontrada.`,
            });
        }

        const listTitle = list[0].title;

        const [result] = await database.query(
            'INSERT INTO tbTasks (title, description, priority, completed, due_date, notification, file, list_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                title,
                description,
                priority,
                completed,
                dueDate,
                notification,
                file,
                listId,
            ],
        );

        res.status(201).json({
            id: result.insertId,
            title,
            description,
            priority,
            completed,
            dueDate,
            notification,
            file,
            listId,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao criar tarefa na lista ${
                listTitle || `ID: ${listId}`
            }.`,
        });
    }
}

export async function updateTask(req, res) {
    const { listId, taskId } = req.params;
    const {
        title,
        description,
        priority,
        completed,
        dueDate,
        notification,
        file,
    } = req.body;

    try {
        const [task] = await database.query(
            'SELECT * FROM tbTasks WHERE list_id = ? AND id = ?',
            [listId, taskId],
        );

        if (task.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        const updatedTask = {
            title: title || task[0].title,
            description: description || task[0].description,
            priority: priority || task[0].priority,
            completed: completed !== undefined ? completed : task[0].completed,
            dueDate: dueDate || task[0].due_date,
            notification:
                notification !== undefined
                    ? notification
                    : task[0].notification,
            file: file || task[0].file,
        };

        await database.query(
            'UPDATE tbTasks SET title = ?, description = ?, priority = ?, completed = ?, due_date = ?, notification = ?, file = ? WHERE list_id = ? AND id = ?',
            [
                updatedTask.title,
                updatedTask.description,
                updatedTask.priority,
                updatedTask.completed,
                updatedTask.dueDate,
                updatedTask.notification,
                updatedTask.file,
                listId,
                taskId,
            ],
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar tarefa.',
        });
    }
}

export async function deleteTask(req, res) {
    const { listId, taskId } = req.params;

    try {
        const [task] = await database.query(
            'SELECT * FROM tbTasks WHERE list_id = ? AND id = ?',
            [listId, taskId],
        );

        if (task.length === 0) {
            return res.status(404).json({
                error: 'Tarefa não encontrada.',
            });
        }

        const taskTitle = task[0].title;

        await database.query(
            'DELETE FROM tbTasks WHERE list_id = ? AND id = ?',
            [listId, taskId],
        );

        res.status(200).json({
            message: `Tarefa ${taskTitle} deletada com sucesso.`,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao deletar tarefa ${taskTitle || `ID: ${taskId}`}.`,
        });
    }
}
