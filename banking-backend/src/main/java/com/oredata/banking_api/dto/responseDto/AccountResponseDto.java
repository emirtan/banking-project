package com.oredata.banking_api.dto.responseDto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class AccountResponseDto {
    private UUID id;
    private String number;
    private String name;
    private BigDecimal balance;
    private LocalDateTime createdAt;

    // User Objesi yerine sadece gerekli bilgileri koyuyoruz (Flattening)
    private UUID userId;
    private String username;
    private String email;
}