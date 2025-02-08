import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';

export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    try {
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashError) {
            return res
                .status(500)
                .json({ error: 'Erro ao processar a nova senha.' });
        }

        const newUser = await User.create({
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
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

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta!' });
        }

        const id = user.id;
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: '1h' },
        );

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: '30d' },
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ id, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao fazer login.',
            details: error.message,
        });
    }
}

export async function getUserById(req, res) {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
}

export async function updateUser(req, res) {
    const { userId } = req.params;
    const { newName } = req.body;

    try {
        const updatedUser = await User.update(
            { name: newName },
            { where: { id: userId } },
        );

        if (updatedUser[0] === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Nome atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar o nome do usuário.',
            details: error.message,
        });
    }
}

export async function logoutUser(req, res) {
    const { userId } = req.body;

    try {
        await User.update({ refreshToken: null }, { where: { id: userId } });

        res.json({ message: 'Usuário deslogado com sucesso' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deslogar usuário.',
            details: error.message,
        });
    }
}
