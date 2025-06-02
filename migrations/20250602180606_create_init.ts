import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('identities', (table) => {
        table.integer('id').primary();
        table.json('applicant').notNullable();
        table.json('summary').notNullable();
        table.json('status').notNullable();
        table.json('bvn').notNullable();
    });

    await knex.schema.createTable('accounts', (table) => {
        table.increments('id').primary();
        table.string('account_number').notNullable().unique();
        table.string('account_name').notNullable();
        table.string('bank_name').notNullable();
        table.enu('account_type', ['Savings', 'Current', 'Domiciliary', 'Fixed Deposit']).notNullable();
        table.decimal('balance', 14, 2).notNullable().defaultTo(0.00);
        table.enu('currency', ['NGN', 'USD', 'GBP']).notNullable().defaultTo('NGN');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.enu('status', ['Active', 'Dormant', 'Closed']).notNullable().defaultTo('Active');
    });

    await knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.string('account_number').notNullable().references('account_number').inTable('accounts').onDelete('CASCADE');
        table.decimal('amount', 14, 2).notNullable();
        table.string('channel').notNullable();
        table.string('authorization_token');
        table.string('transaction_type').notNullable();
        table.enu('debit_credit', ['DEBIT', 'CREDIT']).notNullable();
        table.string('narration').notNullable();
        table.string('reference').notNullable();
        table.timestamp('transaction_time').notNullable();
        table.date('value_date').notNullable();
        table.decimal('balance_after', 14, 2).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
    await knex.schema.dropTableIfExists('accounts');
    await knex.schema.dropTableIfExists('identities');
}
