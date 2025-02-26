import express from 'express';
import {
    forgotPassword,
    refreshUserToken,
    resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword', resetPassword);
router.post('/refreshToken', refreshUserToken);

export default router;
