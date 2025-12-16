import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import * as React from 'react';

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
    targetAccountId: z.string().optional(),
    targetAccountNumber: z.string().optional(),
    amount: z.coerce.number().min(0.01, 'Amount must be at least 0.01.'),
}).refine((data) => {
    // Either ID or Number must be present
    return !!data.targetAccountId || !!data.targetAccountNumber;
}, {
    message: "You must select a target account.",
    path: ["targetAccountId"],
}).refine((data) => data.sourceAccountId !== data.targetAccountId, {
    message: "Source and target accounts cannot be the same.",
    path: ["targetAccountId"],
});

type TransferFormValues = z.infer<typeof TransferSchema>;

export const TransferPage = () => {
    const { user } = useAuthStore.getState();
    const userId = user?.id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Transfer Type State
    const [transferType, setTransferType] = React.useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');

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
            targetAccountNumber: '',
            amount: 0,
        },
    });

    // Reset target fields when switching types
    React.useEffect(() => {
        form.setValue('targetAccountId', '');
        form.setValue('targetAccountNumber', '');
    }, [transferType, form]);

    // 3. Mutation (Transfer Operation)
    const transferMutation = useMutation({
        mutationFn: TransactionService.transfer,
        onSuccess: () => {
            toast({
                title: 'Transfer Successful',
                description: 'Money transfer completed successfully.',
            });
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
        const sourceAccount = accounts?.find(a => a.id === values.sourceAccountId);
        if (sourceAccount && sourceAccount.balance < values.amount) {
            form.setError('amount', { message: 'Insufficient balance.' });
            return;
        }

        // Clean up payload based on type
        const payload = { ...values };
        if (transferType === 'INTERNAL') {
            delete payload.targetAccountNumber;
        } else {
            delete payload.targetAccountId;
        }

        transferMutation.mutate(payload);
    };

    if (isLoadingAccounts) {
        return <div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div>;
    }

    // Min accounts check only for INTERNAL transfer if we wanted to be strict,
    // but users might want to send money out even with 1 account.
    // So we remove the "return null if < 2 accounts" block or adapt it.

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Money Transfer</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5" /> Wire / Transfer
                    </CardTitle>
                    <CardDescription> Send money to your own accounts or others. </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Transfer Type Tabs */}
                    <div className="flex space-x-4 mb-6 border-b pb-4">
                        <button
                            type="button"
                            onClick={() => setTransferType('INTERNAL')}
                            className={`pb-2 text-sm font-medium transition-colors ${transferType === 'INTERNAL' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            My Accounts
                        </button>
                        <button
                            type="button"
                            onClick={() => setTransferType('EXTERNAL')}
                            className={`pb-2 text-sm font-medium transition-colors ${transferType === 'EXTERNAL' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                        >
                            Another Account
                        </button>
                    </div>

                    {/* @ts-ignore */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">

                            {/* Source Account */}
                            <FormField
                                control={form.control as any}
                                name="sourceAccountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From (Source)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Source Account" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accounts?.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.accountName} - {formatMoney(acc.balance)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Target Account (INTERNAL) */}
                            {transferType === 'INTERNAL' && (
                                <FormField
                                    control={form.control as any}
                                    name="targetAccountId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>To (My Account)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Target Account" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {accounts?.filter(a => a.id !== form.watch('sourceAccountId')).map(acc => (
                                                        <SelectItem key={acc.id} value={acc.id}>
                                                            {acc.accountName} ({acc.accountNumber})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Target Account (EXTERNAL) */}
                            {transferType === 'EXTERNAL' && (
                                <FormField
                                    control={form.control as any}
                                    name="targetAccountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>To (Account Number)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 1928374650" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the 10-digit account number of the recipient.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

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
