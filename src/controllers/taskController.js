import { models } from '../models/index.js';

export async function getTasksByList(req, res) {
    const { listId } = req.params;

    try {
        const tasks = await models.Task.findAll({ where: { listId: listId } });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar tarefas na lista ${listId}.`,
            details: error.message,
        });
    }
}

export async function getTaskById(req, res) {
    const { listId, taskId } = req.params;

    if (!req.authenticatedUser) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const task = await models.Task.findOne({
            where: { id: taskId, listId: listId },
        });

        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar a tarefa com ID ${taskId}.`,
            details: error.message,
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
        const list = await models.List.findOne({ where: { id: listId } });

        if (!list) {
            return res.status(404).json({
                error: `Lista com ID ${listId} não encontrada.`,
            });
        }

        const listTitle = list.title;

        const newTask = await models.Task.create({
            title,
            description,
            priority,
            completed,
            dueDate,
            notification,
            file,
            listId,
        });

        res.status(201).json({
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            completed: newTask.completed,
            dueDate: newTask.dueDate,
            notification: newTask.notification,
            file: newTask.file,
            listId: newTask.listId,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao criar tarefa na lista ${
                listTitle || `ID: ${listId}`
            }.`,
            details: error.message,
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
        const task = await models.Task.findOne({
            where: { id: taskId, listId: listId },
        });

        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        const updatedTask = await models.Task.update(
            {
                title: title || task.title,
                description: description || task.description,
                priority: priority || task.priority,
                completed: completed !== undefined ? completed : task.completed,
                dueDate: dueDate || task.dueDate,
                notification:
                    notification !== undefined
                        ? notification
                        : task.notification,
                file: file || task.file,
            },
            { where: { id: taskId, listId: listId } },
        );

        res.status(200).json({
            updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar tarefa.',
            details: error.message,
        });
    }
}

export async function deleteTask(req, res) {
    const { listId, taskId } = req.params;

    try {
        const task = await models.Task.findOne({
            where: { id: taskId, listId: listId },
        });

        if (!task) {
            return res.status(404).json({
                error: 'Tarefa não encontrada.',
            });
        }

        const taskTitle = task.title;

        await models.Task.destroy({ where: { id: taskId, listId: listId } });

        res.status(200).json({
            message: `Tarefa ${taskTitle} deletada com sucesso.`,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao deletar tarefa ${taskTitle || `ID: ${taskId}`}.`,
            details: error.message,
        });
    }
}
