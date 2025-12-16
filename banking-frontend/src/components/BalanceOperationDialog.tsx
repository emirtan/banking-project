import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import TransactionService from '@/services/transactionService';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/button'; // Note: Dialog parts are usually in ui/dialog, checking imports
import {
    Dialog as DialogRoot,
    DialogTrigger as DialogTriggerRoot,
    DialogContent as DialogContentRoot,
    DialogHeader as DialogHeaderRoot,
    DialogFooter as DialogFooterRoot,
    DialogTitle as DialogTitleRoot,
    DialogDescription as DialogDescriptionRoot,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Schema
const formSchema = z.object({
    amount: z.coerce
        .number()
        .min(0.01, 'Amount must be at least 0.01')
        .max(1000000, 'Amount cannot exceed 1,000,000'),
});

interface BalanceOperationDialogProps {
    accountId: string;
    currentBalance: number;
}

export function BalanceOperationDialog({ accountId, currentBalance }: BalanceOperationDialogProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            if (activeTab === 'deposit') {
                return TransactionService.deposit(accountId, values.amount);
            } else {
                return TransactionService.withdraw(accountId, values.amount);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
            queryClient.invalidateQueries({ queryKey: ['accountHistory', accountId] });
            toast({
                title: 'Success!',
                description: `Successfully ${activeTab === 'deposit' ? 'deposited' : 'withdrawn'} money.`,
            });
            setOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: 'Transaction Failed',
                description: error.message || 'Something went wrong.',
            });
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values);
    };

    return (
        <DialogRoot open={open} onOpenChange={setOpen}>
            <DialogTriggerRoot asChild>
                <Button variant="outline" size="sm" className="w-full mt-2">
                    <Plus className="mr-2 h-4 w-4" /> / <Minus className="mr-2 h-4 w-4" />
                    Manage Balance
                </Button>
            </DialogTriggerRoot>
            <DialogContentRoot className="sm:max-w-[425px]">
                <DialogHeaderRoot>
                    <DialogTitleRoot>Manage Balance</DialogTitleRoot>
                    <DialogDescriptionRoot>
                        Deposit or withdraw money from this account.
                    </DialogDescriptionRoot>
                </DialogHeaderRoot>

                <Tabs defaultValue="deposit" value={activeTab} onValueChange={(v) => setActiveTab(v as 'deposit' | 'withdraw')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="deposit">Deposit</TabsTrigger>
                        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    </TabsList>

                    <div className="py-4">
                        <div className="text-sm text-muted-foreground mb-4 text-center">
                            Current Balance: <span className="font-bold text-foreground">{currentBalance.toFixed(2)}</span>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooterRoot>
                                    <Button type="submit" disabled={mutation.isPending} className="w-full">
                                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                                    </Button>
                                </DialogFooterRoot>
                            </form>
                        </Form>
                    </div>
                </Tabs>
            </DialogContentRoot>
        </DialogRoot>
    );
}
