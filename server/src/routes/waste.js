import express from 'express';
import { classifyWasteImage, getWasteHotspots } from '../controllers/wasteController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/classify', optionalAuthenticate, classifyWasteImage);
router.get('/hotspots', getWasteHotspots);

export default router;
