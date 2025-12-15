package com.oredata.banking_api.repository;

import com.oredata.banking_api.model.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    // 1. SECURE SEARCH
    // Users can only search within their OWN accounts.
    // PDF Madde 2: "Search accounts for the authenticated user"
    // SQL Logic: (Name LIKE OR Number LIKE) AND (Username EQUALS)
    @Query("SELECT a FROM Account a WHERE (LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR a.number LIKE CONCAT('%', :query, '%')) AND a.user.username = :username")
    List<Account> searchAccountsForUser(@Param("username") String username, @Param("query") String query);

    // 2. Find all accounts by User ID (For listing)
    List<Account> findByUserId(UUID userId);
}