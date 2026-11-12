package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Queue {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "doctor_id", nullable = false)
  private Doctor doctor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "appointment_id", nullable = false)
  private Appointment appointment;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private QueueStatus status; // WAITING, IN_PROGRESS, COMPLETED, CANCELLED

  @Column(nullable = false)
  private Integer position;

  @Column(name = "check_in_time")
  private LocalDateTime checkInTime;

  @Column(name = "called_time")
  private LocalDateTime calledTime;

  @Column(name = "completed_time")
  private LocalDateTime completedTime;

  @Column(name = "estimated_wait_minutes")
  private Integer estimatedWaitMinutes;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
