"use strict";
require('ts-node').register();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
            extension: 'ts'
        },
    },
    test: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        }
    },
    production: {
        client: 'mysql2',
        connection: {
            host: 'sql.freedb.tech',
            user: 'freedb_podijonz',
            password: 'jEBMk2@ey9W4cWB',
            database: 'freedb_credit-wallet'
        }
    }
};
exports.default = config;
