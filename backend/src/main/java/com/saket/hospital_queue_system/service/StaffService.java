package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentDto;
import com.saket.hospital_queue_system.dto.StaffDashboardResponse;
import com.saket.hospital_queue_system.dto.StaffProfileResponse;
import com.saket.hospital_queue_system.dto.UpdateStaffProfileRequest;
import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.Staff;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.PatientRepository;
import com.saket.hospital_queue_system.repository.StaffRepository;
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
public class StaffService {

    private static final Logger logger = LoggerFactory.getLogger(StaffService.class);

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public StaffDashboardResponse getStaffDashboard(String email) {
        logger.info("Getting dashboard for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        Long clinicId = staff.getClinic().getId();

        // Get statistics
        long totalDoctors = doctorRepository.countByClinicId(clinicId);

        // Get all appointments
        LocalDate today = LocalDate.now();

        List<Appointment> todayAppointments = appointmentRepository
                .findByClinicIdAndAppointmentDate(clinicId, today);
        int totalAppointments = todayAppointments.size();

        // Get today's appointments
        List<AppointmentDto> recentAppointments = todayAppointments.stream()
                .limit(5)
                .map(appointment -> new AppointmentDto(
                        appointment.getId(),
                        appointment.getPatient().getUser().getName(),
                        appointment.getPatient().getGender(),
                        appointment.getAppointmentDate().toString(),
                        appointment.getAppointmentTime().toString(),
                        appointment.getStatus(),
                        appointment.getNotes()
                ))
                .collect(Collectors.toList());

        StaffDashboardResponse response = new StaffDashboardResponse();
        response.setStaffName(user.getName());
        response.setEmail(user.getEmail());
        response.setDepartment(staff.getDepartment());
        response.setIsActive(staff.getIsActive());
        response.setTotalDoctors((int) totalDoctors);
        response.setTotalAppointments(todayAppointments.size());
        response.setTodayAppointments(todayAppointments.size());
        response.setRecentAppointments(recentAppointments);

        logger.info("Dashboard retrieved successfully");
        return response;
    }

    @Transactional(readOnly = true)
    public StaffProfileResponse getStaffProfile(String email) {
        logger.info("Getting staff profile for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        return convertToStaffProfileResponse(user, staff);
    }

    public StaffProfileResponse updateStaffProfile(String email, UpdateStaffProfileRequest request) {
        logger.info("Updating staff profile for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        // Update user details
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);

        // Update staff details
        if (request.getDepartment() != null && !request.getDepartment().isEmpty()) {
            staff.setDepartment(request.getDepartment());
        }
        if (request.getPosition() != null && !request.getPosition().isEmpty()) {
            staff.setPosition(request.getPosition());
        }
        if (request.getNotes() != null && !request.getNotes().isEmpty()) {
            staff.setNotes(request.getNotes());
        }
        staffRepository.save(staff);

        logger.info("Staff profile updated successfully");
        return convertToStaffProfileResponse(user, staff);
    }

    private StaffProfileResponse convertToStaffProfileResponse(User user, Staff staff) {
        StaffProfileResponse response = new StaffProfileResponse();
        response.setId(staff.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setDepartment(staff.getDepartment());
        response.setPosition(staff.getPosition());
        response.setNotes(staff.getNotes());
        response.setIsActive(staff.getIsActive());
        response.setCreatedAt(staff.getCreatedAt());
        response.setUpdatedAt(staff.getUpdatedAt());
        return response;
    }
}
