package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(nullable = false, length = 15, unique = true)
  private String phone;

  @Column(nullable = false, length = 100)
  private String password; // Hashed password

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role; // PATIENT, DOCTOR, STAFF

  @Column(nullable = false)
  private Boolean isActive = true;

  @Column(nullable = false)
  private Boolean isVerified = false;

  @Column(name = "profileImage", nullable = false, length = 100)
  private String profileImage;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    System.out.println("User entity created: " + this.email + " with role: " + this.role);
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
    System.out.println("User entity updated: " + this.email);
  }

  // UserDetails implementation for Spring Security
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return isActive;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return isActive;
  }
}
