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
    private String type;            // Enum yerine String dönüyoruz (Daha temiz görünür)
    private String status;          // "SUCCESS" gibi
    private LocalDateTime transactionDate;
    private String sourceAccountNumber; // Tüm obje yerine sadece hesap no
    private String targetAccountNumber; // Tüm obje yerine sadece hesap no
}