package com.saket.hospital_queue_system.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthResponse {
  private String token;
  private String email;
  private String role; // Changed from Role entity to String (PATIENT, DOCTOR, STAFF)
  private Long userId;
  private Long clinicId;
  private String message;
}
