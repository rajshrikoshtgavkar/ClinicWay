package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.*;
import com.saket.hospital_queue_system.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentService appointmentService;

    // COPILOT-FIX: CRITICAL - Added @Valid annotation and specific return type
    @PostMapping("/create")
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(appointmentService.createAppointment(email, request));

        } catch (Exception e) {
            logger.error("Failed to create patient appointment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Clinic dashboard
    @GetMapping("/all-clinic")
    public ResponseEntity<java.util.List<AppointmentResponseDto>> getAppointmentsByClinic(
            @RequestParam Long clinicId) {
        try {
            return ResponseEntity.ok(
                    appointmentService.getAppointmentsByClinic(clinicId));
        } catch (Exception e) {
            logger.error("Failed to retrieve clinic appointments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Doctor dashboard
    @GetMapping("/doctor/list")
    public ResponseEntity<java.util.List<AppointmentResponseDto>> getDoctorAppointments() {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.ok(
                    appointmentService.getDoctorAppointments(email));
        } catch (Exception e) {
            logger.error("Failed to retrieve doctor appointments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Patient dashboard - list own appointments
    @GetMapping("/patient/list")
    public ResponseEntity<java.util.List<AppointmentResponseDto>> getPatientAppointments() {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.ok(
                    appointmentService.getPatientAppointments(email));
        } catch (Exception e) {
            logger.error("Failed to retrieve patient appointments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Single appointment
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    appointmentService.getAppointmentById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Cancel appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> cancelAppointment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    appointmentService.cancelAppointment(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // COPILOT-FIX: CRITICAL - Added @Valid annotation and specific return type
    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAppointmentStatusRequest request) {
        try {
            return ResponseEntity.ok(
                    appointmentService.updateAppointmentStatus(id, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // COPILOT-FIX: CRITICAL - Added @Valid annotation and specific return type
    @PutMapping("/{id}/meeting-link")
    public ResponseEntity<AppointmentResponseDto> addMeetingLink(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMeetingLinkRequest request) {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.ok(
                    appointmentService.addMeetingLink(id, email, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
//    @PostMapping("/offline")
//    public ResponseEntity<?> createOfflineAppointment(
//            @RequestParam Long doctorId,
//            @RequestParam LocalDate appointmentDate,
//            @Valid @RequestBody OfflinePatientDTO request,
//            Authentication authentication
//    ) {
//        appointmentService.createOfflineAppointment(
//                authentication.getName(),
//                doctorId,
//                appointmentDate,
//                request
//        );
//        return ResponseEntity.ok("Offline appointment created");
//    }
}
