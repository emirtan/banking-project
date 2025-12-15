package com.oredata.banking_api.service;

import com.oredata.banking_api.dto.requestDto.TransactionDto;
import com.oredata.banking_api.model.entity.Transaction;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal; // Bunu eklemeyi unutma

public interface TransactionService {
    Transaction transferFunds(TransactionDto transactionDto);
    List<Transaction> getAccountHistory(UUID accountId);

    Transaction withdraw(UUID accountId, BigDecimal amount);
    Transaction deposit(UUID accountId, BigDecimal amount);
}