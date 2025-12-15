package com.oredata.banking_api.service.impl;

import com.oredata.banking_api.config.security.JwtService;
import com.oredata.banking_api.dto.requestDto.LoginRequestDto;
import com.oredata.banking_api.dto.responseDto.LoginResponseDto;
import com.oredata.banking_api.dto.requestDto.RegisterRequestDto; // NEW NAME
import com.oredata.banking_api.model.entity.User;
import com.oredata.banking_api.repository.UserRepository;
import com.oredata.banking_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.oredata.banking_api.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public User registerUser(RegisterRequestDto registerRequestDto) {
        User user = new User();
        // Calling Getter methods via RegisterRequestDto
        user.setUsername(registerRequestDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setEmail(registerRequestDto.getEmail());

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getUsername(),
                        loginRequestDto.getPassword()));

        User user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return new LoginResponseDto(jwtToken, user.getId());
    }
}