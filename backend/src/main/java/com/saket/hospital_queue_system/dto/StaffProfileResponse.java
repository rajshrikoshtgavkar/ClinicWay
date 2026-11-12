package com.saket.hospital_queue_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffProfileResponse {
  private Long id;
  private String name;
  private String email;
  private String phone;
  private String department;
  private String position;
  private String notes;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
