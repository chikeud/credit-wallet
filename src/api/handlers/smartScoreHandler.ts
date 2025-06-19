import { Request, Response } from 'express';
import db from "../../lib/db";

type RiskProfile = {
    avg_monthly_income: number;
    income_volatility: number; // as standard deviation
    monthly_expenses: number;
    overdraft_count_90_days: number;
    recurring_payments: {
        type: string;
        frequency: string;
        successRate: number; // 0–1
    }[];
    loan_repayment: number;
    activeLoanAmount: number;
    account_age_months: number;
   number_of_accounts: number;
};

const mockAnalyzeRisk = async (accessToken: string, accountId: string): Promise<RiskProfile> => {
    // Simulate Open Banking derived data (replace with real Mono/Okra call in production)
    return {
        avg_monthly_income: 550000,
        income_volatility: 0.1, // Lower is better
        monthly_expenses: 330000,
        overdraft_count_90_days: 1,
        recurring_payments: [
            { type: 'rent', frequency: 'monthly', successRate: 1.0 },
            { type: 'power', frequency: 'monthly', successRate: 0.95 }
        ],
        loan_repayment: 40000,
        activeLoanAmount: 250000,
        account_age_months: 18,
       number_of_accounts: 2
    };
};

export const calculateSmartScore = async (accessToken: string, bvn: string) => {
    //const profile = await mockAnalyzeRisk(accessToken, accountId);
    const profile = await db('risk_profiles')
        .where('bvn', bvn);

    const {
        avg_monthly_income,
        income_volatility,
        monthly_expenses,
        overdraft_count_90_days,
        recurring_payments,
        loan_repayment,
        active_loan_amount,
        account_age_months,
       number_of_accounts
    } = profile[0];

    // 🧠 Credit Score Logic

    // 1. Income Stability
    const incomeStabilityScore = Math.max(0, 100 - income_volatility * 100); // Lower volatility is better

    // 2. Expense-to-Income Ratio
    const expenseRatio = monthly_expenses / avg_monthly_income;
    const expenseScore =
        expenseRatio <= 0.5 ? 90 : expenseRatio <= 0.75 ? 75 : expenseRatio <= 1 ? 55 : 35;

    // 3. Recurring Payment Success
    const avgSuccess =
        recurring_payments.reduce((acc, p) => acc + p.successRate, 0) / (recurring_payments.length || 1);
    const recurringScore = avgSuccess >= 0.95 ? 90 : avgSuccess >= 0.85 ? 75 : 60;

    // 4. Overdraft Behavior
    const overdraftScore = overdraft_count_90_days === 0 ? 90 : overdraft_count_90_days <= 2 ? 70 : 50;

    // 5. Loan Repayment Behavior
    const debtToIncome = loan_repayment / avg_monthly_income;
    const loanScore =
        debtToIncome <= 0.2 ? 85 : debtToIncome <= 0.35 ? 70 : debtToIncome <= 0.5 ? 55 : 35;

    // 6. Account Profile
    const ageScore = account_age_months >= 24 ? 90 : account_age_months >= 12 ? 75 : 50;
    const diversityBonus =number_of_accounts > 1 ? 10 : 0;
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
    const { bvn } = req.params;

    try {
        const result = await calculateSmartScore(token, bvn);
        res.json(result);
    } catch (err) {
        //res.json(err);
        res.status(500).json({ error: 'Smart scoring failed', details: err });
    }
};
