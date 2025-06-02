import 'ts-node/register'; // Required if you're using TypeScript
import dotenv from 'dotenv';
dotenv.config();
const config = {
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
            extension: 'ts',
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
            host: 'sql.freedb.tech',
            user: 'freedb_podijonz',
            password: 'jEBMk2@ey9W4cWB',
            database: 'freedb_credit-wallet',
        },
    },
};
export default config;
