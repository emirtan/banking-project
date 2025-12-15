package com.oredata.banking_api.controller;

import com.oredata.banking_api.dto.requestDto.AccountDto;
import com.oredata.banking_api.dto.responseDto.AccountResponseDto; // Yeni DTO
import com.oredata.banking_api.model.entity.Account;
import com.oredata.banking_api.mapper.AccountMapper; // Yeni Mapper
import com.oredata.banking_api.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final AccountMapper accountMapper;

    // 1. Create Account
    @PostMapping
    public ResponseEntity<AccountResponseDto> createAccount(@Valid @RequestBody AccountDto accountDto) {
        Account account = accountService.createAccount(accountDto);
        return ResponseEntity.ok(accountMapper.toDto(account));
    }

    // 2. Search Accounts (Query Param ile)
    @GetMapping("/search")
    public ResponseEntity<List<AccountResponseDto>> searchAccounts(@RequestParam String query) {
        List<Account> accounts = accountService.searchAccounts(query);
        return ResponseEntity.ok(accountMapper.toDtoList(accounts));
    }

    // 3. Update Account
    @PutMapping("/{id}")
    public ResponseEntity<AccountResponseDto> updateAccount(@PathVariable UUID id,
            @Valid @RequestBody AccountDto accountDto) {
        Account account = accountService.updateAccount(id, accountDto);
        return ResponseEntity.ok(accountMapper.toDto(account));
    }

    // 4. Delete Account
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    // 5. View Account Details
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDto> getAccountById(@PathVariable UUID id) {
        Account account = accountService.getAccountById(id);
        return ResponseEntity.ok(accountMapper.toDto(account));
    }

    // 6. Kullanıcının Tüm Hesapları
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponseDto>> getAccountsByUserId(@PathVariable UUID userId) {
        List<Account> accounts = accountService.getAccountsByUserId(userId);
        return ResponseEntity.ok(accountMapper.toDtoList(accounts));
    }
}