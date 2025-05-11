
import { Request, Response, NextFunction } from 'express';
import {checkBlacklist} from "../../lib/karma";

export async function registerUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { name, email, phone } = req.body;
        console.log(name);
        const blacklisted = await checkBlacklist(email);
        //console.log(blacklisted);
        //if (blacklisted) {
        //    return res.status(403).json({ error: 'User is blacklisted.' });
       // }

        // Example logic...
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        next(err);
    }
}
