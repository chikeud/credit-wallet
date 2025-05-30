import { Router, RequestHandler} from 'express';
import { handleRisk } from '../handlers/riskHandler';

const router = Router();

router.get('/:accountId', handleRisk as RequestHandler);

export default router;
