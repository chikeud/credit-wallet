import { Router } from 'express';
import { registerUser } from '../handlers/anotherOne';

const router = Router();

router.post('/register', registerUser);

export default router;
