import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

import AccountService from '@/services/accountService';
import TransactionService from '@/services/transactionService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


// --- Helper Local ---
const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY' }).format(amount);
};

// --- Schema ---
const TransferSchema = z.object({
    sourceAccountId: z.string().min(1, 'Source account must be selected.'),
    targetAccountId: z.string().min(1, 'Target account must be selected.'),
    amount: z.coerce.number().min(0.01, 'Amount must be at least 0.01.'),
}).refine((data) => data.sourceAccountId !== data.targetAccountId, {
    message: "Source and target accounts cannot be the same.",
    path: ["targetAccountId"],
});

type TransferFormValues = z.infer<typeof TransferSchema>;

export const TransferPage = () => {
    const { user } = useAuthStore.getState();
    const userId = user?.id; // Has id after store update
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // 1. Fetch Accounts
    const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ['userAccounts', userId],
        queryFn: () => AccountService.getUserAccounts(userId!),
        enabled: !!userId,
    });

    // 2. Form Setup
    const form = useForm<TransferFormValues>({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolver: zodResolver(TransferSchema),
        defaultValues: {
            sourceAccountId: '',
            targetAccountId: '',
            amount: 0,
        },
    });

    // 3. Mutation (Transfer Operation)
    const transferMutation = useMutation({
        mutationFn: TransactionService.transfer,
        onSuccess: () => {
            toast({
                title: 'Transfer Successful',
                description: 'Money transfer completed successfully.',
            });
            // Invalidate cache to update account balances
            queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || error.message || 'Transfer failed.';
            toast({
                title: 'Error',
                description: msg,
                variant: 'destructive',
            });
        }
    });

    const onSubmit = (values: TransferFormValues) => {
        // Extra Balance Check (for Client-Side UX)
        const sourceAccount = accounts?.find(a => a.id === values.sourceAccountId);
        if (sourceAccount && sourceAccount.balance < values.amount) {
            form.setError('amount', { message: 'Insufficient balance.' });
            return;
        }

        transferMutation.mutate(values);
    };

    if (isLoadingAccounts) {
        return <div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div>;
    }

    if (!accounts || accounts.length < 2) {
        return (
            <Card className="max-w-xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Transfer Unavailable</CardTitle>
                    <CardDescription>You need at least 2 accounts to make a transfer.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Money Transfer</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5" /> Wire / Transfer
                    </CardTitle>
                    <CardDescription>
                        Transfer money between your accounts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* @ts-ignore */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">

                            {/* Source Account */}
                            <FormField
                                control={form.control as any}
                                name="sourceAccountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source Account</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Account" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.accountName} - {formatMoney(acc.balance)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The account money will be withdrawn from.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Target Account */}
                            <FormField
                                control={form.control as any}
                                name="targetAccountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Account</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Account" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.accountName} ({acc.accountNumber})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The account money will be deposited to.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Amount */}
                            <FormField
                                control={form.control as any}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount (TRY)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={transferMutation.isPending}>
                                {transferMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Transfer
                            </Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
