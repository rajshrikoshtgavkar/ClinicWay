package com.saket.hospital_queue_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStaffProfileRequest {
  @Email(message = "Email should be valid")
  private String email;

  @NotBlank(message = "Phone cannot be blank")
  @Pattern(regexp = "\\d{10,15}", message = "Phone number should be 10-15 digits")
  private String phone;

  @NotBlank(message = "Department cannot be blank")
  private String department;

  @NotBlank(message = "Position cannot be blank")
  private String position;

  private String notes;
}
