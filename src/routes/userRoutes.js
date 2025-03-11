import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    registerUser,
    Login,
    getUserById,
    updateUser,
    logoutUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', Login);
router.get('/:userId', authMiddleware, getUserById);
router.put('/:userId/user', authMiddleware, updateUser);
router.post('/:userId/logout', authMiddleware, logoutUser);

export default router;
