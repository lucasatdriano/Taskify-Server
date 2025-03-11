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
        const task = await models.Task.findByPk(taskId);

        if (!task || task.listId !== listId) {
            return res.status(404).json({
                error: 'Tarefa não encontrada.',
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar a tarefa com ID ${taskId}.`,
            details: error.message,
        });
    }
}

export async function getPlannedTasks(req, res) {
    const { userId } = req.params;

    try {
        const plannedTasks = await models.Task.findAll({
            where: {
                userId: userId,
                dueDate: {
                    [Op.not]: null,
                },
            },
        });

        res.json(plannedTasks);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar tarefas planejadas.`,
            details: error.message,
        });
    }
}

export async function getImportantTasks(req, res) {
    const { userId } = req.params;

    try {
        const userLists = await models.List.findAll({
            where: { userId: userId },
            attributes: ['id'],
        });

        if (!userLists.length) {
            return res
                .status(404)
                .json({ error: 'Nenhuma lista encontrada para o usuário.' });
        }

        const listIds = userLists.map((list) => list.id);

        const importantTasks = await models.Task.findAll({
            where: {
                important: true,
                listId: {
                    [Op.in]: listIds,
                },
            },
        });

        res.json(importantTasks);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar tarefas importantes.`,
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
        important,
        file,
    } = req.body;

    try {
        const list = await models.List.findByPk(listId);

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
            important,
            file,
            listId,
        });

        res.status(201).json(newTask);
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
        important,
        file,
    } = req.body;

    try {
        const task = await models.Task.findByPk(taskId);

        if (!task || task.listId !== listId) {
            return res.status(404).json({
                error: 'Tarefa não encontrada.',
            });
        }

        await models.Task.update(
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
                important: important !== undefined ? important : task.important,
                file: file || task.file,
            },
            { where: { id: taskId, listId: listId } },
        );

        const updatedTask = await models.Task.findByPk(taskId);

        if (!updatedTask || updatedTask.listId !== listId) {
            return res.status(404).json({
                error: 'Tarefa atualizada não encontrada.',
            });
        }

        res.status(200).json(updatedTask);
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
        const task = await models.Task.findByPk(taskId);

        if (!task || task.listId !== listId) {
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
