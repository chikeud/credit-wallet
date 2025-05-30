export interface Transaction {
    id: string;
    amount: number;
    channel: string;
    authorization_token: string;
    account_number:string;
    transaction_type: string;
    debit_credit: 'DEBIT' | 'CREDIT';
    narration: string;
    reference: string;
    transaction_time: string;
    value_date: string;
    balance_after: number;
}

export interface Summary {
    account_number: string;
    currency_code: string;
    from: string;
    to: string;
    first_transaction: string;
    last_transaction: string;
    opening_balance: number;
    closing_balance: number;
    total_debit_count: number;
    total_credit_count: number;
    total_debit_value: number;
    total_credit_value: number;
    pages: number;
    records_per_page: number;
}

export interface CustomProperty {
    id: string;
    description: string;
    type: string;
    value: string;
}

export interface TransactionResponse {
    status: string;
    message: string;
    data: {
        summary: Summary;
        transactions: Transaction[];
    };
    custom_properties: CustomProperty[];
}
