import { analyzeRisk } from './riskHandler';

export const calculateScore = async (accessToken: string, accountId: string) => {
    const risk = await analyzeRisk(accessToken, accountId);
    const incomeScore = Math.min(risk.totalCredits / 500000, 1) * 25; // full score if > 500k
    const disposableIncomeScore = Math.min(risk.disposableIncomeRatio, 1) * 25; // full score if 100% surplus

    const gamblingPenalty = risk.gamblingTxCount === 0 ? 20 : risk.gamblingTxCount <= 2 ? 10 : 0;
    const largeCashPenalty = risk.largeCashCreditsCount === 0 ? 15 : risk.largeCashCreditsCount <= 2 ? 10 : 5;
    const reversalPenalty = risk.reversalsCount === 0 ? 15 : risk.reversalsCount <= 2 ? 10 : 5;


    const totalScore =
        incomeScore +
        disposableIncomeScore +
        gamblingPenalty +
        largeCashPenalty +
        reversalPenalty;

    //console.log(largeCashPenalty);

    const scoreBreakdown = {
        incomeScore,
        disposableIncomeScore,
        gamblingPenalty,
        largeCashPenalty,
        reversalPenalty
    };

    //const totalScore = Object.values(scoreBreakdown).reduce((sum, v) => sum + v, 50); // Base 50

    return {
        score: parseFloat(Math.max(0, Math.min(100, totalScore)).toFixed(2)),
        breakdown: scoreBreakdown,
    };
};
export const scoringHandler = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer-')) {
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
