import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Banknote,
  CreditCard,
  DollarSign,
  Euro,
  ChevronRight,
  TrendingUp,
  LucideIcon,
  Search, // Added Icon
} from 'lucide-react';

import AccountService from '@/services/accountService';
import { useAuthStore } from '@/store/authStore';
import { Account, AccountType } from '@/types/account';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import { CreateAccountDialog } from '@/components/CreateAccountDialog';

/* -------------------------------------------------------------------------- */
/*                               ICON MAPS (STATIC)                           */
/* -------------------------------------------------------------------------- */

const ACCOUNT_ICON_MAP: Record<AccountType, LucideIcon> = {
  [AccountType.CHECKING]: CreditCard,
  [AccountType.SAVINGS]: TrendingUp,
};

const CURRENCY_ICON_MAP: Record<string, LucideIcon> = {
  USD: DollarSign,
  EUR: Euro,
  TRY: Banknote, // Added TRY support for completeness, though using Banknote default
};

/* -------------------------------------------------------------------------- */
/*                               UTILS                                         */
/* -------------------------------------------------------------------------- */

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/* -------------------------------------------------------------------------- */
/*                               ACCOUNT CARD                                  */
/* -------------------------------------------------------------------------- */

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const AccountIcon =
    ACCOUNT_ICON_MAP[account.accountType] ?? Banknote;

  const MoneyIcon =
    CURRENCY_ICON_MAP[account.currency] ?? Banknote;

  const isChecking = account.accountType === AccountType.CHECKING;

  return (
    <Card
      className={`relative transition-transform hover:scale-[1.01] hover:shadow-lg
        ${isChecking
          ? 'border-primary shadow-lg dark:border-primary/50'
          : 'border-gray-200 dark:border-gray-700'
        }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center text-sm font-medium">
          <AccountIcon className="h-4 w-4 mr-2 text-primary/70" />
          {account.accountName}
        </CardTitle>

        <p
          className={`text-xs font-semibold uppercase ${isChecking ? 'text-primary' : 'text-gray-500'
            }`}
        >
          {isChecking ? 'Checking' : 'Savings'}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center text-3xl font-bold">
          <MoneyIcon className="h-6 w-6 mr-2 text-gray-500" />
          {formatCurrency(account.balance, account.currency)}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {account.accountNumber}
        </p>

        <Separator className="my-3" />

        <Link to={`/account/${account.id}`}>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

AccountCard.displayName = 'AccountCard';

/* -------------------------------------------------------------------------- */
/*                               DASHBOARD PAGE                                */
/* -------------------------------------------------------------------------- */

export const DashboardPage: React.FC = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: accounts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userAccounts', userId],
    queryFn: () => AccountService.getUserAccounts(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-[200px] w-full rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-500 dark:bg-red-900/20">
        Error loading accounts:{' '}
        <strong>{(error as Error).message}</strong>
      </div>
    );
  }

  const isEmpty = !accounts || accounts.length === 0;

  // Filter accounts based on search query
  const filteredAccounts = accounts?.filter(account =>
    account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.accountNumber.includes(searchQuery)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
        <CreateAccountDialog />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by account name or number..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {isEmpty ? (
        <div className="rounded-lg border bg-white p-16 text-center shadow-md dark:bg-gray-800">
          <Banknote className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-xl font-bold">
            You don't have any accounts yet.
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create a new account to start banking.
          </p>
          <div className="mt-6">
            <CreateAccountDialog />
          </div>
        </div>
      ) : (
        <>
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No accounts found matching your search.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
