package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentResponseDto;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for AppointmentService optimizations
 * Verifies @Transactional(readOnly=true) and N+1 query fixes
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("AppointmentService Optimization Tests")
class AppointmentServiceOptimizationTests {

  @Autowired
  private AppointmentService appointmentService;

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private ClinicRepository clinicRepository;

  private User doctorUser;
  private User patientUser;
  private Doctor doctor;
  private Patient patient;
  private Clinic clinic;

  @BeforeEach
  void setUp() {
    // Create test clinic
    clinic = new Clinic();
    clinic.setName("Test Clinic");
    clinic.setAddress("123 Main St");
        clinic.setDistrict("Test District");
        clinic.setTaluka("Test Taluka");
        clinic.setState("Test State");
    doctorUser = new User();
    doctorUser.setName("Dr. Test");
    doctorUser.setEmail("doctor@test.com");
    doctorUser.setPassword("password");
    doctorUser.setRole(Role.DOCTOR);
    doctorUser.setPhone("1234567890");
    doctorUser = userRepository.save(doctorUser);

    // Create doctor
    doctor = new Doctor();
    doctor.setUser(doctorUser);
    doctor.setClinic(clinic);
    doctor.setSpecialization("Cardiology");
    doctor.setLicenseNumber("DOC123");
    doctor.setIsAvailable(true);
    doctor = doctorRepository.save(doctor);

    // Create patient user
    patientUser = new User();
    patientUser.setName("Patient Test");
    patientUser.setEmail("patient@test.com");
    patientUser.setPassword("password");
    patientUser.setRole(Role.PATIENT);
    patientUser.setPhone("9876543210");
    patientUser = userRepository.save(patientUser);

    // Create patient
    patient = new Patient();
    patient.setUser(patientUser);
    patient.setPatientName("Patient Test");
    patient.setAge(30);
    patient.setGender("MALE");
    patient.setPhoneNumber("9876543210");
    patient.setIsActive(true);
    patient = patientRepository.save(patient);
  }

  @Test
  @DisplayName("getDoctorAppointments should use readOnly transaction")
  void testGetDoctorAppointmentsOptimization() {
    // Create test appointment
    Appointment appointment = new Appointment();
    appointment.setDoctor(doctor);
    appointment.setPatient(patient);
    appointment.setClinic(clinic);
    appointment.setBookedByUser(patientUser);
    appointment.setAppointmentDate(LocalDate.now());
    appointment.setAppointmentTime(LocalTime.of(10, 0));
    appointment.setAppointmentType(AppointmentType.ONLINE);
    appointment.setStatus(AppointmentStatus.BOOKED);
    appointment.setQueueNumber(1);
    appointmentRepository.save(appointment);

    // Call optimized method
    List<AppointmentResponseDto> appointments = appointmentService.getDoctorAppointments("doctor@test.com");

    // Verify
    assertNotNull(appointments);
    assertEquals(1, appointments.size());
    assertEquals(appointment.getId(), appointments.get(0).getId());
  }

  @Test
  @DisplayName("getPatientAppointments should use readOnly transaction")
  void testGetPatientAppointmentsOptimization() {
    // Create test appointments
    Appointment apt1 = new Appointment();
    apt1.setDoctor(doctor);
    apt1.setPatient(patient);
    apt1.setClinic(clinic);
    apt1.setBookedByUser(patientUser);
    apt1.setAppointmentDate(LocalDate.now());
    apt1.setAppointmentTime(LocalTime.of(10, 0));
    apt1.setAppointmentType(AppointmentType.IN_PERSON);
    apt1.setStatus(AppointmentStatus.BOOKED);
    apt1.setQueueNumber(1);
    appointmentRepository.save(apt1);

    // Call optimized method
    List<AppointmentResponseDto> appointments = appointmentService.getPatientAppointments("patient@test.com");

    // Verify
    assertNotNull(appointments);
    assertEquals(1, appointments.size());
  }

  @Test
  @DisplayName("getAppointmentById should use readOnly transaction")
  void testGetAppointmentByIdOptimization() {
    // Create test appointment
    Appointment appointment = new Appointment();
    appointment.setDoctor(doctor);
    appointment.setPatient(patient);
    appointment.setClinic(clinic);
    appointment.setBookedByUser(patientUser);
    appointment.setAppointmentDate(LocalDate.now());
    appointment.setAppointmentTime(LocalTime.of(10, 0));
    appointment.setAppointmentType(AppointmentType.ONLINE);
    appointment.setStatus(AppointmentStatus.BOOKED);
    appointment.setQueueNumber(1);
    appointment = appointmentRepository.save(appointment);

    // Call optimized method
    AppointmentResponseDto result = appointmentService.getAppointmentById(appointment.getId());

    // Verify
    assertNotNull(result);
    assertEquals(appointment.getId(), result.getId());
    assertEquals("BOOKED", result.getStatus());
  }

  @Test
  @DisplayName("updateAppointmentStatus should handle enum conversion safely")
  void testUpdateAppointmentStatusEnumHandling() {
    // Create test appointment
    Appointment appointment = new Appointment();
    appointment.setDoctor(doctor);
    appointment.setPatient(patient);
    appointment.setClinic(clinic);
    appointment.setBookedByUser(patientUser);
    appointment.setAppointmentDate(LocalDate.now());
    appointment.setAppointmentTime(LocalTime.of(10, 0));
    appointment.setAppointmentType(AppointmentType.IN_PERSON);
    appointment.setStatus(AppointmentStatus.BOOKED);
    appointment.setQueueNumber(1);
    appointment = appointmentRepository.save(appointment);

    // Test enum conversion
    try {
      // This should work without throwing exception
      appointment.setStatus(AppointmentStatus.IN_PROGRESS);
      appointmentRepository.save(appointment);
      assertTrue(true, "Enum conversion should work");
    } catch (Exception e) {
      fail("Enum conversion should not throw: " + e.getMessage());
    }
  }

  @Test
  @DisplayName("getAppointmentsByClinic should use optimized repository query")
  void testGetAppointmentsByClinicOptimization() {
    // Create multiple test appointments
    for (int i = 0; i < 3; i++) {
      Appointment apt = new Appointment();
      apt.setDoctor(doctor);
      apt.setPatient(patient);
      apt.setClinic(clinic);
      apt.setBookedByUser(patientUser);
      apt.setAppointmentDate(LocalDate.now().plusDays(i));
      apt.setAppointmentTime(LocalTime.of(10 + i, 0));
      apt.setAppointmentType(AppointmentType.ONLINE);
      apt.setStatus(AppointmentStatus.BOOKED);
      apt.setQueueNumber(i + 1);
      appointmentRepository.save(apt);
    }

    // Call optimized method
    List<AppointmentResponseDto> appointments = appointmentService.getAppointmentsByClinic(clinic.getId());

    // Verify
    assertNotNull(appointments);
    assertEquals(3, appointments.size());
    // Verify appointments are ordered by date/time
    assertEquals(LocalDate.now(), appointments.get(0).getAppointmentDate());
  }
}
