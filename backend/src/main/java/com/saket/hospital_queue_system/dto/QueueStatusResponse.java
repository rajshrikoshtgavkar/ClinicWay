package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QueueStatusResponse {

  private Long queueId;
  private Long appointmentId;
  private String patientName;
  private String doctorName;
  private String doctorSpecialization;
  private String status; // WAITING, IN_PROGRESS, COMPLETED, CANCELLED
  private Integer position;
  private Integer estimatedWaitMinutes;
  private LocalDateTime checkInTime;
  private LocalDateTime calledTime;
  private LocalDateTime completedTime;
}
