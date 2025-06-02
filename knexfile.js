require('dotenv').config();

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
            extension: 'ts', // keep this if using TypeScript for seeds
        },
    },
    test: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
            extension: 'js',
        },
    },
};
