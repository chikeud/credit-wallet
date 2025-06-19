import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const trx = await knex.transaction();

    try {
        await trx('risk_profiles').delete();

        await trx('risk_profiles').insert([
            {
                bvn: '95888168924', // Bunch Dillon
                avg_monthly_income: 550000,
                income_volatility: 0.1,
                monthly_expenses: 330000,
                overdraft_count_90_days: 1,
                recurring_payments: JSON.stringify([
                    { type: 'rent', frequency: 'monthly', successRate: 1.0 },
                    { type: 'power', frequency: 'monthly', successRate: 0.95 }
                ]),
                loan_repayment: 40000,
                active_loan_amount: 250000,
                account_age_months: 18,
                number_of_accounts: 2
            },
            {
                bvn: '84736291847', // Alice Johnson
                avg_monthly_income: 200000,
                income_volatility: 0.3,
                monthly_expenses: 180000,
                overdraft_count_90_days: 2,
                recurring_payments: JSON.stringify([
                    { type: 'internet', frequency: 'monthly', successRate: 0.85 }
                ]),
                loan_repayment: 30000,
                active_loan_amount: 120000,
                account_age_months: 8,
                number_of_accounts: 1
            },
            {
                bvn: '93847561029', // Carlos Smith
                avg_monthly_income: 350000,
                income_volatility: 0.2,
                monthly_expenses: 250000,
                overdraft_count_90_days: 1,
                recurring_payments: JSON.stringify([
                    { type: 'power', frequency: 'monthly', successRate: 0.92 },
                    { type: 'DSTV', frequency: 'monthly', successRate: 0.9 }
                ]),
                loan_repayment: 25000,
                active_loan_amount: 90000,
                account_age_months: 14,
                number_of_accounts: 1
            },
            {
                bvn: '10293847566', // Diana Brown
                avg_monthly_income: 600000,
                income_volatility: 0.08,
                monthly_expenses: 320000,
                overdraft_count_90_days: 0,
                recurring_payments: JSON.stringify([
                    { type: 'rent', frequency: 'monthly', successRate: 1.0 },
                    { type: 'power', frequency: 'monthly', successRate: 1.0 }
                ]),
                loan_repayment: 50000,
                active_loan_amount: 300000,
                account_age_months: 26,
                number_of_accounts: 3
            },
            {
                bvn: '56473829102', // Ethan Williams
                avg_monthly_income: 180000,
                income_volatility: 0.4,
                monthly_expenses: 190000,
                overdraft_count_90_days: 3,
                recurring_payments: JSON.stringify([
                    { type: 'internet', frequency: 'monthly', successRate: 0.6 }
                ]),
                loan_repayment: 20000,
                active_loan_amount: 60000,
                account_age_months: 6,
                number_of_accounts: 1
            }
        ]);

        await trx.commit();
        console.log('Risk profiles seeded successfully.');
    } catch (error) {
        console.error('Error seeding risk profiles:', error);
        await trx.rollback();
        throw error;
    }
}
