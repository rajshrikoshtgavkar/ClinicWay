package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Patient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = true, unique = false)
  private User user;

  @Column(name="patient_name")
  private String patientName;

  @Column(length = 3)
  private Integer age;

  @Column(length = 20)
  private String gender;

  @Column(length = 15)
  private String phoneNumber;

  @Column(length = 100)
  private String address;

  @Column(length = 250)
  private String medicalHistory;

  @Column(name = "is_active", nullable = false)
  private Boolean isActive = true;

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
