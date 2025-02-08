import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    console.log('Cabeçalho Authorization:', req.header('Authorization'));

    const jwtToken = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token recebido:', jwtToken);

    if (!jwtToken) {
        return res
            .status(401)
            .json({ erro: 'Token não encontrado ou inválido.' });
    }

    try {
        const decodedData = jwt.verify(jwtToken, process.env.JWT_SECRET);
        console.log('Token decodificado:', decodedData);
        req.authenticatedUser = decodedData;
        next();
    } catch (error) {
        res.status(401).json({ erro: 'Token inválido.' });
    }
}
