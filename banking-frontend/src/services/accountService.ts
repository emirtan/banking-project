import api from '@/lib/api';
import { Account, AccountBackendResponse, AccountType } from '@/types/account';

// Helper to map Backend Response to Frontend Model (DRY Principle)
const mapResponseToAccount = (item: AccountBackendResponse): Account => ({
  id: item.id,
  accountName: item.name,
  accountNumber: item.number,
  balance: item.balance,
  createdAt: item.createdAt,
  currency: 'TRY', // Default currency as per MVP scope
  accountType: AccountType.CHECKING, // Default account type
});

const AccountService = {

  // GET /api/accounts/user/{userId}
  getUserAccounts: async (userId: string): Promise<Account[]> => {
    const response = await api.get<AccountBackendResponse[]>(`/accounts/user/${userId}`);
    return response.data.map(mapResponseToAccount);
  },

  // GET /api/accounts/{id}
  getAccountById: async (accountId: string): Promise<Account> => {
    const response = await api.get<AccountBackendResponse>(`/accounts/${accountId}`);
    return mapResponseToAccount(response.data);
  },

  // POST /api/accounts
  createAccount: async (data: { userId: string; name: string; balance: number }): Promise<Account> => {
    const response = await api.post<AccountBackendResponse>('/accounts', data);
    return mapResponseToAccount(response.data);
  },

  // PUT /api/accounts/{id}
  updateAccount: async (id: string, data: { name: string }): Promise<Account> => {
    const response = await api.put<AccountBackendResponse>(`/accounts/${id}`, data);
    return mapResponseToAccount(response.data);
  },

  // DELETE /api/accounts/{id}
  deleteAccount: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};

export default AccountService;