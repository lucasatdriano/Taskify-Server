/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gerenciamento de tarefas dentro de listas
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
