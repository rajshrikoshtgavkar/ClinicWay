package com.saket.hospital_queue_system.dto;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMeetingLinkRequest {
  @NotBlank(message = "Meeting link is required")
  @URL(message = "Meeting link must be a valid URL")
  private String meetingLink;

  @Size(max = 50, message = "Meeting platform name cannot exceed 50 characters")
  private String meetingPlatform; // GOOGLE_MEET, ZOOM, MICROSOFT_TEAMS, etc.
}
