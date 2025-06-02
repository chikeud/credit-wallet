import  {Router, RequestHandler} from 'express';
import {  verifyHandler } from '../handlers/kycHandler';

const kycRouter = Router();

kycRouter.post('/verify', verifyHandler as RequestHandler);

export default kycRouter;