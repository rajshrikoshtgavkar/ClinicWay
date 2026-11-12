package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.DoctorDashboardResponse;
import com.saket.hospital_queue_system.dto.DoctorListResponse;
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
 * Integration tests for DoctorService optimizations
 * CRITICAL: Verifies the enum comparison bug fix in getDoctorDashboard
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("DoctorService Optimization Tests")
class DoctorServiceOptimizationTests {

  @Autowired
  private DoctorService doctorService;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private ClinicRepository clinicRepository;

  private User doctorUser;
  private Doctor doctor;
  private Clinic clinic;
  private Patient patient;

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
    doctor.setConsultationFee(500.0);
    doctor.setAvailableSlots("09:00-17:00");
    doctor = doctorRepository.save(doctor);

    // Create patient
    User patientUser = new User();
    patientUser.setName("Patient Test");
    patientUser.setEmail("patient@test.com");
    patientUser.setPassword("password");
    patientUser.setRole(Role.PATIENT);
    patientUser.setPhone("9876543210");
    patientUser = userRepository.save(patientUser);

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
  @DisplayName("CRITICAL: getDoctorDashboard should count COMPLETED appointments correctly")
  void testGetDoctorDashboardCompletedAppointmentCount() {
    // Create mix of appointments with different statuses
    // 3 COMPLETED, 2 BOOKED
    for (int i = 0; i < 3; i++) {
      Appointment apt = new Appointment();
      apt.setDoctor(doctor);
      apt.setPatient(patient);
      apt.setClinic(clinic);
      apt.setBookedByUser(doctorUser);
      apt.setAppointmentDate(LocalDate.now().minusDays(i));
      apt.setAppointmentTime(LocalTime.of(10, 0));
      apt.setAppointmentType(AppointmentType.IN_PERSON);
      apt.setStatus(AppointmentStatus.COMPLETED); // COMPLETED
      apt.setQueueNumber(i + 1);
      apt.setNotes("Test appointment " + i);
      appointmentRepository.save(apt);
    }

    for (int i = 0; i < 2; i++) {
      Appointment apt = new Appointment();
      apt.setDoctor(doctor);
      apt.setPatient(patient);
      apt.setClinic(clinic);
      apt.setBookedByUser(doctorUser);
      apt.setAppointmentDate(LocalDate.now().plusDays(i));
      apt.setAppointmentTime(LocalTime.of(14, 0));
      apt.setAppointmentType(AppointmentType.ONLINE);
      apt.setStatus(AppointmentStatus.BOOKED); // BOOKED
      apt.setQueueNumber(i + 10);
      appointmentRepository.save(apt);
    }

    // Get dashboard
    DoctorDashboardResponse dashboard = doctorService.getDoctorDashboard("doctor@test.com");

    // CRITICAL VERIFICATION: This was broken before (always 0)
    assertNotNull(dashboard);
    assertEquals(5, dashboard.getTotalAppointments(), "Total appointments should be 5");
    assertEquals(3, dashboard.getCompletedAppointments(),
        "CRITICAL BUG FIX: Completed appointments should be 3, not 0! " +
            "This verifies the enum comparison fix: " +
            "AppointmentStatus.COMPLETED.equals(a.getStatus()) instead of " +
            "\"COMPLETED\".equals(a.getStatus())");
  }

  @Test
  @DisplayName("getDoctorDashboard should return correct total appointments")
  void testGetDoctorDashboardTotalAppointments() {
    // Create 5 appointments
    for (int i = 0; i < 5; i++) {
      Appointment apt = new Appointment();
      apt.setDoctor(doctor);
      apt.setPatient(patient);
      apt.setClinic(clinic);
      apt.setBookedByUser(doctorUser);
      apt.setAppointmentDate(LocalDate.now().plusDays(i));
      apt.setAppointmentTime(LocalTime.of(10 + i, 0));
      apt.setAppointmentType(AppointmentType.ONLINE);
      apt.setStatus(AppointmentStatus.BOOKED);
      apt.setQueueNumber(i + 1);
      appointmentRepository.save(apt);
    }

    // Get dashboard
    DoctorDashboardResponse dashboard = doctorService.getDoctorDashboard("doctor@test.com");

    // Verify
    assertNotNull(dashboard);
    assertEquals(5, dashboard.getTotalAppointments());
    assertEquals("Dr. Test", dashboard.getDoctorName());
    assertEquals("Cardiology", dashboard.getSpecialization());
  }

