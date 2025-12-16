import api from '@/lib/api';
import { TransactionResponse } from '@/types/transaction';

export interface TransferRequest {
    sourceAccountId: string;
    targetAccountId?: string;
    targetAccountNumber?: string;
    amount: number;
}

const TransactionService = {
    // POST /api/transactions/transfer
    transfer: async (data: TransferRequest): Promise<TransactionResponse> => {
        const response = await api.post<TransactionResponse>('/transactions/transfer', data);
        return response.data;
    },

    // GET /api/transactions/account/{accountId}
    getAccountHistory: async (accountId: string): Promise<TransactionResponse[]> => {
        const response = await api.get<TransactionResponse[]>(`/transactions/account/${accountId}`);
        return response.data;
    },
};

export default TransactionService;
