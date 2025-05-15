import { Request, Response, NextFunction } from 'express';
import db from '../../lib/db';
import { Wallet } from '../../types/wallet';


export async function fund(req: Request, res: Response, next: NextFunction) {
    const { amount } = req.body;
    const userId: number = req.userId;

    try {
        await db('wallets').where({ user_id: userId }).increment('balance', amount);
        res.json({ message: `Wallet funded with ₦${amount}` });
    } catch (err) {
        next(err);
    }
}

export async function transfer(req: Request, res: Response, next: NextFunction) {
    const { recipientId, amount } = req.body;
    const senderId = req.userId;

    const trx = await db.transaction();

    try {
        const sender = await trx('wallets').where({ user_id: senderId }).first() as Wallet;
        if (!sender || sender.balance < amount) {
            await trx.rollback();
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const recipient = await trx('wallets').where({ user_id: recipientId }).first();
        if (!recipient) {
            await trx.rollback();
            return res.status(404).json({ error: 'Recipient not found' });
        }

        await trx('wallets').where({ user_id: senderId }).decrement('balance', amount);
        await trx('wallets').where({ user_id: recipientId }).increment('balance', amount);

        await trx.commit();
        res.json({ message: 'Transfer successful' });
    } catch (err) {
        await trx.rollback();
        next(err);
    }
}

export async function withdraw(req: Request, res: Response, next: NextFunction) {
    const { amount } = req.body;
    const userId = req.userId;

    const trx = await db.transaction();
    try {
        const wallet = await trx('wallets').where({ user_id: userId }).first() as Wallet;  // Use trx for querying
        if (!wallet || wallet.balance < amount) {
            await trx.rollback();
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        await trx('wallets').where({ user_id: userId }).decrement('balance', amount);
        await trx.commit();

        res.json({ message: `₦${amount} withdrawn successfully` });
    } catch (err) {
        await trx.rollback();
        next(err);
    }
}



export async function getWalletBalance(req: Request, res: Response, next: NextFunction) {
    const userId = req.userId;

    try {
        const wallet = await db('wallets').where({ user_id: userId }).first() as Wallet;

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json({ balance: wallet.balance });
    } catch (err) {
        next(err);
    }
}
