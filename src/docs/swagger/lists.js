/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Gerenciamento de listas de cada usuário
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     List:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID da lista.
 *         title:
 *           type: string
 *           description: Título da lista.
 *         daily:
 *           type: boolean
 *           description: Indica se a lista é diária.
 *         collaboratorsEmails:
 *           type: string
 *           description: Emails dos colaboradores separados por vírgula.
 *         fixed:
 *           type: boolean
 *           description: Indica se a lista é fixa.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da lista.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização da lista.
 *       example:
 *         id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         title: "Lista de Compras"
 *         daily: false
 *         collaboratorsEmails: "colab1@example.com,colab2@example.com"
 *         fixed: true
 *         createdAt: "2023-10-01T12:00:00Z"
 *         updatedAt: "2023-10-01T12:00:00Z"
 */

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
 *                 $ref: '#/components/schemas/List'
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao buscar as listas
 */

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
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro ao buscar a lista
 */

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
 *             $ref: '#/components/schemas/List'
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao criar lista
 */

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
 *             $ref: '#/components/schemas/List'
 *     responses:
 *       200:
 *         description: Lista atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Lista não encontrada
 *       403:
 *         description: Permissão negada
 *       500:
 *         description: Erro ao atualizar lista
 */

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
