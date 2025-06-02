"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRisk = exports.analyzeRisk = void 0;
const db_1 = __importDefault(require("../../lib/db"));
const analyzeRisk = async (accessToken, accountId) => {
    //const transactions = await openBankingClient.getTransactions(accessToken, accountId);
    const transactions = await (0, db_1.default)('transactions')
        .where('account_number', accountId);
    //console.log(transactions);
    const gamblingTx = transactions.filter((t) => t.narration?.toLowerCase().includes('bet')
    //|| t.description?.toLowerCase().includes('bet')
    );
    const largeCashCredits = transactions.filter((t) => t.amount > 500000 && t.debit_credit === 'CREDIT');
    const reversals = transactions.filter((t) => t.narration?.toLowerCase().includes('reversal'));
    const incomeTx = transactions
        .filter((t) => t.debit_credit === 'CREDIT' && t.amount > 20000)
        .map((t) => t.amount);
    const totalCredits = incomeTx.reduce((a, b) => a + Number(b), 0);
    const totalDebits = transactions
        .filter((t) => t.debit_credit === 'DEBIT')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
        totalCredits,
        totalDebits,
        gamblingTxCount: gamblingTx.length,
        largeCashCreditsCount: largeCashCredits.length,
        reversalsCount: reversals.length,
        disposableIncomeRatio: (totalCredits - totalDebits) / totalCredits,
    };
};
exports.analyzeRisk = analyzeRisk;
const handleRisk = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer-')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split('-')[1];
    const { accountId } = req.params;
    //console.log("i got it !!", typeof accountId);
    try {
        const result = await (0, exports.analyzeRisk)(token, accountId);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Risk analysis failed', details: err });
    }
};
exports.handleRisk = handleRisk;
