package com.oredata.banking_api.service.impl;

// NOTE: THIS IS THE MISSING CORRECT IMPORT:
import com.oredata.banking_api.dto.requestDto.AccountDto;

import com.oredata.banking_api.model.entity.Account;
import com.oredata.banking_api.model.entity.User;
import com.oredata.banking_api.repository.AccountRepository;
import com.oredata.banking_api.repository.UserRepository;
import com.oredata.banking_api.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.oredata.banking_api.exception.AccessDeniedException;
import com.oredata.banking_api.exception.ResourceNotFoundException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // Get current username
    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    public Account createAccount(AccountDto accountDto) {
        // User check
        User user = userRepository.findById(accountDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Prevent opening account for others
        if (!user.getUsername().equals(getCurrentUsername())) {
            throw new AccessDeniedException("You cannot create an account for someone else!");
        }

        // Create Account
        Account account = Account.builder()
                .name(accountDto.getName())
                .balance(accountDto.getBalance())
                .number(generateUniqueAccountNumber())
                .user(user)
                .build();

        return accountRepository.save(account);
    }

    @Override
    public Account getAccountById(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Security: Only owner can see
        if (!account.getUser().getUsername().equals(getCurrentUsername())) {
            throw new AccessDeniedException("You do not have permission to access this account!");
        }

        return account;
    }

    @Override
    public Account updateAccount(UUID id, AccountDto accountDto) {
        Account account = getAccountById(id); // Security check is done here

        if (accountDto.getName() != null && !accountDto.getName().isEmpty()) {
            account.setName(accountDto.getName());
        }
        return accountRepository.save(account);
    }

    @Override
    public void deleteAccount(UUID id) {
        Account account = getAccountById(id); // Security check is done here
        accountRepository.delete(account);
    }

    @Override
    public List<Account> searchAccounts(String query) {
        // Secure search
        return accountRepository.searchAccountsForUser(getCurrentUsername(), query);
    }

    @Override
    public List<Account> getAccountsByUserId(UUID userId) {
        User requestedUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!requestedUser.getUsername().equals(getCurrentUsername())) {
            throw new AccessDeniedException("You cannot see someone else's account list!");
        }

        return accountRepository.findByUserId(userId);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            // Generate a random 10-digit number (e.g., 1000000000 to 9999999999)
            long randomNum = (long) (Math.floor(Math.random() * 9_000_000_000L) + 1_000_000_000L);
            accountNumber = String.valueOf(randomNum);
        } while (accountRepository.existsByNumber(accountNumber)); // Ensure Uniqueness
        return accountNumber;
    }
}