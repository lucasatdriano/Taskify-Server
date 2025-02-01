import database from '../config/db.js';

export async function getLists(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [lists] = await database.query(
            'SELECT * FROM tbListas WHERE usuario_id = ?',
            [req.user.id],
        );
        res.json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar listas.' });
    }
}

export async function createList(req, res) {
    const { titulo, fixada, diaria } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const [result] = await database.query(
            'INSERT INTO tbListas (titulo, fixada, diaria, usuario_id) VALUES (?, ?, ?, ?)',
            [titulo, fixada, diaria, req.user.id],
        );
        res.status(201).json({ id: result.insertId, titulo, fixada, diaria });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar lista.' });
    }
}
