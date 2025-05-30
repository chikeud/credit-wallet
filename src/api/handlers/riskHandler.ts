import openBankingClient from '../clients/openBankingClient';
import db from "../../lib/db";
import { Transaction } from "../../types/transaction";

export const analyzeRisk = async (accessToken: string, accountId: string) => {
    //const transactions = await openBankingClient.getTransactions(accessToken, accountId);

    const transactions = await db('transactions')
        .where('account_number', accountId) as Transaction[];

    //console.log(transactions);


    const gamblingTx = transactions.filter((t: any) =>
        t.narration?.toLowerCase().includes('bet')
        //|| t.description?.toLowerCase().includes('bet')
    );

    const largeCashCredits = transactions.filter((t: any) =>
        t.amount > 500000 && t.debit_credit === 'CREDIT'
    );

    const reversals = transactions.filter((t: any) =>
        t.narration?.toLowerCase().includes('reversal')
    );

    const incomeTx = transactions
        .filter((t: any) => t.debit_credit === 'CREDIT' && t.amount > 20000)
        .map((t: any) => t.amount);

    const totalCredits = incomeTx.reduce((a: number, b: any) => a + Number(b), 0);
    const totalDebits = transactions
        .filter((t: any) => t.debit_credit === 'DEBIT')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    return {
        totalCredits,
        totalDebits,
        gamblingTxCount: gamblingTx.length,
        largeCashCreditsCount: largeCashCredits.length,
        reversalsCount: reversals.length,
        disposableIncomeRatio: (totalCredits - totalDebits) / totalCredits,
    };
};

export const handleRisk = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer-')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split('-')[1];
    const { accountId } = req.params;
    //console.log("i got it !!", typeof accountId);

    try {
        const result = await analyzeRisk(token!, accountId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Risk analysis failed', details: err });
    }
};

