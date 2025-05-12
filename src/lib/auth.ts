import { Request, Response, NextFunction } from 'express';


export const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token === 'mock-token') {
        req.userId = '1';
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

