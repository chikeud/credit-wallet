import  { Router, RequestHandler} from 'express';
import {scoringHandler} from "../handlers/scoringHandler";

const router = Router();

router.get('/:accountId', scoringHandler as RequestHandler);

export default router;
