package com.oredata.banking_api.controller;

import com.oredata.banking_api.dto.requestDto.LoginRequestDto;
import com.oredata.banking_api.dto.responseDto.LoginResponseDto;
import com.oredata.banking_api.dto.requestDto.RegisterRequestDto; // NEW NAME
import com.oredata.banking_api.dto.responseDto.RegisterResponseDto;
import com.oredata.banking_api.model.entity.User;
import com.oredata.banking_api.mapper.UserMapper;
import com.oredata.banking_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    // 1. Register
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto registerRequestDto) {
        User user = userService.registerUser(registerRequestDto);
        return ResponseEntity.ok(userMapper.toRegisterResponseDto(user));
    }

    // ... (Other methods are the same)
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(userService.login(loginRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<RegisterResponseDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(userMapper.toDtoList(users));
    }
}