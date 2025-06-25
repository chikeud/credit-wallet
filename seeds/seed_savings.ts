import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const trx = await knex.transaction();

    try {
        await trx('saving_plans').delete();

        await trx('saving_plans').insert([
            {
                bvn: '95888168924', // Bunch Dillon
                goal_amount: 500000,
                saved_amount: 150000,
                target_date: '2025-12-31',
            },
            {
                bvn: '84736291847', // Alice Johnson
                goal_amount: 200000,
                saved_amount: 80000,
                target_date: '2025-09-01',
            },
            {
                bvn: '93847561029', // Carlos Smith
                goal_amount: 300000,
                saved_amount: 220000,
                target_date: '2025-10-15',
            },
            {
                bvn: '10293847566', // Diana Brown
                goal_amount: 1000000,
                saved_amount: 600000,
                target_date: '2026-06-01',
            },
            {
                bvn: '56473829102', // Ethan Williams
                goal_amount: 150000,
                saved_amount: 20000,
                target_date: '2025-08-01',
            }
        ]);

        await trx.commit();
        console.log('Saving plans seeded successfully.');
    } catch (error) {
        console.error('Error seeding saving plans:', error);
        await trx.rollback();
        throw error;
    }
}
