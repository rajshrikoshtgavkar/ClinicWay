package com.saket.hospital_queue_system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ClinicSignupRequest {
  @NotBlank(message = "Clinic name is required")
  private String name;

  @NotBlank(message = "Address is required")
  private String address;

  @NotBlank(message = "State is required")
  private String state;

  @NotBlank(message = "District is required")
  private String district;

  @NotBlank(message = "Taluka is required")
  private String taluka;

  private String phone;
}
