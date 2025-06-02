"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fund = fund;
exports.transfer = transfer;
exports.withdraw = withdraw;
exports.getWalletBalance = getWalletBalance;
const db_1 = __importDefault(require("../../lib/db"));
async function fund(req, res, next) {
    const { amount } = req.body;
    const userId = req.userId;
    try {
        await (0, db_1.default)('wallets').where({ user_id: userId }).increment('balance', amount);
        res.json({ message: `Wallet funded with ₦${amount}` });
    }
    catch (err) {
        next(err);
    }
}
async function transfer(req, res, next) {
    const { recipientId, amount } = req.body;
    const senderId = req.userId;
    const trx = await db_1.default.transaction();
    try {
        const sender = await trx('wallets').where({ user_id: senderId }).first();
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
    }
    catch (err) {
        await trx.rollback();
        next(err);
    }
}
async function withdraw(req, res, next) {
    const { amount } = req.body;
    const userId = req.userId;
    const trx = await db_1.default.transaction();
    try {
        const wallet = await trx('wallets').where({ user_id: userId }).first(); // Use trx for querying
        if (!wallet || wallet.balance < amount) {
            await trx.rollback();
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        await trx('wallets').where({ user_id: userId }).decrement('balance', amount);
        await trx.commit();
        res.json({ message: `₦${amount} withdrawn successfully` });
    }
    catch (err) {
        await trx.rollback();
        next(err);
    }
}
async function getWalletBalance(req, res, next) {
    const userId = req.userId;
    try {
        const wallet = await (0, db_1.default)('wallets').where({ user_id: userId }).first();
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance });
    }
    catch (err) {
        next(err);
    }
}
