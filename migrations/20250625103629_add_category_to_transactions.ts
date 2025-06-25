import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {




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
        table.string('category');
        table.timestamp('transaction_time').notNullable();
        table.date('value_date').notNullable();
        table.decimal('balance_after', 14, 2).notNullable();
    });


}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}