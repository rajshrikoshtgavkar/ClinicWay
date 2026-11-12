package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.QueueCheckInRequest;
import com.saket.hospital_queue_system.dto.QueueStatusResponse;
import com.saket.hospital_queue_system.dto.DoctorQueueResponse;
import com.saket.hospital_queue_system.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

  @Autowired
  private QueueService queueService;

  @PostMapping("/check-in")
  public ResponseEntity<QueueStatusResponse> checkIn(@Valid @RequestBody QueueCheckInRequest request) {
    System.out.println("QueueController: POST /api/queue/check-in");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      QueueStatusResponse response = queueService.checkIn(email, request);

      System.out.println("QueueController: Check-in successful for patient: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("QueueController: Error during check-in: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/my-status")
  public ResponseEntity<QueueStatusResponse> getMyQueueStatus() {
    System.out.println("QueueController: GET /api/queue/my-status");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      QueueStatusResponse response = queueService.getQueueStatus(email);

      System.out.println("QueueController: Queue status retrieved for patient: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("QueueController: Error retrieving queue status: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/doctor/current")
  public ResponseEntity<DoctorQueueResponse> getDoctorQueue() {
    System.out.println("QueueController: GET /api/queue/doctor/current");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorQueueResponse response = queueService.getDoctorQueue(email);

      System.out.println("QueueController: Doctor queue retrieved for doctor: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("QueueController: Error retrieving doctor queue: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/call-next")
  public ResponseEntity<QueueStatusResponse> callNextPatient() {
    System.out.println("QueueController: PUT /api/queue/call-next");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      QueueStatusResponse response = queueService.callNextPatient(email);

      System.out.println("QueueController: Next patient called by doctor: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("QueueController: Error calling next patient: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/{queueId}/complete")
  public ResponseEntity<QueueStatusResponse> completePatient(@PathVariable Long queueId) {
    System.out.println("QueueController: PUT /api/queue/" + queueId + "/complete");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      QueueStatusResponse response = queueService.completePatient(email, queueId);

      System.out.println("QueueController: Patient marked as completed");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("QueueController: Error completing patient: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
