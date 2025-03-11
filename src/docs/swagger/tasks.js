/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gerenciamento de tarefas dentro de listas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID da tarefa.
 *         title:
 *           type: string
 *           description: Título da tarefa.
 *         description:
 *           type: string
 *           description: Descrição da tarefa.
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Prioridade da tarefa.
 *         completed:
 *           type: boolean
 *           description: Indica se a tarefa foi concluída.
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Data de vencimento da tarefa.
 *         notification:
 *           type: boolean
 *           description: Indica se a notificação está ativada para a tarefa.
 *         file:
 *           type: string
 *           format: binary
 *           description: Arquivo anexado à tarefa (opcional).
 *         listId:
 *           type: string
 *           description: ID da lista à qual a tarefa pertence.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da tarefa.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização da tarefa.
 *       example:
 *         id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         title: "Fazer relatório"
 *         description: "Preparar relatório trimestral"
 *         priority: "high"
 *         completed: false
 *         dueDate: "2023-12-31T23:59:59Z"
 *         notification: true
 *         file: "https://example.com/file.pdf"
 *         listId: "f47ac10b-58cc-4372-a567-0e02b2c3d480"
 *         createdAt: "2023-10-01T12:00:00Z"
 *         updatedAt: "2023-10-01T12:00:00Z"
 */

/**
 * @swagger
 * /tasks/{listId}:
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
 *           type: string
 *         description: ID da lista para buscar tarefas
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erro ao buscar tarefas
 */

/**
 * @swagger
 * /tasks/{listId}/{taskId}:
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
 *           type: string
 *         description: ID da lista
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao buscar a tarefa
 */

/**
 * @swagger
 * /tasks/planned/{userId}:
 *   get:
 *     summary: Obtém todas as tarefas planejadas de um usuário
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário para buscar tarefas planejadas
 *     responses:
 *       200:
 *         description: Lista de tarefas planejadas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Nenhuma lista encontrada para o usuário
 *       500:
 *         description: Erro ao buscar tarefas planejadas
 */

/**
 * @swagger
 * /tasks/important/{userId}:
 *   get:
 *     summary: Obtém todas as tarefas importantes de um usuário
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário para buscar tarefas importantes
 *     responses:
 *       200:
 *         description: Lista de tarefas importantes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Nenhuma lista encontrada para o usuário
 *       500:
 *         description: Erro ao buscar tarefas importantes
 */

/**
 * @swagger
 * /tasks/{listId}:
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
 *           type: string
 *         description: ID da lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - completed
 *               - dueDate
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Lista não encontrada
 *       500:
 *         description: Erro ao criar a tarefa
 */

/**
 * @swagger
 * /tasks/{listId}/{taskId}:
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
 *           type: string
 *         description: ID da lista
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao atualizar a tarefa
 */

/**
 * @swagger
 * /tasks/{listId}/{taskId}:
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
 *           type: string
 *         description: ID da lista
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao deletar a tarefa
 */
