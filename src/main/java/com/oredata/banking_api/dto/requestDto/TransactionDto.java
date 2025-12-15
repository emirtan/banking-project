package com.oredata.banking_api.dto.requestDto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class TransactionDto {
    @NotNull(message = "Source Account ID is mandatory")
    private UUID sourceAccountId; // Gönderen Hesap ID (UUID)

    @NotNull(message = "Target Account ID is mandatory")
    private UUID targetAccountId; // Alan Hesap ID (UUID)

    @NotNull(message = "Amount is mandatory")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount; // Miktar
}