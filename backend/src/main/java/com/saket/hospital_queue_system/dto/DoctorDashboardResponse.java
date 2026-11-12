package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDashboardResponse {
  private String doctorName;
  private String email;
  private String specialization;
  private String licenseNumber;
  private String bio;
  private Double consultationFee;
  private String availableSlots;
  private Boolean isAvailable;
  private Integer totalAppointments;
  private Integer completedAppointments;
  private Integer todayAppointments;
  private List<AppointmentDto> todayAppointmentsList;
}
