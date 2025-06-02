export interface Account {
    id: number;
    account_number: string;
    account_name: string;
    bank_name: string;
    account_type: 'Savings' | 'Current' | 'Domiciliary' | 'Fixed Deposit';
    balance: number;
    currency: 'NGN' | 'USD' | 'GBP';
    created_at: string;
    status: 'Active' | 'Dormant' | 'Closed';
}