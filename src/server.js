import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { setupSwagger } from './config/swagger.js';
import listRoutes from './routes/listRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/users', userRoutes);
app.use('/lists', listRoutes);
app.use('/tasks', taskRoutes);

setupSwagger(app);

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📄 Swagger Docs: http://localhost:3000/api-docs');
});
