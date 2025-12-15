package com.oredata.banking_api.service;

import com.oredata.banking_api.dto.requestDto.AccountDto;
import com.oredata.banking_api.model.entity.Account;
import java.util.List;
import java.util.UUID;

public interface AccountService {
    Account createAccount(AccountDto accountDto);
    Account getAccountById(UUID id);
    Account updateAccount(UUID id, AccountDto accountDto);
    void deleteAccount(UUID id);
    List<Account> searchAccounts(String query);
    List<Account> getAccountsByUserId(UUID userId);
}