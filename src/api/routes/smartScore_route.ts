// routes/smartScoreRouter.ts
import { Router, RequestHandler, Request } from 'express';
import { smartScoreHandler } from '../handlers/smartScoreHandler';

const creditScoreRouter = Router();

// GET route with accountId as a URL param
creditScoreRouter.get('/:bvn', smartScoreHandler as RequestHandler);

export default creditScoreRouter;
