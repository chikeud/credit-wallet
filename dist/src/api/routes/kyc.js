import { Router } from 'express';
import { verifyHandler } from '../handlers/kycHandler';
const router = Router();
router.post('/verify', verifyHandler);
export default router;
