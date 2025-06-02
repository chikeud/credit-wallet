import  { Router, RequestHandler} from 'express';
import {scoringHandler} from "../handlers/scoringHandler";

const scoringRouter = Router();

scoringRouter.get('/:accountId', scoringHandler as RequestHandler);

export default scoringRouter;
