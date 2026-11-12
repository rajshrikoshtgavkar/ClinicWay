package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AuthResponse;
import com.saket.hospital_queue_system.dto.ClinicSignupRequest;
import com.saket.hospital_queue_system.dto.LoginRequest;
import com.saket.hospital_queue_system.dto.SignupRequest;
import com.saket.hospital_queue_system.dto.UserResponse;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.repository.*;
import com.saket.hospital_queue_system.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private StaffRepository staffRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private ClinicRepository clinicRepository;

  @Transactional
  public Boolean signup(SignupRequest request) {
    logger.info("Signup request for email: {}, role: {}", request.getEmail(), request.getRole());

    // COPILOT-FIX: MAJOR - Add validation for role string
    if (request.getRole() == null || request.getRole().isBlank()) {
      throw new RuntimeException("Role is required");
    }

    Role roleEnum;
    try {
      roleEnum = Role.valueOf(request.getRole().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw new RuntimeException("Invalid role. Must be PATIENT, DOCTOR, or STAFF");
    }

    // Check if user already exists
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already registered");
    }

    if (userRepository.existsByPhone(request.getPhone())) {
      throw new RuntimeException("Phone number already registered");
    }

    if (roleEnum == Role.STAFF) {
      if (request.getClinic() == null) {
        throw new RuntimeException("Clinic details are required for staff signup");
      }
    }

    // Create user
    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setProfileImage(request.getProfileImage());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(roleEnum);
    user.setIsActive(true);
    User savedUser = userRepository.save(user);
    logger.info("User created with ID: {}", savedUser.getId());

    // Create role-specific profile
    switch (roleEnum) {
      case PATIENT:
        Patient patient = new Patient();
        patient.setUser(savedUser);
        patient.setPhoneNumber(savedUser.getPhone());
        patient.setPatientName(savedUser.getName());
        patient.setIsActive(true);
        patientRepository.save(patient);
        logger.info("Patient profile created");
        break;

      case DOCTOR:
        // COPILOT-FIX: MAJOR - Doctor signup should be handled separately via
        // DoctorCreateDTO
        logger.info("Doctor signup should use separate endpoint /api/doctor/add-doctor");
        throw new RuntimeException("Doctor signup not available via auth endpoint");

      case STAFF:
        ClinicSignupRequest clinicRequest = request.getClinic();
        Clinic clinic = new Clinic();
        clinic.setName(clinicRequest.getName());
        clinic.setDistrict(clinicRequest.getDistrict());
        clinic.setTaluka(clinicRequest.getTaluka());
        clinic.setState(clinicRequest.getState());
        clinic.setAddress(clinicRequest.getAddress());
        clinic.setActive(true);

        Clinic savedClinic = clinicRepository.save(clinic);
        logger.info("Clinic created with ID: {}", savedClinic.getId());

        // Create Staff (Clinic Admin)
        Staff staff = new Staff();
        staff.setUser(savedUser);
        staff.setClinic(savedClinic);
        staff.setDepartment("Administration");
        staff.setIsActive(true);

        staffRepository.save(staff);
        logger.info("Staff profile created as clinic admin");
        break;
    }
    return true;
  }

  public AuthResponse login(LoginRequest request) {
    logger.info("Login attempt for email: {}", request.getEmail());

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    String token = jwtTokenProvider.generateToken(user);
    logger.info("Token generated for user: {}", request.getEmail());

    // COPILOT-FIX: MAJOR - Convert Role enum to String
    AuthResponse response = new AuthResponse();
    response.setToken(token);
    response.setEmail(user.getEmail());
    response.setRole(user.getRole().toString());
    response.setUserId(user.getId());
    response.setClinicId(
        user.getRole() == Role.STAFF
            ? staffRepository.findByUserId(user.getId())
                .map(staff -> staff.getClinic().getId())
                .orElse(null)
            : null);
    response.setMessage("Login successful");

    return response;
  }

  public UserResponse getCurrentUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    logger.debug("Getting current user info: {}", user.getEmail());

    UserResponse response = new UserResponse();
    response.setId(user.getId());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());
    response.setRole(user.getRole().toString()); // COPILOT-FIX: Convert enum to string
    response.setName(user.getName());
    response.setClinicId(
        user.getRole() == Role.STAFF
            ? staffRepository.findByUserId(user.getId())
                .map(staff -> staff.getClinic().getId())
                .orElse(null)
            : null);
    response.setProfileImage(user.getProfileImage());
    response.setIsActive(user.getIsActive());

    return response;
  }
}
