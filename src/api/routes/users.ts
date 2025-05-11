import { Router } from 'express';
import { registerUser } from '../handlers/anotherOne';
import { fakeAuth } from "../../lib/auth";

const router = Router();

router.post('/register', registerUser);

export default router;
