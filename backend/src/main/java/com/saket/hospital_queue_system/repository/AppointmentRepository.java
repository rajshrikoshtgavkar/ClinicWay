package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        int countByDoctorIdAndAppointmentDateAndStatusIn(
                        Long doctorId,
                        LocalDate date,
                        List<AppointmentStatus> statuses);

        // COPILOT-FIX: CRITICAL - Use JOIN FETCH to prevent N+1 queries
        @Query("SELECT DISTINCT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "LEFT JOIN FETCH a.patient p " +
                        "LEFT JOIN FETCH p.user " +
                        "WHERE a.doctor.id = :doctorId")
        List<Appointment> findByDoctorId(@Param("doctorId") Long doctorId);

        // COPILOT-FIX: CRITICAL - Use JOIN FETCH for clinic appointments
        @Query("SELECT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "LEFT JOIN FETCH a.patient p " +
                        "LEFT JOIN FETCH p.user " +
                        "LEFT JOIN FETCH a.clinic " +
                        "WHERE a.clinic.id = :clinicId " +
                        "ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
        List<Appointment> findByClinicIdOrderByAppointmentDateAscAppointmentTimeAsc(
                        @Param("clinicId") Long clinicId);

        // COPILOT-FIX: CRITICAL - Prevent N+1 for patient appointments
        @Query("SELECT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "LEFT JOIN FETCH a.clinic " +
                        "WHERE a.patient = :patient " +
                        "ORDER BY a.appointmentDate DESC")
        List<Appointment> findByPatientOrderByAppointmentDateDesc(@Param("patient") Patient patient);

        // COPILOT-FIX: CRITICAL - Prevent N+1 for clinic list
        @Query("SELECT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.clinic " +
                        "WHERE a.clinic.id = :clinicId")
        List<Appointment> findByClinicId(@Param("clinicId") Long clinicId);

        List<Appointment> findByClinicIdAndAppointmentDate(
                Long clinicId,
                LocalDate appointmentDate
        );

    List<Appointment> findByBookedByUserIdOrderByAppointmentDateDesc(Long userId);

    @Query("SELECT a FROM Appointment a " +
                    "LEFT JOIN FETCH a.doctor d " +
                    "LEFT JOIN FETCH d.user " +
                    "LEFT JOIN FETCH a.patient p " +
                    "LEFT JOIN FETCH p.user " +
                    "LEFT JOIN FETCH a.clinic " +
                    "WHERE a.bookedByUser.id = :userId " +
                    "ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findPatientAppointmentsByBookedByUserId(@Param("userId") Long userId);
}
