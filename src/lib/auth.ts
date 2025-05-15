import { Request, Response, NextFunction } from 'express';


export const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if ( token != null ) {
        if (token?.startsWith('user-')) {
            const userId = parseInt(token.split('-')[1]);
            req.userId = userId;
            next();
        }

    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

