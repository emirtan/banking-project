package com.oredata.banking_api.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {

    @Column(nullable = false, updatable = false) // Written on creation, never changed
    private LocalDateTime createdAt;

    @Column(nullable = false) // insertable=false is REMOVED! Can be written anytime.
    private LocalDateTime updatedAt;

    // Runs just before record creation (Pre-INSERT)
    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now; // Update date = Create date on initial creation
    }

    // Runs just before update (Pre-UPDATE)
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}