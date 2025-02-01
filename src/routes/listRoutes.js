import express from 'express';
import { getLists, createList } from '../controllers/listController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getLists);
router.post('/', authMiddleware, createList);

export default router;
