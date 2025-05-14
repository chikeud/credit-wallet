import { Request, Response, NextFunction } from 'express';
import { User } from '../../types/user';
import bcrypt from 'bcryptjs';
import db from '../../lib/db';
import { checkBlacklist } from '../../lib/karma';


export async function registerUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    try {
        const blacklisted = await checkBlacklist(email);
        if (blacklisted) {
            return res.status(403).json({ error: 'User is blacklisted.' });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create a user object (id is optional because it's auto-generated)
        const newUser: Omit<User, 'id'> = { name, email, password_hash };

        const [userId] = await db('users').insert(newUser);

        await db('wallets').insert({ user_id: userId, balance: 0 });

        return res.status(201).json({ userId, message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
}


export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
        const user: User | undefined = await db<User>('users').where({ email }).first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const authorized = await bcrypt.compare(password, user.password_hash);
        const token = 'user-' + user.id;

        if (!authorized) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        return res.status(201).json({ token, message: 'User logged In!' });
    } catch (err) {
        next(err);
    }
}