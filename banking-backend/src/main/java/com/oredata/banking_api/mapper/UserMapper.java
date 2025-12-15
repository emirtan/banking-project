package com.oredata.banking_api.mapper;

import com.oredata.banking_api.dto.responseDto.RegisterResponseDto; // Fixed Import
import com.oredata.banking_api.model.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    // User -> RegisterResponseDto Conversion
    public RegisterResponseDto toRegisterResponseDto(User user) {
        if (user == null)
            return null;

        RegisterResponseDto dto = new RegisterResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        return dto;
    }

    // If returning a user list for admin, you can convert this to a
    // RegisterResponseDto list
    // Or use a separate UserResponseDto class if available.
    // For now, let's proceed with RegisterResponseDto:
    public List<RegisterResponseDto> toDtoList(List<User> users) {
        return users.stream()
                .map(this::toRegisterResponseDto)
                .collect(Collectors.toList());
    }
}