package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.Queue;
import com.saket.hospital_queue_system.entity.QueueStatus;
import com.saket.hospital_queue_system.entity.Patient;
import com.saket.hospital_queue_system.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<Queue, Long> {

  List<Queue> findByPatientAndStatus(Patient patient, QueueStatus status);

  List<Queue> findByDoctorAndStatus(Doctor doctor, QueueStatus status);

  @Query("SELECT q FROM Queue q WHERE q.patient = :patient " +
      "AND q.appointment.appointmentDate = CURRENT_DATE " +
      "ORDER BY q.createdAt DESC")
  List<Queue> findTodayQueueByPatient(@Param("patient") Patient patient);

  @Query("SELECT q FROM Queue q WHERE q.doctor = :doctor " +
      "AND q.appointment.appointmentDate = CURRENT_DATE " +
      "ORDER BY q.position ASC")
  List<Queue> findTodayQueueByDoctor(@Param("doctor") Doctor doctor);

  @Query("SELECT q FROM Queue q WHERE q.patient = :patient " +
      "AND q.appointment.appointmentDate = CURRENT_DATE " +
      "AND q.status != 'CANCELLED'")
  Optional<Queue> findTodayActiveQueueByPatient(@Param("patient") Patient patient);

  List<Queue> findByDoctorAndStatusOrderByPositionAsc(Doctor doctor, QueueStatus status);

  @Query("SELECT COUNT(q) FROM Queue q WHERE q.doctor = :doctor " +
      "AND q.appointment.appointmentDate = CURRENT_DATE " +
      "AND q.status = 'COMPLETED'")
  Integer countCompletedTodayByDoctor(@Param("doctor") Doctor doctor);
}
