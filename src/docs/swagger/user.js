/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário.
 *         name:
 *           type: string
 *           description: Nome do usuário.
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário.
 *         password:
 *           type: string
 *           description: Senha do usuário (não retornada em respostas).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização do usuário.
 *       example:
 *         id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         name: "João Silva"
 *         email: "joao.silva@example.com"
 *         createdAt: "2023-10-01T12:00:00Z"
 *         updatedAt: "2023-10-01T12:00:00Z"
 *
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Token de acesso JWT.
 *         refreshToken:
 *           type: string
 *           description: Token de atualização JWT.
 *       example:
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário com nome, email e senha.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro ao cadastrar usuário
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Autentica o usuário e retorna tokens JWT (accessToken e refreshToken).
 *     tags: [User]
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
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Usuário não encontrado ou senha incorreta
 *       500:
 *         description: Erro ao realizar login
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar nome
 */

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
