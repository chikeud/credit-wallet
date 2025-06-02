import { Router } from 'express';
import { handleRisk } from '../handlers/riskHandler';
const router = Router();
router.get('/:accountId', handleRisk);
export default router;
