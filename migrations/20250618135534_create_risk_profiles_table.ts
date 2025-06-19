import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('risk_profiles', (table) => {
        table.increments('id').primary();
        table.string('bvn').notNullable();
        table.integer('account_age_months').notNullable();
        table.decimal('avg_monthly_income', 14, 2).notNullable();
        table.decimal('monthly_expenses', 14, 2).notNullable();
        table.integer('number_of_accounts').notNullable();
        table.integer('overdraft_count_90_days').notNullable();
        table.decimal('loan_repayment', 14, 2).notNullable();
        table.decimal('active_loan_amount', 14, 2).notNullable();
        table.decimal('income_volatility', 5, 2).notNullable(); // 0.00 to 1.00
        table.json('recurring_payments').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('risk_profiles');
}
