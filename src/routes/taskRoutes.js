import express from 'express';
import { getTasks, createTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:lista_id', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);

export default router;
