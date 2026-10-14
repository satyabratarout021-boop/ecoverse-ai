import express from 'express';
import { askEcoAI } from '../controllers/aiController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', optionalAuthenticate, askEcoAI);

export default router;
