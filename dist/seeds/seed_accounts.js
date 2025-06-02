export async function seed(knex) {
    const trx = await knex.transaction();
    try {
        await trx('accounts').delete();
        await trx('accounts').insert([
            {
                account_number: '1000000001',
                account_name: 'John Doe',
                bank_name: 'Zenith Bank',
                account_type: 'Savings',
                balance: 45000,
                currency: 'NGN',
                created_at: '2021-06-10 08:30:00',
                status: 'Active',
            },
            {
                account_number: '1000000002',
                account_name: 'Jane Smith',
                bank_name: 'GTBank',
                account_type: 'Current',
                balance: 80000,
                currency: 'NGN',
                created_at: '2020-12-01 10:15:00',
                status: 'Active',
            },
            {
                account_number: '1000000003',
                account_name: 'David Obi',
                bank_name: 'Access Bank',
                account_type: 'Savings',
                balance: 32000,
                currency: 'NGN',
                created_at: '2021-03-25 14:45:00',
                status: 'Active',
            },
            {
                account_number: '1000000004',
                account_name: 'Amaka Johnson',
                bank_name: 'UBA',
                account_type: 'Fixed Deposit',
                balance: 120000,
                currency: 'NGN',
                created_at: '2019-09-05 09:00:00',
                status: 'Dormant',
            },
            {
                account_number: '1000000005',
                account_name: 'Emeka Chukwu',
                bank_name: 'First Bank',
                account_type: 'Savings',
                balance: 27000,
                currency: 'NGN',
                created_at: '2022-01-20 11:00:00',
                status: 'Active',
            },
        ]);
        await trx.commit();
        console.log('Seeding completed successfully.');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        await trx.rollback();
        throw error;
    }
}
