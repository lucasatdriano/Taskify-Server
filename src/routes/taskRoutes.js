import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    getTasksByList,
    getTaskById,
    getPlannedTasks,
    getImportantTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/:listId', authMiddleware, getTasksByList);
router.get('/:listId/:taskId', authMiddleware, getTaskById);
router.get('/planned/:userId', authMiddleware, getPlannedTasks);
router.get('/important/:userId', authMiddleware, getImportantTasks);
router.post('/:listId', authMiddleware, createTask);
router.put('/:listId/:taskId', authMiddleware, updateTask);
router.delete('/:listId/:taskId', authMiddleware, deleteTask);

export default router;
