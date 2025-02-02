import database from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertResult] = await database.query(
            'INSERT INTO tbUsers (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
        );
        res.status(201).json({ id: insertResult.insertId });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao cadastrar usuário.',
            details: error.message,
        });
    }
}

export async function Login(req, res) {
    const { email, password } = req.body;

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET não definido');

        const [userData] = await database.query(
            'SELECT * FROM tbUsers WHERE email = ?',
            [email],
        );

        if (userData.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado!' });
        }

        const foundUser = userData[0];
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta!' });
        }

        const accessToken = jwt.sign(
            { id: foundUser.id, email: foundUser.email },
            secret,
            { expiresIn: '1h' },
        );

        const refreshToken = jwt.sign(
            { id: foundUser.id, email: foundUser.email },
            secret,
            { expiresIn: '30d' },
        );

        await database.query(
            'UPDATE tbUsers SET refresh_token = ? WHERE id = ?',
            [refreshToken, foundUser.id],
        );

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
}

export async function getUserById(req, res) {
    const { userId } = req.params;

    try {
        const [userData] = await database.query(
            'SELECT id, name, email FROM tbUsers WHERE id = ?',
            [userId],
        );

        if (userData.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(userData[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
}

export async function updateUserName(req, res) {
    const { userId } = req.params;
    const { newName } = req.body;

    try {
        const [result] = await database.query(
            'UPDATE tbUsers SET name = ? WHERE id = ?',
            [newName, userId],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Nome atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o nome do usuário.' });
    }
}

export async function updateUserPassword(req, res) {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const [users] = await database.query(
            'SELECT * FROM tbUsers WHERE id = ?',
            [userId],
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const user = users[0];
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password,
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Senha atual incorreta!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await database.query('UPDATE tbUsers SET password = ? WHERE id = ?', [
            hashedPassword,
            userId,
        ]);

        res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar a senha do usuário.',
        });
    }
}

export async function refreshUserToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(401).json({ error: 'Refresh token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECCRET não definido');

        jwt.verify(refreshToken, secret, async (err, decoded) => {
            if (err) {
                return res
                    .status(403)
                    .json({ error: 'Refresh token inválido' });
            }

            const [userRows] = await database.query(
                'SELECT * FROM tbUsers WHERE id = ? AND refresh_token = ?',
                [decoded.id, refreshToken],
            );

            if (userRows.length === 0) {
                return res.status(403).json({
                    error: 'Refresh token não encontrado no banco de dados',
                });
            }

            const accessToken = jwt.sign(
                { id: decoded.id, email: decoded.email },
                secret,
                { expiresIn: '1h' },
            );

            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar novo token' });
    }
}

export async function logoutUser(req, res) {
    const { userId } = req.body;

    try {
        await database.query(
            'UPDATE tbUsers SET refresh_token = NULL WHERE id = ?',
            [userId],
        );

        res.json({ message: 'Usuário deslogado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deslogar usuário.' });
    }
}
