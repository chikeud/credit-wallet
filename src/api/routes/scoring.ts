import express, {Request, Router, Response, RequestHandler} from 'express';
import {scoringHandler} from "../handlers/scoringHandler";

const router = Router();

router.get('/:accountId', scoringHandler);

export default router;
