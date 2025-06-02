import axios from 'axios';
import { TokenResponse,IdentityResponse, TransactionsResponse } from '../../types/response';

const BASE_URL = 'https://apis.openbanking.ng';
const CLIENT_ID = process.env.OB_CLIENT_ID!;
const CLIENT_SECRET = process.env.OB_CLIENT_SECRET!;

const openBankingClient = {
    getToken: async (authCode: string): Promise<string> => {
        const { data } = await axios.post<TokenResponse>(`${BASE_URL}/oauth/token`, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: authCode,
            grant_type: 'authorization_code'
        });
        return data.access_token;
    },

    getIdentity: async (accessToken: string): Promise<IdentityResponse> => {
        const { data } = await axios.get<IdentityResponse>(`${BASE_URL}/identity`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    },

    getTransactions: async (accessToken: string, accountId: string) => {
        const { data } = await axios.get(`${BASE_URL}/accounts/${accountId}/transactions`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data.transactions;
    }
};

export default openBankingClient;