import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import AccountService from '@/services/accountService';
import TransactionService from '@/services/transactionService';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY' }).format(amount);
};

export const HistoryPage = () => {
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    // 1. Fetch user's all accounts
    const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ['userAccounts', userId],
        queryFn: () => AccountService.getUserAccounts(userId!),
        enabled: !!userId,
    });

    // 2. Fetch transaction history for each account
    const { data: allTransactions, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['allTransactions', accounts],
        queryFn: async () => {
            if (!accounts || accounts.length === 0) return [];

            // Fetch parallel requests for all accounts
            const promises = accounts.map((acc: any) =>
                TransactionService.getAccountHistory(acc.id).then(txs =>
                    txs.map(tx => ({ ...tx, accountId: acc.id, accountName: acc.accountName, accountNumber: acc.accountNumber }))
                )
            );

            const results = await Promise.all(promises);
            // Flat merge
            return results.flat().sort((a: any, b: any) =>
                new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            );
        },
        enabled: !!accounts && accounts.length > 0,
    });

    if (isLoadingAccounts || isLoadingTransactions) {
        return <div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div>;
    }

    if (!accounts || accounts.length === 0) {
        return <div className="p-10 text-center">You have no accounts yet.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5" /> All Transactions
                    </CardTitle>
                    <CardDescription>
                        All transaction movements for your accounts (Recent first).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!allTransactions || allTransactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No transaction records found.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Detail</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allTransactions.map((tx: any) => {
                                    // tx.accountId is which account was used fetching this tx.
                                    // Distinguish colors:
                                    // Source Account matches row account -> Outflow (-)
                                    // Target Account matches row account -> Inflow (+)

                                    const isOutflow = tx.sourceAccountNumber === tx.accountNumber && tx.type === 'TRANSFER';
                                    const isSelfDeposit = tx.type === 'DEPOSIT';
                                    const isSelfWithdrawal = tx.type === 'WITHDRAWAL';

                                    // Determine colors and signs
                                    let amountColor = 'text-gray-900';
                                    let sign = '';

                                    if (tx.type === 'TRANSFER') {
                                        if (isOutflow) {
                                            amountColor = 'text-red-500';
                                            sign = '-';
                                        } else {
                                            amountColor = 'text-green-600';
                                            sign = '+';
                                        }
                                    } else if (isSelfDeposit) {
                                        amountColor = 'text-green-600';
                                        sign = '+';
                                    } else if (isSelfWithdrawal) {
                                        amountColor = 'text-red-500';
                                        sign = '-';
                                    }

                                    return (
                                        <TableRow key={`${tx.id}-${tx.accountId}`}>
                                            <TableCell className="font-medium">
                                                {format(new Date(tx.transactionDate), 'd MMM yyyy HH:mm', { locale: tr })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs">{tx.accountName}</span>
                                                    <span className="text-muted-foreground text-[10px]">{tx.accountNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{tx.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {tx.type === 'TRANSFER' ? (
                                                    isOutflow ?
                                                        `-> ${tx.targetAccountNumber}` :
                                                        `<- ${tx.sourceAccountNumber}`
                                                ) : (
                                                    tx.type
                                                )}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${amountColor}`}>
                                                {sign}{formatMoney(tx.amount)}
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
