import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import listRoutes from './routes/listRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/lists', listRoutes);
app.use('/tasks', taskRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
