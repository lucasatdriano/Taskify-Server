import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { models } from '../models/index.js';

export async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await models.User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        );

        const resetURL =
            process.env.NODE_ENV === 'production'
                ? `https://apptaskify.vercel.app/resetPassword/${token}`
                : `http://localhost:3000/resetPassword/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Redefinição de Senha',
            html: `<h1>Taskify</h1>
            <p>Para redefinir sua senha, clique no link abaixo:</p>
            <a href="${resetURL}">${resetURL}</a>
            <p>Se não foi você que solicitou a recuperação de senha, ignore este e-mail.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao enviar e-mail',
            details: error.message,
        });
    }
}

export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await models.User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await models.user.save();

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao redefinir senha',
            details: error.message,
        });
    }
}

export async function refreshUserToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(401).json({ error: 'Refresh token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET não definido');

        const decoded = jwt.verify(refreshToken, secret);

        const user = await models.User.findOne({
            where: { id: decoded.id, refreshToken },
        });

        if (!user) {
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
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao gerar novo token',
            details: error.message,
        });
    }
}
