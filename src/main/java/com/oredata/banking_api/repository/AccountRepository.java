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

    // 1. GÜVENLİ ARAMA (Secure Search)
    // Kullanıcı sadece KENDİNE ait hesaplar içinde arama yapabilir.
    // PDF Madde 2: "Search accounts for the authenticated user"
    // SQL Mantığı: (İsim BENZİYORSA VEYA Numara BENZİYORSA) VE (Kullanıcı Adı EŞİTSE)
    @Query("SELECT a FROM Account a WHERE (LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR a.number LIKE CONCAT('%', :query, '%')) AND a.user.username = :username")
    List<Account> searchAccountsForUser(@Param("username") String username, @Param("query") String query);

    // 2. Kullanıcı ID'sine göre tüm hesapları bul (Listeleme için)
    List<Account> findByUserId(UUID userId);
}