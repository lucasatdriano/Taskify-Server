import express from 'express';
import {
    registerUser,
    Login,
    getUserById,
    updateUserName,
    updateUserPassword,
    refreshUserToken,
    logoutUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', Login);
router.get('/:userId', getUserById);
router.put('/:userId/name', updateUserName);
router.put('/:userId/password', updateUserPassword);
router.post('/refreshToken', refreshUserToken);
router.post('/:userId/logout', logoutUser);

export default router;
