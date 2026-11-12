package com.saket.hospital_queue_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OfflinePatientDTO {

    @NotBlank(message = "Patient full name is required")
    private String fullName;

    @NotBlank(message = "Gender is required")
    private String gender; // MALE / FEMALE / OTHER

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid Indian phone number"
    )
    private String phone;

    // Optional
    private Integer age;
    private String email;
    private String address;
}
