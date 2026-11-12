package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.StaffDashboardResponse;
import com.saket.hospital_queue_system.dto.StaffProfileResponse;
import com.saket.hospital_queue_system.dto.UpdateStaffProfileRequest;
import com.saket.hospital_queue_system.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

  @Autowired
  private StaffService staffService;

  @GetMapping("/dashboard")
  public ResponseEntity<StaffDashboardResponse> getStaffDashboard() {
    System.out.println("StaffController: GET /api/staff/dashboard");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      StaffDashboardResponse response = staffService.getStaffDashboard(email);

      System.out.println("StaffController: Dashboard retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("StaffController: Error retrieving dashboard: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<StaffProfileResponse> getStaffProfile() {
    System.out.println("StaffController: GET /api/staff/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      StaffProfileResponse response = staffService.getStaffProfile(email);

      System.out.println("StaffController: Profile retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("StaffController: Error retrieving profile: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/profile")
  public ResponseEntity<StaffProfileResponse> updateStaffProfile(
      @Valid @RequestBody UpdateStaffProfileRequest request) {
    System.out.println("StaffController: PUT /api/staff/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      StaffProfileResponse response = staffService.updateStaffProfile(email, request);

      System.out.println("StaffController: Profile updated for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("StaffController: Error updating profile: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
