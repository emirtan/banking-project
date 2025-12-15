package com.oredata.banking_api.dto.responseDto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionResponseDto {
    private Long id;
    private BigDecimal amount;
    private String type; // Returning String instead of Enum (Looks cleaner)
    private String status; // e.g. "SUCCESS"
    private LocalDateTime transactionDate;
    private String sourceAccountNumber; // Just account number instead of full object
    private String targetAccountNumber; // Just account number instead of full object
}