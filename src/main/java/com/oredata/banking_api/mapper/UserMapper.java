package com.oredata.banking_api.mapper;

import com.oredata.banking_api.dto.responseDto.RegisterResponseDto; // Importu düzelttik
import com.oredata.banking_api.model.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    // User -> RegisterResponseDto Çevirimi
    public RegisterResponseDto toRegisterResponseDto(User user) {
        if (user == null) return null;

        RegisterResponseDto dto = new RegisterResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        return dto;
    }

    // Eğer admin için user listesi döneceksen bu metodu da RegisterResponseDto listesine çevirebilirsin
    // Veya UserResponseDto diye ayrı bir sınıfın varsa onu kullanırsın.
    // Şimdilik RegisterResponseDto üzerinden gidelim:
    public List<RegisterResponseDto> toDtoList(List<User> users) {
        return users.stream()
                .map(this::toRegisterResponseDto)
                .collect(Collectors.toList());
    }
}