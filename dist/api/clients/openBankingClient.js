"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://apis.openbanking.ng';
const CLIENT_ID = process.env.OB_CLIENT_ID;
const CLIENT_SECRET = process.env.OB_CLIENT_SECRET;
const openBankingClient = {
    getToken: async (authCode) => {
        const { data } = await axios_1.default.post(`${BASE_URL}/oauth/token`, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: authCode,
            grant_type: 'authorization_code'
        });
        return data.access_token;
    },
    getIdentity: async (accessToken) => {
        const { data } = await axios_1.default.get(`${BASE_URL}/identity`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    },
    getTransactions: async (accessToken, accountId) => {
        const { data } = await axios_1.default.get(`${BASE_URL}/accounts/${accountId}/transactions`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data.transactions;
    }
};
exports.default = openBankingClient;
