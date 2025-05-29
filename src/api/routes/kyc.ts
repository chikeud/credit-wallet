import express, {Request, Router, Response, RequestHandler} from 'express';
import { verifyIdentity, verifyHandler} from '../handlers/kycHandler';

const router = Router();

router.get('/verify', verifyHandler as RequestHandler);

export default router;
