import openBankingClient from '../clients/openBankingClient';

export const analyzeRisk = async (accessToken: string, accountId: string) => {
    const transactions = await openBankingClient.getTransactions(accessToken, accountId);

    const gamblingTx = transactions.filter((t: any) =>
        t.merchant?.toLowerCase().includes('bet') || t.description?.toLowerCase().includes('bet')
    );

    const largeCashCredits = transactions.filter((t: any) =>
        t.amount > 500000 && t.type === 'credit'
    );

    const reversals = transactions.filter((t: any) =>
        t.description?.toLowerCase().includes('reversal')
    );

    const incomeTx = transactions
        .filter((t: any) => t.type === 'credit' && t.amount > 20000)
        .map((t: any) => t.amount);

    const totalCredits = incomeTx.reduce((a: number, b: number) => a + b, 0);
    const totalDebits = transactions
        .filter((t: any) => t.type === 'debit')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

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

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { accountId } = req.params;

    try {
        const result = await analyzeRisk(token!, accountId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Risk analysis failed', details: err });
    }
};

