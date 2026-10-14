import express from 'express';
import { getWaterTelemetry } from '../controllers/waterController.js';

const router = express.Router();

router.get('/telemetry', getWaterTelemetry);

export default router;
