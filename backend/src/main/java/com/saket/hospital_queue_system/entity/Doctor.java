package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Doctor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(nullable = false, length = 100)
  private String specialization;

  @Column(length = 50)
  private String licenseNumber;

  @Column(length = 250)
  private String bio;

  @Column(name = "consultation_fee")
  private Double consultationFee;

  @ManyToOne
  private Clinic clinic;

  @Column(length = 20)
  private String availableSlots; // e.g., "09:00-17:00"

  @Column(name = "is_available", nullable = false)
  private Boolean isAvailable = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private java.time.LocalDateTime createdAt;

  @Column(name = "updated_at")
  private java.time.LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = java.time.LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = java.time.LocalDateTime.now();
  }
}
