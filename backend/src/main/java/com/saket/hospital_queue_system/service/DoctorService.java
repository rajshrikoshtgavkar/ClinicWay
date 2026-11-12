package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentDto;
import com.saket.hospital_queue_system.dto.DoctorDashboardResponse;
import com.saket.hospital_queue_system.dto.DoctorListResponse;
import com.saket.hospital_queue_system.dto.DoctorProfileResponse;
import com.saket.hospital_queue_system.dto.UpdateDoctorProfileRequest;
import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.AppointmentStatus;
import com.saket.hospital_queue_system.entity.Doctor;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public DoctorDashboardResponse getDoctorDashboard(String email) {
        logger.info("Getting dashboard for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        // Get all appointments for this doctor
        List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctor.getId());

        // Count statistics
        int totalAppointments = allAppointments.size();
        int completedAppointments = (int) allAppointments.stream()
                .filter(a -> AppointmentStatus.COMPLETED.equals(a.getStatus()))
                .count();

        // Get today's appointments
        LocalDate today = LocalDate.now();
        List<AppointmentDto> todayAppointmentsList = allAppointments.stream()
                .filter(a -> a.getAppointmentDate().equals(today))
                .map(appointment -> new AppointmentDto(
                        appointment.getId(),
                        appointment.getPatient().getUser().getName(),
                        appointment.getPatient().getGender(),
                        appointment.getAppointmentDate().toString(),
                        appointment.getAppointmentTime().toString(),
                        appointment.getStatus(),
                        appointment.getNotes()))
                .collect(Collectors.toList());

        int todayAppointments = todayAppointmentsList.size();

        DoctorDashboardResponse response = new DoctorDashboardResponse();
        response.setDoctorName(user.getName());
        response.setEmail(user.getEmail());
        response.setSpecialization(doctor.getSpecialization());
        response.setLicenseNumber(doctor.getLicenseNumber());
        response.setBio(doctor.getBio());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setAvailableSlots(doctor.getAvailableSlots());
        response.setIsAvailable(doctor.getIsAvailable());
        response.setTotalAppointments(totalAppointments);
        response.setCompletedAppointments(completedAppointments);
        response.setTodayAppointments(todayAppointments);
        response.setTodayAppointmentsList(todayAppointmentsList);

        logger.info("Dashboard retrieved successfully");
        return response;
    }

    @Transactional(readOnly = true)
    public List<DoctorListResponse> getAvailableDoctors() {
        logger.debug("Fetching available doctors");
        return doctorRepository.findByIsAvailableTrue()
                .stream()
                .map(this::convertToDoctorListResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoctorListResponse> getDoctorsForClinic(Long clinicId) {
        logger.debug("Fetching doctors for clinic ID: {}", clinicId);
        return doctorRepository.findByClinicId(clinicId)
                .stream()
                .map(this::convertToDoctorListResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DoctorProfileResponse getDoctorProfile(String email) {
        logger.info("Getting doctor profile for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        return convertToDoctorProfileResponse(user, doctor);
    }

    public DoctorProfileResponse updateDoctorProfile(String email, UpdateDoctorProfileRequest request) {
        logger.info("Updating doctor profile for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        // Update user details
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);

        // Update doctor details
        if (request.getBio() != null && !request.getBio().isEmpty()) {
            doctor.setBio(request.getBio());
        }
        if (request.getConsultationFee() != null) {
            doctor.setConsultationFee(request.getConsultationFee());
        }
        if (request.getAvailableSlots() != null && !request.getAvailableSlots().isEmpty()) {
            doctor.setAvailableSlots(request.getAvailableSlots());
        }
        if (request.getLicenseNumber() != null && !request.getLicenseNumber().isEmpty()) {
            doctor.setLicenseNumber(request.getLicenseNumber());
        }
        doctorRepository.save(doctor);

        logger.info("Doctor profile updated successfully");
        return convertToDoctorProfileResponse(user, doctor);
    }

    private DoctorProfileResponse convertToDoctorProfileResponse(User user, Doctor doctor) {
        DoctorProfileResponse response = new DoctorProfileResponse();
        response.setId(doctor.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setSpecialization(doctor.getSpecialization());
        response.setLicenseNumber(doctor.getLicenseNumber());
        response.setBio(doctor.getBio());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setAvailableSlots(doctor.getAvailableSlots());
        response.setIsAvailable(doctor.getIsAvailable());
        response.setCreatedAt(doctor.getCreatedAt());
        response.setUpdatedAt(doctor.getUpdatedAt());
        return response;
    }

    private DoctorListResponse convertToDoctorListResponse(Doctor doctor) {
        User user = doctor.getUser();
        DoctorListResponse.ClinicBasicInfo clinicInfo = null;

        if (doctor.getClinic() != null) {
            clinicInfo = DoctorListResponse.ClinicBasicInfo.builder()
                    .id(doctor.getClinic().getId())
                    .name(doctor.getClinic().getName())
                    .address(doctor.getClinic().getAddress())
                    .district(doctor.getClinic().getDistrict())
                    .taluka(doctor.getClinic().getTaluka())
                    .build();
        }

        return DoctorListResponse.builder()
                .id(doctor.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .specialization(doctor.getSpecialization())
                .licenseNumber(doctor.getLicenseNumber())
                .bio(doctor.getBio())
                .consultationFee(doctor.getConsultationFee())
                .availableSlots(doctor.getAvailableSlots())
                .isAvailable(doctor.getIsAvailable())
                .clinic(clinicInfo)
                .build();
    }
}
