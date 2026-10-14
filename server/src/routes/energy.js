import express from 'express';
import { getEnergyTelemetry } from '../controllers/energyController.js';

const router = express.Router();

router.get('/telemetry', getEnergyTelemetry);

export default router;
