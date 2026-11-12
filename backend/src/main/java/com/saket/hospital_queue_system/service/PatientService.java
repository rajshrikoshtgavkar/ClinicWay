package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentDto;
import com.saket.hospital_queue_system.dto.PatientDashboardResponse;
import com.saket.hospital_queue_system.dto.PatientProfileResponse;
import com.saket.hospital_queue_system.dto.UpdatePatientProfileRequest;
import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.AppointmentStatus;
import com.saket.hospital_queue_system.entity.Patient;
import com.saket.hospital_queue_system.entity.Role;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.PatientRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

        private static final Logger logger = LoggerFactory.getLogger(PatientService.class);

        @Autowired
        private PatientRepository patientRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Transactional
        public PatientDashboardResponse getPatientDashboard(String email) {
                logger.info("Getting dashboard for email: {}", email);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Patient patient = getOrCreatePatientProfile(user);

                // Get all appointments
                List<Appointment> allAppointments = appointmentRepository
                                .findByPatientOrderByAppointmentDateDesc(patient);

                // Count statistics
                int totalAppointments = allAppointments.size();
                int completedAppointments = (int) allAppointments.stream()
                                .filter(a -> AppointmentStatus.COMPLETED.equals(a.getStatus()))
                                .count();
                int upcomingAppointments = (int) allAppointments.stream()
                                .filter(a -> AppointmentStatus.BOOKED.equals(a.getStatus())
                                                && a.getAppointmentDate() != null
                                                && a.getAppointmentDate().isAfter(LocalDate.now()))
                                .count();

                // Get recent appointments (limit to 5)
                List<AppointmentDto> recentAppointments = allAppointments.stream()
                                .limit(5)
                                .map(appointment -> {
                                        Patient appointmentPatient = appointment.getPatient();
                                        User appointmentPatientUser = appointmentPatient != null
                                                        ? appointmentPatient.getUser()
                                                        : null;
                                        String patientName = appointmentPatient == null
                                                        ? null
                                                        : appointmentPatient.getPatientName() != null
                                                                        ? appointmentPatient.getPatientName()
                                                                        : appointmentPatientUser != null
                                                                                        ? appointmentPatientUser
                                                                                                        .getName()
                                                                                        : null;
                                        return new AppointmentDto(
                                                        appointment.getId(),
                                                        patientName,
                                                        appointmentPatient != null
                                                                        ? appointmentPatient.getGender()
                                                                        : null,
                                                        appointment.getAppointmentDate() == null
                                                                        ? null
                                                                        : appointment.getAppointmentDate()
                                                                                        .toString(),
                                                        appointment.getAppointmentTime() == null
                                                                        ? null
                                                                        : appointment.getAppointmentTime()
                                                                                        .toString(),
                                                        appointment.getStatus(),
                                                        appointment.getNotes());
                                })
                                .collect(Collectors.toList());

                PatientDashboardResponse response = new PatientDashboardResponse();
                response.setPatientName(user.getName());
                response.setEmail(user.getEmail());
                response.setAge(patient.getAge());
                response.setProfileImage(user.getProfileImage());
                response.setGender(patient.getGender());
                response.setAddress(patient.getAddress());
                response.setMedicalHistory(patient.getMedicalHistory());
                response.setTotalAppointments(totalAppointments);
                response.setCompletedAppointments(completedAppointments);
                response.setUpcomingAppointments(upcomingAppointments);
                response.setRecentAppointments(recentAppointments);

                logger.info("Dashboard retrieved successfully");
                return response;
        }

        @Transactional
        public PatientProfileResponse getPatientProfile(String email) {
                logger.info("Getting profile for email: {}", email);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Patient patient = getOrCreatePatientProfile(user);

                return convertToProfileResponse(user, patient);
        }

        @Transactional(readOnly = true)
        public PatientProfileResponse getPatientById(Long patientId) {
                logger.info("Getting patient by ID: {}", patientId);

                Patient patient = patientRepository.findById(patientId)
                                .orElseThrow(() -> new RuntimeException("Patient not found"));

                return convertToProfileResponse(patient.getUser(), patient);
        }

        @Transactional
        public PatientProfileResponse updatePatientProfile(String email, UpdatePatientProfileRequest request) {
                logger.info("Updating profile for email: {}", email);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Patient patient = getOrCreatePatientProfile(user);

                // Update user fields
                user.setName(request.getName());
                user.setEmail(request.getEmail());
                user.setPhone(request.getPhone());
                userRepository.save(user);

                // Update patient fields
                patient.setAge(request.getAge());
                patient.setGender(request.getGender());
                patient.setAddress(request.getAddress());
                patient.setMedicalHistory(request.getMedicalHistory());
                patientRepository.save(patient);

                logger.info("Patient profile updated successfully");
                return convertToProfileResponse(user, patient);
        }

        @Transactional
        public Patient getOrCreatePatientProfile(User user) {
                if (user.getRole() != Role.PATIENT) {
                        throw new IllegalArgumentException("Only patient accounts have patient profiles");
                }

                return patientRepository.findByUserId(user.getId()).orElseGet(() -> {
                        Patient patient = new Patient();
                        patient.setUser(user);
                        patient.setPatientName(user.getName());
                        patient.setPhoneNumber(user.getPhone());
                        patient.setIsActive(true);
                        logger.warn("Recreating missing patient profile for user ID {}", user.getId());
                        return patientRepository.save(patient);
                });
        }

        private PatientProfileResponse convertToProfileResponse(User user, Patient patient) {
                PatientProfileResponse response = new PatientProfileResponse();
                response.setId(patient.getId());
                response.setName(user != null ? user.getName() : patient.getPatientName());
                response.setEmail(user != null ? user.getEmail() : null);
                response.setPhone(user != null ? user.getPhone() : patient.getPhoneNumber());
                response.setAge(patient.getAge());
                response.setGender(patient.getGender());
                response.setAddress(patient.getAddress());
                response.setMedicalHistory(patient.getMedicalHistory());
                response.setProfileImage(user != null ? user.getProfileImage() : null);
                response.setIsActive(patient.getIsActive());
                response.setCreatedAt(patient.getCreatedAt());
                response.setUpdatedAt(patient.getUpdatedAt());
                return response;
        }
}