  @Test
  @DisplayName("getDoctorDashboard should return today's appointments")
  void testGetDoctorDashboardTodayAppointments() {
    // Create today's appointments
    for (int i = 0; i < 3; i++) {
      Appointment apt = new Appointment();
      apt.setDoctor(doctor);
      apt.setPatient(patient);
      apt.setClinic(clinic);
      apt.setBookedByUser(doctorUser);
      apt.setAppointmentDate(LocalDate.now()); // TODAY
      apt.setAppointmentTime(LocalTime.of(10 + i, 0));
      apt.setAppointmentType(AppointmentType.IN_PERSON);
      apt.setStatus(AppointmentStatus.BOOKED);
      apt.setQueueNumber(i + 1);
      appointmentRepository.save(apt);
    }

    // Create future appointments (should NOT be included)
    for (int i = 0; i < 2; i++) {
      Appointment apt = new Appointment();
      apt.setDoctor(doctor);
      apt.setPatient(patient);
      apt.setClinic(clinic);
      apt.setBookedByUser(doctorUser);
      apt.setAppointmentDate(LocalDate.now().plusDays(1 + i)); // TOMORROW+
      apt.setAppointmentTime(LocalTime.of(10, 0));
      apt.setAppointmentType(AppointmentType.ONLINE);
      apt.setStatus(AppointmentStatus.BOOKED);
      apt.setQueueNumber(i + 10);
      appointmentRepository.save(apt);
    }

    // Get dashboard
    DoctorDashboardResponse dashboard = doctorService.getDoctorDashboard("doctor@test.com");

    // Verify only today's appointments are returned
    assertEquals(3, dashboard.getTodayAppointments());
    assertNotNull(dashboard.getTodayAppointmentsList());
    assertEquals(3, dashboard.getTodayAppointmentsList().size());
  }

  @Test
  @DisplayName("getAvailableDoctors should use readOnly transaction")
  void testGetAvailableDoctorsOptimization() {
    // Create available doctor
    Doctor doc2 = new Doctor();
    User user2 = new User();
    user2.setName("Dr. Available");
    user2.setEmail("available@test.com");
    user2.setPassword("password");
    user2.setRole(Role.DOCTOR);
    user2.setPhone("5555555555");
    user2 = userRepository.save(user2);

    doc2.setUser(user2);
    doc2.setClinic(clinic);
    doc2.setSpecialization("Neurology");
    doc2.setLicenseNumber("DOC456");
    doc2.setIsAvailable(true);
    doctorRepository.save(doc2);

    // Get available doctors
    List<DoctorListResponse> doctors = doctorService.getAvailableDoctors();

    // Verify
    assertNotNull(doctors);
    assertTrue(doctors.size() >= 2);
    assertTrue(doctors.stream().anyMatch(d -> d.getEmail().equals("doctor@test.com")));
    assertTrue(doctors.stream().anyMatch(d -> d.getEmail().equals("available@test.com")));
  }

  @Test
  @DisplayName("getDoctorsForClinic should use readOnly transaction")
  void testGetDoctorsForClinicOptimization() {
    // Get doctors for clinic
    List<DoctorListResponse> doctors = doctorService.getDoctorsForClinic(clinic.getId());

    // Verify
    assertNotNull(doctors);
    assertEquals(1, doctors.size());
    assertEquals("Dr. Test", doctors.get(0).getName());
    assertEquals("Cardiology", doctors.get(0).getSpecialization());
  }

  @Test
  @DisplayName("getDoctorProfile should use readOnly transaction")
  void testGetDoctorProfileOptimization() {
    // Get profile
    var profile = doctorService.getDoctorProfile("doctor@test.com");

    // Verify
    assertNotNull(profile);
    assertEquals("Dr. Test", profile.getName());
    assertEquals("doctor@test.com", profile.getEmail());
    assertEquals("Cardiology", profile.getSpecialization());
  }
}
