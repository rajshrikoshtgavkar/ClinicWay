package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DoctorQueueResponse {

  private QueueEntryDto currentPatient;
  private List<QueueEntryDto> waitingPatients;
  private List<QueueEntryDto> completedPatients;
  private Integer totalSeenToday;
}
