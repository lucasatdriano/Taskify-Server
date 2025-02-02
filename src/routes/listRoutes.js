import express from 'express';
import {
    getUserLists,
    getUserListById,
    createUserList,
    updateUserList,
    deleteUserList,
} from '../controllers/listController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, getUserLists);
router.get('/:listId', authenticateUser, getUserListById);
router.post('/', authenticateUser, createUserList);
router.put('/:listId', authenticateUser, updateUserList);
router.delete('/:listId', authenticateUser, deleteUserList);

export default router;
