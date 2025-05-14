
import { RequestHandler, Router} from 'express';
import { getWalletBalance, fund, withdraw, transfer } from '../handlers/walletHandler';
import { fakeAuth } from '../../lib/auth';

const router = Router();

router.use(fakeAuth);

router.get('/balance',  getWalletBalance as RequestHandler);
router.post('/fund', fund as RequestHandler);
router.post('/transfer', transfer as RequestHandler);
router.post('/withdraw', withdraw as RequestHandler);

export default router;
