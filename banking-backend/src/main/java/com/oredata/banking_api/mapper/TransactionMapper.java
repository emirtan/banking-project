package com.oredata.banking_api.mapper;

import com.oredata.banking_api.dto.responseDto.TransactionResponseDto;
import com.oredata.banking_api.model.entity.Transaction;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TransactionMapper {

    public TransactionResponseDto toDto(Transaction entity) {
        if (entity == null) {
            return null;
        }

        TransactionResponseDto dto = new TransactionResponseDto();
        dto.setId(entity.getId());
        dto.setAmount(entity.getAmount());
        dto.setTransactionDate(entity.getTransactionDate());

        // Enum -> String Conversion (With Null Check)
        if (entity.getType() != null) {
            dto.setType(entity.getType().name());
        }

        if (entity.getStatus() != null) {
            dto.setStatus(entity.getStatus().name());
        }

        // Getting Associated Account Numbers
        // New names in Entity: getFrom() and getTo()
        if (entity.getFrom() != null) {
            dto.setSourceAccountNumber(entity.getFrom().getNumber());
        }

        if (entity.getTo() != null) {
            dto.setTargetAccountNumber(entity.getTo().getNumber());
        }

        return dto;
    }

    public List<TransactionResponseDto> toDtoList(List<Transaction> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}