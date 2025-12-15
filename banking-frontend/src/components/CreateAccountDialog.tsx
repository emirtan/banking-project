import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import AccountService from '@/services/accountService';
import { useAuthStore } from '@/store/authStore';

const CreateAccountSchema = z.object({
    name: z.string().min(3, 'Account name must be at least 3 characters.'),
    balance: z.coerce.number().min(0, 'Balance cannot be negative.'),
});

type CreateAccountFormValues = z.infer<typeof CreateAccountSchema>;

export const CreateAccountDialog = () => {
    const [open, setOpen] = React.useState(false);
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const form = useForm<CreateAccountFormValues>({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolver: zodResolver(CreateAccountSchema),
        defaultValues: {
            name: '',
            balance: 0,
        },
    });

    const createMutation = useMutation({
        mutationFn: (values: CreateAccountFormValues) =>
            AccountService.createAccount({
                userId: user?.id!,
                name: values.name,
                balance: values.balance
            }),
        onSuccess: () => {
            toast({
                title: 'Account Created',
                description: 'Your new bank account has been successfully opened.',
            });
            queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
            setOpen(false);
            form.reset();
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || 'Failed to create account.';
            toast({
                title: 'Error',
                description: msg,
                variant: 'destructive',
            });
        }
    });

    const onSubmit = (values: CreateAccountFormValues) => {
        if (!user?.id) {
            toast({
                title: 'Session Error',
                description: 'User ID not found. Please logout and login again.',
                variant: 'destructive',
            });
            return;
        }
        createMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> New Account
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription>
                        Set the account name and initial balance.
                    </DialogDescription>
                </DialogHeader>

                {/* @ts-ignore */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">

                        <FormField
                            control={form.control as any}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Vacation Fund" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="balance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Initial Balance (USD/TRY)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="100" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Amount to deposit upon opening.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
