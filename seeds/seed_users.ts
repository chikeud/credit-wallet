import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Start a transaction for users and wallets insertion
    const trx = await knex.transaction();

    try {
        // Delete all existing data in both tables to avoid conflicts
        await trx('wallets').delete();
        await trx('users').delete();

        // Insert users
        await trx('users').insert([
            { name: 'Richard Magnus', email: 'richard.magnus@example.com', password_hash: 'password123' },
            { name: 'Janet Magnus', email: 'janete.magnus@example.com', password_hash: 'password123' },
            { name: 'Podi Jones', email: 'podijonz@gmail.com', password_hash: 'password123' },
            { name: 'Johnny Bravo', email: 'Jbrav@example.com', password_hash: 'password123' }
        ]);

        // Fetch the ids of the inserted users after commit
        const users = await trx('users').select('id');  // Collect the inserted user ids

        // Commit the transaction after users are successfully inserted
        await trx.commit();

        // Now use the user ids for wallet insertion
        await knex('wallets').insert([
            { user_id: users[0].id, balance: 100.00 }, // Richard Magnus
            { user_id: users[1].id, balance: 50.00 },  // Janet Magnus
            { user_id: users[2].id, balance: 1000000.00 }, // Podi Jones
            { user_id: users[3].id, balance: 50.00 }   // Johnny Bravo
        ]);

        console.log('Seeding completed successfully.');

    } catch (error) {
        // Rollback if any errors occur
        console.error('Error during seeding:', error);
        await trx.rollback();
        throw error;
    }
}
