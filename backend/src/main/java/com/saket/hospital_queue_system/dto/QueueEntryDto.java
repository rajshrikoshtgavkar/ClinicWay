package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QueueEntryDto {
    private Long appointmentId;
  private Long queueId;
  private Long patientId;
  private String patientName;
  private String patientPhone;
  private Integer patientAge;
  private String patientGender;
  private String status;
  private Integer position;
  private Integer estimatedWaitMinutes;
  private LocalDateTime checkInTime;
  private LocalDateTime calledTime;
  private LocalDateTime appointmentTime;
}
