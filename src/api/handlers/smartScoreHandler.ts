import { Request, Response } from 'express';

type RiskProfile = {
    avgMonthlyIncome: number;
    incomeVolatility: number; // as standard deviation
    monthlyExpenses: number;
    overdraftCount90Days: number;
    recurringPayments: {
        type: string;
        frequency: string;
        successRate: number; // 0–1
    }[];
    loanRepayment: number;
    activeLoanAmount: number;
    accountAgeMonths: number;
    numberOfAccounts: number;
};

const mockAnalyzeRisk = async (accessToken: string, accountId: string): Promise<RiskProfile> => {
    // Simulate Open Banking derived data (replace with real Mono/Okra call in production)
    return {
        avgMonthlyIncome: 550000,
        incomeVolatility: 0.1, // Lower is better
        monthlyExpenses: 330000,
        overdraftCount90Days: 1,
        recurringPayments: [
            { type: 'rent', frequency: 'monthly', successRate: 1.0 },
            { type: 'power', frequency: 'monthly', successRate: 0.95 }
        ],
        loanRepayment: 40000,
        activeLoanAmount: 250000,
        accountAgeMonths: 18,
        numberOfAccounts: 2
    };
};

export const calculateSmartScore = async (accessToken: string, accountId: string) => {
    const profile = await mockAnalyzeRisk(accessToken, accountId);

    const {
        avgMonthlyIncome,
        incomeVolatility,
        monthlyExpenses,
        overdraftCount90Days,
        recurringPayments,
        loanRepayment,
        activeLoanAmount,
        accountAgeMonths,
        numberOfAccounts
    } = profile;

    // 🧠 Credit Score Logic

    // 1. Income Stability
    const incomeStabilityScore = Math.max(0, 100 - incomeVolatility * 100); // Lower volatility is better

    // 2. Expense-to-Income Ratio
    const expenseRatio = monthlyExpenses / avgMonthlyIncome;
    const expenseScore =
        expenseRatio <= 0.5 ? 90 : expenseRatio <= 0.75 ? 75 : expenseRatio <= 1 ? 55 : 35;

    // 3. Recurring Payment Success
    const avgSuccess =
        recurringPayments.reduce((acc, p) => acc + p.successRate, 0) / (recurringPayments.length || 1);
    const recurringScore = avgSuccess >= 0.95 ? 90 : avgSuccess >= 0.85 ? 75 : 60;

    // 4. Overdraft Behavior
    const overdraftScore = overdraftCount90Days === 0 ? 90 : overdraftCount90Days <= 2 ? 70 : 50;

    // 5. Loan Repayment Behavior
    const debtToIncome = loanRepayment / avgMonthlyIncome;
    const loanScore =
        debtToIncome <= 0.2 ? 85 : debtToIncome <= 0.35 ? 70 : debtToIncome <= 0.5 ? 55 : 35;

    // 6. Account Profile
    const ageScore = accountAgeMonths >= 24 ? 90 : accountAgeMonths >= 12 ? 75 : 50;
    const diversityBonus = numberOfAccounts > 1 ? 10 : 0;
    const accountProfileScore = ageScore + diversityBonus;

    // 🔢 Final Weighted Score (like FICO)
    const finalRawScore =
        incomeStabilityScore * 0.25 +
        expenseScore * 0.2 +
        recurringScore * 0.2 +
        overdraftScore * 0.1 +
        loanScore * 0.15 +
        accountProfileScore * 0.1;

    const compositeScore = Math.round(300 + finalRawScore * 5.5);

    const riskLevel =
        compositeScore >= 700 ? 'low' : compositeScore >= 600 ? 'moderate' : 'high';

    return {
        compositeScore,
        riskLevel,
        breakdown: {
            incomeStabilityScore: Math.round(incomeStabilityScore),
            expenseScore: Math.round(expenseScore),
            recurringScore: Math.round(recurringScore),
            overdraftScore: Math.round(overdraftScore),
            loanScore: Math.round(loanScore),
            accountProfileScore: Math.round(accountProfileScore)
        }
    };
};

export const smartScoreHandler = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { accountId } = req.params;

    try {
        const result = await calculateSmartScore(token, accountId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Smart scoring failed', details: err });
    }
};
