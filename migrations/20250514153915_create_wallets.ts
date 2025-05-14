import { Knex } from 'knex';

exports.up = function(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.createTable('wallets', (table: Knex.CreateTableBuilder) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.decimal('balance', 10, 2).defaultTo(0.00);
        table.timestamps(true, true);
    });
};

exports.down = function(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.dropTableIfExists('wallets');
};
