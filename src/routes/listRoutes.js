import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    getUserLists,
    getUserListById,
    createUserList,
    updateUserList,
    deleteUserList,
} from '../controllers/listController.js';

const router = express.Router();

router.get('/', authMiddleware, getUserLists);
router.get('/:listId', authMiddleware, getUserListById);
router.post('/', authMiddleware, createUserList);
router.put('/:listId', authMiddleware, updateUserList);
router.delete('/:listId', authMiddleware, deleteUserList);

export default router;
