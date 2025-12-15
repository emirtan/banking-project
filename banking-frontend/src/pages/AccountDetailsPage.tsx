import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import AccountService from '@/services/accountService';
import TransactionService from '@/services/transactionService';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EditAccountDialog } from '@/components/EditAccountDialog';
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR');
};

export const AccountDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    // 1. Fetch Account Details
    const { data: account, isLoading: isLoadingAccount } = useQuery({
        queryKey: ['account', id],
        queryFn: () => AccountService.getAccountById(id!),
        enabled: !!id,
    });

    // 2. Fetch Transaction History
    const { data: transactions, isLoading: isLoadingHistory, isError: isHistoryError, error: historyError } = useQuery({
        queryKey: ['accountHistory', id],
        queryFn: () => TransactionService.getAccountHistory(id!),
        enabled: !!id,
    });

    if (isLoadingAccount || isLoadingHistory) {
        return <div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div>;
    }

    if (isHistoryError) {
        return <div className="p-10 text-center text-red-500">Error loading transaction history: {(historyError as any).message}</div>;
    }

    if (!account) return <div>Account not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">{account.accountName}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <EditAccountDialog account={account} />
                    <DeleteAccountDialog accountId={account.id} accountName={account.accountName} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Balance Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">
                            {formatMoney(account.balance)}
                        </div>
                        <p className="text-muted-foreground mt-2">
                            Account No: {account.accountNumber} <br />
                            Created At: {formatDate(account.createdAt)}
                        </p>
                    </CardContent>
                </Card>

                {/* Statistics can be added here */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Recent transactions for this account.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!transactions || transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No transactions found.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Source/Target</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => {
                                    // Check if sourceAccountNumber is my account number
                                    const isOutflow = tx.sourceAccountNumber === account.accountNumber && tx.type === 'TRANSFER';

                                    return (
                                        <TableRow key={tx.id}>
                                            <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                                            <TableCell>
                                                <Badge variant={isOutflow ? "destructive" : "default"}>
                                                    {tx.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs">
                                                    <div>From: {tx.sourceAccountNumber}</div>
                                                    <div>To: {tx.targetAccountNumber}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={`text-right font-medium ${isOutflow ? 'text-red-500' : 'text-green-600'}`}>
                                                {isOutflow ? '-' : '+'}{formatMoney(tx.amount)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
