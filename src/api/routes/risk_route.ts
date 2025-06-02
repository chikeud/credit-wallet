import { Router, RequestHandler} from 'express';
import { handleRisk } from '../handlers/riskHandler';

const riskRouter = Router();

riskRouter.get('/:accountId', handleRisk as RequestHandler);

export default riskRouter;