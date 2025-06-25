import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const trx = await knex.transaction();

    try {
        await trx('credit_builder_loans').delete();

        await trx('credit_builder_loans').insert([
            {
                bvn: '95888168924', // Bunch Dillon
                borrowed_amount: 100000,
                due_date: '2025-08-01',
                repaid: true,
                repaid_date: '2025-06-15',
            },
            {
                bvn: '84736291847', // Alice Johnson
                borrowed_amount: 50000,
                due_date: '2025-07-15',
                repaid: false,
                repaid_date: null,
            },
            {
                bvn: '93847561029', // Carlos Smith
                borrowed_amount: 75000,
                due_date: '2025-07-30',
                repaid: true,
                repaid_date: '2025-06-20',
            },
            {
                bvn: '10293847566', // Diana Brown
                borrowed_amount: 150000,
                due_date: '2025-09-10',
                repaid: false,
                repaid_date: null,
            },
            {
                bvn: '56473829102', // Ethan Williams
                borrowed_amount: 30000,
                due_date: '2025-07-01',
                repaid: false,
                repaid_date: null,
            }
        ]);

        await trx.commit();
        console.log('Credit builder loans seeded successfully.');
    } catch (error) {
        console.error('Error seeding credit builder loans:', error);
        await trx.rollback();
        throw error;
    }
}
