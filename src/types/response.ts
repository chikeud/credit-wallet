// Define response types
export interface TokenResponse {
    access_token: string;
    // optionally: expires_in?: number;
}

export interface IdentityResponse {
    name: string;
    email: string;
    verified: boolean;
    dateOfBirth: string;
    bvn: string;
    // add fields based on API response
}

export interface TransactionsResponse {
    transactions: any[]; // Replace `any` with your actual transaction type
}