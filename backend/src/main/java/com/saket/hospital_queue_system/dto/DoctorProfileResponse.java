package com.saket.hospital_queue_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorProfileResponse {
  private Long id;
  private String name;
  private String email;
  private String phone;
  private String specialization;
  private String licenseNumber;
  private String bio;
  private Double consultationFee;
  private String availableSlots;
  private Boolean isAvailable;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
