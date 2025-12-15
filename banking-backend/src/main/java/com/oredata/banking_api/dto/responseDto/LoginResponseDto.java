package com.oredata.banking_api.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // Bunu ekle ki new LoginResponseDto("token") diyebilelim
public class LoginResponseDto {
    private String token;
    private java.util.UUID userId;

}