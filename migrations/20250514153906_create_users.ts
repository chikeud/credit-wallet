import { Knex } from 'knex';

exports.up = function(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
        table.increments('id').primary();
        table.string('name');
        table.string('email').unique();
        table.string('password_hash');
        table.timestamps(true, true);
    });
};

exports.down = function(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.dropTableIfExists('users');
};
