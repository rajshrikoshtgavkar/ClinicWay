package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PatientProfileResponse {
  private Long id;
  private String name;
  private String email;
  private String phone;
  private Integer age;
  private String gender;
  private String address;
  private String medicalHistory;
  private String profileImage;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
