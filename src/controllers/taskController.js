import database from '../config/db.js';

export async function getTasks(req, res) {
    const { lista_id } = req.params;

    try {
        const [tasks] = await database.query(
            'SELECT * FROM tbTarefas WHERE lista_id = ?',
            [lista_id],
        );
        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            error: `Erro ao buscar tarefas na lista ${lista_id}.`,
        });
    }
}

export async function createTask(req, res) {
    const { titulo, descricao, prioridade, lista_id } = req.body;

    try {
        const [result] = await database.query(
            'INSERT INTO tbTarefas (titulo, descricao, prioridade, lista_id) VALUES (?, ?, ?, ?)',
            [titulo, descricao, prioridade, lista_id],
        );
        res.status(201).json({
            id: result.insertId,
            titulo,
            descricao,
            prioridade,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erro ao criar tarefa na lista ${lista_id}.`,
        });
    }
}
