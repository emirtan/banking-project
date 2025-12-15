import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import AccountService from '@/services/accountService';

interface DeleteAccountDialogProps {
    accountId: string;
    accountName: string;
}

export const DeleteAccountDialog = ({ accountId, accountName }: DeleteAccountDialogProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => AccountService.deleteAccount(accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
            toast({
                title: 'Account Deleted',
                description: `${accountName} deleted successfully.`,
            });
            navigate('/dashboard');
        },
        onError: (error: any) => {
            toast({
                title: 'Deletion Failed',
                description: error.response?.data?.message || 'Failed to delete account.',
                variant: 'destructive',
            });
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. <strong>{accountName}</strong> account and all related transactions will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
