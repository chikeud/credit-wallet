// src/types/auth.ts
import { Request } from 'express';

export interface AuthedRequest extends Request {
    userId: number;
}
