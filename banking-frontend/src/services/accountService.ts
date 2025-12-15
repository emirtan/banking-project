import api from '@/lib/api';
import { Account, AccountBackendResponse, AccountType } from '@/types/account';

const AccountService = {
  // GET /api/accounts/user/{userId}
  // NOTE: Backend returns by userId, not "getAll".
  // However, we need to have the userId. We should get it from the Auth store or JWT.
  // For now, I'm adding a userId parameter. We will provide it from the store when using it.
  getUserAccounts: async (userId: string): Promise<Account[]> => {
    // Backend Controller: @GetMapping("/user/{userId}")
    const response = await api.get<AccountBackendResponse[]>(`/accounts/user/${userId}`);

    // Mapping
    return response.data.map(item => ({
      id: item.id,
      accountName: item.name,
      accountNumber: item.number,
      balance: item.balance,
      createdAt: item.createdAt,
      currency: 'TRY', // Default
      accountType: AccountType.CHECKING // Default
    }));
  },

  getAllAccountsSimple: async (): Promise<Account[]> => {
    // Search endpoint (specs: POST /api/accounts for search)
    // But we want to list them.
    // Requiring userId might be a bit difficult in the Dashboard for now.
    // So we'll need to get the Auth user info first.
    return [];
  },

  // GET /api/accounts/{id}
  getAccountById: async (accountId: string): Promise<Account> => {
    const response = await api.get<AccountBackendResponse>(`/accounts/${accountId}`);
    const item = response.data;

    return {
      id: item.id,
      accountName: item.name,
      accountNumber: item.number,
      balance: item.balance,
      createdAt: item.createdAt,
      currency: 'TRY',
      accountType: AccountType.CHECKING
    };
  },

  // POST /api/accounts
  createAccount: async (data: { userId: string; name: string; balance: number }): Promise<Account> => {
    const response = await api.post<AccountBackendResponse>('/accounts', data);
    const item = response.data;
    return {
      id: item.id,
      accountName: item.name,
      accountNumber: item.number,
      balance: item.balance,
      createdAt: item.createdAt,
      currency: 'TRY', // Default
      accountType: AccountType.CHECKING // Default
    };
  },

  // PUT /api/accounts/{id}
  updateAccount: async (id: string, data: { name: string }): Promise<Account> => {
    const response = await api.put<AccountBackendResponse>(`/accounts/${id}`, data);
    const item = response.data;
    return {
      id: item.id,
      accountName: item.name,
      accountNumber: item.number,
      balance: item.balance,
      createdAt: item.createdAt,
      currency: 'TRY',
      accountType: AccountType.CHECKING
    };
  },

  // DELETE /api/accounts/{id}
  deleteAccount: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};


export default AccountService;