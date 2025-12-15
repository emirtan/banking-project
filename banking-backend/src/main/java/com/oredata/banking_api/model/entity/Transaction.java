package com.oredata.banking_api.model.entity;

import com.oredata.banking_api.model.entity.enums.TransactionStatus;
import com.oredata.banking_api.model.entity.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 20]

    // NOTE: Named 'from' and 'to' as in PDF (Java doesn't reserve 'from' but SQL
    // might, so we mapped columns)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id", nullable = false)
    private Account from; // [cite: 21]

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id", nullable = false)
    private Account to; // [cite: 22]

    @Column(nullable = false)
    private BigDecimal amount; // [cite: 22]

    @Column(nullable = false)
    private LocalDateTime transactionDate; // [cite: 23]

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status; // [cite: 24]

    @Enumerated(EnumType.STRING)
    private TransactionType type; // Keep as extra, no harm
}