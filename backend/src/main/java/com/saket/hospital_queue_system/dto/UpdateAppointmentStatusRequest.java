package com.saket.hospital_queue_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentStatusRequest {
  @NotBlank(message = "Status is required")
  private String status; // BOOKED, IN_PROGRESS, COMPLETED, CANCELLED

  @Size(max = 500, message = "Notes cannot exceed 500 characters")
  private String notes;
}
