import express from 'express';
import {
    registerUser,
    Login,
    getUserById,
    updateUserName,
    updateUserPassword,
    refreshUserToken,
    logoutUser,
} from '../controllers/userController.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gerenciamento de usuários
 */

router.post('/register', registerUser);
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário com nome, email e senha.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       500:
 *         description: Erro ao cadastrar usuário
 */

router.post('/login', Login);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Autentica o usuário e retorna tokens JWT (accessToken e refreshToken).
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Usuário não encontrado ou senha incorreta
 *       500:
 *         description: Erro ao realizar login
 */

router.get('/:userId', getUserById);
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Obtém os detalhes de um usuário
 *     description: Retorna informações do usuário com base no ID fornecido.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do usuário encontrados
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário
 */

router.put('/:userId/name', updateUserName);
/**
 * @swagger
 * /users/{userId}/name:
 *   put:
 *     summary: Atualiza o nome de um usuário
 *     description: Altera o nome do usuário com base no ID fornecido.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *             required:
 *               - newName
 *     responses:
 *       200:
 *         description: Nome atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar nome
 */

router.put('/:userId/password', updateUserPassword);
/**
 * @swagger
 * /users/{userId}/password:
 *   put:
 *     summary: Atualiza a senha de um usuário
 *     description: Altera a senha do usuário com base no ID fornecido.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       401:
 *         description: Senha atual incorreta
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar a senha
 */

router.post('/refreshToken', refreshUserToken);
/**
 * @swagger
 * /users/refreshToken:
 *   post:
 *     summary: Atualiza o accessToken usando um refreshToken válido
 *     description: Gera um novo accessToken usando o refreshToken fornecido.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Novo accessToken gerado com sucesso
 *       401:
 *         description: Refresh token não fornecido ou inválido
 *       403:
 *         description: Refresh token não encontrado no banco de dados
 *       500:
 *         description: Erro ao gerar novo token
 */

router.post('/:userId/logout', logoutUser);
/**
 * @swagger
 * /users/{userId}/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     description: Remove o refreshToken do usuário, efetivando o logout.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deslogado com sucesso
 *       500:
 *         description: Erro ao deslogar usuário
 */

export default router;
