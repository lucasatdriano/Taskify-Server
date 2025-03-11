import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dotenv from 'dotenv';

import { setupSwagger } from './config/swagger.js';
import syncDatabase from './config/sync.js';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listRoutes from './routes/listRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/lists', listRoutes);
app.use('/tasks', taskRoutes);

setupSwagger(app);
syncDatabase();

const PORT = process.env.PORT;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('🛜  Conectado ao banco de dados com sucesso!');
        console.log('🚀 Servidor rodando em http://localhost:3000');
        console.log('📄 Documentação Swagger: http://localhost:3000/api-docs');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados: ', err);
    }
});
