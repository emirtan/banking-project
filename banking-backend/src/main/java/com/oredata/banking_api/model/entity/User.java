package com.oredata.banking_api.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // IMPORTANT IMPORT

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Account> accounts;

    // --- UserDetails METHODS (For Spring Security) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // We don't separate roles (Admin/User) for now, giving "ROLE_USER" to everyone.
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account not expired
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account not locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials not expired
    }

    @Override
    public boolean isEnabled() {
        return true; // Account enabled
    }
}