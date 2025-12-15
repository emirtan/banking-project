package com.oredata.banking_api.service;

import com.oredata.banking_api.dto.requestDto.LoginRequestDto;
import com.oredata.banking_api.dto.responseDto.LoginResponseDto;
import com.oredata.banking_api.dto.requestDto.RegisterRequestDto; // YENİ İSİM
import com.oredata.banking_api.model.entity.User;
import java.util.List;

public interface UserService {
    // Parametre artık RegisterRequestDto
    User registerUser(RegisterRequestDto registerRequestDto);

    List<User> getAllUsers();
    LoginResponseDto login(LoginRequestDto loginRequestDto);
}