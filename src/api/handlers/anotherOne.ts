
import { Request, Response, NextFunction } from 'express';

export async function registerUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { name, email, phone } = req.body;
        console.log(name);

        // Example logic...
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        next(err);
    }
}
