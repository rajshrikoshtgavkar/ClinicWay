package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffDashboardResponse {
  private String staffName;
  private String email;
  private String department;
  private Boolean isActive;
  private Integer totalDoctors;
  private Integer totalAppointments;
  private Integer todayAppointments;
  private List<AppointmentDto> recentAppointments;
}
