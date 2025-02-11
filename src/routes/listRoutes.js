import express from 'express';
import {
    getUserLists,
    getUserListById,
    createUserList,
    updateUserList,
    deleteUserList,
} from '../controllers/listController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Gerenciamento de listas de cada usuário
 */

router.get('/', authMiddleware, getUserLists);
/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Recupera todas as listas do usuário autenticado
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de listas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   daily:
 *                     type: boolean
 *                   collaboratorsEmails:
 *                     type: string
 *                   fixed:
 *                     type: boolean
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao buscar as listas
 */

router.get('/:listId', authMiddleware, getUserListById);
/**
 * @swagger
 * /lists/{listId}:
 *   get:
 *     summary: Recupera uma lista do usuário autenticado pelo ID
 *     parameters:
 *       - name: listId
 *         in: path
 *         required: true
 *         description: ID da lista
 *         schema:
 *           type: string
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Detalhes da lista
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 daily:
 *                   type: boolean
 *                 collaboratorsEmails:
 *                   type: string
 *                 fixed:
 *                   type: boolean
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro ao buscar a lista
 */

router.post('/', authMiddleware, createUserList);
/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Cria uma nova lista para o usuário autenticado
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               daily:
 *                 type: boolean
 *               collaboratorsEmails:
 *                 type: string
 *                 description: Emails dos colaboradores separados por vírgula
 *               fixed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 daily:
 *                   type: boolean
 *                 collaboratorsEmails:
 *                   type: string
 *                 fixed:
 *                   type: boolean
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao criar lista
 */

router.put('/:listId', authMiddleware, updateUserList);
/**
 * @swagger
 * /lists/{listId}:
 *   put:
 *     summary: Atualiza uma lista do usuário autenticado
 *     parameters:
 *       - name: listId
 *         in: path
 *         required: true
 *         description: ID da lista
 *         schema:
 *           type: string
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               collaboratorsEmails:
 *                 type: string
 *               fixed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lista atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     daily:
 *                       type: boolean
 *                     collaboratorsEmails:
 *                       type: string
 *                     fixed:
 *                       type: boolean
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Lista não encontrada
 *       403:
 *         description: Permissão negada
 *       500:
 *         description: Erro ao atualizar lista
 */

router.delete('/:listId', authMiddleware, deleteUserList);
/**
 * @swagger
 * /lists/{listId}:
 *   delete:
 *     summary: Deleta uma lista do usuário autenticado
 *     parameters:
 *       - name: listId
 *         in: path
 *         required: true
 *         description: ID da lista
 *         schema:
 *           type: string
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista deletada com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Lista não encontrada
 *       403:
 *         description: Permissão negada
 *       500:
 *         description: Erro ao deletar lista
 */

export default router;
