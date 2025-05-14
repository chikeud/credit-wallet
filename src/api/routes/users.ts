import {RequestHandler, Router} from 'express';
import { registerUser, login } from '../handlers/userHandler';

const router = Router();

router.post('/register', registerUser as RequestHandler);
router.post('/login', login as RequestHandler);

export default router;
