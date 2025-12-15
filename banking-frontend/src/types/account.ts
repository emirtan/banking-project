// Account types
export enum AccountType {
  CHECKING = 'CHECKING', // Checking Account
  SAVINGS = 'SAVINGS',   // Savings Account
}

// Individual Account Structure (UI Model)
export interface Account {
  id: string; // UUID
  accountName: string; // Backend: name
  accountNumber: string; // Backend: number
  balance: number;
  currency: 'TRY' | 'USD' | 'EUR'; // Not in Backend, default TRY
  accountType: AccountType; // Not in Backend, default CHECKING
  createdAt: string;
}

// Raw JSON format from Backend
export interface AccountBackendResponse {
  id: string;
  number: string;
  name: string;
  balance: number;
  createdAt: string;
  userId: string;
  username: string;
  email: string;
}

// List response from Backend
// NOTE: Backend sometimes returns List<Dto> directly, sometimes wraps it.
// Controller: return ResponseEntity.ok(accountMapper.toDtoList(accounts)); -> Returns Array directly.
// However, older code had { accounts: [] } structure. We should check this.
// Backend Controller: public ResponseEntity<List<AccountResponseDto>> ...
// So it will return Array directly (`AccountBackendResponse[]`).