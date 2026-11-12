package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.*;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

        @Autowired
        private AppointmentRepository appointmentRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private PatientRepository patientRepository;
        @Autowired
        private DoctorRepository doctorRepository;
        @Autowired
        private PatientService patientService;

        // Create appointment
        @Transactional
        public AppointmentResponseDto createAppointment(
                        String email,
                        CreateAppointmentRequest request) {
                User bookedBy = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (bookedBy.getRole() != Role.PATIENT) {
                        throw new RuntimeException("Only patients can book appointments");
                }

                Doctor doctor = doctorRepository.findById(request.getDoctorId())
                                .orElseThrow(() -> new RuntimeException("Doctor not found"));
                if (doctor.getClinic() == null) {
                        throw new IllegalArgumentException(
                                        "This doctor is not associated with a clinic and cannot accept appointments");
                }

                Patient patient;

                if ("SELF".equalsIgnoreCase(request.getBookingFor())) {
                        patient = patientService.getOrCreatePatientProfile(bookedBy);
                } else {
                        PatientDetailsDto d = request.getPatientDetails();
                        if (d == null)
                                throw new RuntimeException("Patient details required");

                        Patient p = new Patient();
                        p.setUser(null);
                        p.setPatientName(d.getName());
                        p.setAge(d.getAge());
                        p.setGender(d.getGender());
                        p.setPhoneNumber(d.getPhone());
                        p.setIsActive(true);
                        patient = patientRepository.save(p);
                }

                int queueNumber = appointmentRepository.countByDoctorIdAndAppointmentDateAndStatusIn(
                                doctor.getId(),
                                request.getAppointmentDate(),
                                List.of(
                                                AppointmentStatus.BOOKED,
                                                AppointmentStatus.CHECKED_IN,
                                                AppointmentStatus.IN_PROGRESS))
                                + 1;

                Appointment appointment = new Appointment();
                appointment.setDoctor(doctor);
                appointment.setClinic(doctor.getClinic());
                appointment.setPatient(patient);
                appointment.setBookedByUser(bookedBy);
                appointment.setAppointmentDate(request.getAppointmentDate());
                appointment.setAppointmentTime(request.getAppointmentTime());
                appointment.setPaymentStatus(request.getAppointmentType().equalsIgnoreCase("ONLINE")
                                ? PaymentStatus.COMPLETED
                                : PaymentStatus.PENDING);

                // COPILOT-FIX: MAJOR - Convert appointmentType string to enum
                AppointmentType appointmentType;
                try {
                        appointmentType = AppointmentType.valueOf(request.getAppointmentType().toUpperCase());
                } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid appointment type. Must be ONLINE or IN_PERSON");
                }
                appointment.setAppointmentType(appointmentType);

                appointment.setQueueNumber(queueNumber);
                appointment.setNotes(request.getNotes());

                appointment.setStatus(
                                appointmentType == AppointmentType.ONLINE
                                                ? AppointmentStatus.CHECKED_IN
                                                : AppointmentStatus.BOOKED);

                appointmentRepository.save(appointment);
                return AppointmentResponseDto.from(appointment);
        }

        @Transactional(readOnly = true)
        public AppointmentResponseDto getAppointmentById(Long id) {
                return AppointmentResponseDto.from(
                                appointmentRepository.findById(id)
                                                .orElseThrow(() -> new RuntimeException("Appointment not found")));
        }

        @Transactional
        public List<AppointmentResponseDto> getPatientAppointments(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                patientService.getOrCreatePatientProfile(user);

                return appointmentRepository.findPatientAppointmentsByBookedByUserId(user.getId())
                                .stream()
                                .map(AppointmentResponseDto::from)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<AppointmentResponseDto> getAppointmentsByClinic(Long clinicId) {

                List<Appointment> appointments = appointmentRepository
                                .findByClinicIdOrderByAppointmentDateAscAppointmentTimeAsc(
                                                clinicId);

                return appointments.stream()
                                .map(AppointmentResponseDto::from)
                                .toList();
        }

        public AppointmentResponseDto addMeetingLink(
                        Long appointmentId,
                        String email,
                        UpdateMeetingLinkRequest request) {
                Appointment appointment = appointmentRepository.findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // 🔒 Role validation
                if (user.getRole() != Role.DOCTOR && user.getRole() != Role.STAFF) {
                        throw new RuntimeException("Only doctor or staff can add meeting link");
                }

                // 🔒 Appointment type validation
                if (appointment.getAppointmentType() != AppointmentType.ONLINE) {
                        throw new RuntimeException("Meeting link allowed only for ONLINE appointments");
                }

                if (request.getMeetingLink() == null || request.getMeetingLink().isBlank()) {
                        throw new RuntimeException("Meeting link cannot be empty");
                }

                appointment.setMeetingLink(request.getMeetingLink());
                appointment.setMeetingPlatform(
                                request.getMeetingPlatform() != null
                                                ? request.getMeetingPlatform()
                                                : "GOOGLE_MEET");

                appointmentRepository.save(appointment);

                return AppointmentResponseDto.from(appointment);
        }

        @Transactional(readOnly = true)
        public List<AppointmentResponseDto> getDoctorAppointments(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Doctor doctor = doctorRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

                return appointmentRepository.findByDoctorId(doctor.getId())
                                .stream().map(AppointmentResponseDto::from).toList();
        }

        public AppointmentResponseDto cancelAppointment(Long id) {
                Appointment appointment = appointmentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
                        throw new RuntimeException("Cannot cancel completed appointment");
                }

                appointment.setStatus(AppointmentStatus.CANCELLED);
                return AppointmentResponseDto.from(
                                appointmentRepository.save(appointment));
        }

        public AppointmentResponseDto updateAppointmentStatus(
                        Long id,
                        UpdateAppointmentStatusRequest request) {
                Appointment appointment = appointmentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                AppointmentStatus newStatus;
                try {
                        newStatus = AppointmentStatus.valueOf(String.valueOf(request.getStatus()).toUpperCase());
                } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid appointment status: " + request.getStatus());
                }
                AppointmentStatus currentStatus = appointment.getStatus();

                // 🔒 Validation
                if (newStatus == AppointmentStatus.COMPLETED) {
                        if (request.getNotes() == null || request.getNotes().isBlank()) {
                                throw new RuntimeException("Doctor notes are required to complete visit");
                        }
                }

                // 🔁 Allowed transitions
                switch (currentStatus) {
                        case BOOKED -> {
                                if (newStatus != AppointmentStatus.IN_PROGRESS &&
                                                newStatus != AppointmentStatus.CANCELLED)
                                        throw new RuntimeException("Invalid transition");
                        }
                        case IN_PROGRESS -> {
                                if (newStatus != AppointmentStatus.COMPLETED &&
                                                newStatus != AppointmentStatus.CANCELLED)
                                        throw new RuntimeException("Invalid transition");
                        }
                        default -> throw new RuntimeException("Appointment already closed");
                }

                appointment.setStatus(newStatus);

                if (request.getNotes() != null) {
                        appointment.setNotes(request.getNotes());
                }

                appointmentRepository.save(appointment);
                return AppointmentResponseDto.from(appointment);
        }
}
