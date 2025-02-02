import express from 'express';
import {
    getTasksByList,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gerenciamento de tarefas dentro de listas
 */

router.get('/:listId', authenticateUser, getTasksByList);
/**
 * @swagger
 * /{listId}:
 *   get:
 *     summary: Obtém todas as tarefas de uma lista
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da lista para buscar tarefas
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *       500:
 *         description: Erro ao buscar tarefas
 */

router.get('/:listId/:taskId', authenticateUser, getTaskById);
/**
 * @swagger
 * /{listId}/{taskId}:
 *   get:
 *     summary: Obtém uma única tarefa pelo ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da lista
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa retornada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao buscar a tarefa
 */

router.post('/:listId', authenticateUser, createTask);
/**
 * @swagger
 * /{listId}:
 *   post:
 *     summary: Cria uma nova tarefa em uma lista
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               notification:
 *                 type: boolean
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro ao criar a tarefa
 */

router.put('/:listId/:taskId', authenticateUser, updateTask);
/**
 * @swagger
 * /{listId}/{taskId}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da lista
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               notification:
 *                 type: boolean
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao atualizar a tarefa
 */

router.delete('/:listId/:taskId', authenticateUser, deleteTask);
/**
 * @swagger
 * /{listId}/{taskId}:
 *   delete:
 *     summary: Deleta uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da lista
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao deletar a tarefa
 */

export default router;
