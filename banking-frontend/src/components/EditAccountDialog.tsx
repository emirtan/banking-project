import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useState } from 'react';
import { Pencil } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
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
import { useToast } from '@/components/ui/use-toast';
import AccountService from '@/services/accountService';
import { Account } from '@/types/account';

const EditAccountSchema = z.object({
    name: z.string().min(3, 'Account name must be at least 3 characters.'),
});

type EditAccountFormValues = z.infer<typeof EditAccountSchema>;

interface EditAccountDialogProps {
    account: Account;
}

export const EditAccountDialog = ({ account }: EditAccountDialogProps) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<EditAccountFormValues>({
        resolver: zodResolver(EditAccountSchema),
        defaultValues: {
            name: account.accountName,
        },
    });

    const updateMutation = useMutation({
        mutationFn: (values: EditAccountFormValues) =>
            AccountService.updateAccount(account.id, values),
        onSuccess: (updatedAccount) => {
            // Refresh queries
            queryClient.invalidateQueries({ queryKey: ['account', account.id] });
            queryClient.invalidateQueries({ queryKey: ['userAccounts'] });

            toast({
                title: 'Account Updated',
                description: `Account name changed to "${updatedAccount.accountName}".`,
            });
            setOpen(false);
        },
        onError: (error: any) => {
            toast({
                title: 'Update Failed',
                description: error.response?.data?.message || 'Failed to update account name.',
                variant: 'destructive',
            });
        },
    });

    const onSubmit = (values: EditAccountFormValues) => {
        updateMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Account</DialogTitle>
                    <DialogDescription>
                        You can change the account name here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
