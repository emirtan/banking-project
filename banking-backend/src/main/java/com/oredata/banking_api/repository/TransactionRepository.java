package com.oredata.banking_api.repository;

import com.oredata.banking_api.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // The reason we write "From_Id" is to prevent JPA from misunderstanding the
    // word 'From'.
    List<Transaction> findByFrom_IdOrTo_IdOrderByTransactionDateDesc(UUID fromId, UUID toId);
}