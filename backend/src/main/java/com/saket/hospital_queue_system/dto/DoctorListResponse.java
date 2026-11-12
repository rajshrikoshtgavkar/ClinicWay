package com.saket.hospital_queue_system.dto;

import lombok.*;

/**
 * DTO for returning doctor information in list/search endpoints.
 * Excludes sensitive data and only includes publicly visible fields.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DoctorListResponse {
  private Long id;
  private String name;
  private String email;
  private String phone;
  private String profileImage;
  private String specialization;
  private String licenseNumber;
  private String bio;
  private Double consultationFee;
  private String availableSlots;
  private Boolean isAvailable;
  private ClinicBasicInfo clinic;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class ClinicBasicInfo {
    private Long id;
    private String name;
    private String address;
    private String district;
    private String taluka;
  }
}
