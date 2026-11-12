package com.saket.hospital_queue_system.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserResponse {
  private Long id;
  private String name;
  private String email;
  private String phone;
  private String profileImage;
  private String role; // Changed from Role entity to String
  private Long clinicId;
  private Boolean isActive;
}
