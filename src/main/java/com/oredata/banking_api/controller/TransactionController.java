package com.oredata.banking_api.controller;

import com.oredata.banking_api.dto.requestDto.TransactionDto;
import com.oredata.banking_api.dto.responseDto.TransactionResponseDto; // Yeni DTO
import com.oredata.banking_api.model.entity.Transaction;
import com.oredata.banking_api.mapper.TransactionMapper; // Yeni Mapper
import com.oredata.banking_api.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponseDto> transferFunds(@Valid @RequestBody TransactionDto transactionDto) {
        // Servisten gelen entity'yi DTO'ya çevirip dönüyoruz
        Transaction transaction = transactionService.transferFunds(transactionDto);
        return ResponseEntity.ok(transactionMapper.toDto(transaction));
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponseDto> deposit(@RequestParam UUID accountId,
            @RequestParam BigDecimal amount) {
        Transaction transaction = transactionService.deposit(accountId, amount);
        return ResponseEntity.ok(transactionMapper.toDto(transaction));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponseDto> withdraw(@RequestParam UUID accountId,
            @RequestParam BigDecimal amount) {
        Transaction transaction = transactionService.withdraw(accountId, amount);
        return ResponseEntity.ok(transactionMapper.toDto(transaction));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionResponseDto>> getAccountHistory(@PathVariable UUID accountId) {
        List<Transaction> transactions = transactionService.getAccountHistory(accountId);
        // Listeyi topluca çevirip dönüyoruz
        return ResponseEntity.ok(transactionMapper.toDtoList(transactions));
    }
}