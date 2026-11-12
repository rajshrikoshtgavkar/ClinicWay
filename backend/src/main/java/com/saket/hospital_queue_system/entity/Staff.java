package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Staff {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @ManyToOne
  private Clinic clinic;

  @Column(length = 100)
  private String department;

  @Column(length = 100)
  private String position;

  @Column(length = 250)
  private String notes;

  @Column(name = "is_active", nullable = false)
  private Boolean isActive = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    System.out.println("Staff entity created: " + this.getUser().getName());
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
    System.out.println("Staff entity updated: " + this.getUser().getName());
  }
}
