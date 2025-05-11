import { Request, Response, NextFunction } from 'express';
import { AuthedRequest } from "../types/auth";

export function fakeAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('user-')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(token.split('-')[1]);
    if (isNaN(userId)) return res.status(401).json({ error: 'Invalid token' });

    (req as any).userId = userId;
    next();
}
