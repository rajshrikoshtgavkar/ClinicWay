package com.saket.hospital_queue_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignupRequest {
  @Email(message = "Email should be valid")
  @NotBlank(message = "Email is required")
  private String email;

  @NotBlank(message = "Phone is required")
  @Size(min = 10, max = 15, message = "Phone must be between 10 and 15 digits")
  private String phone;

  @NotBlank(message = "Password is required")
  @Size(min = 6, message = "Password must be at least 6 characters")
  private String password;

  private String profileImage;

  @NotBlank(message = "Role is required")
  private String role; // PATIENT, DOCTOR, STAFF

  @NotBlank(message = "Name is required")
  private String name;

  // For STAFF signup - clinic details
  private ClinicSignupRequest clinic;

  // For DOCTOR signup - specialization details
  private String specialization;
  private Long clinicId;
}
