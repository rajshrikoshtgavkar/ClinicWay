package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.AppointmentStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
  private Long id;
  private String patientName;
  private String patientGender;
  private String appointmentDate;
  private String appointmentTime;
  private AppointmentStatus status;
  private String notes;
}
