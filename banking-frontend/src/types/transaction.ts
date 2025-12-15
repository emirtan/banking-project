export enum TransactionType {
    TRANSFER = 'TRANSFER',
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

// Backend Response DTO
export interface TransactionResponse {
    id: number;
    amount: number;
    type: string; // Backend sends string (Enum name)
    status: string; // Backend sends string
    transactionDate: string; // LocalDateTime string
    sourceAccountNumber: string;
    targetAccountNumber: string;
}

// Request DTO for Transfer
export interface TransferRequest {
    sourceAccountId: string; // UUID
    targetAccountId: string; // UUID
    amount: number;
}
