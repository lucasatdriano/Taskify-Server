import database from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const [result] = await database.query(
            'INSERT INTO tbUsuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashedPassword],
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
}

export async function login(req, res) {
    const { email, senha } = req.body;

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET não definido');

        const [rows] = await database.query(
            'SELECT * FROM tbUsuarios WHERE email = ?',
            [email],
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado!' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta!' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secret, {
            expiresIn: '1h',
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
}
