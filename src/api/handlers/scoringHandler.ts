import { analyzeRisk } from './riskHandler';

export const calculateScore = async (accessToken: string, accountId: string) => {
    const risk = await analyzeRisk(accessToken, accountId);

    const scoreBreakdown = {
        incomeScore: risk.totalCredits > 300000 ? 20 : 10,
        disposableIncomeScore: risk.disposableIncomeRatio > 0.3 ? 20 : 10,
        gamblingPenalty: risk.gamblingTxCount > 0 ? -10 : 0,
        largeCashPenalty: risk.largeCashCreditsCount > 2 ? -10 : 0,
        reversalPenalty: risk.reversalsCount > 2 ? -5 : 0,
    };

    const totalScore = Object.values(scoreBreakdown).reduce((sum, v) => sum + v, 50); // Base 50

    return {
        score: Math.max(0, Math.min(100, totalScore)),
        breakdown: scoreBreakdown,
    };
};
export const scoringHandler = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { accountId } = req.params;

    try {
        const score = await calculateScore(token!, accountId);
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: 'Scoring failed', details: err });
    }
}
