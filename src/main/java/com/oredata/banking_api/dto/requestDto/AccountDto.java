package com.oredata.banking_api.dto.requestDto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID; // UUID importu şart

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class AccountDto {

    // Değişiklik: Long -> UUID ve customerId -> userId
    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Account name is required")
    @Size(min = 3, message = "Account name must be at least 3 characters")
    private String name;

    @NotNull(message = "Initial balance is required")
    @DecimalMin(value = "0.00", message = "Balance cannot be negative")
    private BigDecimal balance;
}