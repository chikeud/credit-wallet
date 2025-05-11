
import { Router } from 'express';
import { getWalletBalance } from '../handlers/walletHandler';
import { fakeAuth } from '../../lib/auth';

const router = Router();

//router.get('/balance', fakeAuth, getWalletBalance);

export default router;
