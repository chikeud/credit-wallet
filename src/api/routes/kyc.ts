import  {Router, RequestHandler} from 'express';
import {  verifyHandler } from '../handlers/kycHandler';

const router = Router();

router.post('/verify', verifyHandler as RequestHandler);

export default router;
