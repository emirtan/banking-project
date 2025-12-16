package com.oredata.banking_api.service.impl;

import com.oredata.banking_api.dto.requestDto.TransactionDto;
import com.oredata.banking_api.model.entity.Account;
import com.oredata.banking_api.model.entity.Transaction;
import com.oredata.banking_api.model.entity.enums.TransactionStatus;
import com.oredata.banking_api.model.entity.enums.TransactionType;
import com.oredata.banking_api.repository.AccountRepository;
import com.oredata.banking_api.repository.TransactionRepository;
import com.oredata.banking_api.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.oredata.banking_api.exception.InsufficientBalanceException;
import com.oredata.banking_api.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public Transaction transferFunds(TransactionDto transactionDto) {
        // 1. Find Accounts
        Account fromAccount = accountRepository.findById(transactionDto.getSourceAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found"));

        Account toAccount;

        // RESOLVE TARGET ACCOUNT
        if (transactionDto.getTargetAccountId() != null) {
            toAccount = accountRepository.findById(transactionDto.getTargetAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found with ID"));
        } else if (transactionDto.getTargetAccountNumber() != null) {
            toAccount = accountRepository.findByNumber(transactionDto.getTargetAccountNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found with Number"));
        } else {
            throw new IllegalArgumentException("Target Account ID or Number must be provided");
        }

        // 2. Is Balance Sufficient?
        if (fromAccount.getBalance().compareTo(transactionDto.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance! Transaction failed.");
        }

        // 3. Update Balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(transactionDto.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(transactionDto.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // 4. Transaction Record (CHANGE: Used .from and .to)
        Transaction transaction = Transaction.builder()
                .amount(transactionDto.getAmount())
                .from(fromAccount) // <-- OLD: sourceAccount
                .to(toAccount) // <-- OLD: targetAccount
                .transactionDate(LocalDateTime.now())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.SUCCESS)
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction deposit(UUID accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        // CHANGE: Used .from and .to
        Transaction transaction = Transaction.builder()
                .amount(amount)
                .from(account) // Source is self for deposit
                .to(account) // Target is self
                .transactionDate(LocalDateTime.now())
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction withdraw(UUID accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance!");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        // CHANGE: Used .from and .to
        Transaction transaction = Transaction.builder()
                .amount(amount)
                .from(account)
                .to(account)
                .transactionDate(LocalDateTime.now())
                .type(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.SUCCESS)
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getAccountHistory(UUID accountId) {
        // CHANGE: Call new repository method
        return transactionRepository.findByFrom_IdOrTo_IdOrderByTransactionDateDesc(accountId, accountId);
    }
}