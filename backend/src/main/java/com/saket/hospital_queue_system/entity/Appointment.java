package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Doctor doctor;

    @ManyToOne(optional = false)
    private Clinic clinic;

    @ManyToOne(optional = false)
    private Patient patient;

    @ManyToOne(optional = false)
    private User bookedByUser; // Logged-in user

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private AppointmentType appointmentType;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private Integer queueNumber;

    private String meetingLink;

    private String meetingPlatform;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
