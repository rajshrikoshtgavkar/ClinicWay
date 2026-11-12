package com.saket.hospital_queue_system.dto;

import lombok.*;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QueueCheckInRequest {

  @NotNull(message = "Appointment ID cannot be null")
  private Long appointmentId;
}
