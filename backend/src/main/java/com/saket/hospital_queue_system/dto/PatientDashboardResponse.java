package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientDashboardResponse {
  private String patientName;
  private String email;
  private Integer age;
  private String gender;
  private String address;
  private String profileImage;
  private String medicalHistory;
  private Integer totalAppointments;
  private Integer completedAppointments;
  private Integer upcomingAppointments;
  private List<AppointmentDto> recentAppointments;
}
