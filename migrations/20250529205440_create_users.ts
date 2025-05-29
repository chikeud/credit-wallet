import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('identities', (table) => {
        table.integer('id').primary();
        table.json('applicant').notNullable();
        table.json('summary').notNullable();
        table.json('status').notNullable();
        table.json('bvn').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('identities');
}
