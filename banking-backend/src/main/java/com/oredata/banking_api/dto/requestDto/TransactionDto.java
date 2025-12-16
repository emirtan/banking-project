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
    private UUID sourceAccountId; // Source Account ID (UUID)

    private UUID targetAccountId; // Target Account ID (UUID) - Optional if Number is provided

    private String targetAccountNumber; // Target Account Number (String) - Optional if ID is provided

    @NotNull(message = "Amount is mandatory")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount; // Amount
}