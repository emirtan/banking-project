package com.oredata.banking_api.mapper;

import com.oredata.banking_api.dto.responseDto.AccountResponseDto;
import com.oredata.banking_api.model.entity.Account;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AccountMapper {

    public AccountResponseDto toDto(Account account) {
        if (account == null) return null;

        AccountResponseDto dto = new AccountResponseDto();
        dto.setId(account.getId());
        dto.setNumber(account.getNumber());
        dto.setName(account.getName());
        dto.setBalance(account.getBalance());
        dto.setCreatedAt(account.getCreatedAt());

        // Hassas User detaylarını (şifre vs) almadan sadece bunları alıyoruz:
        if (account.getUser() != null) {
            dto.setUserId(account.getUser().getId());
            dto.setUsername(account.getUser().getUsername());
            dto.setEmail(account.getUser().getEmail());
        }

        return dto;
    }

    public List<AccountResponseDto> toDtoList(List<Account> accounts) {
        return accounts.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}