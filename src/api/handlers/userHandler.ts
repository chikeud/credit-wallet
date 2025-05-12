import { Request, Response, NextFunction } from 'express';
import db from '../../lib/db';
import { checkBlacklist } from '../../lib/karma';

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, email } = req.body;

    try {
        const blacklisted = await checkBlacklist(email);
        if (blacklisted) {
            return res.status(403).json({ error: 'User is blacklisted.' });
        }

        const [userId] = await db('users').insert({ name, email});
        await db('wallets').insert({ user_id: userId, balance: 0 });

        return res.status(201).json({ userId, message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
}
