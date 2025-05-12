import {RequestHandler, Router} from 'express';
import { registerUser } from '../handlers/userHandler';

const router = Router();

router.post('/register', registerUser as RequestHandler);

export default router;
