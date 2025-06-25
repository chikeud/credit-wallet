// routes/pfm.ts

import express from 'express';
import db from '../../lib/db'; // your Knex instance
const router = express.Router();

// Create savings plan
router.post('/savings', async (req, res) => {
    const { bvn, goal_amount, target_date } = req.body;
    try {
        await db('saving_plans').insert({
            bvn,
            goal_amount,
            target_date
        });
        res.status(201).json({ message: 'Plan created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create savings plan' });
    }
});

// Create credit builder loan
router.post('/credit-builder', async (req, res) => {
    const { bvn, borrowed_amount } = req.body;
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    try {
        await db('credit_builder_loans').insert({
            bvn,
            borrowed_amount,
            due_date: dueDate
        });
        res.status(201).json({ message: 'Loan created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create loan' });
    }
});

// Mark loan as repaid
router.post('/credit-builder/:id/repay', async (req, res) => {
    const { id } = req.params;
    try {
        await db('credit_builder_loans')
            .where({ id })
            .update({
                repaid: true,
                repaid_date: new Date()
            });
        res.status(200).json({ message: 'Loan repaid' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to mark as repaid' });
    }
});

// Fetch PFM data
router.get('/:bvn', async (req, res) => {
    const { bvn } = req.params;

    try {
        const plan = await db('saving_plans').where({ bvn }).first();
        const loans = await db('credit_builder_loans').where({ bvn });

        const transactions = await db('transactions')
            .select('category', db.raw('SUM(amount) as amount'))
            .where({ bvn })
            .andWhere('type', 'debit')
            //.andWhereBetween('date', [db.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'), db.fn.now()])
            .groupBy('category');

        const category_spend = transactions.map(row => ({
            category: row.category,
            amount: parseFloat(row.amount)
        }));

        res.json({
            plan: plan || null,
            loans: loans || [],
            category_spend
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

export default router;
