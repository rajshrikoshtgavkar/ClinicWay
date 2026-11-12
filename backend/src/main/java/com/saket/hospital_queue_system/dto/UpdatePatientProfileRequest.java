package com.saket.hospital_queue_system.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UpdatePatientProfileRequest {

  @NotBlank(message = "Name cannot be blank")
  private String name;

  @NotBlank(message = "Email cannot be blank")
  @Email(message = "Email should be valid")
  private String email;

  @NotBlank(message = "Phone cannot be blank")
  @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number should contain 10-15 digits")
  private String phone;

  private Integer age;

  private String gender;

  private String address;

  private String medicalHistory;
}
