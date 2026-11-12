package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.PatientDashboardResponse;
import com.saket.hospital_queue_system.dto.PatientProfileResponse;
import com.saket.hospital_queue_system.dto.UpdatePatientProfileRequest;
import com.saket.hospital_queue_system.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

  private static final Logger logger = LoggerFactory.getLogger(PatientController.class);

  @Autowired
  private PatientService patientService;

  @GetMapping("/dashboard")
  public ResponseEntity<PatientDashboardResponse> getPatientDashboard() {
    System.out.println("PatientController: GET /api/patient/dashboard");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      PatientDashboardResponse response = patientService.getPatientDashboard(email);

      System.out.println("PatientController: Dashboard retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      logger.error("Failed to retrieve patient dashboard", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<PatientProfileResponse> getPatientProfile() {
    System.out.println("PatientController: GET /api/patient/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      PatientProfileResponse response = patientService.getPatientProfile(email);

      System.out.println("PatientController: Profile retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      logger.error("Failed to retrieve patient profile", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<PatientProfileResponse> getPatientById(@PathVariable Long id) {
    System.out.println("PatientController: GET /api/patient/" + id);
    try {
      PatientProfileResponse response = patientService.getPatientById(id);
      System.out.println("PatientController: Patient retrieved with id: " + id);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      logger.error("Failed to retrieve patient with ID {}", id, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/profile")
  public ResponseEntity<PatientProfileResponse> updatePatientProfile(
      @Valid @RequestBody UpdatePatientProfileRequest request) {
    System.out.println("PatientController: PUT /api/patient/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      PatientProfileResponse response = patientService.updatePatientProfile(email, request);

      System.out.println("PatientController: Profile updated for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      logger.error("Failed to update patient profile", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
