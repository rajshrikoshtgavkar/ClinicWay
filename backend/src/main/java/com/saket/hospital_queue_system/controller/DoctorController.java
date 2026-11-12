package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.DoctorCreateDTO;
import com.saket.hospital_queue_system.dto.DoctorDashboardResponse;
import com.saket.hospital_queue_system.dto.DoctorListResponse;
import com.saket.hospital_queue_system.dto.DoctorProfileResponse;
import com.saket.hospital_queue_system.dto.UpdateDoctorProfileRequest;
import com.saket.hospital_queue_system.entity.Clinic;
import com.saket.hospital_queue_system.entity.Doctor;
import com.saket.hospital_queue_system.entity.Role;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
import com.saket.hospital_queue_system.service.ClinicService;
import com.saket.hospital_queue_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

  @Autowired
  private DoctorService doctorService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private ClinicService clinicService;

  @Transactional
  @PostMapping("/add-doctor")
  public ResponseEntity<String> addDoctor(@Valid @RequestBody DoctorCreateDTO request) {
    System.out.println("DoctorController: POST /api/doctor/add-doctor");
    try {
      // COPILOT-FIX: CRITICAL - Completely refactored to use DTO instead of entities
      // Create User
      User user = new User();
      user.setEmail(request.getEmail());
      user.setName(request.getName());
      user.setPhone(request.getPhone());
      user.setPassword(passwordEncoder.encode(request.getPassword()));
      user.setProfileImage(request.getProfileImage());
      user.setRole(Role.DOCTOR);
      user.setIsActive(true);
      User savedUser = userRepository.save(user);

      // Create Doctor profile
      Doctor newDoctor = new Doctor();
      newDoctor.setUser(savedUser);
      newDoctor.setSpecialization(request.getSpecialization());
      newDoctor.setConsultationFee(request.getConsultationFee());
      newDoctor.setLicenseNumber(request.getLicenseNumber());
      newDoctor.setBio(request.getBio());

      // Associate with clinic
      Clinic clinic = clinicService.getClinicById(request.getClinicId());
      if (clinic == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Clinic not found");
      }
      newDoctor.setClinic(clinic);

      doctorRepository.save(newDoctor);
      System.out.println("DoctorController: Doctor added with email: " + user.getEmail());
      return ResponseEntity.status(HttpStatus.CREATED).body("Doctor added successfully");
    } catch (Exception e) {
      System.out.println("DoctorController: Error adding doctor: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Error adding doctor: " + e.getMessage());
    }
  }

  @GetMapping("/dashboard")
  public ResponseEntity<DoctorDashboardResponse> getDoctorDashboard() {
    System.out.println("DoctorController: GET /api/doctor/dashboard");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorDashboardResponse response = doctorService.getDoctorDashboard(email);

      System.out.println("DoctorController: Dashboard retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving dashboard: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/available")
  public ResponseEntity<List<DoctorListResponse>> getAvailableDoctors() {
    System.out.println("DoctorController: GET /api/doctor/available");
    try {
      List<DoctorListResponse> doctors = doctorService.getAvailableDoctors();
      return ResponseEntity.ok(doctors);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving available doctors: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping
  public ResponseEntity<List<DoctorListResponse>> getAllDoctors() {
    System.out.println("DoctorController: GET /api/doctor");
    try {
      List<DoctorListResponse> doctors = doctorService.getAvailableDoctors();
      return ResponseEntity.ok(doctors);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving doctors: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/clinic/{clinicId}")
  public ResponseEntity<List<DoctorListResponse>> getDoctorsForClinic(@PathVariable Long clinicId) {
    System.out.println("DoctorController: GET /api/doctor/clinic/" + clinicId);
    try {
      List<DoctorListResponse> doctors = doctorService.getDoctorsForClinic(clinicId);
      return ResponseEntity.ok(doctors);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving doctors for clinic: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<DoctorProfileResponse> getDoctorProfile() {
    System.out.println("DoctorController: GET /api/doctor/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorProfileResponse response = doctorService.getDoctorProfile(email);

      System.out.println("DoctorController: Profile retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving profile: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/profile")
  public ResponseEntity<DoctorProfileResponse> updateDoctorProfile(
      @Valid @RequestBody UpdateDoctorProfileRequest request) {
    System.out.println("DoctorController: PUT /api/doctor/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorProfileResponse response = doctorService.updateDoctorProfile(email, request);

      System.out.println("DoctorController: Profile updated for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DoctorController: Error updating profile: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
