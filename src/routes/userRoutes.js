import express from 'express';
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
router.get('/:userId', getUserById);
router.put('/:userId/user', updateUser);
router.post('/:userId/logout', logoutUser);

export default router;
